// src/app/api/tesoreria/movimientos/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const tenantId = 'default_tenant'; // TODO: Auth real
    const body = await request.json();

    const { cuenta_bancaria_id, tipo_movimiento, monto, descripcion, fecha } = body;

    // Validaciones
    if (!cuenta_bancaria_id || !tipo_movimiento || !monto) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO core.movimientos_caja
        (tenant_id, cuenta_bancaria_id, tipo_movimiento, monto, moneda, descripcion, fecha, conciliado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;
      `;

      // Asumimos la moneda de la cuenta o por defecto COP si no se envía
      // Lo ideal sería buscar la moneda de la cuenta antes, simplificado aquí:
      const moneda = 'COP';

      const values = [
        tenantId,
        cuenta_bancaria_id,
        tipo_movimiento, // 'ingreso' o 'egreso'
        monto,
        moneda,
        descripcion,
        fecha || new Date(),
        true // Movimientos manuales nacen conciliados (o false si prefieres)
      ];

      await client.query(query, values);
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(error); // Keep original error for full context in logs
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
