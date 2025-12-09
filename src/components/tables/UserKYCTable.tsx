"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { AlertModal } from "../ui/modal/AlertModal";

interface UserKYC {
  id: number;
  email: string;
  full_name: string;
  kyc_status: string;
  created_at: string;
  doc_front_url: string;
  doc_rut_url: string;
}

interface UserKYCTableProps {
  users: UserKYC[];
  refreshData: () => void;
}

export default function UserKYCTable({ users, refreshData }: UserKYCTableProps) {
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  // Estado para el Modal de Confirmación
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    userId: number;
    status: 'approved' | 'rejected';
    userName: string;
  } | null>(null);

  // Abrir modal
  const confirmAction = (user: UserKYC, status: 'approved' | 'rejected') => {
    setSelectedAction({
      userId: user.id,
      status,
      userName: user.full_name
    });
    setModalOpen(true);
  };

  // Ejecutar acción (llamada a API)
  const executeAction = async () => {
    if (!selectedAction) return;

    const { userId, status } = selectedAction;
    setProcessingId(userId);
    
    try {
      const res = await fetch(`/api/admin/users/${userId}/kyc`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error('Error al actualizar estado');
      
      refreshData();
      setModalOpen(false); // Cerrar modal tras éxito
    } catch (err) {
      alert('Error al procesar la solicitud');
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const openDoc = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Inversionista
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Fecha Registro
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Documentos KYC
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Estado Actual
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={5}>
                      No hay usuarios pendientes de aprobación.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex flex-col">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {user.full_name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openDoc(user.doc_front_url)}
                            className="text-primary hover:underline text-xs"
                          >
                            📄 Cédula
                          </button>
                          <button 
                            onClick={() => openDoc(user.doc_rut_url)}
                            className="text-primary hover:underline text-xs"
                          >
                            📄 RUT
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={user.kyc_status === "approved" ? "success" : user.kyc_status === "pending" ? "warning" : "error"}
                        >
                          {user.kyc_status.toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <div className="flex gap-3">
                          <button
                            className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => confirmAction(user, 'approved')}
                            disabled={processingId === user.id}
                          >
                            Aprobar
                          </button>
                          <button
                            className="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => confirmAction(user, 'rejected')}
                            disabled={processingId === user.id}
                          >
                            Rechazar
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {selectedAction && (
        <AlertModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={executeAction}
          title={selectedAction.status === 'approved' ? "Aprobar Usuario" : "Rechazar Usuario"}
          message={
            selectedAction.status === 'approved' 
              ? `¿Estás seguro de que deseas aprobar el KYC de ${selectedAction.userName}? Esto permitirá al usuario invertir en la plataforma.`
              : `¿Estás seguro de que deseas rechazar el KYC de ${selectedAction.userName}? El usuario no podrá invertir hasta corregir sus documentos.`
          }
          confirmText={selectedAction.status === 'approved' ? "Sí, Aprobar" : "Sí, Rechazar"}
          variant={selectedAction.status === 'approved' ? "success" : "danger"}
          isLoading={processingId === selectedAction.userId}
        />
      )}
    </>
  );
}