import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { updateHallazgo } from '@/lib/isoService';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    const { id } = await params;
    const hallazgoId = parseInt(id, 10);
    const body = await req.json();

    const updated = await updateHallazgo(user.tenant, hallazgoId, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'Hallazgo no encontrado o acceso denegado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
