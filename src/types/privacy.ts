export interface Preference {
  id: number;
  canal: 'TELEFONO' | 'EMAIL' | 'WHATSAPP';
  finalidad: 'MARKETING' | 'FINANCIERO' | 'IA';
  autorizado: boolean;
}

export interface ArcoRequest {
  id: number;
  tipo_solicitud: 'ACCESO' | 'RECTIFICACION' | 'CANCELACION' | 'OPOSICION';
  detalle: string;
  estado: string;
  fecha_solicitud: string;
}

export interface AdminArcoRequest {
  id: number;
  tenant_id: string;
  user_id: number;
  email_solicitante: string;
  tipo_solicitud: 'ACCESO' | 'RECTIFICACION' | 'CANCELACION' | 'OPOSICION';
  detalle: string; // This is aliased from detalle_solicitud
  estado: string;
  fecha_solicitud: string;
  fecha_limite_respuesta?: string;
  fecha_resolucion?: string;
  evidencia_respuesta?: string;
  responsable_id?: number;
  nombre_solicitante?: string;
}
