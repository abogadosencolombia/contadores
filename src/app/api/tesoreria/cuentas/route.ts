import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: Listar cuentas con saldo calculado
export async function GET(_request: Request) {
  try {
    const tenantId = 'default_tenant'; // TODO: Obtener de la sesión real

    const client = await pool.connect();
    try {
      // Esta consulta une las cuentas con sus movimientos para calcular el saldo
      const query = `
        SELECT
            cb.id,
            cb.nombre_banco,
            cb.numero_cuenta_display,
            cb.moneda,
            cb.descripcion,
            COALESCE(SUM(
                CASE
                    WHEN mc.tipo_movimiento = 'ingreso' THEN mc.monto
                    WHEN mc.tipo_movimiento = 'egreso' THEN -mc.monto
                    ELSE 0
                END
            ), 0) as saldo_actual
        FROM core.cuentas_bancarias cb
        LEFT JOIN core.movimientos_caja mc ON cb.id = mc.cuenta_bancaria_id
        WHERE cb.tenant_id = $1
        GROUP BY cb.id, cb.nombre_banco, cb.numero_cuenta_display, cb.moneda, cb.descripcion
        ORDER BY cb.fecha_creacion DESC;
      `;

      const res = await client.query(query, [tenantId]);

      // Formateamos el saldo para que sea un número manejable en el frontend
      const cuentas = res.rows.map(row => ({
        ...row,
        saldo_actual: parseFloat(row.saldo_actual)
      }));

      return NextResponse.json(cuentas);
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error obteniendo cuentas:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Crear nueva cuenta (Agregar datos)
export async function POST(request: Request) {
  try {
    const tenantId = 'default_tenant';
    const body = await request.json();

    // Validación simple
    if (!body.nombre_banco || !body.numero_cuenta || !body.moneda) {
      return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO core.cuentas_bancarias
        (tenant_id, nombre_banco, numero_cuenta_display, moneda, descripcion)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nombre_banco, numero_cuenta_display;
      `;

      const values = [
        tenantId,
        body.nombre_banco,
        body.numero_cuenta,
        body.moneda,
        body.descripcion || ''
      ];

      const res = await client.query(query, values);
      return NextResponse.json({ success: true, cuenta: res.rows[0] });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error creando cuenta:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
