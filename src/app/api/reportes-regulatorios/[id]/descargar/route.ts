import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload as _UserPayload } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuth(req);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    const tenantId = payload.tenant;
    const { id } = await context.params;

    // 1. Buscar el reporte en la BD
    const docRes = await db.query(
      `SELECT storage_path_reporte, tipo_reporte
       FROM core.reportes_regulatorios
       WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    if (docRes.rows.length === 0) {
      return NextResponse.json({ message: 'Reporte no encontrado o no autorizado.' }, { status: 404 });
    }

    const doc = docRes.rows[0];
    const storagePath = doc.storage_path_reporte; // Ej: "default_tenant/reportes_regulatorios/reporte.xml"

    // 2. Construir la ruta absoluta y segura
    const filePath = path.join(process.cwd(), 'secure_uploads', storagePath);

    // 3. Leer el archivo del disco
    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch (error: unknown) {
      console.error('Error al leer el archivo:', error);
      return NextResponse.json({ message: 'Archivo no encontrado en el servidor.' }, { status: 404 });
    }

    // 4. Extraer el nombre del archivo
    const filename = path.basename(storagePath);

    // 5. Enviar el archivo al cliente
    const headers = new Headers();
    // Importante: Content-Type como XML
    headers.append('Content-Type', 'application/xml');
    headers.append('Content-Disposition', `attachment; filename="${filename}"`);

    const fileBlob = new Blob([new Uint8Array(fileBuffer)], { type: 'application/xml' });
    return new NextResponse(fileBlob, {
      status: 200,
      headers: headers,
    });
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (errorMessage.includes('No autenticado') || errorMessage.includes('Token inválido')) {
        return NextResponse.json({ message: errorMessage }, { status: 401 });
      }
    }
    console.error('Error en GET /descargar reporte:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}