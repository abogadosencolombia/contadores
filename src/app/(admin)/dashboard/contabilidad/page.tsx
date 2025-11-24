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
import { PencilIcon, PlusIcon, PaperPlaneIcon } from "@/icons";
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

// 2. Definimos la interfaz para los certificados
interface Certificado {
  id: number;
  ano_fiscal: number;
  verification_uuid: string;
  fecha_emision: string;
  file_path: string;
  accionista_nombre: string;
  accionista_documento: string;
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

  // --- Estados del Componente (Certificados) ---
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [isLoadingCert, setIsLoadingCert] = useState(true);
  const [certPage, setCertPage] = useState(1);
  const [certTotalPages, setCertTotalPages] = useState(0);
  const [sendingId, setSendingId] = useState<number | null>(null);

  // --- Estados para Modales ---
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
  const { isOpen: isSignOpen, openModal: openSignModal, closeModal: closeSignModal } = useModal();
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

  // --- Carga de Certificados ---
  const fetchCertificados = useCallback(async (page: number) => {
    setIsLoadingCert(true);
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', ITEMS_PER_PAGE.toString());

    try {
      const res = await fetch(`/api/contabilidad/certificados-dividendos?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const { data, total } = await res.json();
        setCertificados(data);
        setCertTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error cargando certificados", error);
    } finally {
      setIsLoadingCert(false);
    }
  }, []);

  // --- Efectos ---
  useEffect(() => { fetchBalances(currentPage); }, [currentPage, fetchBalances]);
  useEffect(() => { fetchCertificados(certPage); }, [certPage, fetchCertificados]);

  // --- Manejadores ---
  const handleOpenSignModal = (balance: Balance) => {
    setSelectedBalance(balance);
    setError(null);
    openSignModal();
  };

  const customCloseSignModal = () => {
    closeSignModal();
    setError(null);
    setSelectedBalance(null);
  };

  const handleCloseGenerateModal = () => {
    closeGenerateModal();
    fetchCertificados(1); // Recargar certificados al cerrar el modal (por si se generaron nuevos)
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

  const handleSendEmail = async (certificadoId: number) => {
    setSendingId(certificadoId);
    try {
      const res = await fetch('/api/contabilidad/certificados-dividendos/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificado_id: certificadoId })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error al enviar el correo');
      
      alert('Correo enviado exitosamente'); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSendingId(null);
    }
  };

  // --- Estilos ---
  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";
  const hashColClasses = "min-w-[150px] max-w-xs whitespace-normal font-mono text-xs";

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

      {/* --- Tabla de Certificados --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Certificados de Dividendos</h3>
        </div>
        <div className="max-w-full overflow-x-auto">
          {isLoadingCert ? <p className="text-center py-10">Cargando certificados...</p> : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell isHeader className={baseHeaderClasses}>Año Fiscal</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Accionista</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Documento</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Fecha Emisión</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Verificación UUID</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {certificados.length > 0 ? certificados.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className={baseCellClasses}>{c.ano_fiscal}</TableCell>
                    <TableCell className={baseCellClasses}>{c.accionista_nombre}</TableCell>
                    <TableCell className={baseCellClasses}>{c.accionista_documento}</TableCell>
                    <TableCell className={baseCellClasses}>{new Date(c.fecha_emision).toLocaleDateString()}</TableCell>
                    <TableCell className={`${baseCellClasses} font-mono text-xs`}>{c.verification_uuid}</TableCell>
                    <TableCell className={baseCellClasses}>
                      <div className="flex items-center gap-2">
                        <a 
                          href={`/verificar-certificado/${c.verification_uuid}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-500 hover:underline text-sm mr-2"
                        >
                          Ver
                        </a>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleSendEmail(c.id)}
                          disabled={sendingId === c.id}
                          startIcon={<PaperPlaneIcon className="w-4 h-4" />}
                        >
                          {sendingId === c.id ? '...' : 'Enviar'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="py-10 text-center text-gray-500">No se encontraron certificados.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        {!isLoadingCert && certTotalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination currentPage={certPage} totalPages={certTotalPages} onPageChange={setCertPage} />
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
    </>
  );
}
