"use client";

import React, { useState, useEffect } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from '@/components/ui/badge/Badge';
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/alert/Alert";

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

export default function AuditoriaInternaPage() {
  const [riesgos, setRiesgos] = useState<RiesgoContable[]>([]);
  const [selectedRiesgo, setSelectedRiesgo] = useState<RiesgoContable | null>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(true);

  // Cargar datos
  const fetchRiesgos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auditoria-interna/riesgos');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRiesgos(data);
      } else {
        console.error("API did not return an array", JSON.stringify(data, null, 2));
        setRiesgos([]);
      }
    } catch (error) {
      console.error("Failed to fetch riesgos", error);
      setRiesgos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiesgos();
  }, []);

  // Manejar validación del Revisor Fiscal
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

  // Estilos de tabla
  const headerClass = "py-3 px-4 text-left font-medium text-gray-500 dark:text-gray-400";
  const cellClass = "py-3 px-4 text-sm text-gray-500 dark:text-gray-400";

  return (
    <>
      <PageBreadcrumb pageTitle="Auditoría Interna & IA Compliance" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Mapa de Riesgos NIIF Detectados
        </h3>

        {loading ? <p>Cargando análisis de IA...</p> : (
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
              </TableBody>
            </Table>
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
