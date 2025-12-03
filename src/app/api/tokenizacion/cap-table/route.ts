import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // 1. Autenticación
    try {
      verifyAuth(req);
    } catch (_e) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Consulta Agregada del Cap Table
    // Unimos core.cap_table con core.users para obtener nombres
    // Agrupamos por inversionista para sumar sus porcentajes/acciones
    const query = `
      SELECT 
        u.full_name,
        u.email,
        SUM(ct.porcentaje) as total_percentage,
        SUM(ct.cantidad) as total_tokens,
        MIN(ct.fecha) as first_investment_date
      FROM core.cap_table ct
      JOIN core.users u ON ct.inversionista_id = u.id
      GROUP BY u.id, u.full_name, u.email
      ORDER BY total_percentage DESC
    `;

    const result = await pool.query(query);

    // Formatear datos para el frontend
    const capTableData = result.rows.map(row => ({
      name: row.full_name || row.email,
      email: row.email,
      percentage: parseFloat(row.total_percentage),
      tokens: parseInt(row.total_tokens),
      firstInvestment: row.first_investment_date
    }));

    // Calcular total para validación (debería ser cercano a 100 si todo está emitido, 
    // o menos si hay acciones en tesorería no tokenizadas)
    const totalDistributed = capTableData.reduce((acc, curr) => acc + curr.percentage, 0);

    return NextResponse.json({
      shareholders: capTableData,
      summary: {
        totalDistributed: totalDistributed,
        totalShareholders: capTableData.length
      }
    });

  } catch (error: unknown) {
    console.error('Error fetching Cap Table:', error);
    return NextResponse.json(
      { error: 'Error al obtener Cap Table' },
      { status: 500 }
    );
  }
}
