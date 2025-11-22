import { NextResponse } from 'next/server';
import { getMetricas } from '@/lib/esgService';

export async function GET() {
  try {
    const metricas = await getMetricas();
    return NextResponse.json(metricas);
  } catch (error) {
    console.error('Error al obtener métricas ESG:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener las métricas' },
      { status: 500 }
    );
  }
}
