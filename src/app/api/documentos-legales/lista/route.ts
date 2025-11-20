import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id, titulo, estado 
        FROM core.documentos_legales 
        ORDER BY fecha_creacion DESC
      `;
      const result = await client.query(query);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error fetching legal documents:', error);
    return NextResponse.json(
      { error: 'Error fetching legal documents', details: error.message },
      { status: 500 }
    );
  }
}
