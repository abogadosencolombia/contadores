// src/lib/services/reportesService.ts
import db from '@/lib/db';
import { create } from 'xmlbuilder2';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// En un caso real, estas taxonomías son archivos XSD complejos.
// Por ahora, simulamos las etiquetas que podríamos usar.
const TAXONOMIAS = {
  SUPERSOCIEDADES: {
    '42-EMPRESARIAL': {
      Activos: 'co:ActivosCorrientes',
      Pasivos: 'co:PasivosCorrientes',
      Patrimonio: 'co:PatrimonioNeto',
      // ... se añadirían cientos de etiquetas aquí
    },
  },
  SUPERFINANCIERA: {
    'XBRL-NIIF-PLENA': {
      Activos: 'sf:ActivosTotales',
      Pasivos: 'sf:PasivosTotales',
      Patrimonio: 'sf:Patrimonio',
      // ... se añadirían cientos de etiquetas aquí
    },
  },
};

export class ReportesService {
  /**
   * Genera el reporte, lo guarda en disco y crea el registro de trazabilidad.
   */
  static async generarReporte(
    balanceId: number,
    entidad: 'Supersociedades' | 'Superfinanciera',
    tipoReporte: string,
    tenantId: string,
    userId: number | null
  ) {
    // 1. Obtener datos fuente del balance
    const { rows: [balance] } = await db.query(
      `SELECT datos_balance, periodo_fecha
       FROM core.balances_financieros
       WHERE id = $1 AND tenant_id = $2 AND estado_firma = 'firmado'`,
      [balanceId, tenantId]
    );

    if (!balance) {
      throw new Error('Balance no encontrado, no pertenece al tenant o no está firmado.');
    }

    const datos = balance.datos_balance; // { activos: 150000, pasivos: 50000, ... }
    const periodo = balance.periodo_fecha;
    const contextoRef = `C-${new Date(periodo).getFullYear()}`;

    // 2. Generar el XML (XBRL)
    // ¡¡IMPORTANTE!! ESTA ES UNA SIMULACIÓN MUY SIMPLIFICADA.
    // La generación real de XBRL requiere mapear CIENTOS de campos
    // de tu 'datos_balance' a la taxonomía exacta (XSD) proveída por la entidad.

    // Asumimos que la taxonomía existe para este ejemplo
    // ¡CORRECCIÓN! Las claves de entidad y tipoReporte son sensibles a mayúsculas.
    const entidadKey = entidad.toUpperCase() as keyof typeof TAXONOMIAS;
    const tipoReporteKey = tipoReporte.toUpperCase();
    const etiquetas = (TAXONOMIAS[entidadKey] as any)?.[tipoReporteKey] || TAXONOMIAS.SUPERSOCIEDADES['42-EMPRESARIAL'];

    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('xbrli:xbrl', {
        'xmlns:xbrli': 'http://www.xbrl.org/2003/instance',
        'xmlns:co': 'http://www.supersociedades.gov.co/taxonomia/2024-01-01/co',
        'xmlns:sf': 'http://www.superfinanciera.gov.co/taxonomia/2024-01-01/sf',
      })
      // Aquí irían los contextos, unidades, etc.
      .ele(etiquetas.Activos, { contextRef: contextoRef, unitRef: 'COP', decimals: '0' }).txt(datos.activos || 0).up()
      .ele(etiquetas.Pasivos, { contextRef: contextoRef, unitRef: 'COP', decimals: '0' }).txt(datos.pasivos || 0).up()
      .ele(etiquetas.Patrimonio, { contextRef: contextoRef, unitRef: 'COP', decimals: '0' }).txt(datos.patrimonio || 0);
      // ... etc.

    const xmlString = root.end({ prettyPrint: true });

    // 3. Guardar archivo y calcular HASH
    const fileName = `reporte_${entidad}_${tipoReporte}_${balanceId}_${Date.now()}.xml`;
    // Usamos la carpeta 'secure_uploads' que está en tu .gitignore
    const uploadDir = path.join(process.cwd(), 'secure_uploads', tenantId, 'reportes_regulatorios');
    await fs.mkdir(uploadDir, { recursive: true });

    const storagePath = path.join(uploadDir, fileName);
    // Guardamos la ruta relativa para la BBDD
    const storagePathRelative = path.join(tenantId, 'reportes_regulatorios', fileName);

    await fs.writeFile(storagePath, xmlString, 'utf-8');

    const hash = crypto.createHash('sha256').update(xmlString).digest('hex');

    // 4. Guardar en BBDD para trazabilidad
    const { rows: [nuevoReporte] } = await db.query(
      `INSERT INTO core.reportes_regulatorios
       (tenant_id, balance_financiero_id, entidad_regulatoria, tipo_reporte, periodo_reportado, generado_por_user_id, estado, storage_path_reporte, hash_reporte)
       VALUES ($1, $2, $3, $4, $5, $6, 'GENERADO', $7, $8)
       RETURNING id, entidad_regulatoria, tipo_reporte, periodo_reportado, fecha_generacion, estado, storage_path_reporte`,
      [tenantId, balanceId, entidad, tipoReporte, periodo, userId, storagePathRelative, hash]
    );

    return nuevoReporte; // Devolvemos el objeto completo para el frontend
  }

