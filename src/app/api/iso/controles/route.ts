import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getControles, createControl, updateControl } from '@/lib/isoService';
import { IsoControlInput } from '@/types/iso-27001';

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const controles = await getControles(user.tenant);
    return NextResponse.json(controles);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = await req.json();

    // Si el body incluye 'id', lo tratamos como una actualización del SoA o control
    if (body.id) {
      const updated = await updateControl(user.tenant, Number(body.id), body);
      return NextResponse.json(updated);
    } else {
      // Creación de nuevo control
      const newControl = await createControl(user.tenant, body as IsoControlInput);
      return NextResponse.json(newControl);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
