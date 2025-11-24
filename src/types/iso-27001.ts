export type IsoControlEstado = 'NO_INICIADO' | 'EN_PROCESO' | 'IMPLEMENTADO' | 'NO_APLICA' | string;
export type IsoAuditoriaEstado = 'PLANIFICADA' | 'EN_EJECUCION' | 'COMPLETADA' | 'CANCELADA' | string;
export type IsoHallazgoEstado = 'ABIERTO' | 'EN_PROGRESO' | 'CERRADO' | string;

export interface IsoControl {
  id: number;
  tenantId: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  esAplicable: boolean;
  justificacionExclusion?: string | null;
  estadoImplementacion: IsoControlEstado;
  createdAt: Date;
  // New fields
  categoria?: string | null;
  responsableImplementacionId?: number | null;
  updatedAt?: Date;
}

export interface IsoAuditoria {
  id: number;
  tenantId: string;
  creadoPorUserId?: number | null;
  nombreAuditoria: string;
  tipoAuditoria: string;
  fechaProgramada: Date;
  fechaEjecucion?: Date | null;
  auditorLider?: string | null;
  alcance?: string | null;
  estado: IsoAuditoriaEstado;
  createdAt: Date;
  // New fields
  fechaEjecucionInicio?: Date | null;
  fechaEjecucionFin?: Date | null;
  equipoAuditor?: string | null;
  objetivos?: string | null;
  documentoInformeId?: number | null;
}

export interface IsoHallazgo {
  id: number;
  tenantId: string;
  auditoriaId?: number | null;
  controlIsoId?: number | null;
  descripcion: string;
  tipoHallazgo: string;
  accionCorrectiva?: string | null;
  responsableId?: number | null;
  fechaCompromiso?: Date | null;
  estado: IsoHallazgoEstado;
  evidenciaCierreUrl?: string | null;
  createdAt: Date;
  // New fields
  descripcionHallazgo?: string | null;
  analisisCausaRaiz?: string | null;
  fechaCierre?: Date | null;
  evidenciaCierre?: string | null;
  
  // Joined fields optional
  auditoriaNombre?: string;
  controlCodigo?: string;
  responsableNombre?: string;
}

// Input Types
export interface IsoControlInput {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  esAplicable?: boolean;
  justificacionExclusion?: string | null;
  estadoImplementacion?: IsoControlEstado;
  // New fields
  categoria?: string | null;
  responsableImplementacionId?: number | null;
}

export interface IsoAuditoriaInput {
  creadoPorUserId?: number | null;
  nombreAuditoria: string;
  tipoAuditoria: string;
  fechaProgramada: Date | string;
  fechaEjecucion?: Date | string | null;
  auditorLider?: string | null;
  alcance?: string | null;
  estado?: IsoAuditoriaEstado;
  // New fields
  fechaEjecucionInicio?: Date | string | null;
  fechaEjecucionFin?: Date | string | null;
  equipoAuditor?: string | null;
  objetivos?: string | null;
  documentoInformeId?: number | null;
}

export interface IsoHallazgoInput {
  auditoriaId?: number | null;
  controlIsoId?: number | null;
  descripcion: string;
  tipoHallazgo: string;
  accionCorrectiva?: string | null;
  responsableId?: number | null;
  fechaCompromiso?: Date | string | null;
  estado?: IsoHallazgoEstado;
  evidenciaCierreUrl?: string | null;
  // New fields
  descripcionHallazgo?: string | null;
  analisisCausaRaiz?: string | null;
  fechaCierre?: Date | string | null;
  evidenciaCierre?: string | null;
}

// Stats Interface
export interface IsoStats {
  totalControlesAplicables: number;
  porcentajeImplementacion: number;
  hallazgosAbiertos: number;
  proximaAuditoria: Date | null;
  estadoSoA: {
    labels: string[];
    series: number[];
  };
}
