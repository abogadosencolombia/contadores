import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { storageService } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (!payload) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { certificado_id } = await req.json();
    if (!certificado_id) {
      return NextResponse.json({ error: 'ID de certificado requerido' }, { status: 400 });
    }

    const client = await db.connect();
    
    // Obtener datos del certificado, accionista y verificar tenant por seguridad
    // Asumimos que verifyAuth devuelve el tenant_id string en payload.tenant
    // Necesitamos hacer JOIN con accionistas para verificar que el certificado pertenece a un accionista de este tenant
    const query = `
      SELECT 
        cd.file_path, 
        cd.ano_fiscal,
        a.email, 
        a.nombre_completo,
        a.tenant_id as acc_tenant_id
      FROM core.certificadosdividendos cd
      JOIN core.accionistas a ON cd.accionista_id = a.id
      JOIN core.tenants t ON a.tenant_id = t.id
      WHERE cd.id = $1 AND t.tenant_id = $2
    `;
    
    const result = await client.query(query, [certificado_id, payload.tenant]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Certificado no encontrado o no autorizado' }, { status: 404 });
    }

    const { file_path, ano_fiscal, email, nombre_completo } = result.rows[0];

    if (!email) {
      return NextResponse.json({ error: 'El accionista no tiene un correo electrónico registrado.' }, { status: 400 });
    }

    // 1. Obtener URL firmada de Supabase Storage
    let signedUrl: string;
    try {
       signedUrl = await storageService.getSignedUrl(file_path);
    } catch (err) {
       console.error("Error obteniendo URL firmada:", err);
       return NextResponse.json({ error: 'El archivo no se encuentra en el almacenamiento.' }, { status: 404 });
    }

    // 2. Descargar el archivo como Buffer para adjuntarlo
    const fileRes = await fetch(signedUrl);
    if (!fileRes.ok) {
       console.error(`Error descargando archivo de ${signedUrl}: ${fileRes.statusText}`);
       return NextResponse.json({ error: 'No se pudo descargar el archivo del certificado.' }, { status: 500 });
    }
    const fileBuffer = Buffer.from(await fileRes.arrayBuffer());

    // Enviar email
    await sendEmail({
      to: email,
      subject: `Certificado de Dividendos ${ano_fiscal} - ${nombre_completo}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Certificado de Dividendos</h2>
          <p>Estimado(a) <strong>${nombre_completo}</strong>,</p>
          <p>Adjunto a este correo encontrará su certificado de dividendos correspondiente al año fiscal <strong>${ano_fiscal}</strong>.</p>
          <p>Este documento cuenta con una firma digital y un código QR para su verificación.</p>
          <br>
          <p>Cordialmente,</p>
          <p><strong>Departamento de Contabilidad</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `Certificado_Dividendos_${ano_fiscal}.pdf`,
          content: fileBuffer
        }
      ]
    });

    return NextResponse.json({ message: 'Correo enviado exitosamente.' });

  } catch (error: any) {
    console.error('Error enviando certificado:', error);
    return NextResponse.json({ error: 'Error interno al enviar el correo.' }, { status: 500 });
  }
}
