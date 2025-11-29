// En: src/app/api/documentos-legales/[id]/solicitar-firmas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';

interface SolicitarParams { params: Promise<{ id: string }> }

/**
 * Este endpoint finaliza el borrador y lo pasa a 'pendiente_firma',
 * bloqueándolo para futuras ediciones (activando WORM).
 */
export async function POST(req: NextRequest, { params }: SolicitarParams) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const { id } = await params;
    const tenantId = decoded.tenant;

    // 1. Encontrar el documento y verificar el estado
    const docRes = await db.query(
      `SELECT * FROM core.documentos_legales WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    if (docRes.rows.length === 0) {
      return NextResponse.json({ message: 'Documento no encontrado.' }, { status: 404 });
    }
    if (docRes.rows[0].estado !== 'borrador') {
      return NextResponse.json({ message: 'Este documento no es un borrador. No se puede solicitar firmas.' }, { status: 403 });
    }

    // 2. Actualizar el estado a 'pendiente_firma'
    const result = await db.query(
      `UPDATE core.documentos_legales
       SET estado = 'pendiente_firma'
       WHERE id = $1 AND tenant_id = $2
       RETURNING *;`,
      [id, tenantId]
    );

    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error: unknown) {
    console.error(`Error en POST /api/documentos-legales/[id]/solicitar-firmas:`, error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
