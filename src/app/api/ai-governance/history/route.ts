import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, UserPayload } from '@/lib/auth';
import { AiGovernanceService } from '@/lib/aiGovernanceService';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  let decoded: UserPayload;

  try {
    decoded = verifyAuth(req);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'No autorizado. Token inválido o expirado.' },
      { status: 401 }
    );
  }

  try {
    const tenantId = decoded.tenant;

    if (!tenantId) {
      return NextResponse.json(
        { message: 'ID de tenant no encontrado en el token.' },
        { status: 400 }
      );
    }

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Usamos el servicio para obtener los datos
    const decisions = await AiGovernanceService.getDecisionsHistory(tenantId, page, limit);

    // Para el total, hacemos una consulta rápida directa, ya que el servicio no lo provee por ahora
    // y es necesario para la paginación en frontend.
    const countQuery = `
      SELECT COUNT(*) FROM core.ai_governance_decisions
      WHERE tenant_id = $1
    `;
    const { rows: countRows } = await db.query(countQuery, [tenantId]);
    const total = parseInt(countRows[0].count, 10);

    return NextResponse.json({
      data: decisions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error en GET /api/ai-governance/history:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}