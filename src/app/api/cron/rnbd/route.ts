import { NextRequest, NextResponse } from 'next/server';
import { RnbdService as SicService } from '@/lib/rnbdService';
import { sendEmail } from '@/lib/email'; // Importar el servicio de correo

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Seguridad: Validar Token Bearer
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Extraer dirección de correo del remitente SMTP para usarla como destino de alertas
  const adminEmailMatch = process.env.SMTP_FROM?.match(/<(.*?)>/);
  const adminEmail = adminEmailMatch ? adminEmailMatch[1] : 'soporte@abogadosencolombiasas.com'; // Fallback

  try {
    // 2. Llama a SicService.verificarRenovacionesPendientes()
    const pendientes = await SicService.verificarRenovacionesPendientes();
    
    // 3. Enviar alertas de vencimiento (Gestión Manual)
    await SicService.enviarAlertasVencimiento(pendientes);

    // 4. Retorna un JSON con el resumen
    return NextResponse.json({
      message: 'Proceso de verificación y alertas RNBD finalizado',
      total_pendientes: pendientes.length,
      pendientes
    });

  } catch (error: any) {
    console.error('Error general en cron RNBD:', error);
    // También se podría enviar un correo en caso de un error general del cron
    if (adminEmail) {
      try {
        await sendEmail({
          to: adminEmail,
          subject: '[ALERTA RNBD] Error crítico en el cron de renovación',
          html: `
            <h1>Error Crítico en el Cron de Renovación RNBD</h1>
            <p>Se ha producido un error inesperado al ejecutar el cron de renovación del RNBD.</p>
            <p><strong>Detalles del error:</strong> ${error.message}</p>
            <p>Por favor, revisa los logs del servidor con urgencia.</p>
          `,
        });
        console.log(`Alerta por correo enviada a ${adminEmail} por error general en RNBD cron.`);
      } catch (emailError: any) {
        console.error('Error al enviar alerta por correo de error general de RNBD cron:', emailError);
      }
    }
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
