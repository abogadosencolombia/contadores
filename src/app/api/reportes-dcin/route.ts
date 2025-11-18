// src/app/api/reportes-dcin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { DcinService } from '@/lib/dcinService'; // Importamos el nuevo servicio
import { verifyAuth } from '@/lib/auth';

// GET /api/reportes-dcin (Listar reportes generados)
export async function GET(request: NextRequest) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    const tenantId = payload.tenant;

    const { rows } = await db.query(
      'SELECT * FROM core.reportes_dcin WHERE tenant_id = $1 ORDER BY fecha_generacion DESC',
      [tenantId]
    );
    return NextResponse.json(rows);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Error desconocido' }, { status: 500 });
  }
}

// POST /api/reportes-dcin (Generar un nuevo reporte)
export async function POST(request: NextRequest) {
  try {
    const payload = verifyAuth(request);
    if (!payload.roles?.includes('admin')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { inversionId } = await request.json(); // Solo necesitamos el ID de la inversión
    const userId = payload.userId;
    const tenantId = payload.tenant;

    if (!inversionId) {
      return NextResponse.json({ error: 'Falta parámetro requerido: inversionId' }, { status: 400 });
    }

    const nuevoReporte = await DcinService.generarReporteDCIN(
      inversionId,
      tenantId,
      userId
    );

    return NextResponse.json(nuevoReporte, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('No autenticado')) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      console.error('Error al generar el reporte DCIN:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor', details: error.message },
        { status: 500 }
      );
    }
     console.error('Error al generar el reporte DCIN:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}