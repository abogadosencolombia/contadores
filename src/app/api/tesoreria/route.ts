// src/app/api/tesoreria/cuentas/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    // TODO: Reemplazar con la sesión real del usuario (Auth)
    const tenantId = 'default_tenant';

    const client = await pool.connect();
    try {
      const query = `
        SELECT id, nombre_banco, numero_cuenta_display, moneda
        FROM core.cuentas_bancarias
        WHERE tenant_id = $1
        ORDER BY nombre_banco ASC
      `;

      const res = await client.query(query, [tenantId]);

      return NextResponse.json(res.rows);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error fetching bank accounts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
