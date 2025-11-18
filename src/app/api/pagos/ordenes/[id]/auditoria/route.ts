// en: src/app/api/pagos/ordenes/[id]/auditoria/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = params;
    const tenantId = payload.tenant;

    // 1. Obtener los detalles principales de la orden de pago
    const ordenQuery = db.query(
      `SELECT 
         id, monto, moneda, monto_equivalente_cop, requiere_doble_firma,
         firmado_por_user_id_1, fecha_firma_1, hash_firma_1,
         firmado_por_user_id_2, fecha_firma_2, hash_firma_2
       FROM core.ordenes_pago 
       WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    // 2. Obtener el log de auditoría con los nombres de los usuarios
    const logQuery = db.query(
      `SELECT 
         log.accion, 
         log.detalles, 
         log.hash_evidencia, 
         log.fecha, 
         u.full_name as usuario
       FROM core.auditoria_pagos_log log
       LEFT JOIN core.users u ON log.user_id = u.id
       WHERE log.orden_pago_id = $1
       ORDER BY log.fecha ASC`,
      [id]
    );

    // Ejecutar ambas consultas en paralelo
    const [ordenResult, logResult] = await Promise.all([ordenQuery, logQuery]);

    if (ordenResult.rows.length === 0) {
      return NextResponse.json({ error: 'Orden de pago no encontrada.' }, { status: 404 });
    }

    // 3. Combinar los resultados y devolver
    const auditoriaCompleta = {
      orden: ordenResult.rows[0],
      log: logResult.rows,
    };

    return NextResponse.json(auditoriaCompleta);

  } catch (error: any) {
    if (error.message.includes('No autenticado') || error.message.includes('Token inválido')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error(`Error al obtener auditoría para la orden ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
