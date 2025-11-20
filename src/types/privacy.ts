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
