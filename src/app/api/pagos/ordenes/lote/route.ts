import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
// import { verifyAuth } from '@/lib/auth'; // Descomenta si usas tu auth

export async function POST(req: NextRequest) {
  try {
    // 1. Simulación de usuario (En producción, usa verifyAuth(req))
    // const session = await verifyAuth(req);
    const userId = 1; // ID de usuario admin temporal
    const tenantId = '1'; // ID de tu tenant (empresa) temporal

    const { dividendos } = await req.json();

    if (!dividendos || !Array.isArray(dividendos)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 2. Iteramos sobre los dividendos aprobados por el usuario
      for (const div of dividendos) {

        // A. Crear la Orden de Pago (Queda en estado 'pendiente' para pago manual/banco)
        const ordenQuery = `
          INSERT INTO core.ordenes_pago
          (tenant_id, creado_por_user_id, proveedor_nit, proveedor_nombre, descripcion,
           monto, moneda, monto_equivalente_cop, estado, estado_pago)
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, 'aprobado', 'pendiente')
          RETURNING id;
        `;

        // Asumimos tasa 1:1 si es COP, o 4000 si es USD (simplificado)
        const tasaCambio = div.moneda === 'USD' ? 4000 : 1;
        const montoCOP = div.monto_neto * tasaCambio;

        await client.query(ordenQuery, [
          tenantId,
          userId,
          String(div.accionista_id), // Usamos ID accionista como NIT/ID proveedor
          div.nombre,
          `Dividendos 2025 - ${div.email}`,
          div.monto_neto,
          div.moneda,
          montoCOP
        ]);

        // B. Registrar el Dividendo Contable (Para certificados de retención futuros)
        const dividendoQuery = `
          INSERT INTO core.dividendospagados
          (accionista_id, ano_fiscal, monto_bruto, retencion, monto_neto, fecha_pago)
          VALUES ($1, 2025, $2, $3, $4, CURRENT_DATE)
        `;

        await client.query(dividendoQuery, [
            div.accionista_id,
            div.monto_bruto,
            div.retencion,
            div.monto_neto
        ]);
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true, message: `${dividendos.length} órdenes creadas` });

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error SQL:', err);
      throw err;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('Error general:', error);
    return NextResponse.json({ error: 'Error procesando lote' }, { status: 500 });
  }
}
