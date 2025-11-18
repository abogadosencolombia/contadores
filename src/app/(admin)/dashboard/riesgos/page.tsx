// En: src/app/(admin)/dashboard/riesgos/page.tsx

"use client";

import React, { useState, useEffect, FormEvent, useMemo, useCallback } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";
import Badge from '@/components/ui/badge/Badge';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/components/tables/Pagination'; // <-- 1. IMPORTAR PAGINACIÓN

// --- Interfaz de Riesgo (sin cambios) ---
interface Riesgo {
  id: number;
  dominio: string;
  riesgo: string;
  probabilidad: number;
  impacto: number;
  nivel: number;
  owner: string;
  control: string;
  estado: 'abierto' | 'mitigando' | 'cerrado';
  fecha: string;
}

// --- Opciones para Selects (sin cambios) ---
const severidadOptions = [
  { value: "1", label: "1 - Muy Baja" },
  { value: "2", label: "2 - Baja" },
  { value: "3", label: "3 - Media" },
  { value: "4", label: "4 - Alta" },
  { value: "5", label: "5 - Crítica" },
];

const estadoOptions = [
  { value: "abierto", label: "Abierto" },
  { value: "mitigando", label: "Mitigando" },
  { value: "cerrado", label: "Cerrado" },
];

const filtroEstadoOptions = [
  { value: "", label: "Todos los Estados" },
  ...estadoOptions,
];

// Constante para cuántos items mostrar por página
const ITEMS_PER_PAGE = 10;

