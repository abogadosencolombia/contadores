// En: src/app/api/riesgos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth'; // Importamos nuestro helper

/**
 * OBTIENE todos los riesgos de la base de datos (AHORA CON FILTROS Y PAGINACIÓN)
 */
export async function GET(req: NextRequest) {
  try {
    const _user = verifyAuth(req);

    // --- Lógica de Paginación ---
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // --- Lógica de Filtros (Existente) ---
    const search = req.nextUrl.searchParams.get('search');
    const dominio = req.nextUrl.searchParams.get('dominio');
    const estado = req.nextUrl.searchParams.get('estado');

    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`(riesgo ILIKE $${params.length} OR control ILIKE $${params.length})`);
    }
    if (dominio) {
      params.push(dominio);
      whereClauses.push(`dominio = $${params.length}`);
    }
    if (estado) {
      params.push(estado);
      whereClauses.push(`estado = $${params.length}`);
    }

    const whereString = whereClauses.length > 0 ? ' WHERE ' + whereClauses.join(' AND ') : '';

    // --- Dos Consultas en Paralelo ---

    // 1. Consulta para obtener el CONTEO TOTAL (para la paginación)
    const countQuery = `SELECT COUNT(*) FROM core.riesgos ${whereString}`;

    // 2. Consulta para obtener los DATOS de la página actual
    const dataQuery = `
      SELECT * FROM core.riesgos
      ${whereString}
      ORDER BY id DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const [countResult, dataResult] = await Promise.all([
      db.query(countQuery, params),
      db.query(dataQuery, [...params, limit, offset])
    ]);

    const total = parseInt(countResult.rows[0].count, 10);
    const data = dataResult.rows;

    // 3. Devolver un objeto con los datos y el total
    return NextResponse.json({
      data,
      total,
    }, { status: 200 });

  } catch (err: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (err instanceof Error) {
      errorMessage = err.message;
      if (errorMessage.includes('No autenticado')) {
        return NextResponse.json({ message: errorMessage }, { status: 401 });
      }
    }
    console.error('Error en GET /api/riesgos:', err);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

/**
 * CREA un nuevo riesgo en la base de datos (Sin Cambios)
 */
export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = await req.json();
    const { dominio, riesgo, probabilidad, impacto, control } = body;

    if (!dominio || !riesgo || !probabilidad || !impacto || !control) {
      return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const query = `
      INSERT INTO core.riesgos
        (dominio, riesgo, probabilidad, impacto, owner, control, estado)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const params = [
      dominio,
      riesgo,
      parseInt(probabilidad, 10),
      parseInt(impacto, 10),
      user.fullName,
      control,
      'abierto'
    ];

    const result = await db.query(query, params);
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (err: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (err instanceof Error) {
      errorMessage = err.message;
      if (errorMessage.includes('No autenticado')) {
        return NextResponse.json({ message: errorMessage }, { status: 401 });
      }
    }
    console.error('Error en POST /api/riesgos:', err);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
