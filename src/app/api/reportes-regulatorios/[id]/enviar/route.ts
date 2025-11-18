import { NextRequest, NextResponse } from 'next/server';
import { ReportesService } from '@/lib/reportesService';
import { verifyAuth, UserPayload } from '@/lib/auth';

/**
 * POST /api/reportes-regulatorios/[id]/enviar
 * Dispara el envío de un reporte ya generado hacia la entidad (Supersociedades, etc.)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    const tenantId = payload.tenant;

    const reporteId = parseInt(params.id);

    if (isNaN(reporteId)) {
      return NextResponse.json({ error: 'ID de reporte inválido' }, { status: 400 });
    }

    // Usamos el servicio para manejar la lógica de envío
    const resultadoEnvio = await ReportesService.enviarReporte(reporteId, tenantId);

    return NextResponse.json(resultadoEnvio);

  } catch (error: any) {
    if (error.message.includes('No autenticado') || error.message.includes('Token inválido')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error(`Error al enviar reporte ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
