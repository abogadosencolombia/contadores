import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Recibimos los datos de la factura que se acaba de subir
    const facturaData = await request.json();

    // Validamos que haya datos
    if (!facturaData) {
      return NextResponse.json(
        { error: 'No se recibieron datos de la factura' },
        { status: 400 }
      );
    }

    // 1.5. Obtener el usuario autenticado para inyectar el user_id real
    let userId = 1; // Fallback (temporal)
    let tenantId: string | undefined; // Inicializamos tenantId como undefined
    try {
      const user = verifyAuth(request);
      userId = user.userId;
      tenantId = user.tenant;
    } catch (authError) {
      console.warn('No se pudo obtener usuario autenticado en ai-governance/analyze, usando ID temporal 1');
    }

    if (!tenantId) {
      console.warn('No se pudo obtener tenantId en ai-governance/analyze, el webhook de N8N podría no funcionar correctamente.');
    }

    // 2. Usamos la variable ESPECÍFICA que definiste
    const webhookUrl = process.env.N8N_AI_WEBHOOK_GOVERNANCE_URL;

    if (!webhookUrl) {
      console.error('ERROR CRÍTICO: N8N_AI_WEBHOOK_GOVERNANCE_URL no definida en .env');
      return NextResponse.json(
        { error: 'Error de configuración del servidor de IA' },
        { status: 500 }
      );
    }

    // 3. Enviamos la factura a n8n (Fire and Forget)
    // No esperamos a que la IA termine para responder al usuario,
    // queremos que la interfaz de facturación siga rápida.
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...facturaData,
        user_id: userId, // <-- INYECTADO EL ID REAL
        tenant_id: tenantId, // <-- INYECTADO EL TENANT_ID
        origen: 'dashboard-facturacion',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error(`Error enviando a n8n: ${response.status} ${response.statusText}`);
      throw new Error('Fallo la conexión con el motor de IA');
    }

    // 4. Confirmamos que el proceso inició
    return NextResponse.json({
      success: true,
      message: 'Factura enviada a auditoría de IA correctamente.',
    });

  } catch (error: any) {
    console.error('Error en API AI Governance:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno' },
      { status: 500 }
    );
  }
}
