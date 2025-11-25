import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const ano = searchParams.get('ano') || new Date().getFullYear().toString();

    const client = await db.connect();
    const tenantRes = await client.query('SELECT id FROM core.tenants WHERE tenant_id = $1', [payload.tenant]);
    const tenantId = tenantRes.rows[0]?.id;

    const res = await client.query(
      `SELECT * FROM core.configuracion_dividendos WHERE tenant_id = $1 AND ano_fiscal = $2`,
      [tenantId, ano]
    );
    client.release();

    return NextResponse.json(res.rows[0] || {}); // Return empty object if not found
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await req.json();
    const { ano_fiscal, valor_accion, porcentaje_dividendo, porcentaje_retencion } = body;

    const client = await db.connect();
    const tenantRes = await client.query('SELECT id FROM core.tenants WHERE tenant_id = $1', [payload.tenant]);
    const tenantId = tenantRes.rows[0]?.id;

    await client.query(
      `INSERT INTO core.configuracion_dividendos (tenant_id, ano_fiscal, valor_accion, porcentaje_dividendo, porcentaje_retencion)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (tenant_id, ano_fiscal)
       DO UPDATE SET
         valor_accion = EXCLUDED.valor_accion,
         porcentaje_dividendo = EXCLUDED.porcentaje_dividendo,
         porcentaje_retencion = EXCLUDED.porcentaje_retencion,
         updated_at = CURRENT_TIMESTAMP`,
      [tenantId, ano_fiscal, valor_accion, porcentaje_dividendo, porcentaje_retencion]
    );
    client.release();

    return NextResponse.json({ message: 'Configuración guardada' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error guardando configuración' }, { status: 500 });
  }
}
