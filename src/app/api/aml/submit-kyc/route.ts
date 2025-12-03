// src/app/api/aml/submit-kyc/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { AmlScanPayload } from '@/types/aml-kyc';

interface RequestWithIP extends NextRequest {
  ip?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticación
    // verifyAuth lanza un error si el token no es válido o no existe
    const user = verifyAuth(req);

    // 2. Parsear body
    const body = await req.json();
    const { documentUrl, geoLocation } = body;

    if (!documentUrl) {
      return NextResponse.json(
        { error: 'Falta el parámetro documentUrl' },
        { status: 400 }
      );
    }

    // 3. Detectar IP
    let ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

    // x-forwarded-for puede contener múltiples IPs (client, proxy1, proxy2...)
    if (ipAddress.includes(',')) {
      ipAddress = ipAddress.split(',')[0].trim();
    }

    // Fallback si no hay x-forwarded-for (ej. desarrollo local)
    if (ipAddress === 'unknown') {
      const requestIP = (req as RequestWithIP).ip;
      if (requestIP) {
        ipAddress = requestIP;
      }
    }

    // 4. Insertar registro en base de datos
    // Aseguramos que geoLocation sea un JSON válido para la columna jsonb
    const geoLocationJson = geoLocation ? JSON.stringify(geoLocation) : '{}';

    const insertQuery = `
      INSERT INTO core.kyc_logs (user_id, document_url, ip_address, geo_location, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING id;
    `;

    const result = await db.query(insertQuery, [
      user.userId,
      documentUrl,
      ipAddress,
      geoLocationJson,
    ]);

    const kycLogId = result.rows[0].id;

    // 5. Llamada al Webhook (N8N)
    const n8nWebhookUrl = process.env.N8N_AML_WEBHOOK_URL;

    if (n8nWebhookUrl) {
      const payload: AmlScanPayload & { kycLogId: string } = {
        userId: user.userId,
        userEmail: user.email,
        fullName: user.fullName,
        kycLogId,
        ipAddress,
        geoLocation,
        documentUrl,
      };

      // Ejecutamos el fetch pero capturamos errores para no fallar el request principal.
      // En entornos Serverless (Vercel), debemos esperar la promesa (await) para asegurar
      // que el request salga antes de que la función se congele/termine.
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } catch (webhookError) {
        console.error('Error al enviar webhook a N8N:', webhookError);
        // No retornamos error al cliente, es "fire and forget" desde su perspectiva
      }
    } else {
      console.warn('N8N_AML_WEBHOOK_URL no está definida en las variables de entorno.');
    }

    // 6. Retornar éxito
    return NextResponse.json({
      success: true,
      kycLogId,
      message: 'KYC log created and processing started',
    });

  } catch (error: unknown) {
    console.error('Error en API submit-kyc:', error);

    // Manejo específico para errores de auth conocidos
    if (error instanceof Error && (error.message.includes('No autenticado') || error.message.includes('Token'))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    return NextResponse.json(
      { error: (error instanceof Error) ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
