"use client";

import React, { useEffect, useState } from "react";
import RegistrarDatoModal from "@/components/esg/RegistrarDatoModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { EsgRegistro } from "@/types/esg";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function EsgDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registros, setRegistros] = useState<EsgRegistro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      // Por defecto trae los del año actual, podemos parametrizar esto luego
      const res = await fetch("/api/esg/registros");
      if (!res.ok) throw new Error("Error al cargar registros");
      const data = await res.json();
      setRegistros(data);
    } catch (error) {
      console.error("Failed to fetch ESG records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  // Cálculos simples para las tarjetas
  // En un escenario real, esto vendría de una API de "resumen" o procesado más robustamente
  const calculateTotalByCategory = (categoryName: string) => {
    return registros
      .filter((r) => r.categoriaNombre === categoryName)
      .reduce((acc, curr) => acc + curr.valor, 0);
  };

  const totalEnvironmental = calculateTotalByCategory("Ambiental");
  const totalSocial = calculateTotalByCategory("Social");
  const totalGovernance = calculateTotalByCategory("Gobernanza");

  // Datos para el gráfico (Ejemplo: Registros por mes para cada categoría)
  // Simplificación: Agrupamos por mes y sumamos valores (esto puede no tener sentido si las unidades son diferentes, 
  // pero sirve para visualización de actividad)
  const processChartData = () => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const categories = ["Ambiental", "Social", "Gobernanza"];
    
    const series = categories.map(cat => {
        const data = new Array(12).fill(0);
        registros.filter(r => r.categoriaNombre === cat).forEach(r => {
            const date = new Date(r.periodoFecha);
            const month = date.getMonth(); // 0-11
            data[month] += 1; // Contamos registros por ahora para que tenga sentido en gráfico comparativo
        });
        return { name: cat, data };
    });

    return { series, months };
  };

  const { series, months } = processChartData();

  const chartOptions: ApexOptions = {
    colors: ["#22c55e", "#3b82f6", "#a855f7"], // Green, Blue, Purple
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: { show: false },
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
    },
    grid: {
        strokeDashArray: 5,
        yaxis: {
            lines: { show: true }
        }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} registros`,
      },
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Reporte ESG
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600"
        >
          Registrar Nuevo Dato
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        <SummaryCard title="Environmental" value={totalEnvironmental} count={registros.filter(r => r.categoriaNombre === 'Ambiental').length} color="bg-green-500" />
        <SummaryCard title="Social" value={totalSocial} count={registros.filter(r => r.categoriaNombre === 'Social').length} color="bg-blue-500" />
        <SummaryCard title="Governance" value={totalGovernance} count={registros.filter(r => r.categoriaNombre === 'Gobernanza').length} color="bg-purple-500" />
      </div>

      {/* Chart Section */}
      <div className="p-5 mb-6 bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Actividad de Registros por Mes</h2>
        <div className="overflow-x-auto">
             <div className="min-w-[600px]">
                <ReactApexChart options={chartOptions} series={series} type="bar" height={350} />
             </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-medium text-gray-800 dark:text-white">Registros Recientes</h3>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500">Fecha</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500">Categoría</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500">Métrica</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500">Valor</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500">Unidad</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                 <TableRow>
                    <TableCell className="px-5 py-4 text-center" colSpan={5}>Cargando datos...</TableCell>
                 </TableRow>
              ) : registros.length === 0 ? (
                <TableRow>
                    <TableCell className="px-5 py-4 text-center" colSpan={5}>No hay registros encontrados.</TableCell>
                 </TableRow>
              ) : (
                registros.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(reg.periodoFecha).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge 
                        color={
                            reg.categoriaNombre === 'Ambiental' ? 'success' :
                            reg.categoriaNombre === 'Social' ? 'primary' : 'warning' // Purple not available in Badge type usually, mapping Governance to warning/primary
                        }
                      >
                        {reg.categoriaNombre}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                      {reg.metricaNombre}
                    </TableCell>
                    <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                      {reg.valor}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {reg.unidadMedida}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <RegistrarDatoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRegistros}
      />
    </div>
  );
}

function SummaryCard({ title, value, count, color }: { title: string; value: number; count: number; color: string }) {
    return (
        <div className="p-5 bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{count}</h3>
                    <p className="text-xs text-gray-400">Registros totales</p>
                </div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${color} bg-opacity-10`}>
                     <span className={`block w-3 h-3 rounded-full ${color}`}></span>
                </div>
            </div>
            {/* Podríamos mostrar el valor total sumado si las unidades fueran consistentes, pero como mezclamos unidades (kg, %, etc), mejor solo mostrar conteo o dejar valor como indicativo secundario */}
             <div className="mt-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">Suma de valores ingresados: {value.toFixed(2)}</span>
            </div>
        </div>
    )
}
