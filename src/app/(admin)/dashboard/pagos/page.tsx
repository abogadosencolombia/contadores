
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import Alert from '@/components/ui/alert/Alert';
import { PlusIcon } from '@/icons';
import CrearOrdenPagoModal from '@/components/pagos/CrearOrdenPagoModal';
import AuditoriaOrdenPagoModal from '@/components/pagos/AuditoriaOrdenPagoModal'; // Importar el nuevo modal
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/hooks/useAuth'; // Importar el hook de autenticación

// Interfaces para las órdenes de pago
interface OrdenPago {
  id: number;
  proveedor_nombre: string;
  monto: number;
  moneda: string;
  estado: 'pendiente_aprobacion' | 'pendiente_firma_2' | 'aprobado' | 'rechazado';
  requiere_doble_firma: boolean;
  firmado_por_user_id_1: number | null;
  fecha_creacion: string;
}

const ITEMS_PER_PAGE = 10;

export default function PagosPage() {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth(); // Usar el hook de autenticación

  const [ordenes, setOrdenes] = useState<OrdenPago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingFirma, setIsLoadingFirma] = useState<number | null>(null);
  const [ordenAuditoriaId, setOrdenAuditoriaId] = useState<number | null>(null); // Estado para el modal de auditoría

  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();

  const fetchOrdenes = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: page.toString(), limit: ITEMS_PER_PAGE.toString() });

    try {
      const res = await fetch(`/api/pagos/ordenes?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo cargar las órdenes de pago.');
      }
      const { data, totalPages: newTotalPages } = await res.json();
      setOrdenes(data);
      setTotalPages(newTotalPages);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
      setOrdenes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Solo buscar órdenes si el usuario está autenticado
    if (user) {
      fetchOrdenes(currentPage);
    }
  }, [currentPage, fetchOrdenes, user]);

  const handleCreateSuccess = () => {
    closeCreateModal();
    fetchOrdenes(1);
    setCurrentPage(1);
  };

  const handleFirmar = async (ordenId: number) => {
    setIsLoadingFirma(ordenId);
    setError(null);

    try {
      const res = await fetch(`/api/pagos/ordenes/${ordenId}/firmar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Error al firmar la orden.');
      }

      fetchOrdenes(currentPage);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    } finally {
      setIsLoadingFirma(null);
    }
  };

  const getEstadoColor = (estado: OrdenPago['estado']): "success" | "warning" | "error" | "info" => {
    switch (estado) {
      case 'aprobado': return 'success';
      case 'pendiente_aprobacion':
      case 'pendiente_firma_2': return 'warning';
      case 'rechazado': return 'error';
      default: return 'info';
    }
  };

  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";

  // Manejar el estado de carga de la autenticación
  if (isAuthLoading) {
    return <p className="text-center py-20">Verificando autenticación...</p>;
  }

  // Manejar error de autenticación o si no hay usuario (ya redirigido por el hook, pero es buena práctica)
  if (authError || !user) {
    return <Alert variant="error" title="Acceso Denegado" message={authError || "Debes iniciar sesión para ver esta página."} />;
  }

  return (
    <>
      <PageBreadCrumb pageTitle="Gestión de Pagos con Control Dual" />
      {error && <Alert variant="error" title="Error" message={error} className="mb-4" />}

      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={openCreateModal} startIcon={<PlusIcon className="w-4 h-4" />}>
          Crear Orden de Pago
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-10">Cargando órdenes de pago...</p>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell isHeader className={baseHeaderClasses}>ID</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Proveedor</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Monto</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Estado</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Requiere 2 Firmas</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Fecha Creación</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {ordenes.length > 0 ? (
                  ordenes.map((orden) => (
                    <TableRow key={orden.id}>
                      <TableCell className={baseCellClasses}>{orden.id}</TableCell>
                      <TableCell className={baseCellClasses}>{orden.proveedor_nombre}</TableCell>
                      <TableCell className={baseCellClasses}>
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: orden.moneda }).format(orden.monto)}
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        <Badge size="sm" color={getEstadoColor(orden.estado)}>
                          {orden.estado.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        <Badge size="sm" color={orden.requiere_doble_firma ? 'warning' : 'info'}>
                            {orden.requiere_doble_firma ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        {new Date(orden.fecha_creacion).toLocaleDateString('es-CO')}
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        <div className="flex gap-2">
                          {orden.estado === 'pendiente_aprobacion' && user.roles.includes('admin') && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleFirmar(orden.id)}
                              disabled={isLoadingFirma === orden.id}
                            >
                              {isLoadingFirma === orden.id ? 'Firmando...' : (orden.requiere_doble_firma ? 'Firmar (1/2)' : 'Aprobar (1/1)')}
                            </Button>
                          )}
                          {orden.estado === 'pendiente_firma_2' && user.roles.includes('admin') && orden.firmado_por_user_id_1 !== user.id && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleFirmar(orden.id)}
                              disabled={isLoadingFirma === orden.id}
                            >
                              {isLoadingFirma === orden.id ? 'Autorizando...' : 'Autorizar (2/2)'}
                            </Button>
                          )}
                          {orden.estado === 'aprobado' && (
                            <Button size="sm" variant="outline" onClick={() => setOrdenAuditoriaId(orden.id)}>
                              Ver Auditoría
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                      No se encontraron órdenes de pago.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>

      {isCreateOpen && (
        <CrearOrdenPagoModal
          isOpen={isCreateOpen}
          onClose={closeCreateModal}
          onSuccess={handleCreateSuccess}
        />
      )}

      {ordenAuditoriaId && (
        <AuditoriaOrdenPagoModal
          isOpen={ordenAuditoriaId !== null}
          onClose={() => setOrdenAuditoriaId(null)}
          ordenId={ordenAuditoriaId}
        />
      )}
    </>
  );
}
