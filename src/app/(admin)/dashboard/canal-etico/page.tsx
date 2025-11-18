// En: src/app/(admin)/dashboard/canal-etico/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import Badge from '@/components/ui/badge/Badge';
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import FileInput from '@/components/form/input/FileInput';
import { DownloadIcon } from '@/icons';

// ... (Interfaces: CasoEtico, CasoEticoDetalle, ActaResolucion)
// 1. Interfaz para la tabla (ligera)
interface CasoEtico {
  id: number;
  caso_uuid: string;
  titulo: string;
  tipo_irregularidad: string;
  estado: 'abierto' | 'en_investigacion' | 'resuelto' | 'cerrado';
  fecha_creacion: string;
}

// --- NUEVA INTERFAZ PARA DETALLES ---
// Hereda de CasoEtico y añade los campos completos
interface CasoEticoDetalle extends CasoEtico {
  descripcion_irregularidad: string;
  archivos_evidencia: string[]; // Esto será un array de rutas de archivo
}

// 2. Interfaz para el Acta (Modal de Resolución)
interface ActaResolucion {
  titulo_acta: string;
  descripcion_acta: string;
}

const tiposIrregularidad = [
  { value: 'fraude', label: 'Fraude' },
  { value: 'acoso', label: 'Acoso' },
  { value: 'conflicto_interes', label: 'Conflicto de Interés' },
  { value: 'soborno', label: 'Soborno' },
  { value: 'otro', label: 'Otro' },
];


// Función de ayuda
const getEstadoColor = (estado: CasoEtico['estado']): "success" | "warning" | "info" => {
// ... (sin cambios)
  if (estado === 'resuelto' || estado === 'cerrado') return 'success';
  if (estado === 'en_investigacion') return 'warning';
  return 'info'; // estado 'abierto'
};

