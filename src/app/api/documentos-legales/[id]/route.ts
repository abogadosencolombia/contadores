// En: src/app/api/documentos-legales/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';

interface DocumentoParams { params: Promise<{ id: string }> }

// --- GET (Detalle de un Documento) ---
export async function GET(req: NextRequest, { params }: DocumentoParams) {
  // ... (Implementar lógica GET similar a api/facturacion/facturas/[id]/route.ts)
}


// --- PATCH (Actualizar metadatos SÓLO SI ES BORRADOR) ---
export async function PATCH(req: NextRequest, { params }: DocumentoParams) {
  let decoded: UserPayload;
  try { decoded = verifyAuth(req); } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }

  const { id } = await params;
  const { titulo, descripcion, fecha_documento } = await req.json();

  try {
    const docRes = await db.query(
      `SELECT estado FROM core.documentos_legales WHERE id = $1 AND tenant_id = $2`,
      [id, decoded.tenant]
    );
    if (docRes.rows.length === 0) {
      return NextResponse.json({ message: 'Documento no encontrado.' }, { status: 404 });
    }
    if (docRes.rows[0].estado !== 'borrador') {
      return NextResponse.json({ message: 'No se puede modificar un documento que ya está en proceso de firma o finalizado (WORM).' }, { status: 403 });
    }

    // Lógica de actualización (similar a api/riesgos/[id]/route.ts)
    const result = await db.query(
      `UPDATE core.documentos_legales SET titulo = $1, descripcion = $2, fecha_documento = $3
       WHERE id = $4 AND tenant_id = $5 RETURNING *`,
      [titulo, descripcion, fecha_documento, id, decoded.tenant]
    );
    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error) {
    console.error('Error en PATCH /api/documentos-legales/[id]:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

// --- DELETE (Eliminar SÓLO SI ES BORRADOR) ---
export async function DELETE(req: NextRequest, { params }: DocumentoParams) {
  let decoded: UserPayload;
  try { decoded = verifyAuth(req); } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }

  const { id } = await params;

  try {
    const docRes = await db.query(
      `SELECT estado FROM core.documentos_legales WHERE id = $1 AND tenant_id = $2`,
      [id, decoded.tenant]
    );
    if (docRes.rows.length === 0) {
      return NextResponse.json({ message: 'Documento no encontrado.' }, { status: 404 });
    }
    if (docRes.rows[0].estado !== 'borrador') {
      return NextResponse.json({ message: 'No se puede eliminar un documento que ya está en proceso de firma o finalizado (WORM).' }, { status: 403 });
    }

    // Lógica de eliminación (similar a api/riesgos/[id]/route.ts)
    await db.query(
      `DELETE FROM core.documentos_legales WHERE id = $1 AND tenant_id = $2`,
      [id, decoded.tenant]
    );
    return NextResponse.json({ message: 'Documento en borrador eliminado.' }, { status: 200 });

  } catch (error) {
    console.error('Error en DELETE /api/documentos-legales/[id]:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
