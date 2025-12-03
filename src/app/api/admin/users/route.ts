import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Autenticación y Autorización
    let user;
    try {
      user = verifyAuth(req);
    } catch {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar rol de admin o finance
    const hasAllowedRole = user.roles.some(role => ['admin', 'finance_ai', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // 2. Consultar usuarios pendientes de KYC
    // Asumimos que existen columnas para los documentos o que se gestionan en una tabla relacionada.
    // Por ahora, traemos los datos básicos del usuario.
    const query = `
      SELECT 
        id, 
        email, 
        full_name, 
        kyc_status, 
        created_at,
        'https://placehold.co/600x400?text=Cedula+Frontal' as doc_front_url, -- Placeholder o columna real
        'https://placehold.co/600x400?text=RUT' as doc_rut_url           -- Placeholder o columna real
      FROM core.users 
      WHERE kyc_status = 'pendiente'
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    return NextResponse.json(result.rows);

  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener usuarios' },
      { status: 500 }
    );
  }
}
