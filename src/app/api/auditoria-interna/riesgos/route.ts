import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { verifyAuth } from '@/lib/auth'; // Custom Auth
import db from '@/lib/db'; // Direct DB Access

// GET: Obtener lista de riesgos
export async function GET(req: NextRequest) {
  try {
    // 1. Verify Custom Auth
    try {
      verifyAuth(req);
    } catch (authError) {
      console.error('Auth verification failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Query Database directly (Bypassing Supabase RLS issues for now)
    const query = `
      SELECT * 
      FROM core.riesgos_contables 
      ORDER BY fecha_deteccion DESC
    `;
    
    const result = await db.query(query);

    // console.log(`API Audit/Riesgos: Returned ${result.rows.length} rows via direct DB.`);
    return NextResponse.json(result.rows);

  } catch (error: any) {
    console.error("Error fetching riesgos (DB):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Validar riesgo (Revisor Fiscal)
export async function PATCH(req: NextRequest) {
  try {
    // 1. Verify Auth
    const user = verifyAuth(req); // Get user info from token

    const body = await req.json();
    const { id, estado, comentarios_revisor } = body;

    // 2. Update via DB
    const updateQuery = `
      UPDATE core.riesgos_contables
      SET estado = $1,
          comentarios_revisor = $2,
          validado_por_user_id = $3,
          fecha_validacion = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const values = [estado, comentarios_revisor, user.userId, id];
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Riesgo not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);

  } catch (error: any) {
    console.error("Error updating riesgo:", error);
    // Handle specific auth errors
    if (error.message.includes('No autenticado')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
