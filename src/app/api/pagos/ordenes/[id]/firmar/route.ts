import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { UserPayload, verifyAuth } from '@/lib/auth';
import { createHash } from 'crypto';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  let userPayload: UserPayload;
  try {
    userPayload = verifyAuth(req);
  } catch (err: unknown) {
    if (err instanceof Error) {
        return NextResponse.json({ message: err.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'An unknown error occurred during authentication.' }, { status: 401 });
  }

  // Verificación de rol
  if (!userPayload.roles?.includes('admin')) {
    return NextResponse.json({ message: 'Acceso denegado: Se requiere rol de administrador.' }, { status: 403 });
  }

  const { id } = await context.params;
  const { userId, tenant } = userPayload;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Obtener y bloquear la orden para evitar race conditions
    const { rows: [orden] } = await client.query(
      'SELECT * FROM core.ordenes_pago WHERE id = $1 AND tenant_id = $2 FOR UPDATE',
      [id, tenant]
    );

    if (!orden) {
      return NextResponse.json({ message: 'Orden de pago no encontrada.' }, { status: 404 });
    }

    // 2. Generar evidencia (Hash)
    const datosParaFirmar = [
      orden.id,
      orden.tenant_id,
      orden.monto,
      orden.moneda,
      orden.proveedor_nit,
      userId, // ID del firmante
      new Date().toISOString()
    ].join('|');
    const hash_firma = createHash('sha256').update(datosParaFirmar).digest('hex');

    let nuevoEstado: string;
    let accionAuditoria: string;

    // 3. Lógica de actualización de estado y firmas
    if (orden.estado === 'pendiente_aprobacion') {
      // Aplicando Firma 1
      nuevoEstado = orden.requiere_doble_firma ? 'pendiente_firma_2' : 'aprobado';
      accionAuditoria = 'FIRMAR_1';

      await client.query(
        `UPDATE core.ordenes_pago
         SET firmado_por_user_id_1 = $1,
             fecha_firma_1 = NOW(),
             hash_firma_1 = $2,
             estado = $3
         WHERE id = $4`,
        [userId, hash_firma, nuevoEstado, id]
      );

    } else if (orden.estado === 'pendiente_firma_2') {
      // Aplicando Firma 2
      if (userId === orden.firmado_por_user_id_1) {
        throw new Error('La segunda firma debe ser de un usuario diferente.');
      }
      nuevoEstado = 'aprobado';
      accionAuditoria = 'FIRMAR_2';

      await client.query(
        `UPDATE core.ordenes_pago
         SET firmado_por_user_id_2 = $1,
             fecha_firma_2 = NOW(),
             hash_firma_2 = $2,
             estado = $3
         WHERE id = $4`,
        [userId, hash_firma, nuevoEstado, id]
      );

    } else {
      // Si ya está aprobada, rechazada, etc.
      return NextResponse.json({ message: `La orden ya está en estado '${orden.estado}'.` }, { status: 409 });
    }

    // 4. Registrar en auditoría
    await client.query(
      `INSERT INTO core.auditoria_pagos_log (orden_pago_id, user_id, accion, hash_evidencia, detalles)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, userId, accionAuditoria, hash_firma, `Firma aplicada por usuario ${userId}. Nuevo estado: ${nuevoEstado}`]
    );

    // 5. Obtener la orden actualizada para devolverla
    const { rows: [ordenActualizada] } = await client.query(
      'SELECT * FROM core.ordenes_pago WHERE id = $1',
      [id]
    );

    await client.query('COMMIT');

    return NextResponse.json(ordenActualizada);

  } catch (error: unknown) {
    await client.query('ROLLBACK');
    console.error('Error al firmar la orden de pago:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: errorMessage || 'Error interno del servidor.' }, { status: 500 });
  } finally {
    client.release();
  }
}