export default function CanalEticoPage() {
  // ... (Estados existentes: casos, isLoading, error)
  const [casos, setCasos] = useState<CasoEtico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... (Estados Modal Resolver)
  const [selectedCaso, setSelectedCaso] = useState<CasoEtico | null>(null);
  const { isOpen: isResolverOpen, openModal: openResolverModal, closeModal: closeResolverModal } = useModal();
  const [isProcessingResolucion, setIsProcessingResolucion] = useState(false);
  const [modalErrorResolucion, setModalErrorResolucion] = useState<string | null>(null);
  const [casoDetalle, setCasoDetalle] = useState<CasoEticoDetalle | null>(null);
  const [isResolverLoadingDetails, setIsResolverLoadingDetails] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // ... (Estados Modal Crear)
  const { isOpen: isCrearOpen, openModal: openCrearModal, closeModal: closeCrearModal } = useModal();
  const [isProcessingCreacion, setIsProcessingCreacion] = useState(false);
  const [modalErrorCreacion, setModalErrorCreacion] = useState<string | null>(null);
  const [archivosEvidencia, setArchivosEvidencia] = useState<FileList | null>(null);


  // --- fetchCasos (sin cambios) ---
  const fetchCasos = useCallback(async () => {
    // ... (código existente)
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/canal-etico/gestion`, { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar los casos del canal ético.');
      const { data } = await res.json();

      const formattedData = data.map((d: any) => ({
        ...d,
        fecha_creacion: new Date(d.fecha_creacion).toLocaleString('es-CO'),
      }));
      setCasos(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCasos();
  }, [fetchCasos]);

  // --- customCloseResolverModal (sin cambios) ---
  const customCloseResolverModal = () => {
    // ... (código existente)
    closeResolverModal();
    setSelectedCaso(null);
    setCasoDetalle(null);
    setModalErrorResolucion(null);
    setIsProcessingResolucion(false);
    setIsResolverLoadingDetails(false);
    setIsDownloading(null);
  };

  // --- handleOpenResolverModal (sin cambios) ---
  const handleOpenResolverModal = async (caso: CasoEtico) => {
    // ... (código existente)
    setSelectedCaso(caso);
    setModalErrorResolucion(null);
    setIsResolverLoadingDetails(true);
    openResolverModal();

    try {
      const res = await fetch(`/api/canal-etico/gestion/${caso.id}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'No se pudieron cargar los detalles del caso.');
      }
      const data: CasoEticoDetalle = await res.json();
      setCasoDetalle(data);
    } catch (err: any) {
      setModalErrorResolucion(err.message);
    } finally {
      setIsResolverLoadingDetails(false);
    }
  };

  // --- FUNCIÓN ACTUALIZADA: handleConfirmResolucion ---
  const handleConfirmResolucion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCaso) return;

    setIsProcessingResolucion(true);
    setModalErrorResolucion(null);

    const formData = new FormData(event.currentTarget);

    // 1. Solo enviamos los datos del formulario
    const actaData = {
      titulo_acta: formData.get('titulo_acta') as string,
      descripcion_acta: formData.get('descripcion_acta') as string,
    };

    try {
      // 2. Ya no simulamos el PDF aquí. El backend lo hace.
      const res = await fetch(`/api/canal-etico/gestion/${selectedCaso.id}/resolver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actaData), // Solo enviamos el título y la desc
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Error al resolver el caso.');
      }

      customCloseResolverModal();
      fetchCasos(); // Recargar la tabla

    } catch (err: any) {
      setModalErrorResolucion(err.message);
    } finally {
      setIsProcessingResolucion(false);
    }
  };

  // --- handleCrearCaso (sin cambios) ---
  const handleCrearCaso = async (event: React.FormEvent<HTMLFormElement>) => {
    // ... (código existente)
    event.preventDefault();
    setIsProcessingCreacion(true);
    setModalErrorCreacion(null);
    const formData = new FormData(event.currentTarget);
    formData.append('tenant_id', 'default_tenant');
    formData.append('user_id', 'null');
    if (archivosEvidencia) {
      for (let i = 0; i < archivosEvidencia.length; i++) {
        formData.append('evidencia', archivosEvidencia[i]);
      }
    }
    try {
      const res = await fetch(`/api/canal-etico/casos`, {
        method: 'POST',
        body: formData,
      });
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Error al crear el caso.');
      }
      closeCrearModal();
      setArchivosEvidencia(null);
      fetchCasos();
    } catch (err: any) {
      setModalErrorCreacion(err.message);
    } finally {
      setIsProcessingCreacion(false);
    }
  };

  // --- handleDownloadEvidencia (sin cambios) ---
  const handleDownloadEvidencia = async (filePath: string) => {
    // ... (código existente)
    setIsDownloading(filePath);
    setModalErrorResolucion(null);
    try {
      const res = await fetch(`/api/canal-etico/descargar?file=${encodeURIComponent(filePath)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al descargar.');
      }

      const blob = await res.blob();
      const filename = filePath.split('/').pop() || 'evidencia';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      setModalErrorResolucion(err.message);
    } finally {
      setIsDownloading(null);
    }
  };


  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";

  return (
    <>
      {/* ... (Breadcrumb, Botón Crear, Alerta Error, Tabla de Casos... todo sin cambios) */}
      <PageBreadcrumb pageTitle="Canal Ético y Transparencia" />

      <div className="flex justify-end mb-4">
        <Button
          variant="primary"
          onClick={openCrearModal}
        >
          Reportar Nuevo Caso
        </Button>
      </div>

      {error && !isLoading && (
        <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-10">Cargando casos...</p>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell isHeader className={baseHeaderClasses}>Título</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Tipo</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Fecha Reporte</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Estado</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {casos.map((caso) => (
                  <TableRow key={caso.id}>
                    <TableCell className={baseCellClasses}>{caso.titulo}</TableCell>
                    <TableCell className={baseCellClasses}>{caso.tipo_irregularidad}</TableCell>
                    <TableCell className={baseCellClasses}>{caso.fecha_creacion}</TableCell>
                    <TableCell className={baseCellClasses}>
                      <Badge size="sm" color={getEstadoColor(caso.estado)}>
                        {caso.estado.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className={baseCellClasses}>
                      {caso.estado !== 'resuelto' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenResolverModal(caso)}
                        >
                          Resolver y Generar Acta
                        </Button>
                      )}
                      {caso.estado === 'resuelto' && (
                        <Button size="sm" variant="outline" disabled>
                          Acta en WORM
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* --- Modal para RESOLVER CASO (sin cambios en el JSX, solo en la lógica de envío) --- */}
      {selectedCaso && (
        <Modal
          isOpen={isResolverOpen}
          onClose={customCloseResolverModal}
          className="max-w-[700px] p-5 lg:p-10"
        >
          <form onSubmit={handleConfirmResolucion} className="flex flex-col">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Resolver Caso y Generar Acta
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Caso: <strong className="text-gray-700 dark:text-gray-200">{selectedCaso.titulo}</strong>
            </p>

            {modalErrorResolucion && <Alert variant="error" title="Error" message={modalErrorResolucion} className="mb-4" />}

            <div className="px-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '60vh' }}>

              {isResolverLoadingDetails ? (
                <div className="py-8 text-center text-gray-500">Cargando detalles del caso...</div>
              ) : casoDetalle ? (
                <fieldset className="mb-6 p-4 border rounded-lg dark:border-gray-700 space-y-4">
                  <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">Detalles del Reporte</legend>

                  <div>
                    <Label>Descripción de la Irregularidad</Label>
                    <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-3 rounded-md whitespace-pre-wrap">
                      {casoDetalle.descripcion_irregularidad}
                    </p>
                  </div>

                  <div>
                    <Label>Evidencia Adjunta</Label>
                    {casoDetalle.archivos_evidencia.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {casoDetalle.archivos_evidencia.map((filePath, index) => {
                          const isDownloadingThis = isDownloading === filePath;
                          const friendlyName = `Descargar Evidencia ${index + 1}`;
                          return (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadEvidencia(filePath)}
                              disabled={isDownloadingThis}
                              startIcon={<DownloadIcon className="w-4 h-4" />}
                            >
                              {isDownloadingThis ? 'Descargando...' : friendlyName}
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No se adjuntaron archivos de evidencia.</p>
                    )}
                  </div>
                </fieldset>
              ) : null}


              <div className="grid grid-cols-1 gap-y-5">
                <div>
                  <Label htmlFor="titulo_acta">Título del Acta de Resolución</Label>
                  <Input type="text" id="titulo_acta" name="titulo_acta" placeholder="Ej: Acta de Resolución Caso ET-001" required />
                </div>
                <div>
                  <Label htmlFor="descripcion_acta">Conclusión / Descripción del Acta</Label>
                  <TextArea id="descripcion_acta" name="descripcion_acta" rows={6} placeholder="Detalle de los hallazgos, decisiones tomadas y cierre del caso. Este texto se incluirá en el documento legal." required />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 px-2">
              Al confirmar, se generará un documento PDF inmutable y se enviará al módulo de Gestión Documental (WORM) para la firma conjunta del Contador y Revisor Fiscal.
            </p>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={customCloseResolverModal} type="button" disabled={isProcessingResolucion}>
                Cancelar
              </Button>
              <Button size="sm" type="submit" disabled={isProcessingResolucion || isResolverLoadingDetails}>
                {isProcessingResolucion ? 'Procesando...' : 'Confirmar y Enviar a Firmas'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- MODAL PARA CREAR CASO (sin cambios) --- */}
      <Modal
        isOpen={isCrearOpen}
        onClose={closeCrearModal}
        className="max-w-[700px] p-5 lg:p-10"
      >
        <form onSubmit={handleCrearCaso} className="flex flex-col">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Reportar Nuevo Caso
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Complete la información para registrar una nueva irregularidad.
          </p>

          {modalErrorCreacion && <Alert variant="error" title="Error" message={modalErrorCreacion} className="mb-4" />}

          <div className="px-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '60vh' }}>
            <div className="grid grid-cols-1 gap-y-5">
              <div>
                <Label htmlFor="titulo">Título del Caso</Label>
                <Input type="text" id="titulo" name="titulo" placeholder="Ej: Posible conflicto de interés en..." required />
              </div>

              <div>
                <Label htmlFor="tipo_irregularidad">Tipo de Irregularidad</Label>
                <Select
                  id="tipo_irregularidad"
                  name="tipo_irregularidad"
                  required
                  options={tiposIrregularidad}
                  placeholder="Seleccione un tipo..."
                  onChange={() => {}}
                  defaultValue=""
                />
              </div>

              <div>
                <Label htmlFor="descripcion_irregularidad">Descripción Detallada</Label>
                <TextArea id="descripcion_irregularidad" name="descripcion_irregularidad" rows={6} placeholder="Describa la situación en detalle. Sea lo más específico posible." required />
              </div>

              <div>
                <Label htmlFor="evidencia">Archivos de Evidencia (Opcional)</Label>
                <FileInput
                  id="evidencia"
                  name="evidencia"
                  // @ts-ignore
                  multiple={true}
                  onChange={(e) => setArchivosEvidencia(e.target.files)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Puede adjuntar imágenes, PDFs o documentos como evidencia.
                </p>
              </div>

            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 px-2">
            Este reporte será gestionado por el comité de ética.
          </p>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={() => { closeCrearModal(); setArchivosEvidencia(null); }} type="button" disabled={isProcessingCreacion}>
              Cancelar
            </Button>
            <Button size="sm" type="submit" disabled={isProcessingCreacion}>
              {isProcessingCreacion ? 'Enviando...' : 'Reportar Caso'}
            </Button>
          </div>
        </form>
      </Modal>
      {/* --- FIN DE NUEVO MODAL --- */}

    </>
  );
}
