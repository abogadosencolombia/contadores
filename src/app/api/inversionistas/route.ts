// src/app/api/inversionistas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const client = await db.connect();
    // Obtener tenant_id numérico
    const tenantRes = await client.query('SELECT id FROM core.tenants WHERE tenant_id = $1', [payload.tenant]);
    const tenantId = tenantRes.rows[0]?.id;

    const res = await client.query(
      `SELECT * FROM core.accionistas WHERE tenant_id = $1 ORDER BY created_at DESC`,
      [tenantId]
    );
    client.release();

    return NextResponse.json(res.rows);
  } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await req.json();
    const { nombre_completo, tipo_documento, numero_documento, email, numero_acciones, fecha_ingreso } = body;

    const client = await db.connect();
    const tenantRes = await client.query('SELECT id FROM core.tenants WHERE tenant_id = $1', [payload.tenant]);
    const tenantId = tenantRes.rows[0]?.id;

    await client.query(
      `INSERT INTO core.accionistas (tenant_id, nombre_completo, tipo_documento, numero_documento, email, numero_acciones, fecha_ingreso)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [tenantId, nombre_completo, tipo_documento, numero_documento, email, numero_acciones, fecha_ingreso || new Date()]
    );
    client.release();

    return NextResponse.json({ message: 'Inversionista creado' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creando inversionista' }, { status: 500 });
  }
}
