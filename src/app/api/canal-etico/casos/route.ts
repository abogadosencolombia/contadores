// En: src/app/api/canal-etico/casos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { promises as fs } from 'fs'; // Importamos fs para guardar archivos
import path from 'path'; // Importamos path para construir rutas

// --- POST (Crear Nuevo Caso con Archivos) ---
export async function POST(req: NextRequest) {
  let casoUuid: string | null = null; // Para guardar el UUID del caso

  try {
    const formData = await req.formData();

    // 1. Obtener campos de texto
    const tenant_id = formData.get('tenant_id') as string;
    const titulo = formData.get('titulo') as string;
    const descripcion_irregularidad = formData.get('descripcion_irregularidad') as string;
    const tipo_irregularidad = formData.get('tipo_irregularidad') as string;
    const user_id = formData.get('user_id') as string; // Vendrá como 'null' o un ID

    // 2. Obtener archivos
    const archivos = formData.getAll('evidencia') as File[];

    if (!tenant_id || !titulo || !descripcion_irregularidad || !tipo_irregularidad) {
      return NextResponse.json({ message: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    // 3. Insertar datos de texto y obtener el UUID
    const insertQuery = `
      INSERT INTO core.canal_etico_casos (
        tenant_id, creado_por_user_id, titulo, descripcion_irregularidad,
        tipo_irregularidad, estado
      )
      VALUES ($1, $2, $3, $4, $5, 'abierto')
      RETURNING caso_uuid, fecha_creacion;
    `;

    const insertParams = [
      tenant_id,
      user_id === 'null' ? null : Number(user_id), // Convertir user_id
      titulo,
      descripcion_irregularidad,
      tipo_irregularidad
    ];

    const result = await db.query(insertQuery, insertParams);
    const nuevoCaso = result.rows[0];
    casoUuid = nuevoCaso.caso_uuid; // Guardamos el UUID

    // 4. Procesar y guardar archivos (si existen)
    const archivosGuardados: string[] = [];
    if (archivos && archivos.length > 0) {
      // Ruta de guardado: .../secure_uploads/tenant_id/casos_eticos/caso_uuid/
      const savePath = path.join(
        process.cwd(),
        'secure_uploads', // Usamos la carpeta segura existente
        tenant_id,
        'casos_eticos',
        casoUuid
      );

      // Asegurarse de que el directorio exista
      await fs.mkdir(savePath, { recursive: true });

      for (const file of archivos) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Evitar sobreescritura y normalizar nombres
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
        const filePath = path.join(savePath, fileName);

        await fs.writeFile(filePath, buffer);

        // Guardamos la ruta relativa a la carpeta 'secure_uploads'
        archivosGuardados.push(path.join(tenant_id, 'casos_eticos', casoUuid, fileName));
      }

      // 5. Actualizar la DB con las rutas de los archivos
      if (archivosGuardados.length > 0) {
        const updateQuery = `
          UPDATE core.canal_etico_casos
          SET archivos_evidencia = $1
          WHERE caso_uuid = $2;
        `;
        await db.query(updateQuery, [JSON.stringify(archivosGuardados), casoUuid]);
      }
    }

    // Devolvemos el UUID para que el usuario anónimo pueda consultar
    return NextResponse.json(nuevoCaso, { status: 201 });

  } catch (error: any) {
    console.error('Error en POST /api/canal-etico/casos:', error);

    // Rollback manual (muy simplificado): Si falló al guardar archivos, borramos el caso
    if (casoUuid) {
      try {
        await db.query('DELETE FROM core.canal_etico_casos WHERE caso_uuid = $1', [casoUuid]);
      } catch (rollbackError) {
        console.error('Error en rollback de caso ético:', rollbackError);
      }
    }

    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
