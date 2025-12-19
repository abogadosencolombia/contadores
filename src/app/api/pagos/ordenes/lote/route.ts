import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
// import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // 1. Simulación de usuario
    const userId = 1;

    // CORRECCIÓN: Usamos el ID de TEXTO (String) que existe en la tabla core.tenants
    // Según me indicas, el tenant 1 tiene el identificador: "default_tenant"
    const tenantId = 'default_tenant';

    const { dividendos } = await req.json();

    if (!dividendos || !Array.isArray(dividendos)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 2. Iteramos sobre los dividendos
      for (const div of dividendos) {

        const mockTransactionId = `PENDIENTE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const tasaCambio = div.moneda === 'USD' ? 4000 : 1;
        const montoCOP = div.monto_neto * tasaCambio;

        // A. Insertamos la Orden de Pago (Referenciando al tenant por su String ID)
        const ordenQuery = `
          INSERT INTO core.ordenes_pago
          (tenant_id, creado_por_user_id, proveedor_nit, proveedor_nombre, descripcion,
           monto, moneda, monto_equivalente_cop, estado, estado_pago, referencia_pago_externo)
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, 'aprobado', 'pagada', $9)
          RETURNING id;
        `;

        await client.query(ordenQuery, [
          tenantId, // 'default_tenant'
          userId,
          String(div.accionista_id),
          div.nombre,
          `Dividendos 2025 - ${div.email}`,
          div.monto_neto,
          div.moneda,
          montoCOP,
          mockTransactionId
        ]);

        // B. Registrar el Dividendo Contable
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

      return NextResponse.json({
        success: true,
        message: `Se registro ${dividendos.length} en Gestion de Pagos`
      });

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error SQL:', err);
      throw err;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('Error general:', error);
    return NextResponse.json({ error: 'Error procesando lote', detail: error.message }, { status: 500 });
  }
}
