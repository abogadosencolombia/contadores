import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    let user;
    try {
      user = verifyAuth(req);
    } catch (e) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Role check (Admin or Compliance)
    const hasAllowedRole = user.roles.some(role => ['admin', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado: Requiere rol de administrador o cumplimiento' }, { status: 403 });
    }

    // 3. Query with JOIN to get tenant name
    const query = `
      SELECT t.tenant_id, t.nombre_empresa, r.* 
      FROM core.tenants t 
      LEFT JOIN LATERAL (
          SELECT * 
          FROM core.rnbd_registros 
          WHERE tenant_id = t.tenant_id 
          ORDER BY fecha_registro DESC 
          LIMIT 1
      ) r ON true
    `;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error('Error fetching RNBD records (admin):', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
