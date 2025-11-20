"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CapTableChart from "@/components/tokenization/CapTableChart";
import CapTableList from "@/components/tokenization/CapTableList";

interface Shareholder {
  name: string;
  email: string;
  percentage: number;
  tokens: number;
  firstInvestment: string;
}

export default function CapTablePage() {
  const [data, setData] = useState<Shareholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/tokenizacion/cap-table');
        if (!res.ok) throw new Error('Error cargando Cap Table');
        const json = await res.json();
        setData(json.shareholders);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Cap Table Digital" />

      {loading ? (
        <div className="text-center py-20 text-gray-500">Cargando estructura accionaria...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">Error: {error}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No hay acciones emitidas aún. <a href="/dashboard/tokenizacion/emitir" className="text-primary underline">Emitir la primera</a>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <CapTableChart data={data} />
          <CapTableList data={data} />
        </div>
      )}
    </div>
  );
}
