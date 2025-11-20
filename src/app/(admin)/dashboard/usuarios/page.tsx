"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserKYCTable from "@/components/tables/UserKYCTable";

interface UserKYC {
  id: number;
  email: string;
  full_name: string;
  kyc_status: string;
  created_at: string;
  doc_front_url: string;
  doc_rut_url: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserKYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("No autorizado para ver esta información.");
        }
        throw new Error("Error al cargar usuarios.");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Gestión de Usuarios y KYC" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <div>
                <h3 className="font-medium text-black dark:text-white">
                  Solicitudes de KYC Pendientes
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Revise los documentos y apruebe a los inversionistas para permitirles operar.
                </p>
              </div>
              <button 
                onClick={fetchUsers}
                className="text-sm text-primary hover:underline"
              >
                🔄 Actualizar Lista
              </button>
            </div>

            <div className="p-6.5">
              {loading ? (
                <div className="text-center py-10">Cargando solicitudes...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : (
                <UserKYCTable users={users} refreshData={fetchUsers} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
