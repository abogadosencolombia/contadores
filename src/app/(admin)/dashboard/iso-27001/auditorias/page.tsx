'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IsoAuditoria, IsoAuditoriaInput } from '@/types/iso-27001';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Select from '@/components/form/Select';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Helper para obtener las auditorías
async function fetchAuditorias(): Promise<IsoAuditoria[]> {
  const res = await fetch('/api/iso/auditorias');
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al obtener auditorías');
  }
  return res.json();
}

// Helper para crear una auditoría
async function createAuditoriaApi(data: IsoAuditoriaInput): Promise<IsoAuditoria> {
  const res = await fetch('/api/iso/auditorias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al crear auditoría');
  }
  return res.json();
}

const TIPO_AUDITORIA_OPTIONS = [
  { value: 'INTERNA', label: 'INTERNA' },
  { value: 'EXTERNA', label: 'EXTERNA' },
  { value: 'CERTIFICACION', label: 'CERTIFICACIÓN' },
  { value: 'PROVEEDOR', label: 'PROVEEDOR' },
];

export default function IsoAuditoriasPage() {
  const router = useRouter();
  const [auditorias, setAuditorias] = useState<IsoAuditoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Form state for new audit
  const [newAudit, setNewAudit] = useState<IsoAuditoriaInput>({
    nombreAuditoria: '',
    tipoAuditoria: 'INTERNA', // Valor por defecto común
    fechaProgramada: '',
    auditorLider: '',
    estado: 'PLANIFICADA',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAuditorias();
        setAuditorias(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Reset form
    setNewAudit({
      nombreAuditoria: '',
      tipoAuditoria: 'INTERNA',
      fechaProgramada: '',
      auditorLider: '',
      estado: 'PLANIFICADA',
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAudit(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const created = await createAuditoriaApi(newAudit);
      setAuditorias(prev => [created, ...prev]);
      handleModalClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetail = (id: number) => {
    router.push(`/dashboard/iso-27001/auditorias/${id}`);
  };

  // Helper simple para formatear fecha
  const formatDate = (dateStr: Date | string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Auditorías ISO 27001" />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Listado de Auditorías</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Programar Auditoría
        </Button>
      </div>

      {error && <p className="mb-4 text-red-500">Error: {error}</p>}
      {loading && <p className="mb-4">Cargando datos...</p>}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nombre</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tipo</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Fecha Programada</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Auditor Líder</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Estado</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {auditorias.map((auditoria) => (
                  <TableRow key={auditoria.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{auditoria.nombreAuditoria}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{auditoria.tipoAuditoria}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{formatDate(auditoria.fechaProgramada)}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{auditoria.auditorLider || '-'}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <Badge
                        size="sm"
                        color={
                          auditoria.estado === 'COMPLETADA'
                            ? 'success'
                            : auditoria.estado === 'PLANIFICADA'
                            ? 'info'
                            : auditoria.estado === 'EN_EJECUCION'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {auditoria.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <Button size="sm" variant="outline" onClick={() => navigateToDetail(auditoria.id)}>
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && auditorias.length === 0 && (
                   <TableRow>
                     <TableCell className="px-5 py-4 text-center text-gray-500" colSpan={6}>
                       No hay auditorías registradas.
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal Programar Auditoría */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} className="max-w-2xl">
          <ModalHeader title="Programar Nueva Auditoría" onClose={handleModalClose} />
          <ModalBody>
            <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="nombreAuditoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Auditoría</label>
              <input
                type="text"
                id="nombreAuditoria"
                name="nombreAuditoria"
                value={newAudit.nombreAuditoria}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="tipoAuditoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo Auditoría</label>
              <Select
                id="tipoAuditoria"
                name="tipoAuditoria"
                options={TIPO_AUDITORIA_OPTIONS}
                value={newAudit.tipoAuditoria}
                onChange={(value) => setNewAudit(prev => ({ ...prev, tipoAuditoria: value }))}
                placeholder="Seleccione tipo..."
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fechaProgramada" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Programada</label>
              <input
                type="date"
                id="fechaProgramada"
                name="fechaProgramada"
                value={newAudit.fechaProgramada as string}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="alcance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alcance</label>
              <textarea
                id="alcance"
                name="alcance"
                value={newAudit.alcance || ''}
                onChange={(e) => setNewAudit(prev => ({ ...prev, alcance: e.target.value }))}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ej. Toda la plataforma, Departamento de IT..."
              />
            </div>

            <div className="mb-4">
              <label htmlFor="auditorLider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Auditor Líder</label>
              <input
                type="text"
                id="auditorLider"
                name="auditorLider"
                value={newAudit.auditorLider || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Programar
              </Button>
            </div>
          </form>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
