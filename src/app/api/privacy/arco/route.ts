import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const body = await req.json();
    
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
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error: any) {
    console.error('Error creating ARCO request:', error);
    if (error.message && (error.message.includes('No autenticado') || error.message.includes('Token'))) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
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
        return NextResponse.json(result.rows);

    } catch (error: any) {
        console.error('Error fetching ARCO requests:', error);
        if (error.message && (error.message.includes('No autenticado') || error.message.includes('Token'))) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
