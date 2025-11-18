// src/app/api/capital-extranjero/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

// GET /api/capital-extranjero
// Obtiene inversiones pendientes de reportar (para el modal)
export async function GET(request: NextRequest) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const tenantId = payload.tenant;

    // Buscamos solo las que están pendientes de reportar
    const { rows } = await db.query(
      `SELECT * FROM core.inversiones_extranjeras
       WHERE tenant_id = $1 AND estado_reporte = 'pendiente'
       ORDER BY fecha_inversion DESC`,
      [tenantId]
    );
    // Devolvemos un formato compatible con el modal de reportes
    return NextResponse.json({ data: rows });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('No autenticado')) {
       return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// --- NUEVA IMPLEMENTACIÓN DE POST ---
// POST /api/capital-extranjero
// Endpoint para registrar una nueva inversión en core.inversiones_extranjeras
export async function POST(request: NextRequest) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const tenantId = payload.tenant;
    const userId = payload.userId;

    const body = await request.json();

    const {
      nombre_inversionista_extranjero,
      id_inversionista,
      pais_origen,
      fecha_inversion, // Debe venir en formato 'YYYY-MM-DD'
      monto_inversion,
      moneda_inversion,
      monto_equivalente_cop
    } = body;

    // Validación simple
    if (!nombre_inversionista_extranjero || !pais_origen || !fecha_inversion || !monto_inversion || !moneda_inversion || !monto_equivalente_cop) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { rows: [nuevaInversion] } = await db.query(
      `INSERT INTO core.inversiones_extranjeras (
          tenant_id,
          creado_por_user_id,
          nombre_inversionista_extranjero,
          id_inversionista,
          pais_origen,
          fecha_inversion,
          monto_inversion,
          moneda_inversion,
          monto_equivalente_cop
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        tenantId,
        userId,
        nombre_inversionista_extranjero,
        id_inversionista,
        pais_origen,
        fecha_inversion,
        monto_inversion,
        moneda_inversion,
        monto_equivalente_cop
      ]
    );

    return NextResponse.json(nuevaInversion, { status: 201 });

  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes('No autenticado')) {
        return NextResponse.json({ error: err.message }, { status: 401 });
      }
      console.error('Error al registrar inversión:', err);
      return NextResponse.json({ error: 'Error interno del servidor', details: err.message }, { status: 500 });
    }
    console.error('Error al registrar inversión:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
