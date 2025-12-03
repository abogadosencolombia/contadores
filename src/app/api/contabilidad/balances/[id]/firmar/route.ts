import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // Importamos tu conector de base de datos
import { verifyAuth, UserPayload } from '@/lib/auth'; // Importamos tu helper de autenticación

// Interfaz para los parámetros de la URL
interface FirmarParams {
  params: Promise<{
    id: string; // El ID del balance que viene en la URL
  }>
}

/**
 * Endpoint para FIRMAR un balance (UPDATE)
 * Cambia el estado de 'pendiente' a 'firmado'
 */
export async function POST(req: NextRequest, { params }: FirmarParams) {

  let decoded: UserPayload;

  try {
    // 1. Verificar la autenticación del usuario (el contador)
    decoded = verifyAuth(req);

  } catch (err: unknown) {
    // Si el token es inválido o no existe
    return NextResponse.json(
      { message: (err as Error).message || 'No autorizado. Token inválido o expirado.' },
      { status: 401 }
    );
  }

  // Si la autenticación es exitosa, procedemos con la lógica de la base de datos
  try {
    const { id } = await params; // ID del balance a firmar
    const contadorId = decoded.userId; // ID del usuario (contador) que está firmando
    const tenantId = decoded.tenant; // ID del tenant del contador
    const fechaFirma = new Date();

    // ----------------------------------------------------------------------
    // --- Simulación de Firma Digital ---
    // En un futuro, aquí iría la lógica para conectarse a Certicámara/Signaturit.
    // Por ahora, creamos un hash de simulación como pide la funcionalidad.
    // ----------------------------------------------------------------------
    const firmaDigitalHashPlaceholder = `simulacion_firma_${contadorId}_${fechaFirma.toISOString()}`;

    // 2. Actualizar la base de datos
    const updateQuery = `
      UPDATE core.balances_financieros
      SET
        estado_firma = 'firmado',
        firmado_por_contador_id = $1,
        firma_digital_hash = $2,
        fecha_firma = $3
      WHERE
        id = $4 AND tenant_id = $5 -- <-- ¡IMPORTANTE! Seguridad multitenant
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      contadorId,
      firmaDigitalHashPlaceholder,
      fechaFirma,
      id,
      tenantId // Asegura que el contador solo pueda firmar balances de su propio tenant
    ]);

    // 3. Verificar si la actualización fue exitosa
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Balance no encontrado o no pertenece a este tenant.' },
        { status: 404 }
      );
    }

    // 4. Devolver el balance actualizado
    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error: unknown) {
    // Capturar errores de base de datos
    console.error(`Error en POST /api/contabilidad/balances/[id]/firmar:`, error);

    // Manejar error de llave duplicada (aunque en un UPDATE es raro)
    if ((error as { code?: string }).code === '23505') {
        return NextResponse.json({ message: 'Error de integridad de datos.' }, { status: 409 });
    }

    return NextResponse.json(
      { message: 'Error interno del servidor al firmar el balance.' },
      { status: 500 }
    );
  }
}
