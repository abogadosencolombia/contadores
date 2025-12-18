import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  // 1. Seguridad
  if (req.headers.get('x-api-key') !== process.env.N8N_INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { accionista_id, monto_neto, retencion, moneda, proveedor } = await req.json();

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 2. Lógica de Pasarela (Stripe/Wise)
    // Aquí es donde usas el SDK real. Simulamos el éxito:
    const transactionId = `${proveedor}_TX_${Date.now()}`;
    console.log(`Pagando ${monto_neto} ${moneda} a ${accionista_id} vía ${proveedor}`);

    // 3. Registrar en Historial de Pagos (core.ordenes_pago)
    // Según tu schema.sql, ordenes_pago requiere tenant_id, creado_por, etc.
    const ordenQuery = `
      INSERT INTO core.ordenes_pago
      (tenant_id, creado_por_user_id, proveedor_nit, proveedor_nombre, descripcion,
       monto, moneda, monto_equivalente_cop, estado, estado_pago, referencia_pago_externo)
      VALUES
      ('1', 1, '800123456', 'Accionista ' + $1, 'Pago Dividendos 2025',
       $2, $3, $2 * 4000, 'aprobado', 'pagada', $4)
      RETURNING id;
    `;

    await client.query(ordenQuery, [accionista_id, monto_neto, moneda, transactionId]);

    // 4. Registrar el Dividendo Oficial (para el certificado de retención)
    const dividendoQuery = `
      INSERT INTO core.dividendospagados
      (accionista_id, ano_fiscal, monto_bruto, retencion, monto_neto, fecha_pago)
      VALUES ($1, 2025, $2, $3, $4, CURRENT_DATE)
    `;
    // Nota: Debes recalcular el bruto inverso o enviarlo desde n8n.
    // Aquí simplificado asumimos que n8n envía los datos correctos.
    await client.query(dividendoQuery, [accionista_id, monto_neto + retencion, retencion, monto_neto]);

    await client.query('COMMIT');
    return NextResponse.json({ success: true, transactionId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return NextResponse.json({ error: 'Fallo pago' }, { status: 500 });
  } finally {
    client.release();
  }
}
