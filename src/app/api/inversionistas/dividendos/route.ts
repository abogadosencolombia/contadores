import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const { accionista_id, ano_fiscal, monto_bruto, retencion, monto_neto, fecha_pago } = await req.json();

    const client = await db.connect();
    
    // Insertamos el pago. Esto es lo que el generador leerá después.
    await client.query(
      `INSERT INTO core.dividendospagados (accionista_id, ano_fiscal, monto_bruto, retencion, monto_neto, fecha_pago)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [accionista_id, ano_fiscal, monto_bruto, retencion, monto_neto, fecha_pago]
    );
    
    client.release();
    return NextResponse.json({ message: 'Dividendo registrado. Listo para generar certificado.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error registrando dividendo' }, { status: 500 });
  }
}