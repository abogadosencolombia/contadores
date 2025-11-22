export interface AiDecision {
  id: string;
  tenant_id: string;
  user_id: number | null;
  model_name: string;
  decision_type: string;
  risk_score: number;
  input_variables: Record<string, any>;
  explanation: string;
  is_vetoed: boolean;
  created_at: string;
}

export interface AiIncident {
  id: string;
  tenant_id: string;
  decision_id: string;
  criticality: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: string;
  description: string;
  reported_at: string;
}
