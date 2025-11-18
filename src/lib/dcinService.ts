// src/lib/dcinService.ts
import db from '@/lib/db';
import { create } from 'xmlbuilder2';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Simulación de la taxonomía DCIN 83 del Banco de la República
const TAXONOMIA_DCIN = {
  Formulario: 'br:FormularioDCIN83',
  Encabezado: 'br:Encabezado',
  FechaReporte: 'br:FechaReporte',
  DetalleInversion: 'br:DetalleInversion',
  NombreInversionista: 'br:NombreInversionista',
  IdInversionista: 'br:IdInversionista',
  FechaInversion: 'br:FechaInversion',
  FechaCreacionInversion: 'br:FechaCreacionInversion',
  MontoUSD: 'br:MontoUSD',
  MontoCOP: 'br:MontoCOP',
  Pais: 'br:PaisOrigen',
  // ... se añadirían las etiquetas XML reales requeridas por el BanRep
};

export class DcinService {
  /**
   * Genera el reporte DCIN 83, lo guarda y crea trazabilidad.
   */
  static async generarReporteDCIN(
    inversionId: number,
    tenantId: string,
    userId: number | null
  ) {
    // 1. Obtener datos fuente de la inversión
    const { rows: [inversion] } = await db.query(
      `SELECT *
       FROM core.inversiones_extranjeras
       WHERE id = $1 AND tenant_id = $2 AND estado_reporte = 'pendiente'`,
      [inversionId, tenantId]
    );

    if (!inversion) {
      throw new Error('Inversión no encontrada, no pertenece al tenant o ya fue reportada.');
    }

    const periodo = inversion.fecha_inversion;

    // 2. Generar el XML (Simulación)
    // ¡¡IMPORTANTE!! Esta es una simulación. Debes ajustarla
    // a la estructura XML exacta que exija el Banco de la República.
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele(TAXONOMIA_DCIN.Formulario, {
        'xmlns:br': 'http://www.banrep.gov.co/taxonomia/dcin/2024',
      })
      .ele(TAXONOMIA_DCIN.Encabezado)
        .ele(TAXONOMIA_DCIN.FechaReporte).txt(new Date().toISOString()).up()
        // ... info de la empresa (tenant)
      .up()
      .ele(TAXONOMIA_DCIN.DetalleInversion, { contextRef: `INV-${inversion.id}` })
        .ele(TAXONOMIA_DCIN.NombreInversionista).txt(inversion.nombre_inversionista_extranjero).up()
        .ele(TAXONOMIA_DCIN.IdInversionista).txt(inversion.id_inversionista || '').up()
        .ele(TAXONOMIA_DCIN.FechaInversion).txt(new Date(inversion.fecha_inversion).toISOString().split('T')[0]).up()
        .ele(TAXONOMIA_DCIN.MontoUSD).txt(inversion.monto_inversion).up()
        .ele(TAXONOMIA_DCIN.MontoCOP).txt(inversion.monto_equivalente_cop).up()
        .ele(TAXONOMIA_DCIN.Pais).txt(inversion.pais_origen).up()
        .ele(TAXONOMIA_DCIN.FechaCreacionInversion).txt(new Date(inversion.fecha_creacion).toISOString()).up()
      .up();

    const xmlString = root.end({ prettyPrint: true });

    // 3. Guardar archivo y calcular HASH
    const fileName = `DCIN83_${inversion.id}_${Date.now()}.xml`;
    const uploadDir = path.join(process.cwd(), 'secure_uploads', tenantId, 'reportes_dcin');
    await fs.mkdir(uploadDir, { recursive: true });

    const storagePathRelative = path.join(tenantId, 'reportes_dcin', fileName);
    await fs.writeFile(path.join(uploadDir, fileName), xmlString, 'utf-8');

    const hash = crypto.createHash('sha256').update(xmlString).digest('hex');

    // 4. Guardar en BBDD para trazabilidad
    const { rows: [nuevoReporte] } = await db.query(
      `INSERT INTO core.reportes_dcin
       (tenant_id, inversion_id, periodo_reportado, generado_por_user_id, estado, storage_path_reporte, hash_reporte)
       VALUES ($1, $2, $3, $4, 'GENERADO', $5, $6)
       RETURNING id, entidad_regulatoria, tipo_reporte, periodo_reportado, fecha_generacion, estado`,
      [tenantId, inversionId, periodo, userId, storagePathRelative, hash]
    );

    // 5. Marcar la inversión como reportada
    await db.query(
      `UPDATE core.inversiones_extranjeras SET estado_reporte = 'reportado' WHERE id = $1`,
      [inversionId]
    );

    return nuevoReporte;
  }

  /**
   * Envía el reporte DCIN al Banco de la República.
   */
  static async enviarReporteDCIN(reporteId: number, tenantId: string) {
    // 1. Obtener info del reporte
    const { rows: [reporte] } = await db.query(
      'SELECT * FROM core.reportes_dcin WHERE id = $1 AND tenant_id = $2',
      [reporteId, tenantId]
    );
    if (!reporte) throw new Error('Reporte DCIN no encontrado');
    if (reporte.estado !== 'GENERADO') throw new Error('Este reporte ya fue enviado.');

    // 2. Marcar como 'ENVIANDO'
    await db.query("UPDATE core.reportes_dcin SET estado = 'ENVIANDO' WHERE id = $1", [reporteId]);

    // 3. Leer el archivo
    const filePath = path.join(process.cwd(), 'secure_uploads', reporte.storage_path_reporte);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // 4. Enviar a la API del BanRep (Simulación)
    const API_URL = 'https://api-simulada.banrep.gov.co/v1/recepcion_dcin';
    let apiResponse: any;
    let nuevoEstado: string;
    const traceId = crypto.randomUUID();

    try {
      // -- INICIO SIMULACIÓN DE ENVÍO --
      await new Promise(res => setTimeout(res, 1500));
      apiResponse = {
        message: 'Recibido exitosamente por el Banco de la República.',
        traceId: traceId,
        radicado: `BR-RAD-${Date.now()}`
      };
      nuevoEstado = 'ENVIADO';
      // -- FIN SIMULACIÓN DE ENVÍO --

    } catch (error: any) {
      apiResponse = { error: error.message || 'Error en la conexión con la entidad.' };
      nuevoEstado = 'RECHAZADO';
    }

    // 5. Actualizar BBDD
    const { rows: [reporteActualizado] } = await db.query(
      `UPDATE core.reportes_dcin
       SET estado = $1, respuesta_entidad = $2, fecha_envio = NOW(), trace_id_envio = $3
       WHERE id = $4
       RETURNING *`,
      [nuevoEstado, JSON.stringify(apiResponse), traceId, reporteId]
    );

    return reporteActualizado;
  }
}
