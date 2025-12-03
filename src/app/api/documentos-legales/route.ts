// En: src/app/api/documentos-legales/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';
import path from 'path';
import crypto from 'crypto';
import { storageService } from '@/lib/storage';

// --- GET (Listar Documentos) ---
// (Función GET actualizada para incluir fechas de firma)
export async function GET(req: NextRequest) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    return NextResponse.json({ message: (err as Error).message }, { status: 401 });
  }

  try {
    const tenantId = decoded.tenant;
    const result = await db.query(
      `SELECT
          id, titulo, descripcion, tipo_documento, version,
          estado, fecha_documento,
          firmado_por_contador_id, fecha_firma_contador, -- <-- AÑADIDO
          firmado_por_revisor_id, fecha_firma_revisor,   -- <-- AÑADIDO
          storage_path_original
       FROM core.documentos_legales
       WHERE tenant_id = $1
       ORDER BY fecha_documento DESC`,
      [tenantId]
    );
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/documentos-legales:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}


// --- POST (Subir Archivo Real) ---
// (Esta función POST se mantiene igual)
export async function POST(req: NextRequest) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    return NextResponse.json({ message: (err as Error).message }, { status: 401 });
  }

  try {
    const tenantId = decoded.tenant;
    const userId = decoded.userId;

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;
    const titulo = data.get('titulo') as string;
    const descripcion = data.get('descripcion') as string;
    const tipo_documento = data.get('tipo_documento') as string;
    const fecha_documento = data.get('fecha_documento') as string;
    const documento_padre_id = (data.get('documento_padre_id') as string) || null;
    const version = parseInt((data.get('version') as string) || '1', 10);

    if (!file || !titulo || !tipo_documento || !fecha_documento) {
      return NextResponse.json({ message: 'Faltan campos obligatorios o el archivo.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash_sha256_original = crypto.createHash('sha256').update(buffer).digest('hex');

    // Normalización del nombre de archivo
    const safeFilename = path.basename(file.name).replace(/[^a-z0-9_.-]/gi, '_');
    
    // Ruta dentro del Bucket (ej: "tenant-uuid/mi-archivo.pdf")
    const storagePath = `${tenantId}/${Date.now()}_${safeFilename}`;

    // --- SUBIDA A SUPABASE STORAGE ---
    await storageService.uploadFile(storagePath, buffer, file.type);

    const query = `
      INSERT INTO core.documentos_legales (
        tenant_id, creado_por_user_id, titulo, descripcion, tipo_documento, fecha_documento,
        estado, storage_path_original, hash_sha256_original, documento_padre_id, version
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'borrador', $7, $8, $9, $10)
      RETURNING *;
    `;

    const params = [
      tenantId,
      userId,
      titulo,
      descripcion,
      tipo_documento,
      fecha_documento,
      storagePath, // Guardamos la ruta relativa del bucket
      hash_sha256_original,
      documento_padre_id,
      version
    ];

    const result = await db.query(query, params);
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error: unknown) {
    console.error('Error en POST /api/documentos-legales:', error);
    return NextResponse.json({ message: 'Error interno del servidor: ' + (error as Error).message }, { status: 500 });
  }
}
