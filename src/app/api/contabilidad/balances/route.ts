import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // Corregido: Importación default
import { verifyAuth, UserPayload } from '@/lib/auth'; // Corregido: Importamos UserPayload

export async function GET(req: NextRequest) {

  let decoded: UserPayload;

  try {
    // 1. Verificar la autenticación (Forma correcta)
    // verifyAuth es síncrona y lanza un error si el token es inválido
    decoded = verifyAuth(req);

  } catch (err: any) {
    // Esto captura 'No autenticado: Token no encontrado' o 'Token inválido' de auth.ts
    return NextResponse.json(
      { message: err.message || 'No autorizado. Token inválido o expirado.' },
      { status: 401 }
    );
  }

  // Si verifyAuth tuvo éxito, 'decoded' tiene el payload.
  // Ahora usamos un try/catch separado para la lógica de base de datos.
  try {
    // 2. Obtener el tenant_id del usuario (Corregido: usamos 'tenant')
    const tenantId = decoded.tenant;

    if (!tenantId) {
      return NextResponse.json(
        { message: 'ID de tenant no encontrado en el token.' },
        { status: 400 }
      );
    }

    // 3. Obtener parámetros de paginación
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // 4. Consultar la base de datos
    const dataQuery = `
      SELECT * FROM core.balances_financieros
      WHERE tenant_id = $1
      ORDER BY periodo_fecha DESC
      LIMIT $2 OFFSET $3
    `;
    const countQuery = `
      SELECT COUNT(*) FROM core.balances_financieros
      WHERE tenant_id = $1
    `;

    const [dataResult, totalResult] = await Promise.all([
      db.query(dataQuery, [tenantId, limit, offset]),
      db.query(countQuery, [tenantId])
    ]);

    // 5. Devolver la respuesta JSON formateada
    return NextResponse.json({
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10)
    });

  } catch (error) {
    // Este catch es para errores de base de datos
    console.error('Error de base de datos en GET /api/contabilidad/balances:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener balances.' },
      { status: 500 }
    );
  }
}
