"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { getAllArcoRequests } from "@/lib/privacyService";
import { AdminArcoRequest } from "@/types/privacy";
import ResolveArcoModal from "./ResolveArcoModal";

export default function ArcoRequestsTable() {
  const [requests, setRequests] = useState<AdminArcoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AdminArcoRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getAllArcoRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error loading ARCO requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleManage = (request: AdminArcoRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    loadRequests();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return <Badge color="warning" variant="light">Pendiente</Badge>;
      case "EN_PROCESO":
        return <Badge color="info" variant="light">En Proceso</Badge>;
      case "RESUELTO":
        return <Badge color="success" variant="light">Resuelto</Badge>;
      case "RECHAZADO":
        return <Badge color="error" variant="light">Rechazado</Badge>;
      default:
        return <Badge color="light" variant="light">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/3">
        <div className="p-5 border-b border-gray-100 dark:border-white/[0.05]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Solicitudes ARCO
            </h3>
        </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Fecha
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Usuario
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Tipo
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Estado
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="px-5 py-4 text-center text-gray-500" colSpan={6}>
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                    <TableCell className="px-5 py-4 text-center text-gray-500" colSpan={6}>
                        No hay solicitudes registradas.
                    </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                      #{req.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(req.fecha_solicitud).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-800 dark:text-white/90 font-medium">
                                {req.nombre_solicitante || "Usuario sin nombre"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {req.email_solicitante}
                            </span>
                        </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                      {req.tipo_solicitud}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      {getStatusBadge(req.estado)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                        {req.estado === 'PENDIENTE' || req.estado === 'EN_PROCESO' ? (
                            <Button size="sm" variant="outline" onClick={() => handleManage(req)}>
                                Gestionar
                            </Button>
                        ) : (
                             <span className="text-xs text-gray-400 italic">
                                {req.estado === 'RESUELTO' ? 'Resuelto' : 'Cerrado'}
                             </span>
                        )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ResolveArcoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
