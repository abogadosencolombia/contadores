import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getHallazgos, createHallazgo } from '@/lib/isoService';
import { IsoHallazgoInput } from '@/types/iso-27001';

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const { searchParams } = new URL(req.url);
    const auditoriaIdParam = searchParams.get('auditoria_id');
    
    const auditoriaId = auditoriaIdParam ? parseInt(auditoriaIdParam, 10) : undefined;

    const hallazgos = await getHallazgos(user.tenant, auditoriaId);
    return NextResponse.json(hallazgos);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = await req.json();

    const newHallazgo = await createHallazgo(user.tenant, body as IsoHallazgoInput);
    return NextResponse.json(newHallazgo);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
