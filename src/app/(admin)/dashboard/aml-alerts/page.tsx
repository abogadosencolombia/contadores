import { db } from '@/lib/db';
import AmlAlertsTable from './AmlAlertsTable';

export const dynamic = 'force-dynamic';

interface AmlAlert {
  id: number;
  userId: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  analysisSummary?: string;
  rosReportDraft?: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

interface AmlRiskAssessmentRow {
  id: number;
  user_id: number;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  ai_analysis_summary: string | null;
  ros_report_draft: string | null;
  created_at: string;
  full_name: string;
  email: string;
}

export default async function AmlAlertsPage() {
  let alerts: AmlAlert[] = [];

  try {
    // Fetch AML Risk Assessments con datos del usuario
    const query = `
      SELECT 
        ara.id,
        ara.user_id,
        ara.risk_score,
        ara.risk_level,
        ara.ai_analysis_summary,
        ara.ros_report_draft,
        ara.created_at,
        u.full_name,
        u.email
      FROM core.aml_risk_assessments ara
      JOIN core.users u ON ara.user_id = u.id
      ORDER BY ara.created_at DESC
      LIMIT 100;
    `;

    const result = await db.query(query);
    alerts = result.rows.map((row: AmlRiskAssessmentRow) => ({ // Explicitly type row
        id: row.id,
        userId: row.user_id,
        riskScore: row.risk_score,
        riskLevel: row.risk_level,
        analysisSummary: row.ai_analysis_summary,
        rosReportDraft: row.ros_report_draft,
        createdAt: row.created_at,
        user: {
            fullName: row.full_name,
            email: row.email
        }
    }));

  } catch (error) {
    console.error('Error fetching AML alerts:', error);
    // No fallamos toda la página, mostraremos tabla vacía o estado de error localmente si se prefiere
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alertas AML & Reportes ROS</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitoreo de riesgos de lavado de activos y financiación del terrorismo.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <AmlAlertsTable initialAlerts={alerts} />
      </div>
    </div>
  );
}
