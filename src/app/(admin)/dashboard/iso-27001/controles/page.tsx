'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { IsoControl, IsoControlInput, IsoControlEstado } from '@/types/iso-27001';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Assuming a client-side fetch wrapper for API calls
// In a real app, you might use a library like SWR or React Query,
// or a custom hook that calls the API route.
async function fetchControles(): Promise<IsoControl[]> {
  const res = await fetch('/api/iso/controles');
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch controls');
  }
  return res.json();
}

async function updateControlApi(id: number, data: Partial<IsoControlInput>): Promise<IsoControl> {
  const res = await fetch('/api/iso/controles', {
    method: 'POST', // Using POST for update as defined in route.ts
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to update control');
  }
  return res.json();
}

const estadoImplementacionOptions: IsoControlEstado[] = [
  'NO_INICIADO',
  'EN_PROCESO',
  'IMPLEMENTADO',
  'NO_APLICA',
];

export default function IsoControlesPage() {
  const [controls, setControls] = useState<IsoControl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEstado, setFilterEstado] = useState<IsoControlEstado | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingControl, setEditingControl] = useState<IsoControl | null>(null);
  const [formState, setFormState] = useState<Partial<IsoControlInput>>({});

  useEffect(() => {
    async function loadControles() {
      try {
        const data = await fetchControles();
        setControls(data);
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
    loadControles();
  }, []);

  const filteredControls = useMemo(() => {
    if (filterEstado === 'all') {
      return controls;
    }
    return controls.filter(control => control.estadoImplementacion === filterEstado);
  }, [controls, filterEstado]);

  const handleEditClick = (control: IsoControl) => {
    setEditingControl(control);
    setFormState({
      codigo: control.codigo,
      nombre: control.nombre,
      descripcion: control.descripcion,
      esAplicable: control.esAplicable,
      justificacionExclusion: control.justificacionExclusion,
      estadoImplementacion: control.estadoImplementacion,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingControl(null);
    setFormState({});
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingControl) return;

    try {
      setLoading(true);
      const updatedControl = await updateControlApi(editingControl.id, formState);
      setControls(prev =>
        prev.map(c => (c.id === updatedControl.id ? updatedControl : c))
      );
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

  const handleExportSoA = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Declaración de Aplicabilidad (SoA) - ISO 27001', 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table Columns
    const tableColumn = ['Código', 'Nombre', 'Aplicable', 'Estado', 'Justificación'];

    // Table Rows
    const tableRows = controls.map((control) => [
      control.codigo,
      control.nombre,
      control.esAplicable ? 'SÍ' : 'NO',
      control.estadoImplementacion,
      control.justificacionExclusion || '',
    ]);

    // Generate Table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185] }, // Brand color approximation
      columnStyles: {
        0: { cellWidth: 25 }, // Código
        1: { cellWidth: 60 }, // Nombre
        2: { cellWidth: 20 }, // Aplicable
        3: { cellWidth: 35 }, // Estado
        4: { cellWidth: 'auto' }, // Justificación
      },
    });

    // Save PDF
    doc.save('soa-iso-27001.pdf');
  };

  if (loading) return <p>Cargando controles...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Controles ISO 27001</h1>
        <div className="flex items-center gap-4">
          <Button size="sm" variant="primary" onClick={handleExportSoA}>
            Exportar SoA
          </Button>
          {/* Filter by Estado de Implementación */}
          <div className="relative z-20 w-full rounded border border-stroke bg-transparent py-3 pl-6 pr-12 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white">
            <select
              name="filterEstado"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as IsoControlEstado | 'all')}
              className="relative z-20 w-full appearance-none bg-transparent outline-none"
            >
              <option value="all">Todos los Estados</option>
              {estadoImplementacionOptions.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
            <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/ dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]"> {/* Adjusted min-width */}
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Código</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nombre</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Estado de Implementación</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Es Aplicable</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Acciones</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredControls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{control.codigo}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-800 dark:text-white/90">{control.nombre}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <Badge
                        size="sm"
                        color={
                          control.estadoImplementacion === 'IMPLEMENTADO'
                            ? 'success'
                            : control.estadoImplementacion === 'EN_PROCESO'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {control.estadoImplementacion}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <input
                        type="checkbox"
                        checked={control.esAplicable}
                        readOnly
                        className="form-checkbox h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-brand-500"
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(control)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {isModalOpen && editingControl && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} className="max-w-2xl">
          <ModalHeader title="Editar Control ISO" onClose={handleModalClose} />
          <ModalBody>
            <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Código</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formState.codigo || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formState.nombre || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formState.descripcion || ''}
                onChange={handleFormChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="estadoImplementacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado de Implementación</label>
              <select
                id="estadoImplementacion"
                name="estadoImplementacion"
                value={formState.estadoImplementacion || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {estadoImplementacionOptions.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="esAplicable"
                name="esAplicable"
                checked={formState.esAplicable ?? false}
                onChange={(e) => setFormState(prev => ({ ...prev, esAplicable: e.target.checked }))}
                className="form-checkbox h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-brand-500"
              />
              <label htmlFor="esAplicable" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Es Aplicable</label>
            </div>
            {formState.esAplicable === false && (
                <div className="mb-4">
                    <label htmlFor="justificacionExclusion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Justificación de Exclusión</label>
                    <textarea
                        id="justificacionExclusion"
                        name="justificacionExclusion"
                        value={formState.justificacionExclusion || ''}
                        onChange={handleFormChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    ></textarea>
                </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Guardar Cambios
              </Button>
            </div>
          </form>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
