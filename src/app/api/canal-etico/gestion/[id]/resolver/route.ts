// En: src/app/api/canal-etico/gestion/[id]/resolver/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';
import { storageService } from '@/lib/storage'; // Importar storageService
import crypto from 'crypto';
import path from 'path';
// import fs from 'fs/promises'; // Removed: not used anymore
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';

// --- CAMBIO: Actualizada la firma de la ruta (parámetro 'params') ---
// interface ResolverParams { params: Promise<{ id: string }> } // Removed: not used anymore

// --- Función GET (Actualizada para corregir warning) ---
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) { // Changed from any
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const { id } = await context.params; // <-- Corregido await
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

    if (!caso.archivos_evidencia) {
      caso.archivos_evidencia = [];
    }

    return NextResponse.json(caso, { status: 200 });

  } catch (error: unknown) { // Changed from any
    console.error('Error en GET /api/canal-etico/gestion/[id]:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
// --- FIN DE GET ---


// --- FUNCIÓN POST (MODIFICADA CON PDF-LIB) ---
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) { // Changed from any
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 401 });
  }

  const client = await db.connect();
  try {
    const { id: caso_id } = await context.params; // Corregido await
    const tenantId = decoded.tenant;
    const { titulo_acta, descripcion_acta } = await req.json();

    if (!titulo_acta || !descripcion_acta) {
      return NextResponse.json({ message: 'Se requiere el título y la descripción del acta.' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. Obtener el caso y la evidencia
    const casoRes = await client.query(
      `SELECT * FROM core.canal_etico_casos
       WHERE id = $1 AND tenant_id = $2 AND estado != 'resuelto'`,
      [caso_id, tenantId]
    );
    if (casoRes.rows.length === 0) {
      throw new Error('Caso no encontrado o ya resuelto.');
    }
    const caso = casoRes.rows[0];
    const evidenciaPaths: string[] = caso.archivos_evidencia || [];
    // const baseUploadPath = path.join(process.cwd(), 'secure_uploads'); // Removed: not used anymore

    // --- INICIO DE GENERACIÓN DE PDF REAL ---

    // 2. Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage(PageSizes.Letter); // [595.28, 841.89] -> Aprox 8.26 x 11.69 in
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 70; // Posición Y inicial (desde arriba)
    const margin = 70;
    const lineWidth = width - (margin * 2);

    // --- Helper para dibujar texto con saltos de línea ---
    const drawTextWithBreaks = (text: string, size: number, f: typeof font, lineHeight: number, color = rgb(0.2, 0.2, 0.2)) => {
      const lines = text.split('\n');
      for (const line of lines) {
        if (y < 50) { // Añadir nueva página si no hay espacio
          page = pdfDoc.addPage(PageSizes.Letter);
          y = height - 70;
        }
        page.drawText(line.trim(), { x: margin, y, size, font: f, color });
        y -= lineHeight;
      }
    };

    // Título
    page.drawText('ACTA DE RESOLUCIÓN DE CASO ÉTICO', {
      x: margin, y, size: 16, font: fontBold, color: rgb(0, 0, 0),
    });
    y -= 20;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= 20;

    // Metadatos
    drawTextWithBreaks(`CASO ID: ${caso.id} (UUID: ${caso.caso_uuid})`, 10, font, 15);
    drawTextWithBreaks(`FECHA RESOLUCIÓN: ${new Date().toISOString()}`, 10, font, 15);
    drawTextWithBreaks(`RESOLVIÓ: ${decoded.fullName} (ID: ${decoded.userId})`, 10, font, 15);
    y -= 15;

    // Contenido del Acta
    drawTextWithBreaks('I. TÍTULO DEL ACTA', 12, fontBold, 18);
    drawTextWithBreaks(titulo_acta, 10, font, 15);
    y -= 10;

    drawTextWithBreaks('II. DESCRIPCIÓN REPORTE ORIGINAL', 12, fontBold, 18);
    drawTextWithBreaks(caso.descripcion_irregularidad, 10, font, 15);
    y -= 10;

    drawTextWithBreaks('III. CONCLUSIÓN Y DECISIÓN DEL COMITÉ', 12, fontBold, 18);
    drawTextWithBreaks(descripcion_acta, 10, font, 15);
    y -= 15;

    // Incrustar Evidencia
    page.drawText('IV. EVIDENCIA VINCULADA AL CASO:', {
      x: margin, y, size: 12, font: fontBold, color: rgb(0, 0, 0),
    });
    y -= 20;

    // Reemplaza la sección de evidencia (líneas ~150-185) con esto:

    // Reemplaza la sección de evidencia (líneas ~150-185) con esto:

    if (evidenciaPaths.length > 0) {
      for (const relativePath of evidenciaPaths) {
        // Normalizar ruta para Supabase (siempre usar /)
        const storagePath = relativePath.replace(/\\/g, '/');
        const imageName = path.basename(storagePath);

        try {
          // CAMBIO: Descargar de Supabase en lugar de fs.readFile
          const imageBytes = await storageService.downloadFile(storagePath);
          let embeddedImage;

          // Verificar si es archivo de texto
          if (/\.(txt|md)$/i.test(imageName)) {
            // ... (Lógica existente para TXT) ...
            const textContent = imageBytes.toString('utf-8');
            if (y < 100) { page = pdfDoc.addPage(PageSizes.Letter); y = height - 70; }
            
            page.drawText(`- (Archivo de texto) ${imageName}`, { x: margin, y, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.5) });
            y -= 18;
            page.drawLine({ start: { x: margin + 15, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
            y -= 15;

            const contentLines = textContent.split('\n');
            for (const line of contentLines) {
              // ... (Lógica de wrapping existente) ...
              const maxCharsPerLine = 80;
              const wrappedLines = [];
              if (line.length > maxCharsPerLine) {
                for (let i = 0; i < line.length; i += maxCharsPerLine) { wrappedLines.push(line.substring(i, i + maxCharsPerLine)); }
              } else { wrappedLines.push(line); }

              for (const wrappedLine of wrappedLines) {
                if (y < 50) { page = pdfDoc.addPage(PageSizes.Letter); y = height - 70; }
                page.drawText(wrappedLine || ' ', { x: margin + 20, y, size: 8, font: font, color: rgb(0.3, 0.3, 0.3) });
                y -= 12;
              }
            }
            y -= 10;
            continue;
          }

          // --- NUEVO: FUSIÓN DE PDFs ---
          if (/\.pdf$/i.test(imageName)) {
             try {
               // 1. Cargar el PDF de evidencia
               const evidencePdf = await PDFDocument.load(imageBytes);
               
               // 2. Copiar todas las páginas
               const copiedPages = await pdfDoc.copyPages(evidencePdf, evidencePdf.getPageIndices());

               // 3. Añadir una página separadora en el acta principal (opcional, pero bueno para organizar)
               if (y < 100) { 
                 page = pdfDoc.addPage(PageSizes.Letter); 
                 y = height - 70; 
               }
               
               // Escribir en la página actual que sigue un anexo PDF
               page.drawText(`- (Anexo PDF) ${imageName}`, { x: margin, y, size: 10, font: fontBold, color: rgb(0, 0, 0.8) });
               page.drawText(`  (El contenido de este archivo se ha adjuntado en las páginas siguientes)`, { x: margin, y: y - 15, size: 8, font: font, color: rgb(0.5, 0.5, 0.5) });
               y -= 40;

               // 4. Pegar las páginas copiadas al final del documento actual
               for (const copiedPage of copiedPages) {
                 pdfDoc.addPage(copiedPage);
               }
               
               // Recuperar la última página para seguir escribiendo si fuera necesario (o crear una nueva limpia)
               // En este caso, creamos una nueva página limpia para la siguiente evidencia si quedan más
               page = pdfDoc.addPage(PageSizes.Letter);
               y = height - 70;

             } catch (pdfErr: unknown) {
               console.error('Error al fusionar PDF:', pdfErr);
               const message = pdfErr instanceof Error ? pdfErr.message : 'Unknown PDF merge error';
               drawTextWithBreaks(`- (Error al adjuntar PDF: ${imageName}: ${message})`, 9, font, 14, rgb(0.8, 0, 0));
             }
             continue;
          }

          // Incrustar JPG o PNG
          if (/\.jpe?g$/i.test(imageName)) {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          } else if (/\.png$/i.test(imageName)) {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
          } else {
            // Otros formatos (DOCX, XLSX, etc.)
            drawTextWithBreaks(`- (Archivo Adjunto) ${imageName}`, 9, fontBold, 14, rgb(0, 0, 0)); // Use black for clarity
            drawTextWithBreaks(`  Formato no visualizable directamente en PDF. Descargar desde el dashboard.`, 8, font, 14, rgb(0.5, 0.5, 0.5));
            continue;
          }

          // Escalar la imagen para que quepa (máx 450px de ancho)
          const maxWidth = lineWidth - 50;
          const dims = embeddedImage.scale(maxWidth / embeddedImage.width);

          // Verificar si hay espacio para texto + imagen
          if (y < (dims.height + 70)) { // Nueva página si no cabe
            page = pdfDoc.addPage(PageSizes.Letter);
            y = height - 70;
          }

          // Dibujar el nombre de la imagen
          page.drawText(`- (Imagen) ${imageName}`, {
            x: margin,
            y,
            size: 9,
            font: font,
            color: rgb(0.3, 0.3, 0.3)
          });
          y -= 18; // IMPORTANTE: Bajar la posición Y después del texto

          // Ahora dibujar la imagen en la nueva posición
          page.drawImage(embeddedImage, {
            x: margin + 15,
            y: y - dims.height, // Restar la altura para que la imagen quede debajo
            width: dims.width,
            height: dims.height,
          });

          y -= (dims.height + 20); // Espacio después de la imagen

        } catch (imgError: unknown) { // Changed from any
          console.error(`Error al incrustar imagen ${imageName}:`, imgError); // Log raw error for debugging
          const message = imgError instanceof Error ? imgError.message : 'Unknown image embedding error';
          drawTextWithBreaks(`- (Error al cargar evidencia: ${imageName}: ${message})`, 9, font, 14, rgb(0.8, 0, 0));
        }
      }
    } else {
      drawTextWithBreaks('No se adjuntó evidencia.', 10, font, 15);
    }

    // 3. Serializar el PDF a bytes
    const pdfBytes = await pdfDoc.save();

    // --- FIN DE GENERACIÓN DE PDF REAL ---

    // 4. Generar HASH y RUTA
    const hash_acta = crypto
      .createHash('sha256')
      .update(pdfBytes) // Hash sobre los bytes del PDF
      .digest('hex');

    const filename = `acta_etica_${caso.id}_${Date.now()}.pdf`;
    // CAMBIO CRUCIAL: Usar '/' en lugar de path.join para la ruta de Supabase
    const storage_path_acta = `${tenantId}/actas_eticas_resueltas/${filename}`;

    // 5. Subir el archivo PDF a Supabase Storage
    const pdfBuffer = Buffer.from(pdfBytes); // Convertir Uint8Array a Buffer
    await storageService.uploadFile(storage_path_acta, pdfBuffer, 'application/pdf');

    // 6. Crear el Documento Legal en estado 'borrador' (Módulo WORM)
    const docQuery = `
      INSERT INTO core.documentos_legales (
        tenant_id, creado_por_user_id, titulo, descripcion, tipo_documento,
        fecha_documento, estado, storage_path_original, hash_sha256_original, version
      )
      VALUES ($1, $2, $3, $4, 'acta_etica', NOW(), 'borrador', $5, $6, 1)
      RETURNING id;
    `;
    const docParams = [
      tenantId, decoded.userId, titulo_acta, descripcion_acta,
      storage_path_acta, hash_acta
    ];

    const docResult = await client.query(docQuery, docParams);
    const nuevoDocumentoId = docResult.rows[0].id;

    // 7. Actualizar el Caso Ético
    const updateCasoQuery = `
      UPDATE core.canal_etico_casos
      SET estado = 'resuelto', documento_legal_id = $1
      WHERE id = $2 AND tenant_id = $3
      RETURNING *;
    `;
    await client.query(updateCasoQuery, [nuevoDocumentoId, caso_id, tenantId]);

    await client.query('COMMIT');

    // 8. Devolver solo el éxito
    return NextResponse.json(
      {
        message: 'Caso resuelto. Acta PDF real generada y enviada a Gestión Documental.',
        documento_legal_id: nuevoDocumentoId
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    await client.query('ROLLBACK');
    console.error('Error al resolver caso ético:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    return NextResponse.json({ message }, { status: 500 });
  } finally {
    client.release();
  }
}
