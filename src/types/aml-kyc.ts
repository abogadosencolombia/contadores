export type KycStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type AmlRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface KycLog {
  id: string;
  user_id: number;
  document_url?: string | null;
  ip_address?: string | null;
  geo_location?: Record<string, unknown> | null;
  status: KycStatus;
  created_at: Date;
}

export interface AmlRiskAssessment {
  id: string;
  user_id: number;
  risk_score: number;
  risk_level: AmlRiskLevel;
  ai_analysis_summary?: string | null;
  ros_report_draft?: string | null;
  created_at: Date;
}

export interface AmlScanPayload {
  userId: number;
  documentUrl?: string;
  userEmail?: string;
  fullName?: string;
  ipAddress?: string;
  geoLocation?: Record<string, unknown>;
}
