// En: src/app/(admin)/dashboard/documentos-legales/page.tsx
"use client";

import React, { useState, useEffect, useCallback, FormEvent, ChangeEvent } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Alert from "@/components/ui/alert/Alert";
import Badge from '@/components/ui/badge/Badge';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
// --- Importamos el ícono de descarga ---
import { PencilIcon, CheckCircleIcon, TrashBinIcon, PlusIcon, DownloadIcon } from "@/icons";

// 1. Interfaz actualizada
interface DocumentoLegal {
  id: number;
  titulo: string;
  descripcion: string; // <-- AÑADIDO
  tipo_documento: string;
  version: number;
  estado: 'borrador' | 'pendiente_firma' | 'finalizado';
  fecha_documento: string;
  firmado_por_contador_id: number | null;
  firmado_por_revisor_id: number | null;
  storage_path_original: string; // <-- AÑADIDO
}

// 2. Opciones para el Select
const tipoDocumentoOptions = [
  { value: 'contrato', label: 'Contrato' },
  { value: 'acta', label: 'Acta' },
  { value: 'informe_auditoria', label: 'Informe de Auditoría' },
  { value: 'otro', label: 'Otro' },
];

export default function DocumentosLegalesPage() {
  const [documentos, setDocumentos] = useState<DocumentoLegal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  const [selectedDoc, setSelectedDoc] = useState<DocumentoLegal | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Modales
  const { isOpen: isSignOpen, openModal: openSignModal, closeModal: closeSignModal } = useModal();
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isUploadOpen, openModal: openUploadModal, closeModal: closeUploadModal } = useModal();

  const [modalError, setModalError] = useState<string | null>(null);
  const [newDocumentType, setNewDocumentType] = useState<string>('contrato'); // State for the new document type

  // Carga de datos
  const fetchDocumentos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/documentos-legales`, { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar los documentos.');
      const { data } = await res.json();

      const formattedData = data.map((d: DocumentoLegal) => ({
        ...d,
        fecha_documento: new Date(d.fecha_documento).toISOString().split('T')[0],
      }));
      setDocumentos(formattedData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  // --- Manejadores de Acciones ---

  // --- FUNCIÓN DE DESCARGA CORREGIDA ---
  const handleDownload = async (docId: number, storagePath: string) => {
    setIsProcessing(docId); // Usamos 'isProcessing' para mostrar feedback
    setError(null);
    try {
      const res = await fetch(`/api/documentos-legales/${docId}/descargar`);

      if (!res.ok) {
        // Si la respuesta no es OK, leemos el JSON del error
        const errData = await res.json();
        throw new Error(errData.message || 'Error al descargar el archivo.');
      }

      // Si la respuesta es OK, procesamos el archivo (blob)
      const blob = await res.blob();

      // --- CORRECCIÓN ---
      // 'path.sep' no existe en el navegador. Usamos '/' que es el separador estándar
      // para las rutas de almacenamiento.
      const filename = storagePath.split('/').pop() || 'documento';

      // Creamos un link temporal para forzar la descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err)); // Mostramos el error en la alerta principal
    } finally {
      setIsProcessing(null);
    }
  };


  // SUBIR
  const handleOpenUpload = () => {
    setSelectedDoc(null);
    setSelectedFile(null);
    setModalError(null);
    setNewDocumentType('contrato'); // Reset to default when opening modal
    openUploadModal();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setModalError("Debe seleccionar un archivo para subir.");
      return;
    }

    setIsProcessing(-1);
    setModalError(null);
    const formData = new FormData(event.currentTarget);
    formData.append('file', selectedFile);
    // Ensure newDocumentType is sent with the form data
    formData.set('tipo_documento', newDocumentType);

    try {
      const res = await fetch(`/api/documentos-legales`, {
        method: 'POST',
        body: formData,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);

      closeUploadModal();
      fetchDocumentos();
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(null);
    }
  };

  // EDITAR
  const handleOpenEdit = (doc: DocumentoLegal) => {
    setSelectedDoc(doc);
    setModalError(null);
    openEditModal();
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDoc) return;
    setIsProcessing(selectedDoc.id);
    setModalError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string,
      fecha_documento: formData.get('fecha_documento') as string,
    };

    try {
      const res = await fetch(`/api/documentos-legales/${selectedDoc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);

      closeEditModal();
      fetchDocumentos();
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(null);
    }
  };

  // ELIMINAR
  const handleOpenDelete = (doc: DocumentoLegal) => {
    setSelectedDoc(doc);
    setModalError(null);
    openDeleteModal();
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;
    setIsProcessing(selectedDoc.id);
    setModalError(null);

    try {
      const res = await fetch(`/api/documentos-legales/${selectedDoc.id}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);

      closeDeleteModal();
      fetchDocumentos();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      closeDeleteModal();
    } finally {
      setIsProcessing(null);
    }
  };

  // SOLICITAR FIRMAS
  const handleRequestSignatures = async (docId: number) => {
    setIsProcessing(docId);
    setError(null);
    try {
      const res = await fetch(`/api/documentos-legales/${docId}/solicitar-firmas`, {
        method: 'POST',
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);
      fetchDocumentos();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(null);
    }
  };

  // GESTIONAR FIRMAS (MODAL)
  const handleOpenSignModal = (doc: DocumentoLegal) => {
    setSelectedDoc(doc);
    setModalError(null);
    openSignModal();
  };

  const simularFirmaExterna = async (): Promise<{ hash_firma_externa: string, storage_path_firmado: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      hash_firma_externa: `firma_simulada_${Date.now()}`,
      storage_path_firmado: `s3://bucket/docs/doc_${selectedDoc?.id}_firmado.pdf`
    };
  };

  const handleConfirmSignature = async (rol: 'contador' | 'revisor') => {
    if (!selectedDoc) return;
    setIsProcessing(selectedDoc.id);
    setModalError(null);

    try {
      const { hash_firma_externa, storage_path_firmado } = await simularFirmaExterna();
      const res = await fetch(`/api/documentos-legales/${selectedDoc.id}/firmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rol_firma: rol,
          hash_firma_externa: hash_firma_externa,
          storage_path_firmado: storage_path_firmado
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al registrar la firma.');
      }

      closeSignModal();
      fetchDocumentos();

    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessing(null);
    }
  };

  // --- Helpers ---
  const getEstadoColor = (estado: DocumentoLegal['estado']): "success" | "warning" | "info" => {
    if (estado === 'finalizado') return 'success';
    if (estado === 'pendiente_firma') return 'warning';
    return 'info'; // borrador
  };

  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";
  const isUploading = isProcessing === -1;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <PageBreadcrumb pageTitle="Gestión Documental Legal (WORM)" />
        <Button
          size="sm"
          variant="primary"
          onClick={handleOpenUpload}
          startIcon={<PlusIcon className="w-4 h-4" />}
          disabled={isUploading}
        >
          Subir Nuevo Documento
        </Button>
      </div>

      {/* --- CORRECCIÓN 1: Quitado 'onClose' del Alert --- */}
      {error && !isLoading && !isEditOpen && !isDeleteOpen && !isSignOpen && (
        <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>
      )}

      {/* --- Tabla de Documentos --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-10">Cargando documentos...</p>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  {/* --- CAMBIO: Título ahora es "Documento" --- */}
                  <TableCell isHeader className={baseHeaderClasses}>Documento</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Tipo</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Versión</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Fecha Doc.</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Estado</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Firmas</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {documentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">No se encontraron documentos.</TableCell>
                  </TableRow>
                ) : documentos.map((doc) => (
                  <TableRow key={doc.id}>
                    {/* --- CAMBIO: Celda de Título y Descripción --- */}
                    <TableCell className={baseCellClasses} style={{ minWidth: '250px' }}>
                      <span className="font-medium text-gray-800 dark:text-white">{doc.titulo}</span>
                      <p className="text-xs text-gray-500 mt-1 truncate" title={doc.descripcion}>
                        {doc.descripcion || 'Sin descripción'}
                      </p>
                    </TableCell>
                    <TableCell className={baseCellClasses}>{doc.tipo_documento.replace('_', ' ')}</TableCell>
                    <TableCell className={baseCellClasses}>v{doc.version}</TableCell>
                    {/* --- CORRECCIÓN 2: Añadido { timeZone: 'UTC' } --- */}
                    <TableCell className={baseCellClasses}>{new Date(doc.fecha_documento).toLocaleDateString('es-CO', { timeZone: 'UTC' })}</TableCell>
                    <TableCell className={baseCellClasses}>
                      <Badge size="sm" color={getEstadoColor(doc.estado)}>
                        {doc.estado.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className={baseCellClasses}>
                      <div className="flex gap-2">
                        {doc.firmado_por_contador_id && <Badge size="sm" color="success">Contador</Badge>}
                        {doc.firmado_por_revisor_id && <Badge size="sm" color="success">Revisor</Badge>}
                      </div>
                    </TableCell>
                    {/* --- CAMBIO: Celda de Acciones con botón Descargar --- */}
                    <TableCell className={baseCellClasses} style={{ minWidth: '320px' }}>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(doc.id, doc.storage_path_original)}
                          disabled={isProcessing === doc.id || isUploading}
                          startIcon={<DownloadIcon className="w-4 h-4" />}
                        >
                          {isProcessing === doc.id ? '...' : 'Descargar'}
                        </Button>

                        {doc.estado === 'borrador' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleOpenEdit(doc)} disabled={isProcessing === doc.id || isUploading}>
                              Editar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleOpenDelete(doc)} disabled={isProcessing === doc.id || isUploading}
                              className="hover:bg-error-50 hover:border-error-300 hover:text-error-600 dark:hover:bg-error-500/15 dark:hover:text-error-500 dark:hover:border-error-500/30">
                              Eliminar
                            </Button>
                            <Button size="sm" variant="primary" onClick={() => handleRequestSignatures(doc.id)} disabled={isProcessing === doc.id || isUploading}>
                              Solicitar Firmas
                            </Button>
                          </>
                        )}
                        {doc.estado === 'pendiente_firma' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenSignModal(doc)}
                            disabled={isProcessing === doc.id || isUploading}
                            startIcon={<PencilIcon className="w-4 h-4" />}
                          >
                            Gestionar Firmas
                          </Button>
                        )}
                        {doc.estado === 'finalizado' && (
                          <Button size="sm" variant="outline" disabled>
                            Verificado (WORM)
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* --- MODAL GESTIONAR FIRMAS --- */}
      {selectedDoc && (
        <Modal
          isOpen={isSignOpen}
          onClose={closeSignModal}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <div className="text-center">
            <span className="inline-block p-3 text-brand-500 bg-brand-50 rounded-full dark:bg-brand-500/10 mb-4">
              <PencilIcon className="w-8 h-8" />
            </span>
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Gestionar Firmas
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Documento: <strong className="text-gray-700 dark:text-gray-200">{selectedDoc.titulo} (v{selectedDoc.version})</strong>
            </p>

            {modalError && <Alert variant="error" title="Error" message={modalError} className="mb-4 text-left" />}

            <div className="space-y-4">
              <Button
                size="md"
                variant={selectedDoc.firmado_por_contador_id ? "outline" : "primary"}
                onClick={() => handleConfirmSignature('contador')}
                disabled={isProcessing === selectedDoc.id || !!selectedDoc.firmado_por_contador_id || isUploading}
                className="w-full"
                startIcon={selectedDoc.firmado_por_contador_id ? <CheckCircleIcon /> : undefined}
              >
                {isProcessing === selectedDoc.id ? 'Procesando...' : (selectedDoc.firmado_por_contador_id ? 'Firmado por Contador' : 'Firmar como Contador')}
              </Button>

              <Button
                size="md"
                variant={selectedDoc.firmado_por_revisor_id ? "outline" : "primary"}
                onClick={() => handleConfirmSignature('revisor')}
                disabled={isProcessing === selectedDoc.id || !!selectedDoc.firmado_por_revisor_id || isUploading}
                className="w-full"
                startIcon={selectedDoc.firmado_por_revisor_id ? <CheckCircleIcon /> : undefined}
              >
                {isProcessing === selectedDoc.id ? 'Procesando...' : (selectedDoc.firmado_por_revisor_id ? 'Firmado por Revisor' : 'Firmar como Revisor Fiscal')}
              </Button>
            </div>

            <div className="flex items-center justify-center w-full gap-3 mt-8">
              <Button size="sm" variant="outline" onClick={closeSignModal} type="button" disabled={isProcessing === selectedDoc.id || isUploading}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- MODAL EDITAR --- */}
      {selectedDoc && (
        <Modal
          isOpen={isEditOpen}
          onClose={closeEditModal}
          className="max-w-[700px] p-5 lg:p-10"
        >
          <form onSubmit={handleUpdate} className="flex flex-col">
            <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Documento (Borrador)
            </h4>
            {modalError && <Alert variant="error" title="Error" message={modalError} className="mb-4" />}
            <div className="px-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '60vh' }}>
              <div className="grid grid-cols-1 gap-y-5">
                <div>
                  <Label htmlFor="titulo-editar">Título</Label>
                  <Input type="text" id="titulo-editar" name="titulo" defaultValue={selectedDoc.titulo} required />
                </div>
                <div>
                  <Label htmlFor="fecha-editar">Fecha del Documento</Label>
                  <Input type="date" id="fecha-editar" name="fecha_documento" defaultValue={selectedDoc.fecha_documento} required />
                </div>
                <div>
                  <Label htmlFor="desc-editar">Descripción</Label>
                  <TextArea id="desc-editar" name="descripcion" rows={4} defaultValue={selectedDoc.descripcion} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeEditModal} type="button" disabled={isProcessing === selectedDoc.id || isUploading}>
                Cancelar
              </Button>
              <Button size="sm" type="submit" disabled={isProcessing === selectedDoc.id || isUploading}>
                {isProcessing === selectedDoc.id ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- MODAL ELIMINAR --- */}
      {selectedDoc && (
        <Modal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          className="max-w-[500px] p-5 lg:p-10"
        >
          <div className="text-center">
            <span className="inline-block p-3 text-error-500 bg-error-50 rounded-full dark:bg-error-500/10 mb-4">
              <TrashBinIcon className="w-8 h-8" />
            </span>
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Confirmar Eliminación
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Está seguro de que desea eliminar el borrador &quot;{selectedDoc.titulo}&quot;? Esta acción no se puede deshacer.
            </p>
            {modalError && <Alert variant="error" title="Error" message={modalError} className="mt-4 text-left" />}
            <div className="flex items-center justify-center w-full gap-3 mt-8">
              <Button size="sm" variant="outline" onClick={closeDeleteModal} type="button" disabled={isProcessing === selectedDoc.id || isUploading}>
                Cancelar
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleDelete}
                type="button"
                className="bg-error-500 hover:bg-error-600 dark:bg-error-500 dark:hover:bg-error-600"
                disabled={isProcessing === selectedDoc.id || isUploading}
              >
                {isProcessing === selectedDoc.id ? 'Eliminando...' : 'Confirmar Eliminación'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- MODAL SUBIR DOCUMENTO --- */}
      <Modal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        className="max-w-[700px] p-5 lg:p-10"
      >
        <form onSubmit={handleUploadSubmit} className="flex flex-col">
          <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Subir Nuevo Documento
          </h4>
          {modalError && <Alert variant="error" title="Error" message={modalError} className="mb-4" />}
          <div className="px-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '60vh' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Label htmlFor="titulo-subir">Título del Documento</Label>
                <Input type="text" id="titulo-subir" name="titulo" placeholder="Ej: Contrato Cliente Alfa S.A.S 2025" required />
              </div>
              <div>
                <Label htmlFor="tipo-subir">Tipo de Documento</Label>
                <Select
                  id="tipo-subir"
                  name="tipo_documento"
                  value={newDocumentType}
                  onChange={setNewDocumentType}
                  options={tipoDocumentoOptions}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha-subir">Fecha del Documento</Label>
                <Input type="date" id="fecha-subir" name="fecha_documento" defaultValue={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="desc-subir">Descripción (Opcional)</Label>
                <TextArea id="desc-subir" name="descripcion" rows={3} placeholder="Breve descripción del contenido del documento..." />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="file-subir">Archivo (PDF, DOCX)</Label>
                <Input
                  type="file"
                  id="file-subir"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx" // Permitimos más tipos
                  required
                />
                {selectedFile && <p className="text-xs text-gray-500 mt-1">Archivo seleccionado: {selectedFile.name}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeUploadModal} type="button" disabled={isUploading}>
              Cancelar
            </Button>
            <Button size="sm" type="submit" disabled={isUploading}>
              {isUploading ? 'Procesando...' : 'Subir y Crear Borrador'}
            </Button>
          </div>
        </form>
      </Modal>

    </>
  );
}
