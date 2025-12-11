import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import db from '@/lib/db';

// GET: Obtener lista de riesgos con Paginación y Filtros
export async function GET(req: NextRequest) {
  try {
    verifyAuth(req);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const estado = searchParams.get('estado');
    
    const offset = (page - 1) * limit;
    const params: any[] = [];
    const conditions: string[] = [];

    // Construcción dinámica de filtros
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(titulo ILIKE $${params.length} OR categoria_niif ILIKE $${params.length})`);
    }

    if (estado) {
      params.push(estado);
      conditions.push(`estado = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 1. Obtener total de registros (para meta)
    const countResult = await db.query(
      `SELECT COUNT(*) FROM core.riesgos_contables ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // 2. Obtener datos paginados
    const dataResult = await db.query(
      `SELECT * FROM core.riesgos_contables 
       ${whereClause} 
       ORDER BY fecha_deteccion DESC 
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return NextResponse.json({
      data: dataResult.rows,
      meta: {
        total,
        page,
        limit
      }
    });

  } catch (error: any) {
    console.error("Error fetching riesgos (DB):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Validar riesgo (Revisor Fiscal) y Escalar a Riesgos Corporativos
export async function PATCH(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = await req.json();
    const { id, estado, comentarios_revisor } = body;

    // 1. Actualizar Riesgo Contable
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

    const updatedRow = result.rows[0];

    // 2. Automatización: Escalar a core.riesgos si es fraude confirmado
    if (updatedRow.estado === 'VALIDADO_FRAUDE') {
      try {
        // Usamos explicacion_ia preferiblemente, o fallback a descripcion
        const descripcionRiesgo = updatedRow.explicacion_ia || updatedRow.descripcion || 'Sin descripción detallada.';
        const riesgoCompleto = `${updatedRow.titulo}\n\n${descripcionRiesgo}`;
        
        await db.query(
          `INSERT INTO core.riesgos 
           (dominio, riesgo, probabilidad, impacto, owner, control, estado, fecha)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            'Financiero',                   // dominio
            riesgoCompleto,                 // riesgo (Título + Descripción)
            5,                              // probabilidad (Alta)
            5,                              // impacto (Crítico)
            'Auditoría Interna',            // owner
            'Investigación en Curso',       // control (Valor por defecto)
            'abierto',                      // estado
            new Date()                      // fecha
          ]
        );
      } catch (insertError: any) {
        console.error("Error automatización core.riesgos:", insertError.message);
        // No bloqueamos la respuesta principal
      }
    }

    return NextResponse.json(updatedRow);

  } catch (error: any) {
    console.error("Error updating riesgo:", error);
    if (error.message.includes('No autenticado')) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