  /**
   * Envía el reporte a la entidad regulatoria.
   */
  static async enviarReporte(reporteId: number, tenantId: string) {
    // 1. Obtener info del reporte
    const { rows: [reporte] } = await db.query(
      'SELECT * FROM core.reportes_regulatorios WHERE id = $1 AND tenant_id = $2',
      [reporteId, tenantId]
    );
    if (!reporte) throw new Error('Reporte no encontrado');
    if (reporte.estado !== 'GENERADO') throw new Error('Este reporte ya fue enviado o está siendo procesado.');

    // 2. Marcar como 'ENVIANDO' para evitar duplicados
    await db.query("UPDATE core.reportes_regulatorios SET estado = 'ENVIANDO' WHERE id = $1", [reporteId]);

    // 3. Leer el archivo
    const filePath = path.join(process.cwd(), 'secure_uploads', reporte.storage_path_reporte);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // 4. Enviar a la API de la entidad (Simulación)
    // (Esta URL y body son ficticios, debes reemplazarlos con los reales de la entidad)
    const API_URL = 'https://api-simulada.supersociedades.gov.co/v1/sirem/recibir';
    let apiResponse: any;
    let nuevoEstado: string;
    const traceId = crypto.randomUUID();

    try {
      // -- INICIO SIMULACIÓN DE ENVÍO --
      // En un caso real, aquí iría el 'fetch'
      // const response = await fetch(API_URL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/xml',
      //     'Authorization': `Bearer ${process.env.SUPERSOCIEDADES_API_KEY}`
      //   },
      //   body: fileContent
      // });
      // apiResponse = await response.json();
      // if (!response.ok) throw new Error(apiResponse.message);
      // nuevoEstado = 'ENVIADO';

      // Simulación de éxito (tarda 2 segundos)
      await new Promise(res => setTimeout(res, 2000));
      apiResponse = {
        message: 'Recibido exitosamente por la entidad.',
        traceId: traceId,
        radicado: `SSPD-RAD-${Date.now()}`
      };
      nuevoEstado = 'ENVIADO';
      // -- FIN SIMULACIÓN DE ENVÍO --

    } catch (error: any) {
      apiResponse = { error: error.message || 'Error en la conexión con la entidad.' };
      nuevoEstado = 'RECHAZADO'; // O 'FALLIDO'
    }

    // 5. Actualizar BBDD
    const { rows: [reporteActualizado] } = await db.query(
      `UPDATE core.reportes_regulatorios
       SET estado = $1, respuesta_entidad = $2, fecha_envio = NOW(), trace_id_envio = $3
       WHERE id = $4
       RETURNING *`,
      [nuevoEstado, JSON.stringify(apiResponse), traceId, reporteId]
    );

    return reporteActualizado;
  }
}
