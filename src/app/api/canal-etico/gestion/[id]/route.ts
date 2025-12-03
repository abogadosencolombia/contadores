// En: src/app/api/canal-etico/gestion/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';

// --- CAMBIO: Actualizada la firma de la ruta (parámetro 'params' es Promesa) ---
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    return NextResponse.json({ message: (err as Error).message }, { status: 401 });
  }

  try {
    // --- CAMBIO: Se espera la promesa 'params' ---
    const { id } = await context.params;
    const tenantId = decoded.tenant;

    const query = `
      SELECT
        id,
        caso_uuid,
        titulo,
        descripcion_irregularidad,
        tipo_irregularidad,
        estado,
        fecha_creacion,
        archivos_evidencia
      FROM core.canal_etico_casos
      WHERE id = $1 AND tenant_id = $2;
    `;

    const result = await db.query(query, [id, tenantId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Caso no encontrado o no pertenece a este tenant.' }, { status: 404 });
    }

    const caso = result.rows[0];

    // Asegurarnos de que archivos_evidencia sea un array, incluso si es null en la BD
    if (!caso.archivos_evidencia) {
      caso.archivos_evidencia = [];
    }
    // Nota: El driver 'pg' ya parsea el JSONB automáticamente

    return NextResponse.json(caso, { status: 200 });

  } catch (error: unknown) {
    console.error('Error en GET /api/canal-etico/gestion/[id]:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

// --- CAMBIO: Actualizada la firma de POST ---
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    return NextResponse.json({ message: (err as Error).message }, { status: 401 });
  }

  const client = await db.connect(); // <--- Corregido
  try {
    // --- CAMBIO: Acceso a 'params' desde 'context' ---
    const { id: caso_id } = await context.params;
    const tenantId = decoded.tenant;
    const { titulo_acta, descripcion_acta, hash_acta, storage_path_acta } = await req.json();

    if (!titulo_acta || !descripcion_acta || !hash_acta || !storage_path_acta) {
      return NextResponse.json({ message: 'Se requiere la descripción y el hash del acta.' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. Verificar el caso
    const casoRes = await client.query(
      `SELECT * FROM core.canal_etico_casos
       WHERE id = $1 AND tenant_id = $2 AND estado != 'resuelto'`,
      [caso_id, tenantId]
    );
    if (casoRes.rows.length === 0) {
      throw new Error('Caso no encontrado o ya resuelto.');
    }
    const _caso = casoRes.rows[0];

    // 2. Crear el Documento Legal en estado 'borrador' (Módulo WORM)
    const docQuery = `
      INSERT INTO core.documentos_legales (
        tenant_id, creado_por_user_id, titulo, descripcion, tipo_documento,
        fecha_documento, estado, storage_path_original, hash_sha256_original, version
      )
      VALUES ($1, $2, $3, $4, 'acta_etica', NOW(), 'borrador', $5, $6, 1)
      RETURNING id;
    `;
    const docParams = [
      tenantId,
      decoded.userId,
      titulo_acta,
      descripcion_acta,
      storage_path_acta, // Ruta al PDF generado (ej: 's3://bucket/acta_caso_123.pdf')
      hash_acta          // Hash del PDF
    ];

    const docResult = await client.query(docQuery, docParams);
    const nuevoDocumentoId = docResult.rows[0].id;

    // 3. Actualizar el Caso Ético para vincularlo al documento y marcarlo como 'resuelto'
    const updateCasoQuery = `
      UPDATE core.canal_etico_casos
      SET estado = 'resuelto', documento_legal_id = $1
      WHERE id = $2 AND tenant_id = $3
      RETURNING *;
    `;
    await client.query(updateCasoQuery, [nuevoDocumentoId, caso_id, tenantId]);

    await client.query('COMMIT');

    return NextResponse.json(
      {
        message: 'Caso resuelto. Acta enviada a Gestión Documental para firmas.',
        documento_legal_id: nuevoDocumentoId
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    await client.query('ROLLBACK');
    console.error('Error al resolver caso ético:', error);
    return NextResponse.json({ message: (error as Error).message || 'Error interno del servidor.' }, { status: 500 });
  } finally {
    client.release();
  }
}
