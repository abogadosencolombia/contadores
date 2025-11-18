// src/app/api/reportes-dcin/[id]/enviar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DcinService } from '@/lib/dcinService';
import { verifyAuth } from '@/lib/auth';

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

    const resultadoEnvio = await DcinService.enviarReporteDCIN(reporteId, tenantId);

    return NextResponse.json(resultadoEnvio);

  } catch (error: unknown) {
    if (error instanceof Error) {
        if (error.message.includes('No autenticado')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        console.error(`Error al enviar reporte DCIN ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Error interno del servidor', details: error.message },
            { status: 500 }
        );
    }
     console.error(`Error al enviar reporte DCIN ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}