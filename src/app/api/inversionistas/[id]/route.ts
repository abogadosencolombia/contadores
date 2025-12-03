// src/app/api/inversionistas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const payload = verifyAuth(req);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();
    const { nombre_completo, email, numero_acciones } = body;

    const client = await db.connect();
    // Validar tenant por seguridad
    const check = await client.query(
      `SELECT a.id FROM core.accionistas a
       JOIN core.tenants t ON a.tenant_id = t.id
       WHERE a.id = $1 AND t.tenant_id = $2`,
      [id, payload.tenant]
    );

    if (check.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Inversionista no encontrado' }, { status: 404 });
    }

    await client.query(
      `UPDATE core.accionistas
       SET nombre_completo = $1, email = $2, numero_acciones = $3
       WHERE id = $4`,
      [nombre_completo, email, numero_acciones, id]
    );
    client.release();

    return NextResponse.json({ message: 'Inversionista actualizado' });
  } catch (_error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
