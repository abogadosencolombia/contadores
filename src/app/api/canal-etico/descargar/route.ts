// En: src/app/api/canal-etico/descargar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';
import path from 'path'; // Mantenemos path para normalizar, aunque Supabase usa /
import { storageService } from '@/lib/storage';

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
    // 1. Prevenir Path Traversal y normalizar
    // Nota: path.normalize en Windows usará backslashes, pero en Supabase necesitamos forward slashes.
    // Como el filePath viene de la URL, ya debería usar forward slashes si se guardó correctamente.
    // Si viene con backslashes (legacy), lo convertimos.
    let safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    
    // Aseguramos que usamos / para comparar con la DB y pedir a Supabase
    safePath = safePath.split(path.sep).join('/');

    if (safePath !== filePath && safePath !== filePath.replace(/\\/g, '/')) {
        // Si la normalización cambió la ruta drásticamente (más allá de separadores), sospechoso.
        // Pero permitimos el cambio de \ a /
         // console.log("Path normalization diff:", filePath, safePath);
    }

    // 2. Verificar que el archivo pertenece al tenant del usuario
    // Esta consulta verifica si algún caso del tenant_id del usuario
    // contiene esta ruta de archivo en su array JSONB 'archivos_evidencia'.
    // La ruta en DB puede estar guardada con \ (legacy) o / (nuevo).
    // Intentamos buscar ambas o asumimos que safePath ya está en formato correcto.
    
    // Para compatibilidad con legacy (Windows paths guardados en DB), podríamos necesitar buscar con backslashes también
    // si la DB tiene 'tenant\\casos...'
    
    const checkQuery = `
      SELECT 1
      FROM core.canal_etico_casos
      WHERE tenant_id = $1
      AND (
        archivos_evidencia::jsonb @> $2::jsonb
        OR 
        archivos_evidencia::jsonb @> $3::jsonb
      );
    `;

    // Opción con backslashes para legacy Windows paths
    const legacyPath = safePath.replace(/\//g, '\\');

    const { rows } = await db.query(checkQuery, [tenantId, JSON.stringify([safePath]), JSON.stringify([legacyPath])]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Acceso denegado. El archivo no pertenece a un caso de este tenant.' }, { status: 403 });
    }
    // --- Fin Validación de Seguridad ---


    // 3. Obtener URL firmada de Supabase
    // Si el archivo es legacy y está en disco local, esto fallará.
    // Pero el requerimiento es mover a Supabase. Asumimos que los archivos nuevos estarán ahí.
    // Si se requiere soportar híbrido, habría que comprobar existencia local primero.
    // Dado el prompt, migramos a Supabase.
    
    // Nota: Si en la DB está guardado con backslashes (legacy), a Supabase hay que pedirle con forward slashes
    // o como se haya subido. Si se subió localmente, NO está en Supabase.
    // Esta lógica solo servirá para los archivos NUEVOS subidos a Supabase.
    // Los archivos viejos darán "Object not found" si no se migran.
    
    try {
        const signedUrl = await storageService.getSignedUrl(safePath);
        return NextResponse.redirect(signedUrl);
    } catch (storageError: any) {
        console.error("Error Storage:", storageError);
        return NextResponse.json({ message: 'No se pudo generar la descarga. El archivo puede no existir en el almacenamiento en la nube.' }, { status: 404 });
    }

  } catch (error: any) {
    console.error('Error en GET /api/canal-etico/descargar:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
