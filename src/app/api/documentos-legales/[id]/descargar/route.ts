// En: src/app/api/documentos-legales/[id]/descargar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }

  try {
    // --- SOLUCIÓN: Await params antes de acceder a sus propiedades ---
    const { id } = await params;
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

    // 2. Construir la ruta absoluta y segura
    const filePath = path.join(process.cwd(), 'secure_uploads', storagePath);

    // 3. Leer el archivo del disco
    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch (error: any) {
      console.error('Error al leer el archivo:', error);
      return NextResponse.json({ message: 'Archivo no encontrado en el servidor.' }, { status: 404 });
    }

    // 4. Extraer el nombre del archivo
    const filename = path.basename(storagePath);

    // 5. Enviar el archivo al cliente
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${filename}"`);
    headers.append('Content-Type', 'application/octet-stream');

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: headers,
    });
  } catch (error: any) {
    console.error('Error en GET /descargar:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
