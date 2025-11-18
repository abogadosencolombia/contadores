
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { UserPayload, verifyAuth } from '@/lib/auth'; // Asumiendo que tienes esto

const UMBRAL_COP = 10000000;

export async function POST(req: NextRequest) {
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

  try {
    const { proveedor_nit, proveedor_nombre, monto, moneda, descripcion } = await req.json();
    const { userId, tenant } = userPayload;

    if (!proveedor_nit || !proveedor_nombre || !monto || !moneda) {
      return NextResponse.json({ message: 'Faltan campos requeridos.' }, { status: 400 });
    }

    let montoEquivalenteCOP = monto;
    if (moneda === 'USD') {
      // Obtener la URL base de la solicitud actual para llamar a la API interna
      const ratesApiUrl = new URL('/api/tasas-cambio', req.url);
      const ratesResponse = await fetch(ratesApiUrl.toString());

      if (!ratesResponse.ok) {
        const errorBody = await ratesResponse.text();
        console.error(`Error al obtener la tasa de cambio. Status: ${ratesResponse.status}, Body: ${errorBody}`);
        throw new Error('No se pudo obtener la tasa de cambio para la conversión.');
      }

      const rates = await ratesResponse.json();
      if (!rates.USD_TO_COP) {
        throw new Error('La respuesta de la API de tasas no contiene el valor USD_TO_COP.');
      }
      montoEquivalenteCOP = monto * rates.USD_TO_COP;
    }

    const requiere_doble_firma = montoEquivalenteCOP > UMBRAL_COP;

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const ordenQuery = `
        INSERT INTO core.ordenes_pago
        (tenant_id, creado_por_user_id, proveedor_nit, proveedor_nombre, descripcion, monto, moneda, monto_equivalente_cop, requiere_doble_firma, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pendiente_aprobacion')
        RETURNING *;
      `;
      const { rows: [nuevaOrden] } = await client.query(ordenQuery, [
        tenant,
        userId,
        proveedor_nit,
        proveedor_nombre,
        descripcion,
        monto,
        moneda,
        montoEquivalenteCOP,
        requiere_doble_firma,
      ]);

      const auditoriaQuery = `
        INSERT INTO core.auditoria_pagos_log (orden_pago_id, user_id, accion, detalles)
        VALUES ($1, $2, 'CREAR', $3);
      `;
      await client.query(auditoriaQuery, [
        nuevaOrden.id,
        userId,
        `Orden creada por ${proveedor_nombre} por ${moneda} ${monto}.`
      ]);

      await client.query('COMMIT');

      return NextResponse.json(nuevaOrden, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error('Error al crear la orden de pago:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
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

  try {
    const { tenant } = userPayload;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const { rows: ordenes } = await db.query(
      'SELECT * FROM core.ordenes_pago WHERE tenant_id = $1 ORDER BY fecha_creacion DESC LIMIT $2 OFFSET $3',
      [tenant, limit, offset]
    );

    const { rows: [{ count }] } = await db.query(
      'SELECT COUNT(*) FROM core.ordenes_pago WHERE tenant_id = $1',
      [tenant]
    );

    return NextResponse.json({
      data: ordenes,
      totalPages: Math.ceil(Number(count) / limit),
      currentPage: page,
    });
  } catch (error: unknown) {
    console.error('Error al listar órdenes de pago:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ message: 'Error interno del servidor.', error: errorMessage }, { status: 500 });
  }
}
