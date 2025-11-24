import db from '@/lib/db';
import {
  IsoControl,
  IsoControlInput,
  IsoAuditoria,
  IsoAuditoriaInput,
  IsoHallazgo,
  IsoHallazgoInput,
  IsoStats,
} from '@/types/iso-27001';

// ==========================================
// ISO STATS
// ==========================================

export const getIsoStats = async (tenantId: string): Promise<IsoStats> => {
  // 1. Total Controles Aplicables & % Implementación & Distribution
  const controlesQuery = `
    SELECT
      estado_implementacion as estado,
      COUNT(*) as count
    FROM core.iso_controles
    WHERE tenant_id = $1 AND es_aplicable = true
    GROUP BY estado_implementacion
  `;
  const controlesRes = await db.query(controlesQuery, [tenantId]);
  
  let totalAplicables = 0;
  let implementados = 0;
  const distribution: Record<string, number> = {};

  controlesRes.rows.forEach(row => {
    const count = Number(row.count);
    const estado = row.estado;
    totalAplicables += count;
    if (estado === 'IMPLEMENTADO') implementados += count;
    distribution[estado] = count;
  });

  const porcentaje = totalAplicables > 0 ? (implementados / totalAplicables) * 100 : 0;

  // 2. Hallazgos Abiertos
  const hallazgosQuery = `
    SELECT COUNT(*) as count
    FROM core.iso_hallazgos
    WHERE tenant_id = $1 AND estado = 'ABIERTO'
  `;
  const hallazgosRes = await db.query(hallazgosQuery, [tenantId]);
  const hallazgosAbiertos = Number(hallazgosRes.rows[0]?.count || 0);

  // 3. Próxima Auditoría
  const auditoriaQuery = `
    SELECT fecha_programada
    FROM core.iso_auditorias
    WHERE tenant_id = $1 AND estado = 'PLANIFICADA' AND fecha_programada >= CURRENT_DATE
    ORDER BY fecha_programada ASC
    LIMIT 1
  `;
  const auditoriaRes = await db.query(auditoriaQuery, [tenantId]);
  const proximaAuditoria = auditoriaRes.rows[0]?.fecha_programada || null;

  // Format for chart
  const labels = ['NO_INICIADO', 'EN_PROCESO', 'IMPLEMENTADO']; 
  const series = labels.map(l => distribution[l] || 0);

  return {
    totalControlesAplicables: totalAplicables,
    porcentajeImplementacion: Math.round(porcentaje),
    hallazgosAbiertos,
    proximaAuditoria: proximaAuditoria ? new Date(proximaAuditoria) : null,
    estadoSoA: {
      labels,
      series
    }
  };
};

// ==========================================
// ISO CONTROLES
// ==========================================

export const getControles = async (tenantId: string): Promise<IsoControl[]> => {
  const query = `
    SELECT
      id,
      tenant_id as "tenantId",
      codigo,
      nombre,
      descripcion,
      es_aplicable as "esAplicable",
      justificacion_exclusion as "justificacionExclusion",
      estado_implementacion as "estadoImplementacion",
      created_at as "createdAt",
      categoria,
      responsable_implementacion_id as "responsableImplementacionId",
      updated_at as "updatedAt"
    FROM core.iso_controles
    WHERE tenant_id = $1
    ORDER BY codigo ASC
  `;
  const result = await db.query(query, [tenantId]);
  return result.rows;
};

export const getControlById = async (tenantId: string, id: number): Promise<IsoControl | null> => {
  const query = `
    SELECT
      id,
      tenant_id as "tenantId",
      codigo,
      nombre,
      descripcion,
      es_aplicable as "esAplicable",
      justificacion_exclusion as "justificacionExclusion",
      estado_implementacion as "estadoImplementacion",
      created_at as "createdAt",
      categoria,
      responsable_implementacion_id as "responsableImplementacionId",
      updated_at as "updatedAt"
    FROM core.iso_controles
    WHERE tenant_id = $1 AND id = $2
  `;
  const result = await db.query(query, [tenantId, id]);
  return result.rows[0] || null;
};

