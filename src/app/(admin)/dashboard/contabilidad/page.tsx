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
import { PencilIcon, PlusIcon } from "@/icons";
import GenerarCertificadosModal from '@/components/contabilidad/GenerarCertificadosModal';

// 1. Definimos la interfaz para los balances
interface Balance {
  id: number;
  tenant_id: string;
  tipo_empresa: string;
  normativa: string;
  periodo_fecha: string;
  datos_balance: any;
  hash_sha256: string;
  estado_firma: 'pendiente' | 'firmado';
  firmado_por_contador_id: number | null;
  fecha_generacion: string;
}

// Constante para paginación
const ITEMS_PER_PAGE = 10;

export default function ContabilidadPage() {
  // --- Estados del Componente (Balances) ---
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --- Estados para Modales ---
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const { isOpen: isSignOpen, openModal: openSignModal, closeModal: closeSignModal } = useModal();
  const { isOpen: isViewBalanceOpen, openModal: openViewBalanceModal, closeModal: closeViewBalanceModal } = useModal();
  const [isSigning, setIsSigning] = useState(false);
  const { isOpen: isGenerateOpen, openModal: openGenerateModal, closeModal: closeGenerateModal } = useModal();

  // --- Carga de Balances ---
  const fetchBalances = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());

    try {
      const res = await fetch(`/api/contabilidad/balances?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo cargar los balances.');
      }
      const { data, total } = await res.json();

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

  // --- Efectos ---
  useEffect(() => { fetchBalances(currentPage); }, [currentPage, fetchBalances]);

  // --- Manejadores ---
  const handleOpenSignModal = (balance: Balance) => {
    setSelectedBalance(balance);
    setError(null);
    openSignModal();
  };

  const handleViewBalance = (balance: Balance) => {
    setSelectedBalance(balance);
    openViewBalanceModal();
  };

  const customCloseSignModal = () => {
    closeSignModal();
    setError(null);
    setSelectedBalance(null);
  };

  const customCloseViewBalanceModal = () => {
    closeViewBalanceModal();
    setSelectedBalance(null);
  };

  const handleCloseGenerateModal = () => {
    closeGenerateModal();
    // fetchCertificados(1); // Ya no es necesario recargar certificados aquí
  };

  const handleConfirmSignature = async () => {
    if (!selectedBalance) return;
    setIsSigning(true);
    setError(null);
    try {
      const res = await fetch(`/api/contabilidad/balances/${selectedBalance.id}/firmar`, { method: 'POST' });
      if (!res.ok) throw new Error('Error al firmar el balance.');
      customCloseSignModal();
      fetchBalances(currentPage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSigning(false);
    }
  };

  // --- Estilos ---
  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";
  const hashColClasses = "min-w-[150px] max-w-xs whitespace-normal font-mono text-xs";

  // --- Helper para renderizar filas recursivas ---
  const renderBalanceRows = (data: any, level = 0) => {
    if (!data || typeof data !== 'object') return null;

    return Object.entries(data).map(([key, value]) => {
      const isObject = typeof value === 'object' && value !== null;
      // Usamos px-4 (1rem) como base. Si hay nivel, sumamos la indentación.
      const indentStyle = level > 0 ? { paddingLeft: `calc(1rem + ${level * 20}px)` } : {};

      if (isObject) {
        return (
          <React.Fragment key={key}>
            <TableRow className="bg-gray-50/50 dark:bg-white/5">
              <TableCell colSpan={2} className="py-2 px-4 font-semibold text-gray-800 dark:text-gray-200 capitalize text-sm" style={indentStyle}>
                {key.replace(/_/g, ' ')}
              </TableCell>
            </TableRow>
            {renderBalanceRows(value, level + 1)}
          </React.Fragment>
        );
      }

      return (
        <TableRow key={key}>
          <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-300 capitalize text-sm" style={indentStyle}>
            {key.replace(/_/g, ' ')}
          </TableCell>
          <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-300 text-right text-sm">
            {typeof value === 'number'
              ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
              : String(value)
            }
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Contabilidad y Balances" />

      {error && !isLoading && !isSignOpen && (
        <div className="mb-4">
          <Alert variant="error" title="Error" message={error} />
        </div>
      )}

      {/* --- Tabla de Balances --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Balances Financieros</h3>
            <Button size="sm" variant="primary" onClick={openGenerateModal} startIcon={<PlusIcon className="w-4 h-4" />}>
                Generar Certificados
            </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          {isLoading ? <p className="text-center py-10">Cargando balances...</p> : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell isHeader className={baseHeaderClasses}>Periodo</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Normativa</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Tipo</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Generado</TableCell>
                  <TableCell isHeader className={`${baseHeaderClasses} ${hashColClasses}`}>Hash</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Estado</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {balances.length > 0 ? balances.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className={baseCellClasses}>{b.periodo_fecha}</TableCell>
                    <TableCell className={baseCellClasses}>{b.normativa}</TableCell>
                    <TableCell className={baseCellClasses}>{b.tipo_empresa}</TableCell>
                    <TableCell className={baseCellClasses}>{b.fecha_generacion}</TableCell>
                    <TableCell className={`${baseCellClasses} ${hashColClasses}`}>{b.hash_sha256.substring(0, 10)}...</TableCell>
                    <TableCell className={baseCellClasses}>
                      <Badge size="sm" color={b.estado_firma === 'pendiente' ? 'warning' : 'success'}>
                        {b.estado_firma === 'pendiente' ? 'Pendiente' : 'Firmado'}
                      </Badge>
                    </TableCell>
                    <TableCell className={baseCellClasses}>
                      <Button size="sm" variant="outline" onClick={() => handleViewBalance(b)} className="mr-2">
                        Ver
                      </Button>
                      {b.estado_firma === 'pendiente' && (
                        <Button size="sm" variant="outline" onClick={() => handleOpenSignModal(b)} startIcon={<PencilIcon className="w-4 h-4" />}>
                          Firmar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={7} className="py-10 text-center text-gray-500">No hay balances.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* --- Modales --- */}
      {selectedBalance && (
        <Modal isOpen={isSignOpen} onClose={customCloseSignModal} className="max-w-[600px] p-5 lg:p-10">
            <div className="text-center">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Confirmar Firma</h4>
                <p className="text-sm text-gray-500 mb-6">Firmar balance del periodo {selectedBalance.periodo_fecha}</p>
                <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={customCloseSignModal} disabled={isSigning}>Cancelar</Button>
                    <Button variant="primary" onClick={handleConfirmSignature} disabled={isSigning}>{isSigning ? 'Firmando...' : 'Firmar'}</Button>
                </div>
            </div>
        </Modal>
      )}

      <GenerarCertificadosModal
        isOpen={isGenerateOpen}
        onClose={handleCloseGenerateModal}
      />

      {selectedBalance && (
        <Modal isOpen={isViewBalanceOpen} onClose={customCloseViewBalanceModal} className="max-w-[800px] p-5 lg:p-10">
          <div className="text-center">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Detalle del Balance</h4>
            <p className="text-sm text-gray-500 mb-6">Periodo: {selectedBalance.periodo_fecha}</p>
            <div className="text-left max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-white/5 sticky top-0 z-10">
                  <TableRow>
                    <TableCell isHeader className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-left text-sm">Concepto</TableCell>
                    <TableCell isHeader className="py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-right text-sm">Valor (COP)</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent">
                  {selectedBalance.datos_balance ? (
                     renderBalanceRows(selectedBalance.datos_balance)
                  ) : (
                    <TableRow>
                       <TableCell colSpan={2} className="py-4 text-center text-gray-500">No hay datos disponibles.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <Button variant="outline" onClick={customCloseViewBalanceModal}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
