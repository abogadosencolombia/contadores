import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  // 1. Seguridad básica
  const authHeader = req.headers.get('x-api-key');
  if (authHeader !== process.env.N8N_INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await db.connect();
  try {
    // AÑO FISCAL: Puedes parametrizarlo si quieres, por ahora es 2025
    const anoFiscal = 2025;

    // CORRECCIÓN: Agregamos "AND NOT EXISTS" para filtrar los ya pagados
    const query = `
      SELECT
        a.id as accionista_id,
        a.nombre_completo,
        a.email,
        a.numero_acciones,
        cd.valor_accion,
        cd.porcentaje_dividendo,
        cd.porcentaje_retencion,
        cb.proveedor_externo,
        cb.moneda
      FROM core.accionistas a
      JOIN core.tenants t ON a.tenant_id = t.id
      JOIN core.configuracion_dividendos cd ON a.tenant_id = cd.tenant_id
      LEFT JOIN core.cuentas_bancarias cb ON t.tenant_id = cb.tenant_id
      WHERE cd.ano_fiscal = $1
      AND cb.proveedor_externo IS NOT NULL

      -- FILTRO ANTI-DUPLICADOS:
      -- Solo trae accionistas que NO tengan registro en dividendospagados este año
      AND NOT EXISTS (
        SELECT 1
        FROM core.dividendospagados dp
        WHERE dp.accionista_id = a.id
        AND dp.ano_fiscal = $1
      )
    `;

    // Pasamos el año fiscal como parámetro seguro ($1)
    const { rows } = await client.query(query, [anoFiscal]);

    return NextResponse.json(rows);

  } catch (error: any) {
    console.error('Error en distribución info:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
