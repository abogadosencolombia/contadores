import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (!payload) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener parámetros de paginación
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const tenantIdString = payload.tenant;

    const client = await db.connect();

    // Obtener ID numérico del tenant
    const tenantRes = await client.query('SELECT id FROM core.tenants WHERE tenant_id = $1', [tenantIdString]);
    if (tenantRes.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Tenant no válido' }, { status: 400 });
    }
    const tenantId = tenantRes.rows[0].id;

    // Consulta para obtener certificados con datos del accionista
    const query = `
      SELECT 
        cd.id,
        cd.ano_fiscal,
        cd.verification_uuid,
        cd.fecha_emision,
        cd.file_path,
        a.nombre_completo as accionista_nombre,
        a.numero_documento as accionista_documento
      FROM core.certificadosdividendos cd
      JOIN core.accionistas a ON cd.accionista_id = a.id
      WHERE a.tenant_id = $1
      ORDER BY cd.fecha_emision DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) 
      FROM core.certificadosdividendos cd
      JOIN core.accionistas a ON cd.accionista_id = a.id
      WHERE a.tenant_id = $1
    `;

    const [result, countResult] = await Promise.all([
      client.query(query, [tenantId, limit, offset]),
      client.query(countQuery, [tenantId])
    ]);

    client.release();

    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      data: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error: unknown) {
    console.error('Error al obtener certificados:', error);
    return NextResponse.json(
      { message: 'Error interno al obtener certificados' },
      { status: 500 }
    );
  }
}
