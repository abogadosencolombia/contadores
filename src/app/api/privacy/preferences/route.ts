import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Autenticación
    let user;
    try {
      user = verifyAuth(req);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Obtener preferencias
    const query = `
      SELECT id, canal, finalidad, autorizado 
      FROM core.preferencias_contacto 
      WHERE user_id = $1
    `;
    const { rows } = await db.query(query, [user.userId]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // 1. Autenticación
    let user;
    try {
      user = verifyAuth(req);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Leer body
    const body = await req.json();
    const { canal, finalidad, autorizado } = body;

    if (!canal || !finalidad || typeof autorizado !== 'boolean') {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. UPSERT (Insertar o Actualizar)
    // Usamos ON CONFLICT para manejar la unicidad de (user_id, canal, finalidad)
    const query = `
      INSERT INTO core.preferencias_contacto (user_id, tenant_id, canal, finalidad, autorizado, ip_origen)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_id, canal, finalidad) 
      DO UPDATE SET 
        autorizado = EXCLUDED.autorizado,
        fecha_actualizacion = NOW(),
        ip_origen = EXCLUDED.ip_origen
      RETURNING id, canal, finalidad, autorizado
    `;

    // Obtenemos la IP de origen (si está disponible en los headers, sino un valor por defecto)
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

    const { rows } = await db.query(query, [
      user.userId,
      user.tenant,
      canal,
      finalidad,
      autorizado,
      ip
    ]);

    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error('Error updating preference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
