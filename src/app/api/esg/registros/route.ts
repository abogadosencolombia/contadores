import { NextRequest, NextResponse } from 'next/server';
import { getRegistros, createRegistro } from '@/lib/esgService';
import { EsgRegistroInput } from '@/types/esg';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    
    // Si no se especifica año, usamos el actual
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
    
    if (isNaN(year)) {
      return NextResponse.json(
        { error: 'El parámetro year debe ser un número válido' },
        { status: 400 }
      );
    }

    // Crear rango de fechas: 1 de Enero a 31 de Diciembre del año seleccionado
    const fechaInicio = new Date(year, 0, 1);
    const fechaFin = new Date(year, 11, 31, 23, 59, 59);

    const registros = await getRegistros(fechaInicio, fechaFin);
    
    return NextResponse.json(registros);
  } catch (error) {
    console.error('Error al obtener registros ESG:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener los registros' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.metricaId || body.valor === undefined || !body.periodoFecha) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: metricaId, valor o periodoFecha' },
        { status: 400 }
      );
    }

    // Preparar datos para el servicio
    const registroInput: EsgRegistroInput = {
      metricaId: Number(body.metricaId),
      valor: Number(body.valor),
      periodoFecha: new Date(body.periodoFecha), // Aseguramos que sea Date
      usuarioId: body.usuarioId || null,
      evidenciaUrl: body.evidenciaUrl || null,
      observaciones: body.observaciones || null,
    };

    const nuevoRegistro = await createRegistro(registroInput);

    return NextResponse.json(nuevoRegistro, { status: 201 });
  } catch (error) {
    console.error('Error al crear registro ESG:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al crear el registro' },
      { status: 500 }
    );
  }
}
