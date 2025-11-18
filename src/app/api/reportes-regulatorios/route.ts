import { NextRequest, NextResponse } from 'next/server';
import  db  from '@/lib/db';
import { ReportesService } from '@/lib/reportesService';
import { verifyAuth, UserPayload } from '@/lib/auth';

// GET /api/reportes-regulatorios
export async function GET(request: NextRequest) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    const tenantId = payload.tenant;

    const { rows } = await db.query(
      'SELECT * FROM core.reportes_regulatorios WHERE tenant_id = $1 ORDER BY fecha_generacion DESC',
      [tenantId]
    );
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

// POST /api/reportes-regulatorios (Generación Manual)
export async function POST(request: NextRequest) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { balanceId, entidad, tipoReporte } = await request.json();
    const userId = payload.userId;
    const tenantId = payload.tenant;

    if (!balanceId || !entidad || !tipoReporte) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos: balanceId, entidad, tipoReporte' }, { status: 400 });
    }

    const nuevoReporte = await ReportesService.generarReporte(
      balanceId,
      entidad,
      tipoReporte,
      tenantId,
      userId
    );

    return NextResponse.json(nuevoReporte, { status: 201 });

  } catch (error: any) {
    // El error de verifyAuth se captura aquí
    if (error.message.includes('No autenticado') || error.message.includes('Token inválido')) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error al generar el reporte:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}
