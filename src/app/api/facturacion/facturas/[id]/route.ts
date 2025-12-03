// En: src/app/api/facturacion/facturas/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';

interface FacturaContext {
  params: Promise<{
    id: string; // El ID de la factura que viene en la URL
  }>
}

/**
 * OBTIENE los detalles (incluyendo XMLs) de una factura específica.
 */
export async function GET(req: NextRequest, context: FacturaContext) {

  let decoded: UserPayload;
  try {
    // 1. Verificar la autenticación
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ message }, { status: 401 });
  }

  try {
    const { id } = await context.params; // ID de la factura
    const tenantId = decoded.tenant; // ID del tenant del usuario

        // 2. Consultar la base de datos por los campos específicos
        const query = `
          SELECT
            id,
            tenant_id,
            consecutivo,
            fecha_emision,
            fecha_vencimiento,
            cliente_razon_social,
            cliente_documento,
            cliente_tipo_documento,
            total_sin_impuestos,
            total_impuestos,
            total_con_impuestos,
            items_json,
            estado_dian,
            es_habilitacion,
            cufe,
            xml_ubl_generado,       -- El UBL 2.1 simulado
            dian_xml_respuesta      -- El ApplicationResponse simulado
          FROM core.facturas
          WHERE
            id = $1 AND tenant_id = $2; -- ¡Clave de seguridad multitenant!
        `;

        const result = await db.query(query, [id, tenantId]);

    // 3. Verificar si se encontró la factura
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Factura no encontrada o no pertenece a este tenant.' },
        { status: 404 }
      );
    }

    // 4. Devolver los datos
    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error: unknown) {
    console.error(`Error en GET /api/facturacion/facturas/[id]:`, error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor al obtener el detalle de la factura.';
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
