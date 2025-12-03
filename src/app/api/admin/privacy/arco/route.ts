import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    let user;
    try {
      user = verifyAuth(req);
    } catch {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Role check (Admin or Compliance)
    const hasAllowedRole = user.roles.some(role => ['admin', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado: Requiere rol de administrador' }, { status: 403 });
    }

    // 3. Query with JOIN to get requester name
    const query = `
      SELECT 
        sa.id,
        sa.tenant_id,
        sa.user_id,
        sa.email_solicitante,
        sa.tipo_solicitud,
        sa.detalle_solicitud as detalle,
        sa.estado,
        sa.fecha_solicitud,
        sa.fecha_limite_respuesta,
        sa.fecha_resolucion,
        sa.evidencia_respuesta,
        sa.responsable_id,
        u.full_name as nombre_solicitante
      FROM core.solicitudes_arco sa
      LEFT JOIN core.users u ON sa.user_id = u.id
      ORDER BY sa.fecha_solicitud DESC
    `;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);

  } catch (error: unknown) {
    console.error('Error fetching ARCO requests (admin):', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
