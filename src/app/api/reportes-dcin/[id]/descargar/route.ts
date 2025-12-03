import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * GET /api/reportes-dcin/[id]/descargar
 * Entrega el archivo XML físico para su descarga.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    const tenantId = payload.tenant;
    const { id } = await context.params;
    const reporteId = parseInt(id);

    if (isNaN(reporteId)) {
      return NextResponse.json({ error: 'ID de reporte inválido' }, { status: 400 });
    }

    // 1. Obtener la ruta del archivo de la nueva tabla
    const { rows: [reporte] } = await db.query(
      'SELECT storage_path_reporte FROM core.reportes_dcin WHERE id = $1 AND tenant_id = $2',
      [reporteId, tenantId]
    );

    if (!reporte) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    // 2. Construir la ruta completa y segura
    const storagePathRelative = reporte.storage_path_reporte;
    const filePath = path.join(process.cwd(), 'secure_uploads', storagePathRelative);

    // 3. Leer el archivo del disco
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(storagePathRelative);

    // 4. Devolver el archivo
    const headers = new Headers();
    headers.set('Content-Type', 'application/xml'); // Es un XML
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    return new NextResponse(fileBuffer, { status: 200, headers });

  } catch (error: unknown) {
    if (error instanceof Error) {
        if (error.message.includes('No autenticado')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        // Error si el archivo fue borrado del disco pero no de la BBDD
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.error(`Archivo no encontrado en disco para reporte`, error.message);
            return NextResponse.json({ error: 'Archivo no encontrado en el servidor' }, { status: 404 });
        }
        console.error(`Error al descargar reporte DCIN`, error);
        return NextResponse.json(
            { error: 'Error interno del servidor', details: error.message },
            { status: 500 }
        );
    }
    console.error(`Error al descargar reporte DCIN`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
