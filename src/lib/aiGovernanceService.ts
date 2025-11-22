import db from '@/lib/db';
import { AiDecision, AiIncident } from '@/types/ai-governance';

export class AiGovernanceService {
  /**
   * Obtiene el historial de decisiones de IA para un tenant con paginación.
   * @param tenantId ID del tenant
   * @param page Número de página (empezando en 1)
   * @param limit Límite de elementos por página
   */
  static async getDecisionsHistory(
    tenantId: string,
    page: number,
    limit: number
  ): Promise<AiDecision[]> {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT *
      FROM core.ai_governance_decisions
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await db.query(query, [tenantId, limit, offset]);
    return rows;
  }

  /**
   * Obtiene estadísticas de incidentes agrupadas por criticidad.
   * @param tenantId ID del tenant
   */
  static async getIncidentsStats(tenantId: string): Promise<{ criticality: string; count: number }[]> {
    const query = `
      SELECT criticality, COUNT(*)::int as count
      FROM core.ai_incidents
      WHERE tenant_id = $1
      GROUP BY criticality
    `;

    const { rows } = await db.query(query, [tenantId]);
    return rows;
  }

  /**
   * Obtiene una decisión específica por su ID.
   * @param id ID de la decisión
   */
  static async getDecisionById(id: string): Promise<AiDecision | null> {
    const query = `
      SELECT *
      FROM core.ai_governance_decisions
      WHERE id = $1
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}