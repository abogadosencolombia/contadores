// En: src/app/api/facturacion/facturas/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db'; // <-- MOVIMOS LOS IMPORTS AQUÍ ARRIBA
import { verifyAuth, UserPayload } from '@/lib/auth'; // <-- MOVIMOS LOS IMPORTS AQUÍ ARRIBA

/**
 * OBTIENE una lista paginada de facturas para el tenant del usuario.
 */
export async function GET(req: NextRequest) {

  let decoded: UserPayload;

  try {
    // 1. Verificar la autenticación del usuario (contador)
    decoded = verifyAuth(req);

  } catch (err: any) {
    // Captura 'No autenticado: Token no encontrado' o 'Token inválido'
    return NextResponse.json(
      { message: err.message || 'No autorizado. Token inválido o expirado.' },
      { status: 401 }
    );
  }

  // Si la autenticación fue exitosa, 'decoded' tiene el payload.
  try {
    // 2. Obtener el tenant_id del usuario (¡clave para multitenancy!)
    const tenantId = decoded.tenant;

    if (!tenantId) {
      return NextResponse.json(
        { message: 'ID de tenant no encontrado en el token.' },
        { status: 400 }
      );
    }

    // 3. Obtener parámetros de paginación
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // 4. Consultar la base de datos (solo columnas necesarias para la tabla)
    const dataQuery = `
      SELECT
        id,
        tenant_id,
        consecutivo,
        fecha_emision,
        cliente_razon_social,
        total_con_impuestos,
        estado_dian,
        es_habilitacion,
        cufe
      FROM core.facturas
      WHERE tenant_id = $1
      ORDER BY fecha_emision DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) FROM core.facturas
      WHERE tenant_id = $1
    `;

    // 5. Ejecutar ambas consultas en paralelo
    const [dataResult, totalResult] = await Promise.all([
      db.query(dataQuery, [tenantId, limit, offset]),
      db.query(countQuery, [tenantId])
    ]);

    // 6. Devolver la respuesta JSON que el frontend espera
    return NextResponse.json({
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10)
    });

  } catch (error) {
    // Captura de errores de base de datos
    console.error('Error en GET /api/facturacion/facturas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor al obtener facturas.' },
      { status: 500 }
    );
  }
}


/**
 * CREA una nueva factura en estado "borrador".
 */
export async function POST(req: NextRequest) {

  let decoded: UserPayload;

  try {
    // 1. Verificar la autenticación
    decoded = verifyAuth(req);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }

  try {
    // 2. Obtener los datos del formulario de factura
    const body = await req.json();

    const {
      consecutivo,
      cliente_tipo_documento,
      cliente_documento,
      cliente_razon_social,
      cliente_email,
      fecha_vencimiento,
      moneda,
      total_sin_impuestos,
      total_impuestos,
      total_con_impuestos,
      items_json,
      es_habilitacion
    } = body;

    // 3. Validación de campos mínimos
    if (!consecutivo || !cliente_tipo_documento || !cliente_documento || !cliente_razon_social || !cliente_email || total_con_impuestos === undefined || !items_json) {
      return NextResponse.json({ message: 'Faltan campos obligatorios para crear el borrador.' }, { status: 400 });
    }

    // 4. Obtener datos del usuario autenticado
    const tenantId = decoded.tenant;
    const contadorId = decoded.userId;

    // 5. Crear la consulta SQL
    const query = `
      INSERT INTO core.facturas (
        tenant_id,
        creado_por_user_id,
        consecutivo,
        fecha_vencimiento,
        cliente_tipo_documento,
        cliente_documento,
        cliente_razon_social,
        cliente_email,
        moneda,
        total_sin_impuestos,
        total_impuestos,
        total_con_impuestos,
        items_json,
        es_habilitacion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const params = [
      tenantId,
      contadorId,
      consecutivo,
      fecha_vencimiento || null,
      cliente_tipo_documento,
      cliente_documento,
      cliente_razon_social,
      cliente_email,
      moneda || 'COP',
      total_sin_impuestos,
      total_impuestos,
      total_con_impuestos,
      JSON.stringify(items_json), // Fix: Convertir el objeto JSON a string
      es_habilitacion === true
    ];

    // 6. Ejecutar la inserción
    const result = await db.query(query, params);

    // 7. Devolver la factura recién creada
    return NextResponse.json(result.rows[0], { status: 201 }); // 201 Created

  } catch (error: any) {
    console.error('Error en POST /api/facturacion/facturas:', error);

    // 8. Manejo de Errores Específicos
    if (error.code === '23505') { // Error de violación de unicidad
      if (error.constraint === 'facturas_tenant_consecutivo_key') {
         return NextResponse.json({ message: `El consecutivo de factura '${body.consecutivo}' ya existe para este tenant.` }, { status: 409 });
      }
      return NextResponse.json({ message: 'Error de unicidad: ' + error.detail }, { status: 409 });
    }

    if (error.code === '23502') { // Not-null violation
        return NextResponse.json({ message: `Error de base de datos: ${error.message}.` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Error interno del servidor al crear la factura.' }, { status: 500 });
  }
}
