import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { updateAuditoria, deleteAuditoria } from '@/lib/isoService';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    const { id } = await params;
    const auditId = parseInt(id, 10);
    const body = await req.json();

    const updated = await updateAuditoria(user.tenant, auditId, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'Auditoría no encontrada o acceso denegado' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyAuth(req);
    const { id } = await params;
    const auditId = parseInt(id, 10);

    const success = await deleteAuditoria(user.tenant, auditId);

    if (!success) {
      return NextResponse.json({ error: 'Auditoría no encontrada o acceso denegado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
