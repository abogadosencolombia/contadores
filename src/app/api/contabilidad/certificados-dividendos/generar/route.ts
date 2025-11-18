// en: src/app/api/contabilidad/certificados-dividendos/generar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación y Autorización
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    const tenantIdString = payload.tenant;

    const { ano_fiscal } = await request.json();
    if (!ano_fiscal) {
      return NextResponse.json({ error: 'El año fiscal es requerido' }, { status: 400 });
    }

    const client = await db.connect();
    
    // Obtener el ID numérico del tenant
    const tenantRes = await client.query('SELECT id FROM core.tenants WHERE tenant_id = $1', [tenantIdString]);
    if (tenantRes.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: 'Tenant no válido' }, { status: 400 });
    }
    const tenantId = tenantRes.rows[0].id;

    // 2. Obtener datos de la base de datos (Query corregida)
    const accionistasData = await client.query(
      `SELECT
          a.id as accionista_id,
          a.nombre_completo as accionista_nombre,
          a.numero_documento as accionista_identificacion,
          SUM(dp.monto_bruto) as total_bruto,
          SUM(dp.retencion) as total_retencion,
          SUM(dp.monto_neto) as total_neto
       FROM core.accionistas a
       JOIN core.dividendospagados dp ON a.id = dp.accionista_id
       WHERE a.tenant_id = $1 AND dp.ano_fiscal = $2
       GROUP BY a.id, a.nombre_completo, a.numero_documento`,
      [tenantId, ano_fiscal]
    );

    if (accionistasData.rows.length === 0) {
      client.release();
      return NextResponse.json({ message: 'No se encontraron dividendos para el año fiscal especificado.' }, { status: 404 });
    }

    const certificadosGenerados = [];

    // 3. Procesar cada accionista
    for (const accionista of accionistasData.rows) {
      const verification_uuid = uuidv4();
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verificar-certificado/${verification_uuid}`;

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const qrImageBuffer = await QRCode.toBuffer(verificationUrl);
      const qrImage = await pdfDoc.embedPng(qrImageBuffer);

      page.drawText(`Certificado de Dividendos - Año Fiscal ${ano_fiscal}`, { x: 50, y: height - 50, font, size: 24, color: rgb(0, 0.53, 0.71) });
      page.drawText(`Accionista: ${accionista.accionista_nombre}`, { x: 50, y: height - 100, font, size: 12 });
      page.drawText(`Identificación: ${accionista.accionista_identificacion}`, { x: 50, y: height - 120, font, size: 12 });
      
      page.drawText(`Total Bruto Pagado: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(accionista.total_bruto)}`, { x: 50, y: height - 160, font, size: 14 });
      page.drawText(`Total Retenciones: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(accionista.total_retencion)}`, { x: 50, y: height - 180, font, size: 14 });
      page.drawText(`Total Neto Pagado: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(accionista.total_neto)}`, { x: 50, y: height - 200, font, size: 14, color: rgb(0.1, 0.1, 0.1) });

      page.drawImage(qrImage, { x: width - 150, y: height - 200, width: 100, height: 100 });
      page.drawText('Verificar Autenticidad', { x: width - 155, y: height - 210, font, size: 8 });

      page.drawText('Firma Digital Pendiente', { x: 50, y: 100, font, size: 12, color: rgb(0.7, 0.7, 0.7) });

      const pdfBytes = await pdfDoc.save();

      const dirPath = path.join(process.cwd(), 'secure_uploads', tenantIdString, 'certificados_dividendos');
      await fs.mkdir(dirPath, { recursive: true });
      const fileName = `certificado_${ano_fiscal}_${accionista.accionista_id}.pdf`;
      const filePath = path.join(dirPath, fileName);
      await fs.writeFile(filePath, pdfBytes);
      const storagePath = path.join(tenantIdString, 'certificados_dividendos', fileName).replace(/\\/g, '/');

      const file_hash_sha256 = createHash('sha256').update(pdfBytes).digest('hex');

      await client.query(
        `INSERT INTO core.certificadosdividendos 
          (accionista_id, ano_fiscal, verification_uuid, file_path, file_hash_sha256)
         VALUES ($1, $2, $3, $4, $5)`,
        [accionista.accionista_id, ano_fiscal, verification_uuid, storagePath, file_hash_sha256]
      );

      certificadosGenerados.push({
        accionista: accionista.accionista_nombre,
        archivo: fileName,
        uuid: verification_uuid,
      });
    }

    client.release();
    return NextResponse.json({
      message: `${certificadosGenerados.length} certificados generados exitosamente.`,
      certificados: certificadosGenerados,
    });

  } catch (error: any) {
    if (error.message.includes('No autenticado') || error.message.includes('Token inválido')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error al generar certificados de dividendos:', error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}
