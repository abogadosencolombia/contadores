"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Alert from "@/components/ui/alert/Alert";
import Badge from '@/components/ui/badge/Badge';
import Pagination from '@/components/tables/Pagination';
import { PencilIcon, PlusIcon } from "@/icons"; // Importamos un ícono para el botón
import GenerarCertificadosModal from '@/components/contabilidad/GenerarCertificadosModal';

// 1. Definimos la interfaz para los balances
interface Balance {
  id: number;
  tenant_id: string;
  tipo_empresa: string;
  normativa: string;
  periodo_fecha: string; // La API lo entregará como string
  datos_balance: any; // JSONB
  hash_sha256: string;
  estado_firma: 'pendiente' | 'firmado';
  firmado_por_contador_id: number | null;
  fecha_generacion: string; // La API lo entregará como string
}

// Constante para paginación
const ITEMS_PER_PAGE = 10;

export default function ContabilidadPage() {
  // --- Estados del Componente ---
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados para Modal de Firma ---
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const { isOpen: isSignOpen, openModal: openSignModal, closeModal: closeSignModal } = useModal();
  const [isSigning, setIsSigning] = useState(false); // Estado de carga para el modal

  // --- Estados para Modal de Generación de Certificados ---
  const { isOpen: isGenerateOpen, openModal: openGenerateModal, closeModal: closeGenerateModal } = useModal();

  // --- Estados para Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --- Carga de Datos (GET) ---
  const fetchBalances = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());

    try {
      const res = await fetch(`/api/contabilidad/balances?${params.toString()}`, {
        cache: 'no-store' // <-- AÑADIR ESTA LÍNEA
      });
        if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo cargar los balances. ¿Inició sesión?');
      }

      const { data, total } = await res.json();

      // Formateamos fechas para mejor visualización
      const formattedData = data.map((b: Balance) => ({
        ...b,
        periodo_fecha: new Date(b.periodo_fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' }),
        fecha_generacion: new Date(b.fecha_generacion).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      }));

      setBalances(formattedData);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Efecto para Cargar Datos ---
  useEffect(() => {
    fetchBalances(currentPage);
  }, [currentPage, fetchBalances]);

  // --- Manejadores de Modales ---
  const handleOpenSignModal = (balance: Balance) => {
    setSelectedBalance(balance);
    setError(null); // Limpiar errores previos
    openSignModal();
  };

  const customCloseSignModal = () => {
    closeSignModal();
    setError(null);
    setSelectedBalance(null);
  };

  const handleConfirmSignature = async () => {
    if (!selectedBalance) return;

    setIsSigning(true);
    setError(null);

    try {
      // Usamos la nueva ruta de API para firmar
      const res = await fetch(`/api/contabilidad/balances/${selectedBalance.id}/firmar`, {
        method: 'POST',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al firmar el balance.');
      }

      // Éxito
      customCloseSignModal();
      fetchBalances(currentPage); // Recargar la tabla

    } catch (err: any) {
      setError(err.message); // Mostrar error en el modal
    } finally {
      setIsSigning(false);
    }
  };


  // --- Clases de estilo reutilizables ---
  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";
  const hashColClasses = "min-w-[150px] max-w-xs whitespace-normal font-mono text-xs"; // Para el Hash

  // --- Renderizado de la Interfaz ---
  return (
    <>
      <PageBreadcrumb pageTitle="Contabilidad y Balances" />

      {error && !isLoading && !isSignOpen && (
        <div className="mb-4">
          <Alert variant="error" title="Error al cargar la página" message={error} />
        </div>
      )}

      {/* --- Tabla de Balances --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Balances Pendientes de Firma y Generados
            </h3>
            <Button
                size="sm"
                variant="primary"
                onClick={openGenerateModal}
                startIcon={<PlusIcon className="w-4 h-4" />}
            >
                Generar Certificados
            </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          {isLoading && !isSignOpen ? (
            <p className="text-center py-10">Cargando balances...</p>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell isHeader className={baseHeaderClasses}>Periodo</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Normativa</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Tipo Empresa</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Generado</TableCell>
                  <TableCell isHeader className={`${baseHeaderClasses} ${hashColClasses}`}>Hash (SHA-256)</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Estado</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {balances.length > 0 ? (
                  balances.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className={baseCellClasses}>{b.periodo_fecha}</TableCell>
                      <TableCell className={baseCellClasses}>{b.normativa}</TableCell>
                      <TableCell className={baseCellClasses}>{b.tipo_empresa}</TableCell>
                      <TableCell className={baseCellClasses}>{b.fecha_generacion}</TableCell>
                      <TableCell className={`${baseCellClasses} ${hashColClasses}`}>
                        {b.hash_sha256.substring(0, 15)}...
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        <Badge
                          size="sm"
                          color={b.estado_firma === 'pendiente' ? 'warning' : 'success'}
                        >
                          {b.estado_firma === 'pendiente' ? 'Pendiente Firma' : 'Firmado'}
                        </Badge>
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        {b.estado_firma === 'pendiente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenSignModal(b)}
                            startIcon={<PencilIcon className="w-4 h-4" />}
                            className="hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600 dark:hover:bg-brand-500/15 dark:hover:text-brand-400 dark:hover:border-brand-500/30"
                          >
                            Validar y Firmar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-gray-500">
                      No se encontraron balances.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* --- Controles de Paginación --- */}
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

      {/* --- Modal para CONFIRMAR FIRMA --- */}
      {selectedBalance && (
        <Modal
          isOpen={isSignOpen}
          onClose={customCloseSignModal}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <div className="text-center">
            <span className="inline-block p-3 text-brand-500 bg-brand-50 rounded-full dark:bg-brand-500/10 mb-4">
              <PencilIcon className="w-8 h-8" />
            </span>
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Confirmar Firma Digital
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Está a punto de firmar digitalmente el balance (NIIF/IFRS)
              para el periodo <strong className="text-gray-700 dark:text-gray-200">{selectedBalance.periodo_fecha}</strong>.
            </p>

            <div className="p-4 mb-4 text-left bg-gray-50 rounded-lg dark:bg-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hash (SHA-256) del documento:</p>
              <p className="text-xs font-mono text-gray-700 dark:text-gray-200 break-all">
                {selectedBalance.hash_sha256}
              </p>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Esta acción es irreversible y equivale a su firma autógrafa,
              garantizando la integridad y autenticidad del documento según la Ley 527 de 1999.
            </p>

            {error && <Alert variant="error" title="Error" message={error} className="mb-4 text-left" />}

            <div className="flex items-center justify-center w-full gap-3 mt-8">
              <Button size="sm" variant="outline" onClick={customCloseSignModal} type="button" disabled={isSigning}>
                Cancelar
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleConfirmSignature}
                type="button"
                disabled={isSigning}
              >
                {isSigning ? 'Firmando...' : 'Confirmar y Firmar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- Modal para GENERAR CERTIFICADOS --- */}
      <GenerarCertificadosModal
        isOpen={isGenerateOpen}
        onClose={closeGenerateModal}
      />
    </>
  );
}
