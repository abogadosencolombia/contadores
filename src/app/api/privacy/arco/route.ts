import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

interface ArcoRequestBody {
  tipo?: string;
  tipo_solicitud?: string;
  detalle?: string;
}

interface ArcoRow {
  id: number;
  tipo_solicitud: string;
  detalle: string;
  estado: string;
  fecha_solicitud: Date;
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = (await req.json()) as ArcoRequestBody;
    
    // El frontend service envía 'tipo', pero soportamos 'tipo_solicitud' por compatibilidad
    const tipo_solicitud = body.tipo || body.tipo_solicitud;
    const detalle = body.detalle;

    if (!tipo_solicitud || !detalle) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: tipo_solicitud (o tipo), detalle' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO core.solicitudes_arco 
      (tenant_id, user_id, email_solicitante, tipo_solicitud, detalle_solicitud, estado)
      VALUES ($1, $2, $3, $4, $5, 'PENDIENTE')
      RETURNING id, tipo_solicitud, detalle_solicitud as detalle, estado, fecha_solicitud
    `;

    const values = [
      user.tenant,
      user.userId,
      user.email,
      tipo_solicitud,
      detalle
    ];

    const result = await pool.query(query, values);
    const newRequest = result.rows[0] as ArcoRow;
    return NextResponse.json(newRequest, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating ARCO request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    if (errorMessage.includes('No autenticado') || errorMessage.includes('Token')) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
        const user = verifyAuth(req);
        
        const query = `
            SELECT 
              id, 
              tipo_solicitud, 
              detalle_solicitud as detalle, 
              estado, 
              fecha_solicitud
            FROM core.solicitudes_arco
            WHERE user_id = $1
            ORDER BY fecha_solicitud DESC
        `;
        
        const result = await pool.query(query, [user.userId]);
        return NextResponse.json(result.rows as ArcoRow[]);

    } catch (error: unknown) {
        console.error('Error fetching ARCO requests:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        if (errorMessage.includes('No autenticado') || errorMessage.includes('Token')) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
