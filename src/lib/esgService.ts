import db from '@/lib/db';
import { EsgMetrica, EsgRegistro, EsgRegistroInput, EsgResumen } from '@/types/esg';

export const getMetricas = async (): Promise<EsgMetrica[]> => {
  const query = `
    SELECT
      m.id,
      m.categoria_id as "categoriaId",
      m.nombre,
      m.unidad_medida as "unidadMedida",
      m.descripcion,
      m.activo,
      m.created_at as "createdAt",
      c.nombre as "categoriaNombre"
    FROM core.esg_metricas m
    JOIN core.esg_categorias c ON m.categoria_id = c.id
    WHERE m.activo = true
    ORDER BY m.categoria_id, m.nombre ASC
  `;
  const result = await db.query(query);
  return result.rows;
};

export const getRegistros = async (fechaInicio: Date, fechaFin: Date): Promise<EsgRegistro[]> => {
  const query = `
    SELECT
      r.id,
      r.metrica_id as "metricaId",
      r.usuario_id as "usuarioId",
      r.valor,
      r.periodo_fecha as "periodoFecha",
      r.evidencia_url as "evidenciaUrl",
      r.observaciones,
      r.created_at as "createdAt",
      r.updated_at as "updatedAt",
      m.nombre as "metricaNombre",
      m.unidad_medida as "unidadMedida",
      c.nombre as "categoriaNombre"
    FROM core.esg_registros r
    JOIN core.esg_metricas m ON r.metrica_id = m.id
    JOIN core.esg_categorias c ON m.categoria_id = c.id
    WHERE r.periodo_fecha BETWEEN $1 AND $2
    ORDER BY r.periodo_fecha DESC
  `;
  // Ensure dates are formatted correctly if needed, or rely on driver
  const result = await db.query(query, [fechaInicio, fechaFin]);
  
  // Convert valor to number if it comes as string from pg numeric type
  return result.rows.map(row => ({
    ...row,
    valor: Number(row.valor)
  }));
};

export const createRegistro = async (data: EsgRegistroInput): Promise<EsgRegistro> => {
  const query = `
    INSERT INTO core.esg_registros (
      metrica_id,
      usuario_id,
      valor,
      periodo_fecha,
      evidencia_url,
      observaciones
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      metrica_id as "metricaId",
      usuario_id as "usuarioId",
      valor,
      periodo_fecha as "periodoFecha",
      evidencia_url as "evidenciaUrl",
      observaciones,
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  const values = [
    data.metricaId,
    data.usuarioId || null,
    data.valor,
    data.periodoFecha,
    data.evidenciaUrl || null,
    data.observaciones || null,
  ];

  const result = await db.query(query, values);
  const row = result.rows[0];
  return {
    ...row,
    valor: Number(row.valor)
  };
};

export const getResumenESG = async (): Promise<EsgResumen[]> => {
  const query = `
    SELECT
      c.nombre as categoria,
      SUM(r.valor) as total,
      COUNT(r.id) as "cantidadRegistros"
    FROM core.esg_registros r
    JOIN core.esg_metricas m ON r.metrica_id = m.id
    JOIN core.esg_categorias c ON m.categoria_id = c.id
    GROUP BY c.nombre
    ORDER BY total DESC
  `;
  const result = await db.query(query);
  
  return result.rows.map(row => ({
    categoria: row.categoria,
    total: Number(row.total),
    cantidadRegistros: Number(row.cantidadRegistros) // pg returns count as bigint (string) often
  }));
};
