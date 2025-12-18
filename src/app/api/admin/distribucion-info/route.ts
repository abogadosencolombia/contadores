import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  // 1. Seguridad básica
  const authHeader = req.headers.get('x-api-key');
  if (authHeader !== process.env.N8N_INTERNAL_API_KEY) {
    // Si no has configurado la variable de entorno, comenta la línea de abajo para probar
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await db.connect();
  try {
    // CORRECCIÓN: Hacemos JOIN con la tabla 'tenants' para vincular el ID numérico con el ID de texto
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
      WHERE cd.ano_fiscal = 2025
      AND cb.proveedor_externo IS NOT NULL
    `;

    const { rows } = await client.query(query);

    // Si no hay resultados, devuelve un array vacío pero con status 200
    return NextResponse.json(rows);

  } catch (error: any) {
    console.error('Error en distribución info:', error);
    // Esto te permitirá ver el error real en la respuesta del curl si vuelve a fallar
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
