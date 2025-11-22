"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RenovacionModal } from "@/components/rnbd/RenovacionModal";

interface RnbdRecord {
  tenant_id: string;
  nombre_empresa: string;
  id?: number;
  numero_radicado?: string | null;
  tipo_novedad?: string;
  fecha_registro?: string;
  fecha_vencimiento?: string;
  estado?: string;
}

export default function RnbdDashboard() {
  const [records, setRecords] = useState<RnbdRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Estado para el modal de renovación
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/admin/rnbd");
      if (!response.ok) {
        throw new Error("Error fetching RNBD records");
      }
      const data = await response.json();
      setRecords(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (loading) return <div className="p-6">Cargando registros RNBD...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Estado del RNBD - Clientes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitoreo de radicaciones y vencimientos ante la SIC.
        </p>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Empresa (Tenant)</th>
              <th scope="col" className="px-6 py-3">Radicado</th>
              <th scope="col" className="px-6 py-3">Tipo</th>
              <th scope="col" className="px-6 py-3">Fecha Registro</th>
              <th scope="col" className="px-6 py-3">Vencimiento</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.tenant_id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {record.nombre_empresa || record.tenant_id}
                </td>
                <td className="px-6 py-4">
                  {record.numero_radicado || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {record.tipo_novedad}
                </td>
                <td className="px-6 py-4">
                  {record.fecha_registro ? (
                    new Date(record.fecha_registro).toLocaleDateString()
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4">
                  {record.fecha_vencimiento ? (
                    new Date(record.fecha_vencimiento).toLocaleDateString()
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4">
                  {record.fecha_registro ? (
                    <span
                      className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                        record.estado === "RADICADO"
                          ? "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100"
                          : record.estado === "VENCIDO"
                          ? "text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100"
                          : "text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100"
                      }`}
                    >
                      {record.estado}
                    </span>
                  ) : (
                    <span className="px-2 py-1 font-semibold leading-tight rounded-full text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100">
                      NO REGISTRADO
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedTenant(record.tenant_id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    {record.fecha_registro ? "Registrar Renovación" : "Cargar Radicado Inicial"}
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RenovacionModal
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        tenantId={selectedTenant || ""}
        onSuccess={() => {
          setSelectedTenant(null);
          router.refresh();
        }}
      />
    </div>
  );
}
