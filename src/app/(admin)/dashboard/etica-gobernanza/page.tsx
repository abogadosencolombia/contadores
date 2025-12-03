'use client';

import { useEffect, useState } from 'react';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { AiDecision } from '@/types/ai-governance';
import DecisionDetailModal from '@/components/ai-governance/DecisionDetailModal';

// Componente para una tarjeta de estadísticas de incidentes
interface StatCardProps {
  title: string;
  count: number;
  colorClass: string; // Tailwind class for background/text color
}
const StatCard: React.FC<StatCardProps> = ({ title, count, colorClass }) => (
  <div className={`rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark ${colorClass}`}>
    <div className="flex items-center justify-between">
      <h4 className="text-title-md font-bold text-black dark:text-white">
        {count}
      </h4>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  </div>
);

// Componente para la barra de progreso de Risk Score
interface RiskScoreBarProps {
  score: number; // 0-100
}
const RiskScoreBar: React.FC<RiskScoreBarProps> = ({ score }) => {
  let barColorClass = 'bg-success-500'; // BAJA
  if (score >= 25 && score < 50) barColorClass = 'bg-warning-500'; // MEDIA
  if (score >= 50 && score < 75) barColorClass = 'bg-orange-500'; // ALTA
  if (score >= 75) barColorClass = 'bg-error-500'; // CRÍTICA

  return (
    <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-strokedark">
      <div
        className={`h-2.5 rounded-full ${barColorClass}`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  );
};


export default function EthicsGovernanceCenter() {
  const [incidentStats, setIncidentStats] = useState<
    { criticality: string; count: number }[]
  >([]);
  const [decisionHistory, setDecisionHistory] = useState<AiDecision[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalDecisions, setTotalDecisions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [selectedDecision, setSelectedDecision] = useState<AiDecision | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Incident Stats
  useEffect(() => {
    const fetchIncidentStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const res = await fetch('/api/ai-governance/incidents');
        if (!res.ok) {
          throw new Error('Failed to fetch incident stats');
        }
        const data = await res.json();
        setIncidentStats(data);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching incident stats';
        setErrorStats(errorMessage);
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchIncidentStats();
  }, []);

  // Fetch Decision History
  useEffect(() => {
    const fetchDecisionHistory = async () => {
      setLoadingHistory(true);
      setErrorHistory(null);
      try {
        const res = await fetch(`/api/ai-governance/history?page=${page}&limit=${limit}`);
        if (!res.ok) {
          throw new Error('Failed to fetch decision history');
        }
        const { data, meta } = await res.json();
        setDecisionHistory(data);
        setTotalDecisions(meta.total);
        setTotalPages(meta.totalPages);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error fetching decision history';
        setErrorHistory(errorMessage);
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchDecisionHistory();
  }, [page, limit]); // Re-fetch when page or limit changes

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const getCriticalityCount = (criticality: string) => {
    const stat = incidentStats.find(s => s.criticality === criticality);
    return stat ? stat.count : 0;
  };

  const handleViewDetails = (decision: AiDecision) => {
    setSelectedDecision(decision);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadCrumb pageTitle="Ethics & Governance Center" />

      <h2 className="text-title-md2 mb-6 font-semibold text-black dark:text-white">
        Resumen de IA y Gobernanza
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {loadingStats ? (
          <div className="col-span-full text-center py-4">Cargando estadísticas...</div>
        ) : errorStats ? (
          <div className="col-span-full text-center py-4 text-danger">{errorStats}</div>
        ) : (
          <>
            <StatCard title="Crítica" count={getCriticalityCount('CRITICA')} colorClass="bg-error-50 text-error-700" />
            <StatCard title="Alta" count={getCriticalityCount('ALTA')} colorClass="bg-orange-50 text-orange-700" />
            <StatCard title="Media" count={getCriticalityCount('MEDIA')} colorClass="bg-warning-50 text-warning-700" />
            <StatCard title="Baja" count={getCriticalityCount('BAJA')} colorClass="bg-success-50 text-success-700" />
          </>
        )}
      </div>

      {/* Historial de Decisiones */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Historial de Decisiones
          </h4>
        </div>

        {loadingHistory ? (
          <div className="p-4 text-center">Cargando historial de decisiones...</div>
        ) : errorHistory ? (
          <div className="p-4 text-center text-danger">{errorHistory}</div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHeader className="bg-gray-2 dark:bg-meta-4">
                <TableRow>
                  <TableCell isHeader className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Fecha</TableCell>
                  <TableCell isHeader className="py-4 px-4 font-medium text-black dark:text-white">Modelo</TableCell>
                  <TableCell isHeader className="py-4 px-4 font-medium text-black dark:text-white">Decisión</TableCell>
                  <TableCell isHeader className="py-4 px-4 font-medium text-black dark:text-white">Risk Score</TableCell>
                  <TableCell isHeader className="py-4 px-4 font-medium text-black dark:text-white">Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisionHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-gray-500">No hay decisiones registradas.</TableCell>
                  </TableRow>
                ) : (
                  decisionHistory.map((decision) => (
                    <TableRow key={decision.id}>
                      <TableCell className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                        <p className="text-black dark:text-white">{new Date(decision.created_at).toLocaleString()}</p>
                      </TableCell>
                      <TableCell className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{decision.model_name}</p>
                      </TableCell>
                      <TableCell className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                            decision.is_vetoed ? 'bg-danger text-danger' : 'bg-success text-success'
                          }`}>
                          {decision.is_vetoed ? 'VETADO' : 'APROBADO'}
                        </span>
                      </TableCell>
                      <TableCell className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <RiskScoreBar score={decision.risk_score} />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{decision.risk_score}%</p>
                      </TableCell>
                      <TableCell className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <button
                          onClick={() => handleViewDetails(decision)}
                          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                        >
                          Ver Detalle
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalDecisions > limit && (
              <div className="flex justify-between items-center p-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-center font-medium text-black hover:bg-gray-300 disabled:opacity-50 dark:bg-strokedark dark:text-white dark:hover:bg-boxdark-2"
                >
                  Anterior
                </button>
                <span className="text-black dark:text-white">Página {page} de {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="inline-flex items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-center font-medium text-black hover:bg-gray-300 disabled:opacity-50 dark:bg-strokedark dark:text-white dark:hover:bg-boxdark-2"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Decision Detail Modal */}
      <DecisionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        decision={selectedDecision}
      />
    </div>
  );
}