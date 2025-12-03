import { NextRequest, NextResponse } from 'next/server';
import { ReportesService } from '@/lib/reportesService';
import { verifyAuth, UserPayload as _UserPayload } from '@/lib/auth';

/**
 * POST /api/reportes-regulatorios/[id]/enviar
 * Dispara el envío de un reporte ya generado hacia la entidad (Supersociedades, etc.)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    const tenantId = payload.tenant;

    const { id } = await context.params;
    const reporteId = parseInt(id);

    if (isNaN(reporteId)) {
      return NextResponse.json({ error: 'ID de reporte inválido' }, { status: 400 });
    }

    // Usamos el servicio para manejar la lógica de envío
    const resultadoEnvio = await ReportesService.enviarReporte(reporteId, tenantId);

    return NextResponse.json(resultadoEnvio);

  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (errorMessage.includes('No autenticado') || errorMessage.includes('Token inválido')) {
        return NextResponse.json({ error: errorMessage }, { status: 401 });
      }
    }
    console.error(`Error al enviar reporte`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: errorMessage },
      { status: 500 }
    );
  }
}
