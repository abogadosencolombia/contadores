// En: src/app/api/canal-etico/descargar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Descarga de forma segura un archivo de evidencia del canal ético.
 * Espera un query param: ?file=tenant_id/casos_eticos/caso_uuid/nombre_archivo.pdf
 */
export async function GET(req: NextRequest) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }

  try {
    const tenantId = decoded.tenant;
    const { searchParams } = req.nextUrl;
    const filePath = searchParams.get('file');

    if (!filePath) {
      return NextResponse.json({ message: 'El parámetro "file" es requerido.' }, { status: 400 });
    }

    // --- Validación de Seguridad ---
    // 1. Prevenir Path Traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    if (safePath !== filePath) {
      return NextResponse.json({ message: 'Ruta de archivo no válida.' }, { status: 400 });
    }

    // 2. Verificar que el archivo pertenece al tenant del usuario
    // Esta consulta verifica si algún caso del tenant_id del usuario
    // contiene esta ruta de archivo en su array JSONB 'archivos_evidencia'.
    const checkQuery = `
      SELECT 1
      FROM core.canal_etico_casos
      WHERE tenant_id = $1
      AND archivos_evidencia::jsonb @> $2::jsonb;
    `;

    const { rows } = await db.query(checkQuery, [tenantId, JSON.stringify([safePath])]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Acceso denegado. El archivo no pertenece a un caso de este tenant.' }, { status: 403 });
    }
    // --- Fin Validación de Seguridad ---


    // 3. Construir la ruta absoluta y segura al archivo
    const absolutePath = path.join(process.cwd(), 'secure_uploads', safePath);

    // 4. Leer el archivo del disco
    let fileBuffer: Buffer;
    try {
      fileBuffer = await fs.readFile(absolutePath);
    } catch (error: any) {
      console.error('Error al leer el archivo de evidencia:', error);
      return NextResponse.json({ message: 'Archivo no encontrado en el servidor.' }, { status: 404 });
    }

    // 5. Enviar el archivo al cliente
    const filename = path.basename(safePath);
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${filename}"`);
    headers.append('Content-Type', 'application/octet-stream'); // Tipo genérico para descarga

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: headers,
    });

  } catch (error: any) {
    console.error('Error en GET /api/canal-etico/descargar:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
