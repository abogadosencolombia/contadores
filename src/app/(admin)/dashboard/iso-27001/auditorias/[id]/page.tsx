'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { IsoAuditoria, IsoAuditoriaInput, IsoAuditoriaEstado, IsoHallazgo } from '@/types/iso-27001';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal';
import Select from '@/components/form/Select';
import RegistrarHallazgoModal from '@/components/iso/RegistrarHallazgoModal';
import CerrarHallazgoModal from '@/components/iso/CerrarHallazgoModal';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';

// Helper to fetch single audit details
async function fetchAuditoria(id: string): Promise<IsoAuditoria> {
  const allRes = await fetch('/api/iso/auditorias');
  if (!allRes.ok) throw new Error('Failed to load audits');
  const all: IsoAuditoria[] = await allRes.json();
  const found = all.find(a => a.id === Number(id));
  if (!found) throw new Error('Auditoría no encontrada');
  return found;
}

// Helper to fetch findings
async function fetchHallazgos(auditoriaId: string): Promise<IsoHallazgo[]> {
    const res = await fetch(`/api/iso/hallazgos?auditoria_id=${auditoriaId}`);
    if (!res.ok) throw new Error('Failed to load findings');
    return res.json();
}

async function updateAuditoriaApi(id: number, data: Partial<IsoAuditoriaInput>): Promise<IsoAuditoria> {
  const res = await fetch(`/api/iso/auditorias/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al actualizar auditoría');
  }
  return res.json();
}

const ESTADO_OPTIONS = [
  { value: 'PLANIFICADA', label: 'Planificada' },
  { value: 'EN_EJECUCION', label: 'En Ejecución' },
  { value: 'COMPLETADA', label: 'Completada' },
  { value: 'CANCELADA', label: 'Cancelada' },
];

export default function AuditoriaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [auditoria, setAuditoria] = useState<IsoAuditoria | null>(null);
  const [hallazgos, setHallazgos] = useState<IsoHallazgo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<IsoAuditoriaInput>>({});
  const [updating, setUpdating] = useState(false);

  // Findings Modal State
  const [isHallazgoModalOpen, setIsHallazgoModalOpen] = useState(false);
  
  // Close Finding State
  const [isCerrarModalOpen, setIsCerrarModalOpen] = useState(false);
  const [selectedHallazgoId, setSelectedHallazgoId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadData = async () => {
        try {
            const [auditData, findingsData] = await Promise.all([
                fetchAuditoria(id),
                fetchHallazgos(id)
            ]);
            setAuditoria(auditData);
            setHallazgos(findingsData);
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
    
    loadData();
  }, [id]);

  const handleEditOpen = () => {
    if (!auditoria) return;
    setEditData({
      nombreAuditoria: auditoria.nombreAuditoria,
      tipoAuditoria: auditoria.tipoAuditoria,
      fechaProgramada: auditoria.fechaProgramada,
      auditorLider: auditoria.auditorLider,
      alcance: auditoria.alcance,
      estado: auditoria.estado,
    });
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditData({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditoria) return;
    
    try {
      setUpdating(true);
      const updated = await updateAuditoriaApi(auditoria.id, editData);
      setAuditoria(updated);
      handleEditClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setUpdating(false);
    }
  };

  const refreshHallazgos = async () => {
      if (!id) return;
      const data = await fetchHallazgos(id);
      setHallazgos(data);
  };

  const openCerrarModal = (hallazgoId: number) => {
      setSelectedHallazgoId(hallazgoId);
      setIsCerrarModalOpen(true);
  };

  if (loading) return <p className="p-6">Cargando detalles...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!auditoria) return <p className="p-6">No se encontró la auditoría.</p>;

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle={`Auditoría: ${auditoria.nombreAuditoria}`} />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Auditoria Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Información General</h3>
                 <Badge
                    size="md"
                    color={
                        auditoria.estado === 'COMPLETADA' ? 'success' :
                        auditoria.estado === 'PLANIFICADA' ? 'info' :
                        auditoria.estado === 'EN_EJECUCION' ? 'warning' : 'error'
                    }
                >
                    {auditoria.estado}
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de Auditoría</p>
                    <p className="font-medium text-gray-800 dark:text-white mt-1">{auditoria.tipoAuditoria}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha Programada</p>
                    <p className="font-medium text-gray-800 dark:text-white mt-1">{new Date(auditoria.fechaProgramada).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Auditor Líder</p>
                    <p className="font-medium text-gray-800 dark:text-white mt-1">{auditoria.auditorLider || 'Sin asignar'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Alcance de la Auditoría</p>
                    <div className="bg-gray-50 dark:bg-white/[0.03] p-4 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {auditoria.alcance || 'No definido'}
                    </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6 dark:border-gray-700">
                 <Button variant="primary" onClick={handleEditOpen}>
                    Editar Detalles / Cambiar Estado
                 </Button>
              </div>
            </div>

            {/* Hallazgos Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Hallazgos (No Conformidades)</h3>
                    <Button variant="primary" size="sm" onClick={() => setIsHallazgoModalOpen(true)}>
                        Agregar Hallazgo
                    </Button>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-4 py-3 text-gray-500 font-medium">ID</TableCell>
                                <TableCell isHeader className="px-4 py-3 text-gray-500 font-medium">Descripción</TableCell>
                                <TableCell isHeader className="px-4 py-3 text-gray-500 font-medium">Tipo</TableCell>
                                <TableCell isHeader className="px-4 py-3 text-gray-500 font-medium">Control</TableCell>
                                <TableCell isHeader className="px-4 py-3 text-gray-500 font-medium">Estado</TableCell>
                                <TableCell isHeader className="px-4 py-3 text-gray-500 font-medium">Acciones</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {hallazgos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-4 py-4 text-center text-gray-500">
                                        No se han registrado hallazgos.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                hallazgos.map(h => (
                                    <TableRow key={h.id}>
                                        <TableCell className="px-4 py-3 text-sm">#{h.id}</TableCell>
                                        <TableCell className="px-4 py-3 text-sm max-w-xs truncate" title={h.descripcion}>{h.descripcion}</TableCell>
                                        <TableCell className="px-4 py-3 text-sm">
                                            <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                                                {h.tipoHallazgo.replace(/_/g, ' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm">{h.controlCodigo || '-'}</TableCell>
                                        <TableCell className="px-4 py-3 text-sm">
                                            <Badge
                                                size="sm"
                                                color={h.estado === 'CERRADO' ? 'success' : 'warning'}
                                            >
                                                {h.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-sm">
                                            {h.estado !== 'CERRADO' && (
                                                <button 
                                                    onClick={() => openCerrarModal(h.id)}
                                                    className="text-brand-500 hover:underline text-xs font-medium"
                                                >
                                                    Cerrar
                                                </button>
                                            )}
                                            {h.estado === 'CERRADO' && h.evidenciaCierreUrl && (
                                                <a 
                                                    href={h.evidenciaCierreUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline text-xs font-medium ml-2"
                                                >
                                                    Ver Evidencia
                                                </a>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
              <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Resumen</h3>
              <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                      <span className="text-gray-500">Total Hallazgos</span>
                      <span className="font-medium text-gray-800 dark:text-white">{hallazgos.length}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-500">Abiertos</span>
                      <span className="font-medium text-warning-600">{hallazgos.filter(h => h.estado !== 'CERRADO').length}</span>
                  </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Cerrados</span>
                      <span className="font-medium text-success-600">{hallazgos.filter(h => h.estado === 'CERRADO').length}</span>
                  </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
                <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/iso-27001/auditorias')}>
                    ← Volver al Listado
                </Button>
            </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleEditClose} className="max-w-2xl">
        <ModalHeader title="Editar Auditoría" onClose={handleEditClose} />
        <ModalBody>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombreAuditoria"
                            value={editData.nombreAuditoria || ''}
                            onChange={handleEditChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                         <Select
                            options={ESTADO_OPTIONS}
                            value={editData.estado as string}
                            onChange={(val) => setEditData(prev => ({ ...prev, estado: val as IsoAuditoriaEstado }))}
                            placeholder="Seleccionar estado"
                         />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Programada</label>
                         <input
                            type="date"
                            name="fechaProgramada"
                            value={editData.fechaProgramada ? new Date(editData.fechaProgramada).toISOString().split('T')[0] : ''}
                            onChange={handleEditChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auditor Líder</label>
                        <input
                            type="text"
                            name="auditorLider"
                            value={editData.auditorLider || ''}
                            onChange={handleEditChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alcance</label>
                    <textarea
                        name="alcance"
                        rows={4}
                        value={editData.alcance || ''}
                        onChange={handleEditChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={handleEditClose}>Cancelar</Button>
                    <Button type="submit" variant="primary" disabled={updating}>
                        {updating ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </ModalBody>
      </Modal>

      {/* Registrar Hallazgo Modal */}
      <RegistrarHallazgoModal
        isOpen={isHallazgoModalOpen}
        onClose={() => setIsHallazgoModalOpen(false)}
        auditoriaId={auditoria.id}
        onSuccess={refreshHallazgos}
      />

      {/* Cerrar Hallazgo Modal */}
      {selectedHallazgoId && (
        <CerrarHallazgoModal
            isOpen={isCerrarModalOpen}
            onClose={() => setIsCerrarModalOpen(false)}
            hallazgoId={selectedHallazgoId}
            onSuccess={refreshHallazgos}
        />
      )}
    </div>
  );
}