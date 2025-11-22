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

    // 2. Role check (Admin, Superadmin or Compliance)
    const hasAllowedRole = user.roles.some(role => ['admin', 'superadmin', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado: Requiere rol de administrador, superadmin o cumplimiento' }, { status: 403 });
    }

    const isSuperAdmin = user.roles.includes('superadmin');

    // 3. Query with JOIN to get tenant name
    let query = `
      SELECT 
        t.tenant_id, 
        t.nombre_empresa, 
        r.id, 
        r.numero_radicado, 
        r.tipo_novedad, 
        r.fecha_registro, 
        r.fecha_vencimiento, 
        r.estado
      FROM core.tenants t 
      LEFT JOIN LATERAL (
          SELECT * 
          FROM core.rnbd_registros 
          WHERE tenant_id = t.tenant_id 
          ORDER BY fecha_registro DESC 
          LIMIT 1
      ) r ON true
    `;

    const queryParams: any[] = [];

    if (!isSuperAdmin) {
      // Si NO es superadmin, filtrar por su tenant
      query += ` WHERE t.tenant_id = $1`;
      queryParams.push(user.tenant);
    }

    // Ordenar por nombre de empresa
    query += ` ORDER BY t.nombre_empresa ASC`;

    const result = await pool.query(query, queryParams);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error('Error fetching RNBD records (admin):', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
