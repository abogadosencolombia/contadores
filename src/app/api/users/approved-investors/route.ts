import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Autenticación y Autorización
    let user;
    try {
      user = verifyAuth(req);
    } catch (e) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo roles autorizados pueden ver la lista de inversionistas aprobados
    const hasAllowedRole = user.roles.some(role => ['admin', 'finance_ai', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // 2. Consultar inversionistas con KYC aprobado
    const query = `
      SELECT 
        id, 
        email, 
        full_name, 
        kyc_status
      FROM core.users 
      WHERE kyc_status = 'aprobado'
      ORDER BY full_name ASC
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows);

  } catch (error: unknown) {
    console.error('Error fetching approved investors:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener inversionistas aprobados' },
      { status: 500 }
    );
  }
}
