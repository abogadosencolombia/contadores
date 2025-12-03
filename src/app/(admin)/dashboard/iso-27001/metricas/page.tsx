'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import IsoMetricsChart from '@/components/iso/IsoMetricsChart';
import { IsoStats } from '@/types/iso-27001';

export default function IsoMetricasPage() {
  const [stats, setStats] = useState<IsoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/iso/stats');
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        setStats(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Cargando métricas...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Tablero de Mando ISO 27001" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">

        {/* Total Controles */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Controles Aplicables</p>
              <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
                {stats.totalControlesAplicables}
              </h4>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
               🛡️
            </div>
          </div>
        </div>

        {/* % Implementación */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Implementación Global</p>
              <h4 className="mt-2 text-2xl font-bold text-brand-500">
                {stats.porcentajeImplementacion}%
              </h4>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15">
               📈
            </div>
          </div>
        </div>

        {/* Hallazgos Abiertos */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hallazgos Abiertos</p>
              <h4 className="mt-2 text-2xl font-bold text-warning-600">
                {stats.hallazgosAbiertos}
              </h4>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warning-50 text-warning-600 dark:bg-warning-500/15">
               ⚠️
            </div>
          </div>
        </div>

        {/* Próxima Auditoría */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Próxima Auditoría</p>
              <h4 className="mt-2 text-lg font-bold text-gray-800 dark:text-white">
                {stats.proximaAuditoria ? new Date(stats.proximaAuditoria).toLocaleDateString() : 'N/A'}
              </h4>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15">
               📅
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Estado del SoA (Statement of Applicability)</h3>
          <IsoMetricsChart series={stats.estadoSoA.series} labels={stats.estadoSoA.labels} />
        </div>

        {/* Summary / Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
           <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Acciones Recomendadas</h3>
           <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
             <li className="flex items-start gap-2">
               <span className="mt-1 block h-2 w-2 rounded-full bg-brand-500"></span>
               Revisar controles en estado &#34;No Iniciado&#34; prioritarios.
             </li>
             <li className="flex items-start gap-2">
               <span className="mt-1 block h-2 w-2 rounded-full bg-warning-500"></span>
               Cerrar {stats.hallazgosAbiertos} hallazgos pendientes antes de la próxima auditoría.
             </li>
             <li className="flex items-start gap-2">
               <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500"></span>
               Actualizar evidencia de controles en proceso.
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
}
