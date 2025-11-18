// src/app/api/contabilidad/certificados-dividendos/verificar/[uuid]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { uuid: string } }) {
  try {
    const { uuid } = params;

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      return NextResponse.json({ valido: false, error: 'UUID no válido' }, { status: 400 });
    }

    const client = await db.connect();
    try {
      const query = `
        SELECT
          cd.ano_fiscal,
          cd.verification_uuid,
          cd.file_path,
          cd.file_hash_sha256,
          cd.fecha_emision,
          a.nombre_completo AS accionista_nombre,
          a.tipo_documento AS accionista_tipo_documento,
          a.numero_documento AS accionista_numero_documento
        FROM core.certificadosdividendos cd
        JOIN core.accionistas a ON cd.accionista_id = a.id
        WHERE cd.verification_uuid = $1;
      `;
      
      const result = await client.query(query, [uuid]);

      if (result.rows.length > 0) {
        return NextResponse.json({
          valido: true,
          certificado: result.rows[0],
        });
      } else {
        return NextResponse.json({ valido: false, message: 'Certificado no encontrado' }, { status: 404 });
      }
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error al verificar certificado:', error);
    return NextResponse.json({ valido: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
