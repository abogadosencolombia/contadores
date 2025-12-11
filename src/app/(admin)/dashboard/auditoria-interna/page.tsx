"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from '@/components/ui/badge/Badge';
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Pagination from '@/components/tables/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

interface RiesgoContable {
  id: number;
  titulo: string;
  categoria_niif: string;
  nivel_confianza_ia: number;
  explicacion_ia: string;
  estado: string;
  fecha_deteccion: string;
  comentarios_revisor?: string;
  validado_por?: { full_name: string };
}

const ITEMS_PER_PAGE = 10;

export default function AuditoriaInternaPage() {
  // --- Estados de Datos ---
  const [riesgos, setRiesgos] = useState<RiesgoContable[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- Estados de Paginación y Filtros ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filtroEstado, setFiltroEstado] = useState('');

  // --- Estados de Modal ---
  const [selectedRiesgo, setSelectedRiesgo] = useState<RiesgoContable | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // --- Carga de Datos ---
  const fetchRiesgos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filtroEstado) params.set('estado', filtroEstado);

      const res = await fetch(`/api/auditoria-interna/riesgos?${params.toString()}`);
      const responseData = await res.json();

      if (res.ok && responseData.data) {
        setRiesgos(responseData.data);
        if (responseData.meta) {
            setTotalPages(Math.ceil(responseData.meta.total / ITEMS_PER_PAGE));
            setTotalItems(responseData.meta.total);
        }
      } else {
        setRiesgos([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Failed to fetch riesgos", error);
      setRiesgos([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filtroEstado]);

  useEffect(() => {
    fetchRiesgos();
  }, [fetchRiesgos]);

  // --- Manejo de Acciones ---
  const handleValidation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRiesgo) return;

    const formData = new FormData(e.currentTarget);
    const estado = formData.get('estado');
    const comentarios = formData.get('comentarios');

    await fetch('/api/auditoria-interna/riesgos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedRiesgo.id,
        estado: estado,
        comentarios_revisor: comentarios
      })
    });

    closeModal();
    fetchRiesgos();
  };

  const openValidationModal = (riesgo: RiesgoContable) => {
    setSelectedRiesgo(riesgo);
    openModal();
  };

  // --- Métricas (KPIs) ---
  const metrics = {
    total: totalItems, 
    pendientes: riesgos.filter(r => ['DETECTADO', 'EN_REVISION'].includes(r.estado)).length, 
    altoRiesgo: riesgos.filter(r => r.nivel_confianza_ia > 80 && r.estado === 'DETECTADO').length,
    confirmados: riesgos.filter(r => r.estado === 'VALIDADO_FRAUDE').length,
  };

  const headerClass = "py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400";
  const cellClass = "py-3 px-4 text-sm text-gray-500 dark:text-gray-400";

  return (
    <>
      <PageBreadcrumb pageTitle="Auditoría Interna & IA Compliance" />

      {/* --- KPIs / Mapa de Calor --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Riesgos Totales</h4>
              <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{metrics.total}</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pendientes (Vista)</h4>
              <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{metrics.pendientes}</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Alto Riesgo (Vista)</h4>
              <h3 className="mt-2 text-2xl font-bold text-error-600 dark:text-error-500">{metrics.altoRiesgo}</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-error-50 text-error-600 dark:bg-error-500/15">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmados (Vista)</h4>
              <h3 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">{metrics.confirmados}</h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/15">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- Filtros --- */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
                <Label>Buscar Hallazgo</Label>
                <Input 
                    type="text" 
                    placeholder="Título o categoría..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>
            <div className="w-full md:w-64">
                <Label>Estado</Label>
                <Select
                    options={[
                        { value: "", label: "Todos los Estados" },
                        { value: "DETECTADO", label: "Detectado (IA)" },
                        { value: "EN_REVISION", label: "En Revisión" },
                        { value: "VALIDADO_FRAUDE", label: "Fraude Confirmado" },
                        { value: "FALSO_POSITIVO", label: "Falso Positivo" },
                        { value: "CORREGIDO", label: "Corregido" }
                    ]}
                    onChange={(val) => { setFiltroEstado(val); setCurrentPage(1); }}
                    value={filtroEstado}
                />
            </div>
            <div className="pb-1">
                <Button variant="primary" onClick={() => fetchRiesgos()}>
                    Actualizar
                </Button>
            </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Mapa de Riesgos NIIF Detectados
        </h3>

        {loading ? <p className="py-10 text-center">Cargando datos...</p> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-white/5">
                <TableRow>
                  <TableCell isHeader className={headerClass}>Fecha</TableCell>
                  <TableCell isHeader className={headerClass}>Categoría NIIF</TableCell>
                  <TableCell isHeader className={headerClass}>Hallazgo (IA)</TableCell>
                  <TableCell isHeader className={headerClass}>Confianza IA</TableCell>
                  <TableCell isHeader className={headerClass}>Estado</TableCell>
                  <TableCell isHeader className={headerClass}>Revisor Fiscal</TableCell>
                  <TableCell isHeader className={headerClass}>Acción</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riesgos.map((r) => (
                  <TableRow key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                    <TableCell className={cellClass}>
                      {new Date(r.fecha_deteccion).toLocaleDateString()}
                    </TableCell>
                    <TableCell className={cellClass}>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {r.categoria_niif}
                      </span>
                    </TableCell>
                    <TableCell className={`${cellClass} max-w-xs truncate`} title={r.titulo}>
                      {r.titulo}
                    </TableCell>
                    <TableCell className={cellClass}>
                      {/* Indicador visual de confianza */}
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          r.nivel_confianza_ia > 80 ? 'bg-error-500' : 'bg-warning-500'
                        }`}></span>
                        {r.nivel_confianza_ia}%
                      </div>
                    </TableCell>
                    <TableCell className={cellClass}>
                      <Badge
                        color={
                          r.estado === 'DETECTADO' ? 'warning' :
                          r.estado === 'VALIDADO_FRAUDE' ? 'error' :
                          r.estado === 'FALSO_POSITIVO' ? 'success' : 'light'
                        }
                      >
                        {r.estado.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className={cellClass}>
                      {r.validado_por?.full_name || '-'}
                    </TableCell>
                    <TableCell className={cellClass}>
                      <Button size="sm" onClick={() => openValidationModal(r)}>
                        Ver / Validar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {riesgos.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-gray-500">No se encontraron hallazgos.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && totalPages > 1 && (
            <div className="mt-4 flex justify-center">
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        )}
      </div>

      {/* Modal de Validación del Revisor Fiscal */}
      {selectedRiesgo && (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl p-6">
          <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Validación de Hallazgo #{selectedRiesgo.id}
          </h4>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 dark:bg-white/5 space-y-3">
             <div>
               <span className="text-xs font-bold text-gray-500 uppercase">Anomalía Detectada</span>
               <p className="text-gray-800 dark:text-gray-200">{selectedRiesgo.titulo}</p>
             </div>
             <div>
               <span className="text-xs font-bold text-gray-500 uppercase">Bitácora Explicativa (IA)</span>
               <p className="text-sm text-gray-600 dark:text-gray-300 italic p-2 border-l-4 border-brand-500 bg-white dark:bg-black/20">
                 {selectedRiesgo.explicacion_ia}
               </p>
             </div>
          </div>

          <form onSubmit={handleValidation}>
            <div className="space-y-4">
              <div>
                <Label>Dictamen del Revisor Fiscal</Label>
                <Select
                  name="estado"
                  options={[
                    { value: 'VALIDADO_FRAUDE', label: 'Confirmar como Riesgo/Fraude' },
                    { value: 'FALSO_POSITIVO', label: 'Descartar (Falso Positivo)' },
                    { value: 'CORREGIDO', label: 'Marcar como Corregido' },
                    { value: 'EN_REVISION', label: 'Mantener en Revisión' }
                  ]}
                  defaultValue={selectedRiesgo.estado}
                />
              </div>
              <div>
                <Label>Observaciones de Auditoría</Label>
                <TextArea
                  name="comentarios"
                  rows={3}
                  defaultValue={selectedRiesgo.comentarios_revisor || ''}
                  placeholder="Justifique su dictamen..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button type="submit">Guardar Dictamen</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
