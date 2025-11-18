import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth'; // Importamos tu helper de autenticación
import crypto from 'crypto'; // Usaremos 'crypto' de Node.js para generar hashes

// Interfaz para los parámetros de la URL
interface EnviarDianParams {
  params: {
    id: string; // El ID de la factura que viene en la URL
  }
}

/**
 * Endpoint para SIMULAR el envío de una factura a la DIAN.
 * Cambia el estado de 'borrador' a 'aprobada' y genera datos falsos (CUFE, XML).
 */
export async function POST(req: NextRequest, { params }: EnviarDianParams) {

  let decoded: UserPayload;
  try {
    // 1. Verificar la autenticación del usuario (contador)
    decoded = verifyAuth(req);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }

  try {
    const { id } = params; // ID de la factura a enviar
    const tenantId = decoded.tenant; // ID del tenant del contador

    // 2. Obtener la factura de la BD (solo si es un 'borrador' de este tenant)
    const getFacturaQuery = `
      SELECT * FROM core.facturas
      WHERE id = $1 AND tenant_id = $2 AND estado_dian = 'borrador';
    `;
    const facturaResult = await db.query(getFacturaQuery, [id, tenantId]);

    if (facturaResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Factura no encontrada, ya fue enviada, o no pertenece a este tenant.' },
        { status: 404 }
      );
    }

    const factura = facturaResult.rows[0];
    const fechaEnvio = new Date();

    // 3. --- INICIO DE LA SIMULACIÓN ---
    // En un proyecto real, aquí llamarías a un servicio (ej: The Factory, FacturaTech)
    // que se encarga de todo el UBL 2.1 y la firma digital.

    // 3a. Simulación de Firma Digital (Resolución 000042)
    // Usamos el hash de la factura + una "llave privada" falsa.
    const firmaDigitalSimulada = crypto
      .createHash('sha256')
      .update(JSON.stringify(factura.items_json) + "mi-llave-privada-simulada-del-contador")
      .digest('hex');

    // 3b. Simulación de XML UBL v2.1 (Formato DIAN)
    // CORREGIDO: Añadidos los namespaces xmlns:cac y xmlns:cbc
    const xmlUBLSimulado = `<?xml version="1.0" encoding="UTF-8"?>
      <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
               xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
               xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:UBLVersionID>UBL 2.1</cbc:UBLVersionID>
        <cbc:ID>${factura.consecutivo}</cbc:ID>
        <cbc:UUID schemeName="CUFE">${firmaDigitalSimulada}</cbc:UUID>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cbc:Name>Contadores SAS (Tu Empresa)</cbc:Name>
            <cbc:CompanyID schemeName="NIT">900000001</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:AccountingCustomerParty>
          <cac:Party>
            <cbc:Name>${factura.cliente_razon_social}</cbc:Name>
            <cbc:CompanyID schemeName="${factura.cliente_tipo_documento}">${factura.cliente_documento}</cbc:CompanyID>
          </cac:Party>
        </cac:AccountingCustomerParty>
        <cac:LegalMonetaryTotal>
          <cbc:LineExtensionAmount currencyID="${factura.moneda}">${factura.total_sin_impuestos}</cbc:LineExtensionAmount>
          <cbc:TaxExclusiveAmount currencyID="${factura.moneda}">${factura.total_impuestos}</cbc:TaxExclusiveAmount>
          <cbc:PayableAmount currencyID="${factura.moneda}">${factura.total_con_impuestos}</cbc:PayableAmount>
        </cac:LegalMonetaryTotal>
        ...
        <!-- Aquí irían los ítems, firma digital, etc. -->
      </Invoice>
    `;

    // 3c. Simulación de CUFE (basado en la firma)
    const cufeSimulado = firmaDigitalSimulada;

    // 3d. Simulación de QR (El texto que genera el QR)
    const qrDataSimulado = `https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification?cufe=${cufeSimulado}`;

    // 3e. Simulación de Respuesta de la DIAN (ApplicationResponse)
    // CORREGIDO: Añadidos los namespaces xmlns:cac y xmlns:cbc
    const dianXmlRespuestaSimulado = `<?xml version="1.0" encoding="UTF-8"?>
      <ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2"
                           xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                           xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
        <cbc:ResponseDate>${fechaEnvio.toISOString()}</cbc:ResponseDate>
        <cac:DocumentResponse>
          <cac:Response>
            <cbc:ResponseCode>00</cbc:ResponseCode>
            <cbc:Description>Factura ${factura.consecutivo} APROBADA por la DIAN.</cbc:Description>
          </cac:Response>
        </cac:DocumentResponse>
        <cbc:Note>Ambiente: ${factura.es_habilitacion ? 'Habilitacion' : 'Produccion'}</cbc:Note>
      </ApplicationResponse>
    `;

    // 4. --- FIN DE LA SIMULACIÓN ---

    // 5. Actualizar la factura en la base de datos
    const updateQuery = `
      UPDATE core.facturas
      SET
        estado_dian = 'aprobada',
        cufe = $1,
        qr_data = $2,
        xml_ubl_generado = $3,
        dian_xml_respuesta = $4,
        dian_mensaje_error = NULL -- Limpiamos errores previos
      WHERE
        id = $5 AND tenant_id = $6
      RETURNING *;
    `;

    const result = await db.query(updateQuery, [
      cufeSimulado,
      qrDataSimulado,
      xmlUBLSimulado,
      dianXmlRespuestaSimulado,
      id,
      tenantId
    ]);

    // 6. Devolver la factura actualizada
    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error: any) {
    // Capturar errores de base de datos
    console.error(`Error en POST /api/facturacion/facturas/[id]/enviar-dian:`, error);
    return NextResponse.json(
      { message: 'Error interno del servidor al simular el envío a la DIAN.' },
      { status: 500 }
    );
  }
}