export const createControl = async (tenantId: string, data: IsoControlInput): Promise<IsoControl> => {
  const query = `
    INSERT INTO core.iso_controles (
      tenant_id,
      codigo,
      nombre,
      descripcion,
      es_aplicable,
      justificacion_exclusion,
      estado_implementacion,
      categoria,
      responsable_implementacion_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
      id,
      tenant_id as "tenantId",
      codigo,
      nombre,
      descripcion,
      es_aplicable as "esAplicable",
      justificacion_exclusion as "justificacionExclusion",
      estado_implementacion as "estadoImplementacion",
      created_at as "createdAt",
      categoria,
      responsable_implementacion_id as "responsableImplementacionId",
      updated_at as "updatedAt"
  `;
  const values: (string | number | boolean | Date | null | undefined)[] = [
    tenantId,
    data.codigo,
    data.nombre,
    data.descripcion || null,
    data.esAplicable !== undefined ? data.esAplicable : true,
    data.justificacionExclusion || null,
    data.estadoImplementacion || 'NO_INICIADO',
    data.categoria || null,
    data.responsableImplementacionId || null,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const updateControl = async (
  tenantId: string,
  id: number,
  data: Partial<IsoControlInput>
): Promise<IsoControl | null> => {
  const fields: string[] = [];
  const values: (string | number | boolean | Date | null | undefined)[] = [tenantId, id];
  let idx = 3;

  if (data.codigo !== undefined) { fields.push(`codigo = $${idx++}`); values.push(data.codigo); }
  if (data.nombre !== undefined) { fields.push(`nombre = $${idx++}`); values.push(data.nombre); }
  if (data.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(data.descripcion); }
  if (data.esAplicable !== undefined) { fields.push(`es_aplicable = $${idx++}`); values.push(data.esAplicable); }
  if (data.justificacionExclusion !== undefined) { fields.push(`justificacion_exclusion = $${idx++}`); values.push(data.justificacionExclusion); }
  if (data.estadoImplementacion !== undefined) { fields.push(`estado_implementacion = $${idx++}`); values.push(data.estadoImplementacion); }
  if (data.categoria !== undefined) { fields.push(`categoria = $${idx++}`); values.push(data.categoria); }
  if (data.responsableImplementacionId !== undefined) { fields.push(`responsable_implementacion_id = $${idx++}`); values.push(data.responsableImplementacionId); }

  if (fields.length === 0) return getControlById(tenantId, id);

  const query = `
    UPDATE core.iso_controles
    SET ${fields.join(', ')}, updated_at = now()
    WHERE tenant_id = $1 AND id = $2
    RETURNING
      id,
      tenant_id as "tenantId",
      codigo,
      nombre,
      descripcion,
      es_aplicable as "esAplicable",
      justificacion_exclusion as "justificacionExclusion",
      estado_implementacion as "estadoImplementacion",
      created_at as "createdAt",
      categoria,
      responsable_implementacion_id as "responsableImplementacionId",
      updated_at as "updatedAt"
  `;
  const result = await db.query(query, values);
  return result.rows[0] || null;
};

export const deleteControl = async (tenantId: string, id: number): Promise<boolean> => {
  const query = `DELETE FROM core.iso_controles WHERE tenant_id = $1 AND id = $2`;
  const result = await db.query(query, [tenantId, id]);
  return (result.rowCount || 0) > 0;
};

// ==========================================
// ISO AUDITORIAS
// ==========================================

export const getAuditorias = async (tenantId: string): Promise<IsoAuditoria[]> => {
  const query = `
    SELECT
      id,
      tenant_id as "tenantId",
      creado_por_user_id as "creadoPorUserId",
      nombre_auditoria as "nombreAuditoria",
      tipo_auditoria as "tipoAuditoria",
      fecha_programada as "fechaProgramada",
      fecha_ejecucion as "fechaEjecucion",
      auditor_lider as "auditorLider",
      alcance,
      estado,
      created_at as "createdAt",
      fecha_ejecucion_inicio as "fechaEjecucionInicio",
      fecha_ejecucion_fin as "fechaEjecucionFin",
      equipo_auditor as "equipoAuditor",
      objetivos,
      documento_informe_id as "documentoInformeId"
    FROM core.iso_auditorias
    WHERE tenant_id = $1
    ORDER BY fecha_programada DESC
  `;
  const result = await db.query(query, [tenantId]);
  return result.rows;
};

export const getAuditoriaById = async (tenantId: string, id: number): Promise<IsoAuditoria | null> => {
  const query = `
    SELECT
      id,
      tenant_id as "tenantId",
      creado_por_user_id as "creadoPorUserId",
      nombre_auditoria as "nombreAuditoria",
      tipo_auditoria as "tipoAuditoria",
      fecha_programada as "fechaProgramada",
      fecha_ejecucion as "fechaEjecucion",
      auditor_lider as "auditorLider",
      alcance,
      estado,
      created_at as "createdAt",
      fecha_ejecucion_inicio as "fechaEjecucionInicio",
      fecha_ejecucion_fin as "fechaEjecucionFin",
      equipo_auditor as "equipoAuditor",
      objetivos,
      documento_informe_id as "documentoInformeId"
    FROM core.iso_auditorias
    WHERE tenant_id = $1 AND id = $2
  `;
  const result = await db.query(query, [tenantId, id]);
  return result.rows[0] || null;
};

export const createAuditoria = async (tenantId: string, data: IsoAuditoriaInput): Promise<IsoAuditoria> => {
  const query = `
    INSERT INTO core.iso_auditorias (
      tenant_id,
      creado_por_user_id,
      nombre_auditoria,
      tipo_auditoria,
      fecha_programada,
      fecha_ejecucion,
      auditor_lider,
      alcance,
      estado,
      fecha_ejecucion_inicio,
      fecha_ejecucion_fin,
      equipo_auditor,
      objetivos,
      documento_informe_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING
      id,
      tenant_id as "tenantId",
      creado_por_user_id as "creadoPorUserId",
      nombre_auditoria as "nombreAuditoria",
      tipo_auditoria as "tipoAuditoria",
      fecha_programada as "fechaProgramada",
      fecha_ejecucion as "fechaEjecucion",
      auditor_lider as "auditorLider",
      alcance,
      estado,
      created_at as "createdAt",
      fecha_ejecucion_inicio as "fechaEjecucionInicio",
      fecha_ejecucion_fin as "fechaEjecucionFin",
      equipo_auditor as "equipoAuditor",
      objetivos,
      documento_informe_id as "documentoInformeId"
  `;
  const values: (string | number | boolean | Date | null | undefined)[] = [
    tenantId,
    data.creadoPorUserId || null,
    data.nombreAuditoria,
    data.tipoAuditoria,
    data.fechaProgramada,
    data.fechaEjecucion || null,
    data.auditorLider || null,
    data.alcance || null,
    data.estado || 'PLANIFICADA',
    data.fechaEjecucionInicio || null,
    data.fechaEjecucionFin || null,
    data.equipoAuditor || null,
    data.objetivos || null,
    data.documentoInformeId || null,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const updateAuditoria = async (
  tenantId: string,
  id: number,
  data: Partial<IsoAuditoriaInput>
): Promise<IsoAuditoria | null> => {
  const fields: string[] = [];
  const values: (string | number | boolean | Date | null | undefined)[] = [tenantId, id];
  let idx = 3;

  if (data.nombreAuditoria !== undefined) { fields.push(`nombre_auditoria = $${idx++}`); values.push(data.nombreAuditoria); }
  if (data.tipoAuditoria !== undefined) { fields.push(`tipo_auditoria = $${idx++}`); values.push(data.tipoAuditoria); }
  if (data.fechaProgramada !== undefined) { fields.push(`fecha_programada = $${idx++}`); values.push(data.fechaProgramada); }
  if (data.fechaEjecucion !== undefined) { fields.push(`fecha_ejecucion = $${idx++}`); values.push(data.fechaEjecucion); }
  if (data.auditorLider !== undefined) { fields.push(`auditor_lider = $${idx++}`); values.push(data.auditorLider); }
  if (data.alcance !== undefined) { fields.push(`alcance = $${idx++}`); values.push(data.alcance); }
  if (data.estado !== undefined) { fields.push(`estado = $${idx++}`); values.push(data.estado); }
  if (data.fechaEjecucionInicio !== undefined) { fields.push(`fecha_ejecucion_inicio = $${idx++}`); values.push(data.fechaEjecucionInicio); }
  if (data.fechaEjecucionFin !== undefined) { fields.push(`fecha_ejecucion_fin = $${idx++}`); values.push(data.fechaEjecucionFin); }
  if (data.equipoAuditor !== undefined) { fields.push(`equipo_auditor = $${idx++}`); values.push(data.equipoAuditor); }
  if (data.objetivos !== undefined) { fields.push(`objetivos = $${idx++}`); values.push(data.objetivos); }
  if (data.documentoInformeId !== undefined) { fields.push(`documento_informe_id = $${idx++}`); values.push(data.documentoInformeId); }

  if (fields.length === 0) return getAuditoriaById(tenantId, id);

  const query = `
    UPDATE core.iso_auditorias
    SET ${fields.join(', ')}
    WHERE tenant_id = $1 AND id = $2
    RETURNING
      id,
      tenant_id as "tenantId",
      creado_por_user_id as "creadoPorUserId",
      nombre_auditoria as "nombreAuditoria",
      tipo_auditoria as "tipoAuditoria",
      fecha_programada as "fechaProgramada",
      fecha_ejecucion as "fechaEjecucion",
      auditor_lider as "auditorLider",
      alcance,
      estado,
      created_at as "createdAt",
      fecha_ejecucion_inicio as "fechaEjecucionInicio",
      fecha_ejecucion_fin as "fechaEjecucionFin",
      equipo_auditor as "equipoAuditor",
      objetivos,
      documento_informe_id as "documentoInformeId"
  `;
  const result = await db.query(query, values);
  return result.rows[0] || null;
};

export const deleteAuditoria = async (tenantId: string, id: number): Promise<boolean> => {
  const query = `DELETE FROM core.iso_auditorias WHERE tenant_id = $1 AND id = $2`;
  const result = await db.query(query, [tenantId, id]);
  return (result.rowCount || 0) > 0;
};

// ==========================================
// ISO HALLAZGOS
// ==========================================

export const getHallazgos = async (tenantId: string, auditoriaId?: number): Promise<IsoHallazgo[]> => {
  const conditions: string[] = [`h.tenant_id = $1`];
  const values: (string | number | boolean | Date | null | undefined)[] = [tenantId];

  if (auditoriaId) {
    values.push(auditoriaId);
    conditions.push(`h.auditoria_id = $${values.length}`);
  }

  const query = `
    SELECT
      h.id,
      h.tenant_id as "tenantId",
      h.auditoria_id as "auditoriaId",
      h.control_iso_id as "controlIsoId",
      h.descripcion,
      h.tipo_hallazgo as "tipoHallazgo",
      h.accion_correctiva as "accionCorrectiva",
      h.responsable_id as "responsableId",
      h.fecha_compromiso as "fechaCompromiso",
      h.estado,
      h.evidencia_cierre_url as "evidenciaCierreUrl",
      h.created_at as "createdAt",
      h.descripcion_hallazgo as "descripcionHallazgo",
      h.analisis_causa_raiz as "analisisCausaRaiz",
      h.fecha_cierre as "fechaCierre",
      h.evidencia_cierre as "evidenciaCierre",
      a.nombre_auditoria as "auditoriaNombre",
      c.codigo as "controlCodigo"
    FROM core.iso_hallazgos h
    LEFT JOIN core.iso_auditorias a ON h.auditoria_id = a.id
    LEFT JOIN core.iso_controles c ON h.control_iso_id = c.id
    WHERE ${conditions.join(' AND ')}
    ORDER BY h.created_at DESC
  `;

  const result = await db.query(query, values);
  return result.rows;
};

export const getHallazgoById = async (tenantId: string, id: number): Promise<IsoHallazgo | null> => {
  const query = `
    SELECT
      h.id,
      h.tenant_id as "tenantId",
      h.auditoria_id as "auditoriaId",
      h.control_iso_id as "controlIsoId",
      h.descripcion,
      h.tipo_hallazgo as "tipoHallazgo",
      h.accion_correctiva as "accionCorrectiva",
      h.responsable_id as "responsableId",
      h.fecha_compromiso as "fechaCompromiso",
      h.estado,
      h.evidencia_cierre_url as "evidenciaCierreUrl",
      h.created_at as "createdAt",
      h.descripcion_hallazgo as "descripcionHallazgo",
      h.analisis_causa_raiz as "analisisCausaRaiz",
      h.fecha_cierre as "fechaCierre",
      h.evidencia_cierre as "evidenciaCierre",
      a.nombre_auditoria as "auditoriaNombre",
      c.codigo as "controlCodigo"
    FROM core.iso_hallazgos h
    LEFT JOIN core.iso_auditorias a ON h.auditoria_id = a.id
    LEFT JOIN core.iso_controles c ON h.control_iso_id = c.id
    WHERE h.tenant_id = $1 AND h.id = $2
  `;
  const result = await db.query(query, [tenantId, id]);
  return result.rows[0] || null;
};

export const createHallazgo = async (tenantId: string, data: IsoHallazgoInput): Promise<IsoHallazgo> => {
  const query = `
    INSERT INTO core.iso_hallazgos (
      tenant_id,
      auditoria_id,
      control_iso_id,
      descripcion,
      tipo_hallazgo,
      accion_correctiva,
      responsable_id,
      fecha_compromiso,
      estado,
      evidencia_cierre_url,
      descripcion_hallazgo,
      analisis_causa_raiz,
      fecha_cierre,
      evidencia_cierre
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING
      id,
      tenant_id as "tenantId",
      auditoria_id as "auditoriaId",
      control_iso_id as "controlIsoId",
      descripcion,
      tipo_hallazgo as "tipoHallazgo",
      accion_correctiva as "accionCorrectiva",
      responsable_id as "responsableId",
      fecha_compromiso as "fechaCompromiso",
      estado,
      evidencia_cierre_url as "evidenciaCierreUrl",
      created_at as "createdAt",
      descripcion_hallazgo as "descripcionHallazgo",
      analisis_causa_raiz as "analisisCausaRaiz",
      fecha_cierre as "fechaCierre",
      evidencia_cierre as "evidenciaCierre"
  `;
  const values: (string | number | boolean | Date | null | undefined)[] = [
    tenantId,
    data.auditoriaId || null,
    data.controlIsoId || null,
    data.descripcion,
    data.tipoHallazgo,
    data.accionCorrectiva || null,
    data.responsableId || null,
    data.fechaCompromiso || null,
    data.estado || 'ABIERTO',
    data.evidenciaCierreUrl || null,
    data.descripcionHallazgo || null,
    data.analisisCausaRaiz || null,
    data.fechaCierre || null,
    data.evidenciaCierre || null,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const updateHallazgo = async (
  tenantId: string,
  id: number,
  data: Partial<IsoHallazgoInput>
): Promise<IsoHallazgo | null> => {
  const fields: string[] = [];
  const values: (string | number | boolean | Date | null | undefined)[] = [tenantId, id];
  let idx = 3;

  if (data.auditoriaId !== undefined) { fields.push(`auditoria_id = $${idx++}`); values.push(data.auditoriaId); }
  if (data.controlIsoId !== undefined) { fields.push(`control_iso_id = $${idx++}`); values.push(data.controlIsoId); }
  if (data.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(data.descripcion); }
  if (data.tipoHallazgo !== undefined) { fields.push(`tipo_hallazgo = $${idx++}`); values.push(data.tipoHallazgo); }
  if (data.accionCorrectiva !== undefined) { fields.push(`accion_correctiva = $${idx++}`); values.push(data.accionCorrectiva); }
  if (data.responsableId !== undefined) { fields.push(`responsable_id = $${idx++}`); values.push(data.responsableId); }
  if (data.fechaCompromiso !== undefined) { fields.push(`fecha_compromiso = $${idx++}`); values.push(data.fechaCompromiso); }
  if (data.estado !== undefined) { fields.push(`estado = $${idx++}`); values.push(data.estado); }
  if (data.evidenciaCierreUrl !== undefined) { fields.push(`evidencia_cierre_url = $${idx++}`); values.push(data.evidenciaCierreUrl); }
  if (data.descripcionHallazgo !== undefined) { fields.push(`descripcion_hallazgo = $${idx++}`); values.push(data.descripcionHallazgo); }
  if (data.analisisCausaRaiz !== undefined) { fields.push(`analisis_causa_raiz = $${idx++}`); values.push(data.analisisCausaRaiz); }
  if (data.fechaCierre !== undefined) { fields.push(`fecha_cierre = $${idx++}`); values.push(data.fechaCierre); }
  if (data.evidenciaCierre !== undefined) { fields.push(`evidencia_cierre = $${idx++}`); values.push(data.evidenciaCierre); }

  if (fields.length === 0) return getHallazgoById(tenantId, id);

  const query = `
    UPDATE core.iso_hallazgos
    SET ${fields.join(', ')}
    WHERE tenant_id = $1 AND id = $2
    RETURNING
      id,
      tenant_id as "tenantId",
      auditoria_id as "auditoriaId",
      control_iso_id as "controlIsoId",
      descripcion,
      tipo_hallazgo as "tipoHallazgo",
      accion_correctiva as "accionCorrectiva",
      responsable_id as "responsableId",
      fecha_compromiso as "fechaCompromiso",
      estado,
      evidencia_cierre_url as "evidenciaCierreUrl",
      created_at as "createdAt",
      descripcion_hallazgo as "descripcionHallazgo",
      analisis_causa_raiz as "analisisCausaRaiz",
      fecha_cierre as "fechaCierre",
      evidencia_cierre as "evidenciaCierre"
  `;
  const result = await db.query(query, values);
  return result.rows[0] || null;
};

export const deleteHallazgo = async (tenantId: string, id: number): Promise<boolean> => {
  const query = `DELETE FROM core.iso_hallazgos WHERE tenant_id = $1 AND id = $2`;
  const result = await db.query(query, [tenantId, id]);
  return (result.rowCount || 0) > 0;
};
