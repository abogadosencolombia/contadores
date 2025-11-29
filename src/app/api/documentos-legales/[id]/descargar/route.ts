// En: src/app/api/documentos-legales/[id]/descargar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';
import { storageService } from '@/lib/storage'; // Importar el nuevo servicio de storage

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Corregir tipo para params
) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const { id } = await params; // params ahora es una promesa
    const tenantId = decoded.tenant;

    // 1. Buscar el documento en la BD
    const docRes = await db.query(
      `SELECT storage_path_original, titulo FROM core.documentos_legales
       WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    if (docRes.rows.length === 0) {
      return NextResponse.json({ message: 'Documento no encontrado o no autorizado.' }, { status: 404 });
    }

    const doc = docRes.rows[0];
    // Normalizar ruta: Supabase requiere "/" pero en Windows se puede haber guardado con "\"
    const storagePath = doc.storage_path_original.replace(/\\/g, '/');

    console.log(`[DEBUG] Intentando descargar: ID=${id}, Path=${storagePath}`);

    // 2. Generar URL firmada de Supabase Storage
    const signedUrl = await storageService.getSignedUrl(storagePath);

    // 3. Redirigir al cliente a la URL firmada
    return NextResponse.redirect(signedUrl);

  } catch (error: unknown) {
    console.error('Error en GET /descargar:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
