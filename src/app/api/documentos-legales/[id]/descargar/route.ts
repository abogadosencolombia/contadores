// En: src/app/api/documentos-legales/[id]/descargar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';
import { storageService } from '@/lib/storage'; // Importar el nuevo servicio de storage

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // Corregir tipo para params
) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }

  try {
    const { id } = params; // params ya no es una promesa
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
    const storagePath = doc.storage_path_original; // Ej: "default_tenant/contrato.pdf"

    // 2. Generar URL firmada de Supabase Storage
    const signedUrl = await storageService.getSignedUrl(storagePath);

    // 3. Redirigir al cliente a la URL firmada
    return NextResponse.redirect(signedUrl);

  } catch (error: any) {
    console.error('Error en GET /descargar:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