export default function RiesgosPage() {
  // --- Estados del Componente ---
  const [riesgos, setRiesgos] = useState<Riesgo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados para Modales ---
  const [selectedRiesgo, setSelectedRiesgo] = useState<Riesgo | null>(null);
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  // --- Estados para Filtros ---
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [pendingDominio, setPendingDominio] = useState('');
  const [pendingEstado, setPendingEstado] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    dominio: '',
    estado: '',
  });

  // --- NUEVO: Estados para Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Opciones dinámicas para el filtro de Dominio
  const dominioOptions = useMemo(() => {
    // NOTA: Esta lógica ahora solo verá los dominios de la página actual.
    // Para una app más robusta, este 'dominioOptions' debería cargarse desde su propia API.
    const dominios = new Set(riesgos.map(r => r.dominio));
    const options = Array.from(dominios).map(d => ({ value: d, label: d }));
    return [{ value: "", label: "Todos los Dominios" }, ...options];
  }, [riesgos]);

  // --- Carga de Datos (GET) ---
  // --- Carga de Datos (GET) ---
    const fetchRiesgos = useCallback(async (page: number, search: string, filters: typeof activeFilters) => {
      setIsLoading(true);
      setError(null);

      // Construir los parámetros de la URL, incluyendo paginación
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());
      if (search) params.set('search', search);
      if (filters.dominio) params.set('dominio', filters.dominio);
      if (filters.estado) params.set('estado', filters.estado);

      try {
        const res = await fetch(`/api/riesgos?${params.toString()}`);
        if (!res.ok) {
          throw new Error('No se pudo cargar los datos. ¿Inició sesión?');
        }

        // La API ahora devuelve un objeto { data: [], total: 0 }
        const { data, total } = await res.json();

        // const riesgosConNivel = data.map((r: Riesgo) => ({ // <-- LÍNEA ELIMINADA
        //   ...r,
        //   nivel: r.probabilidad * r.impacto // <-- LÍNEA ELIMINADA
        // })); // <-- LÍNEA ELIMINADA

        setRiesgos(data); // <-- CAMBIO: Usar 'data' directamente
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, []); // El 'useCallback' ahora tiene dependencias vacías

  // --- EFECTO para disparar la carga de datos ---
  useEffect(() => {
    fetchRiesgos(currentPage, debouncedSearchTerm, activeFilters);
  }, [currentPage, debouncedSearchTerm, activeFilters, fetchRiesgos]);


  // --- Manejadores de Filtros (Ahora resetean la página) ---
  const handleApplyFilters = () => {
    setCurrentPage(1); // <-- Vuelve a la página 1
    setActiveFilters({
      dominio: pendingDominio,
      estado: pendingEstado,
    });
  };

  const handleClearFilters = () => {
    setCurrentPage(1); // <-- Vuelve a la página 1
    setSearchTerm('');
    setPendingDominio('');
    setPendingEstado('');
    setActiveFilters({ dominio: '', estado: '' });
  };

  // Calcular el número de filtros activos
  const activeFilterCount =
    (debouncedSearchTerm ? 1 : 0) +
    (activeFilters.dominio ? 1 : 0) +
    (activeFilters.estado ? 1 : 0);

  // --- Manejadores de Modales (Sin cambios) ---
  // ... (handleOpenCreate, handleOpenEdit, handleOpenDelete) ...
  // ... (handleCreate, handleUpdate, handleDelete) ...
  const handleOpenCreate = () => { setError(null); openCreateModal(); };
  const handleOpenEdit = (riesgo: Riesgo) => { setError(null); setSelectedRiesgo(riesgo); openEditModal(); };
  const handleOpenDelete = (riesgo: Riesgo) => { setError(null); setSelectedRiesgo(riesgo); openDeleteModal(); };
  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null);
    const formData = new FormData(event.currentTarget);
    const data = {
      dominio: formData.get('dominio') as string,
      riesgo: formData.get('riesgo') as string,
      probabilidad: formData.get('probabilidad') as string,
      impacto: formData.get('impacto') as string,
      control: formData.get('control') as string,
    };
    try {
      const res = await fetch('/api/riesgos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.message || 'Error al crear el riesgo'); }
      closeCreateModal(); fetchRiesgos(1, debouncedSearchTerm, activeFilters); setCurrentPage(1); (event.target as HTMLFormElement).reset();
    } catch (err: any) { setError(err.message); }
  };
  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!selectedRiesgo) return;
    setError(null);
    const formData = new FormData(event.currentTarget);
    const data = {
      dominio: formData.get('dominio') as string,
      riesgo: formData.get('riesgo') as string,
      probabilidad: formData.get('probabilidad') as string,
      impacto: formData.get('impacto') as string,
      control: formData.get('control') as string,
      estado: formData.get('estado') as string,
    };
    try {
      const res = await fetch(`/api/riesgos/${selectedRiesgo.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.message || 'Error al actualizar el riesgo'); }
      closeEditModal(); fetchRiesgos(currentPage, debouncedSearchTerm, activeFilters); setSelectedRiesgo(null);
    } catch (err: any) { setError(err.message); }
  };
  const handleDelete = async () => {
    if (!selectedRiesgo) return;
    setError(null);
    try {
      const res = await fetch(`/api/riesgos/${selectedRiesgo.id}`, { method: 'DELETE' });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.message || 'Error al eliminar el riesgo'); }
      closeDeleteModal(); fetchRiesgos(1, debouncedSearchTerm, activeFilters); setCurrentPage(1); setSelectedRiesgo(null);
    } catch (err: any) { setError(err.message); closeDeleteModal(); }
  };


  // --- Clases de estilo reutilizables para celdas ---
  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";
  const textColClasses = "min-w-[200px] max-w-sm whitespace-normal"; // Para Riesgo y Control

  // --- Renderizado de la Interfaz ---
  return (
    <>
      <PageBreadcrumb pageTitle="Gestión de Riesgos (ERM)" />

      {/* --- Barra de Filtros --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filtro 1: Búsqueda (Dinámico) */}
          <div className="flex-1">
            <Label htmlFor="search-riesgo">Buscar por Riesgo o Control</Label>
            <Input
              type="text"
              id="search-riesgo"
              name="search-riesgo"
              placeholder="Ej: 'Incumplimiento Ley 1581'..."
              defaultValue={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} // Resetea la pág al escribir
            />
          </div>

          {/* Filtro 2: Dominio (Estático) */}
          <div className="md:w-1/5">
            <Label htmlFor="filtro-dominio">Dominio</Label>
            <Select
              id="filtro-dominio"
              name="filtro-dominio"
              options={dominioOptions}
              defaultValue={pendingDominio}
              onChange={(value) => setPendingDominio(value)}
            />
          </div>

          {/* Filtro 3: Estado (Estático) */}
          <div className="md:w-1/5">
            <Label htmlFor="filtro-estado">Estado</Label>
            <Select
              id="filtro-estado"
              name="filtro-estado"
              options={filtroEstadoOptions}
              defaultValue={pendingEstado}
              onChange={(value) => setPendingEstado(value)}
            />
          </div>
        </div>

        {/* Botones de Filtro */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
          <div className="flex gap-2">
            <Button size="sm" onClick={handleApplyFilters}>
              Aplicar Filtros
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {activeFilterCount > 0 ? `${activeFilterCount} filtros activos` : 'No hay filtros activos'}
            </span>
            <Button size="sm" onClick={handleOpenCreate}>
              Registrar Nuevo Riesgo
            </Button>
          </div>
        </div>
      </div>
      {/* --- FIN de Barra de Filtros --- */}


      {error && !isLoading && (
        <div className="mb-4">
          <Alert variant="error" title="Error" message={error} />
        </div>
      )}

      {/* --- Tabla de Riesgos (CON ACCIONES) --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <p>Cargando riesgos...</p>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell isHeader className={baseHeaderClasses}>Dominio</TableCell>
                  <TableCell isHeader className={`${baseHeaderClasses} ${textColClasses}`}>Riesgo</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>P</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>I</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Nivel</TableCell>
                  <TableCell isHeader className={`${baseHeaderClasses} ${textColClasses}`}>Control</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Propietario</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Estado</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {riesgos.length > 0 ? (
                  riesgos.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className={baseCellClasses}>{r.dominio}</TableCell>
                      <TableCell className={`${baseCellClasses} ${textColClasses}`}>{r.riesgo}</TableCell>
                      <TableCell className={baseCellClasses}>{r.probabilidad}</TableCell>
                      <TableCell className={baseCellClasses}>{r.impacto}</TableCell>
                      <TableCell className={baseCellClasses}>{r.nivel}</TableCell>
                      <TableCell className={`${baseCellClasses} ${textColClasses}`}>{r.control}</TableCell>
                      <TableCell className={baseCellClasses}>{r.owner}</TableCell>
                      <TableCell className={baseCellClasses}>
                        <Badge
                          size="sm"
                          color={r.estado === 'abierto' ? 'error' : r.estado === 'mitigando' ? 'warning' : 'success'}
                        >
                          {r.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(r)}
                            className="hover:bg-warning-50 hover:border-warning-300 hover:text-warning-600 dark:hover:bg-warning-500/15 dark:hover:text-warning-400 dark:hover:border-warning-500/30"
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDelete(r)}
                            className="hover:bg-error-50 hover:border-error-300 hover:text-error-600 dark:hover:bg-error-500/15 dark:hover:text-error-500 dark:hover:border-error-500/30"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="py-10 text-center text-gray-500">
                      No se encontraron riesgos que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* --- NUEVO: Controles de Paginación --- */}
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

      {/* --- Modales (Sin cambios en su estructura interna) --- */}

      {/* --- Modal para CREAR Riesgo --- */}
      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        className="max-w-[700px] p-5 lg:p-10"
      >
        <form onSubmit={handleCreate} className="flex flex-col">
          <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Registrar Nuevo Riesgo
          </h4>
          {error && <Alert variant="error" title="Error" message={error} className="mb-4" />}
          <div className="px-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '60vh' }}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="dominio-crear">Dominio (Ej: Seguridad, Legal, IA)</Label>
                <Input type="text" id="dominio-crear" name="dominio" required />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="riesgo-crear">Descripción del Riesgo</Label>
                <TextArea id="riesgo-crear" name="riesgo" rows={3} required />
              </div>
              <div>
                <Label htmlFor="probabilidad-crear">Probabilidad (1-5)</Label>
                <Select
                  id="probabilidad-crear"
                  name="probabilidad"
                  options={severidadOptions}
                  placeholder="Seleccione..."
                  onChange={() => {}}
                  required
                />
              </div>
              <div>
                <Label htmlFor="impacto-crear">Impacto (1-5)</Label>
                <Select
                  id="impacto-crear"
                  name="impacto"
                  options={severidadOptions}
                  placeholder="Seleccione..."
                  onChange={() => {}}
                  required
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="control-crear">Control (Medida de mitigación)</Label>
                <TextArea id="control-crear" name="control" rows={3} required />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeCreateModal} type="button">
              Cerrar
            </Button>
            <Button size="sm" type="submit">
              Guardar Riesgo
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- Modal para EDITAR Riesgo --- */}
      {selectedRiesgo && (
        <Modal
          isOpen={isEditOpen}
          onClose={closeEditModal}
          className="max-w-[700px] p-5 lg:p-10"
        >
          <form onSubmit={handleUpdate} className="flex flex-col">
            <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Riesgo (ID: {selectedRiesgo.id})
            </h4>
            {error && <Alert variant="error" title="Error" message={error} className="mb-4" />}
            <div className="px-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '60vh' }}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="dominio-editar">Dominio</Label>
                  <Input type="text" id="dominio-editar" name="dominio" defaultValue={selectedRiesgo.dominio} required />
                </div>
                <div>
                  <Label htmlFor="estado-editar">Estado</Label>
                  <Select
                    id="estado-editar"
                    name="estado"
                    options={estadoOptions}
                    defaultValue={selectedRiesgo.estado}
                    onChange={() => {}}
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="riesgo-editar">Descripción del Riesgo</Label>
                  <TextArea id="riesgo-editar" name="riesgo" rows={3} defaultValue={selectedRiesgo.riesgo} required />
                </div>
                <div>
                  <Label htmlFor="probabilidad-editar">Probabilidad (1-5)</Label>
                  <Select
                    id="probabilidad-editar"
                    name="probabilidad"
                    options={severidadOptions}
                    defaultValue={selectedRiesgo.probabilidad.toString()}
                    onChange={() => {}}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="impacto-editar">Impacto (1-5)</Label>
                  <Select
                    id="impacto-editar"
                    name="impacto"
                    options={severidadOptions}
                    defaultValue={selectedRiesgo.impacto.toString()}
                    onChange={() => {}}
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label htmlFor="control-editar">Control (Medida de mitigación)</Label>
                  <TextArea id="control-editar" name="control" rows={3} defaultValue={selectedRiesgo.control} required />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeEditModal} type="button">
                Cancelar
              </Button>
              <Button size="sm" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- Modal para CONFIRMAR ELIMINACIÓN --- */}
      {selectedRiesgo && (
        <Modal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          className="max-w-[500px] p-5 lg:p-10"
        >
          <div className="text-center">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Confirmar Eliminación
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Está seguro de que desea eliminar el riesgo "{selectedRiesgo.riesgo}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-center w-full gap-3 mt-8">
              <Button size="sm" variant="outline" onClick={closeDeleteModal} type="button">
                Cancelar
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleDelete}
                type="button"
                className="bg-error-500 hover:bg-error-600 dark:bg-error-500 dark:hover:bg-error-600"
              >
                Confirmar Eliminación
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
