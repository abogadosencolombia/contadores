// En: src/app/api/documentos-legales/[id]/firmar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';

interface FirmarParams { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: FirmarParams) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { rol_firma, hash_firma_externa, storage_path_firmado } = await req.json();
    const tenantId = decoded.tenant;
    const userId = decoded.userId;

    if (!rol_firma || !hash_firma_externa) {
      return NextResponse.json({ message: 'Se requiere el rol de firma y el hash de la firma externa.' }, { status: 400 });
    }

    // 1. Validar que el documento se pueda firmar
    const docRes = await db.query(
      `SELECT * FROM core.documentos_legales WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    if (docRes.rows.length === 0) {
      return NextResponse.json({ message: 'Documento no encontrado.' }, { status: 404 });
    }

    const doc = docRes.rows[0];
    if (doc.estado === 'finalizado') {
      return NextResponse.json({ message: 'Este documento ya está finalizado y no se puede modificar (WORM).' }, { status: 403 });
    }

    // 2. Aplicar la firma según el rol
    let updateQuery: string;
    let paramsUpdate: (string | number)[];

    if (rol_firma === 'contador') {
      updateQuery = `
        UPDATE core.documentos_legales
        SET estado = 'pendiente_firma',
            firmado_por_contador_id = $1,
            fecha_firma_contador = NOW(),
            hash_firma_contador = $2
        WHERE id = $3 AND tenant_id = $4
        RETURNING *;
      `;
      paramsUpdate = [userId, hash_firma_externa, id, tenantId];
    } else if (rol_firma === 'revisor') {
      updateQuery = `
        UPDATE core.documentos_legales
        SET estado = 'pendiente_firma',
            firmado_por_revisor_id = $1,
            fecha_firma_revisor = NOW(),
            hash_firma_revisor = $2
        WHERE id = $3 AND tenant_id = $4
        RETURNING *;
      `;
      paramsUpdate = [userId, hash_firma_externa, id, tenantId];
    } else {
      return NextResponse.json({ message: 'Rol de firma no válido.' }, { status: 400 });
    }

    const result = await db.query(updateQuery, paramsUpdate);
    let updatedDoc = result.rows[0];

    // 3. Lógica de Finalización (WORM)
    // Si ambas firmas están presentes, se finaliza el documento.
    if (updatedDoc.firmado_por_contador_id && updatedDoc.firmado_por_revisor_id) {

        // El frontend DEBE proveer la ruta al documento final firmado
        const finalStoragePath = storage_path_firmado || updatedDoc.storage_path_original;

        const finalResult = await db.query(
          `UPDATE core.documentos_legales
           SET estado = 'finalizado', storage_path_firmado = $1
           WHERE id = $2 AND tenant_id = $3
           RETURNING *;`,
          [finalStoragePath, id, tenantId]
        );
        updatedDoc = finalResult.rows[0];
    }

    return NextResponse.json(updatedDoc, { status: 200 });

  } catch (error: unknown) {
    console.error(`Error en POST /firmar:`, error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
