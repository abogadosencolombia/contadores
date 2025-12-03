import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db'; // Corregido: Importación default
import { verifyAuth, UserPayload } from '@/lib/auth'; // Corregido: Importamos UserPayload

export async function GET(req: NextRequest) {

  let decoded: UserPayload;

  try {
    // 1. Verificar la autenticación (Forma correcta)
    // verifyAuth es síncrona y lanza un error si el token es inválido
    decoded = verifyAuth(req);

  } catch (err: unknown) {
    // Esto captura 'No autenticado: Token no encontrado' o 'Token inválido' de auth.ts
    return NextResponse.json(
      { message: (err as Error).message || 'No autorizado. Token inválido o expirado.' },
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenant_id,
      tipo_empresa,
      normativa,
      periodo_fecha,
      datos_balance, // N8n debe enviar esto como string
      hash_sha256
    } = body;

    // 1. VALIDACIÓN PRIMERO (Para evitar el crash 500)
    if (!datos_balance) {
      console.error("❌ Error: 'datos_balance' llegó undefined o null");
      return NextResponse.json({ message: 'Falta el campo datos_balance' }, { status: 400 });
    }

    // --- ZONA DE DEPURACIÓN ---
    console.log("🔍 INSPECCIÓN:", typeof datos_balance);

    // Forzamos string para hash (si llega objeto, lo convertimos, si es string se queda igual)
    const stringToHash = (typeof datos_balance === 'object')
      ? JSON.stringify(datos_balance)
      : datos_balance;

    // Calculamos Hash
    const computedHash = crypto
      .createHash('sha256')
      .update(stringToHash) // Ahora seguro que no es undefined
      .digest('hex');

    if (computedHash !== hash_sha256) {
      console.log(`❌ HASH MISMATCH: \nRecibido: ${hash_sha256} \nCalculado: ${computedHash}`);
      return NextResponse.json(
        { message: 'Integridad comprometida: El hash no coincide.', debug_hash: computedHash },
        { status: 400 }
      );
    }

    // --- INSERCIÓN EN DB ---
    // Si llegó como string, lo parseamos a JSON para guardarlo en la columna jsonb
    const objectToSave = (typeof datos_balance === 'string')
        ? JSON.parse(datos_balance)
        : datos_balance;

    const insertQuery = `
      INSERT INTO core.balances_financieros (
        tenant_id, tipo_empresa, normativa, periodo_fecha,
        datos_balance, hash_sha256, estado_firma
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pendiente')
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      tenant_id,
      tipo_empresa,
      normativa,
      periodo_fecha,
      objectToSave,
      hash_sha256
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error: unknown) {
    console.error('Error POST:', error);
    return NextResponse.json({ message: (error as Error) }, { status: 500 });
  }
}
