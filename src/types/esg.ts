export interface EsgCategoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
  createdAt: Date;
}

export interface EsgMetrica {
  id: number;
  categoriaId: number;
  nombre: string;
  unidadMedida?: string | null;
  descripcion?: string | null;
  activo: boolean;
  createdAt: Date;
  // Joined fields
  categoriaNombre?: string;
}

export interface EsgRegistro {
  id: number;
  metricaId: number;
  usuarioId?: string | null;
  valor: number;
  periodoFecha: Date | string;
  evidenciaUrl?: string | null;
  observaciones?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Joined fields
  metricaNombre?: string;
  categoriaNombre?: string;
  unidadMedida?: string;
}

export interface EsgRegistroInput {
  metricaId: number;
  usuarioId?: string | null;
  valor: number;
  periodoFecha: Date | string;
  evidenciaUrl?: string | null;
  observaciones?: string | null;
}

export interface EsgResumen {
  categoria: string;
  total: number;
  cantidadRegistros: number;
}
