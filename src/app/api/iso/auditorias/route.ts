import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getAuditorias, createAuditoria } from '@/lib/isoService';
import { IsoAuditoriaInput } from '@/types/iso-27001';

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const auditorias = await getAuditorias(user.tenant);
    return NextResponse.json(auditorias);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = await req.json();

    const input: IsoAuditoriaInput = {
      ...body,
      // Asigna el usuario actual como creador si no se especifica
      creadoPorUserId: body.creadoPorUserId || user.userId,
    };

    const newAuditoria = await createAuditoria(user.tenant, input);
    return NextResponse.json(newAuditoria);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
