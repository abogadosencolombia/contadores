import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, UserPayload } from '@/lib/auth';
import { AiGovernanceService } from '@/lib/aiGovernanceService';

export async function GET(req: NextRequest) {
  let decoded: UserPayload;

  try {
    decoded = verifyAuth(req);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'No autorizado.' },
      { status: 401 }
    );
  }

  try {
    const tenantId = decoded.tenant;
    if (!tenantId) {
      return NextResponse.json({ message: 'Tenant ID requerido' }, { status: 400 });
    }

    const stats = await AiGovernanceService.getIncidentsStats(tenantId);

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error en GET /api/ai-governance/incidents:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
