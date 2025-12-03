"use client";

import React, { useState, useEffect, useCallback, FormEvent, useMemo } from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Alert from "@/components/ui/alert/Alert";
import Badge from '@/components/ui/badge/Badge';
import Pagination from '@/components/tables/Pagination';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Switch from '@/components/form/switch/Switch';
import { PlusIcon, TrashBinIcon } from "@/icons";

// --- INTERFACES (sin cambios) ---
interface Factura {
  id: number;
  tenant_id: string;
  consecutivo: string;
  fecha_emision: string;
  cliente_razon_social: string;
  total_con_impuestos: number;
  estado_dian: 'borrador' | 'generada' | 'enviada_dian' | 'aprobada' | 'aprobada_con_notificacion' | 'rechazada';
  es_habilitacion: boolean;
  cufe: string | null;
}
interface ItemFactura {
  id: number;
  descripcion: string;
  cantidad: number;
  valor_unitario: number;
  iva_tasa: number;
  total_iva: number;
  total_con_iva: number;
}
interface Totales {
  subtotal: number;
  impuestos: number;
  total: number;
}
// ---

const ITEMS_PER_PAGE = 10;

// Opciones de Tipo de Documento (DIAN)
const tipoDocumentoOptions = [
  { value: '13', label: 'CC (Cédula de Ciudadanía)' },
  { value: '31', label: 'NIT (Número de Identificación Tributaria)' },
  { value: '41', label: 'PA (Pasaporte)' },
  { value: '11', label: 'RC (Registro Civil)' },
  { value: '12', label: 'TI (Tarjeta de Identidad)' },
  { value: '22', label: 'CE (Cédula de Extranjería)' },
];

export default function FacturacionPage() {
  // --- Estados de la Página ---
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Estados de Modales ---
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const { isOpen: isDetailOpen, openModal: openDetailModal, closeModal: closeDetailModal } = useModal();
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [xmlData, setXmlData] = useState<{ ubl: string | null, dian: string | null }>({ ubl: null, dian: null });

  // --- Estados del Formulario de Creación ---
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [esHabilitacion, setEsHabilitacion] = useState(true);

  // --- Estados para el formulario de Ítems ---
  const [items, setItems] = useState<ItemFactura[]>([]);
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemValor, setNewItemValor] = useState<number | "">("");
  const [newItemIVATasa, setNewItemIVATasa] = useState<number>(19);

  // --- NUEVO: Estado para el envío a la DIAN ---
  const [isSending, setIsSending] = useState<number | null>(null); // Almacena el ID de la factura que se está enviando

  // --- Estados para Paginación (MOVIDOS AQUÍ) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --- Totales (Calculado automáticamente) ---
  const totales = useMemo((): Totales => {
    let subtotal = 0;
    let impuestos = 0;
    for (const item of items) {
      subtotal += item.cantidad * item.valor_unitario;
      impuestos += item.total_iva;
    }
    return {
      subtotal,
      impuestos,
      total: subtotal + impuestos,
    };
  }, [items]);

  // --- Carga de Datos (GET) ---
  const fetchFacturas = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: page.toString(), limit: ITEMS_PER_PAGE.toString() });

    try {
      const res = await fetch(`/api/facturacion/facturas?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo cargar las facturas. ¿Inició sesión?');
      }
      const { data, total } = await res.json();
      const formattedData = data.map((f: Factura) => ({
        ...f,
        fecha_emision: new Date(f.fecha_emision).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      }));
      setFacturas(formattedData);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar facturas';
      setError(errorMessage);
      setFacturas([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Estados para Paginación ---
  // (SE ELIMINAN DE AQUÍ)

  // --- Efecto para Cargar Datos ---
  useEffect(() => {
    fetchFacturas(currentPage);
  }, [currentPage, fetchFacturas]);

  // --- Limpiar formulario de ítems ---
  const clearNewItemFields = () => {
    setNewItemDesc("");
    setNewItemQty(1);
    setNewItemValor("");
    setNewItemIVATasa(19);
  };

  // --- Manejador para AÑADIR ÍTEM a la lista ---
  const handleAddItem = () => {
    // ... (sin cambios) ...
    const qty = Number(newItemQty);
    const valor = Number(newItemValor);
    const ivaTasa = Number(newItemIVATasa);

    if (!newItemDesc || qty <= 0 || valor <= 0) {
      setCreateError("Descripción, Cantidad (> 0) y Valor (> 0) son obligatorios para el ítem.");
      return;
    }
    setCreateError(null);

    const subtotalItem = qty * valor;
    const totalIVAItem = subtotalItem * (ivaTasa / 100);
    const totalConIVAItem = subtotalItem + totalIVAItem;

    const nuevoItem: ItemFactura = {
      id: Date.now(),
      descripcion: newItemDesc,
      cantidad: qty,
      valor_unitario: valor,
      iva_tasa: ivaTasa,
      total_iva: totalIVAItem,
      total_con_iva: totalConIVAItem,
    };

    setItems(prevItems => [...prevItems, nuevoItem]);
    clearNewItemFields();
  };

  // --- Manejador para QUITAR ÍTEM de la lista ---
  const handleRemoveItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // --- Manejadores de Modales ---
  const handleOpenCreate = () => {
    // ... (sin cambios) ...
    setCreateError(null);
    setCreateSuccess(null);
    setIsCreating(false);
    setEsHabilitacion(true);
    setItems([]);
    clearNewItemFields();
    openCreateModal();
  };

  const handleOpenDetail = async (factura: Factura) => {
    setSelectedFactura(factura);
    setIsDetailLoading(true); // <-- Inicia la carga
    setXmlData({ ubl: null, dian: null }); // Limpia datos previos
    openDetailModal(); // Abre el modal inmediatamente

    try {
      const res = await fetch(`/api/facturacion/facturas/${factura.id}`);
      if (!res.ok) {
        throw new Error('No se pudo cargar el detalle de la factura.');
      }
      const data = await res.json();
      setXmlData({
        ubl: data.xml_ubl_generado,
        dian: data.dian_xml_respuesta,
      });
    } catch (err: unknown) {
      // Muestra el error en la alerta principal de la página
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar detalle';
      setError(errorMessage);
      // Cierra el modal si falla la carga
      closeDetailModal();
    } finally {
      setIsDetailLoading(false); // <-- Termina la carga
    }
  };

  // --- Manejador para ENVIAR FORMULARIO DE CREACIÓN (POST) ---
  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // ... (sin cambios) ...
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (items.length === 0) {
      setCreateError("La factura debe tener al menos un ítem.");
      return;
    }

    setIsCreating(true);
    const formData = new FormData(event.currentTarget);
    const itemsParaAPI = items.map(item => ({
      descripcion: item.descripcion,
      cantidad: item.cantidad,
      valor_unitario: item.valor_unitario,
      iva_tasa: item.iva_tasa,
      total_iva: item.total_iva,
      total_con_iva: item.total_con_iva,
    }));

    const data = {
      consecutivo: formData.get('consecutivo') as string,
      cliente_tipo_documento: formData.get('cliente_tipo_documento') as string,
      cliente_documento: formData.get('cliente_documento') as string,
      cliente_razon_social: formData.get('cliente_razon_social') as string,
      cliente_email: formData.get('cliente_email') as string,
      fecha_vencimiento: formData.get('fecha_vencimiento') || null,
      es_habilitacion: esHabilitacion,
      total_sin_impuestos: totales.subtotal,
      total_impuestos: totales.impuestos,
      total_con_impuestos: totales.total,
      items_json: itemsParaAPI,
    };

    try {
      const res = await fetch('/api/facturacion/facturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Error al guardar el borrador.');

      // Trigger AI Governance Analysis
      try {
        await fetch('/api/ai-governance/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resData.data || data),
        });
      } catch (aiError) {
        console.error('Error triggering AI analysis:', aiError);
      }

      setCreateSuccess('Factura guardada como borrador con éxito.');
      (event.target as HTMLFormElement).reset();
      setItems([]);

      setTimeout(() => {
        closeCreateModal();
        fetchFacturas(1);
        setCurrentPage(1);
      }, 1500);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear factura';
      setCreateError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  // --- NUEVO: Manejador para ENVIAR A LA DIAN (Simulación) ---
  const handleEnviarDian = async (facturaId: number) => {
    setIsSending(facturaId); // Bloquea el botón de esta fila
    setError(null);

    try {
      const res = await fetch(`/api/facturacion/facturas/${facturaId}/enviar-dian`, {
        method: 'POST',
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Error al simular el envío.');
      }

      // Éxito: recargar la lista de facturas
      fetchFacturas(currentPage);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar a la DIAN';
      setError(errorMessage); // Muestra el error en la alerta de la página
    } finally {
      setIsSending(null); // Desbloquea el botón
    }
  };

  /**
   * INICIO: CAMBIOS SOLICITADOS
   * Helper genérico para descargar contenido como un archivo
   */
  const handleDownloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
     * Helper para SIMULAR la descarga de un PDF.
     * Genera un PDF básico válido con datos de la factura.
     */
    const handleDownloadPDF = (factura: Factura | null) => {
      if (!factura) return;

      // Generar un PDF básico válido con formato simple
      const pdfContent = `%PDF-1.4
  1 0 obj
  <<
  /Type /Catalog
  /Pages 2 0 R
  >>
  endobj
  2 0 obj
  <<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
  >>
  endobj
  3 0 obj
  <<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Contents 4 0 R
  /Resources <<
  /Font <<
  /F1 5 0 R
  >>
  >>
  >>
  endobj
  4 0 obj
  <<
  /Length 1200
  >>
  stream
  BT
  /F1 16 Tf
  50 750 Td
  (FACTURA ELECTRONICA DE VENTA) Tj
  0 -30 Td
  /F1 12 Tf
  (Consecutivo: ${factura.consecutivo}) Tj
  0 -20 Td
  (Ambiente: ${factura.es_habilitacion ? 'Habilitacion' : 'Produccion'}) Tj
  0 -30 Td
  /F1 14 Tf
  (CLIENTE:) Tj
  0 -20 Td
  /F1 11 Tf
  (${factura.cliente_razon_social}) Tj
  0 -30 Td
  /F1 12 Tf
  (Fecha Emision: ${factura.fecha_emision}) Tj
  0 -20 Td
  (Estado DIAN: ${factura.estado_dian.replace('_', ' ')}) Tj
  0 -30 Td
  /F1 14 Tf
  (TOTAL: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(factura.total_con_impuestos)}) Tj
  0 -40 Td
  /F1 10 Tf
  (CUFE:) Tj
  0 -15 Td
  (${factura.cufe ? factura.cufe.substring(0, 60) : 'N/A'}) Tj
  ${factura.cufe && factura.cufe.length > 60 ? `0 -12 Td\n(${factura.cufe.substring(60)}) Tj` : ''}
  0 -30 Td
  (QR: https://catalogo-vpfe.dian.gov.co/User/InvoiceVerification) Tj
  0 -40 Td
  /F1 9 Tf
  (---) Tj
  0 -12 Td
  (Este es un PDF simulado con formato basico.) Tj
  0 -12 Td
  (En produccion se generaria con un servicio de renderizado.) Tj
  ET
  endstream
  endobj
  5 0 obj
  <<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
  >>
  endobj
  xref
  0 6
  0000000000 65535 f
  0000000009 00000 n
  0000000058 00000 n
  0000000115 00000 n
  0000000274 00000 n
  0000001526 00000 n
  trailer
  <<
  /Size 6
  /Root 1 0 R
  >>
  startxref
  1625
  %%EOF`;

      // Usar la función de descarga genérica con tipo MIME correcto
      handleDownloadFile(
        pdfContent,
        `FE-${factura.consecutivo}-Grafica.pdf`,
        'application/pdf'
      );
    };
  // --- FIN: CAMBIOS SOLICITADOS ---


  // --- Mapeo de colores para Badges (sin cambios) ---
  const getEstadoColor = (estado: Factura['estado_dian']): "success" | "warning" | "error" | "info" => {
    switch (estado) {
      case 'aprobada':
      case 'aprobada_con_notificacion':
        return 'success';
      case 'borrador':
      case 'generada':
      case 'enviada_dian':
        return 'warning';
      case 'rechazada':
        return 'error';
      default:
        return 'info';
    }
  };

  // --- Clases de estilo (sin cambios) ---
  const baseHeaderClasses = "py-3 pr-4 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "py-3 pr-4 text-gray-500 text-theme-sm dark:text-gray-400";
  const cufeColClasses = "min-w-[150px] max-w-xs whitespace-normal font-mono text-xs";

  return (
    <>
      <PageBreadcrumb pageTitle="Facturación Electrónica DIAN" />
      {error && !isLoading && !isCreateOpen && (
        <div className="mb-4">
          <Alert variant="error" title="Error" message={error} />
        </div>
      )}

      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={handleOpenCreate} startIcon={<PlusIcon className="w-4 h-4" />}>
          Crear Nueva Factura
        </Button>
      </div>

      {/* --- Tabla de Facturas --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-10">Cargando facturas...</p>
          ) : (
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  {/* ... (encabezados sin cambios) ... */}
                  <TableCell isHeader className={baseHeaderClasses}>Consecutivo</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Cliente</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Fecha Emisión</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Total</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Ambiente</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Estado DIAN</TableCell>
                  <TableCell isHeader className={`${baseHeaderClasses} ${cufeColClasses}`}>CUFE</TableCell>
                  <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {facturas.length > 0 ? (
                  facturas.map((f) => (
                    <TableRow key={f.id}>
                      {/* ... (celdas de datos sin cambios) ... */}
                      <TableCell className={baseCellClasses}>{f.consecutivo}</TableCell>
                      <TableCell className={baseCellClasses}>{f.cliente_razon_social}</TableCell>
                      <TableCell className={baseCellClasses}>{f.fecha_emision}</TableCell>
                      <TableCell className={baseCellClasses}>
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(f.total_con_impuestos)}
                      </TableCell>
                      <TableCell className={baseCellClasses}>
                        <Badge size="sm" color={f.es_habilitacion ? 'info' : 'primary'}>
                          {f.es_habilitacion ? 'Habilitación' : 'Producción'}
                        </Badge>
                      </TableCell>
                       <TableCell className={baseCellClasses}>
                        <Badge size="sm" color={getEstadoColor(f.estado_dian)}>
                          {f.estado_dian.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className={`${baseCellClasses} ${cufeColClasses}`}>
                        {f.cufe ? `${f.cufe.substring(0, 15)}...` : 'N/A'}
                      </TableCell>
                      {/* --- CELDA DE ACCIONES (ACTUALIZADA) --- */}
                      <TableCell className={baseCellClasses}>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDetail(f)}
                            disabled={isSending === f.id}
                          >
                            Ver
                          </Button>
                          {f.estado_dian === 'borrador' && (
                             <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEnviarDian(f.id)}
                              disabled={isSending === f.id} // Se deshabilita solo este botón
                             >
                                {isSending === f.id ? 'Enviando...' : 'Enviar DIAN'}
                             </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-gray-500">
                      No se encontraron facturas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* --- Paginación (sin cambios) --- */}
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

      {/* --- Modal para CREAR Factura (ACTUALIZADO CON FORMULARIO) --- */}
      {isCreateOpen && (
        <Modal
          isOpen={isCreateOpen}
          onClose={closeCreateModal}
          className="max-w-3xl p-5 lg:p-10" // Más ancho
        >
          <form onSubmit={handleCreateSubmit} className="flex flex-col">
            <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Crear Nuevo Borrador de Factura
            </h4>

            {createError && <Alert variant="error" title="Error" message={createError} className="mb-4" />}
            {createSuccess && <Alert variant="success" title="Éxito" message={createSuccess} className="mb-4" />}

            <div className="px-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: '70vh' }}>

              {/* --- SECCIÓN 1: Datos Generales --- */}
              <fieldset className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 p-4 border rounded-lg dark:border-gray-700 mb-6">
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">Datos Generales</legend>
                <div className="lg:col-span-1">
                  <Label htmlFor="consecutivo">Consecutivo (Factura Nro.)</Label>
                  <Input type="text" id="consecutivo" name="consecutivo" placeholder="Ej: FE-003" required disabled={isCreating} />
                </div>
                <div>
                  <Label htmlFor="fecha_vencimiento">Fecha Vencimiento (Opcional)</Label>
                  <Input type="date" id="fecha_vencimiento" name="fecha_vencimiento" disabled={isCreating} />
                </div>
                <div className="lg:col-span-2">
                  <Label>Ambiente DIAN</Label>
                  <Switch
                    label={esHabilitacion ? "Habilitación (Sandbox)" : "Producción (Real)"}
                    defaultChecked={esHabilitacion}
                    onChange={setEsHabilitacion}
                    disabled={isCreating}
                  />
                </div>
              </fieldset>

              {/* --- SECCIÓN 2: Cliente (ACTUALIZADO) --- */}
              <fieldset className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 p-4 border rounded-lg dark:border-gray-700 mb-6">
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">Datos del Cliente</legend>

                <div>
                  <Label htmlFor="cliente_tipo_documento">Tipo de Documento</Label>
                  <div className="relative">
                    <Select
                      id="cliente_tipo_documento"
                      name="cliente_tipo_documento"
                      options={tipoDocumentoOptions}
                      placeholder="Seleccione un tipo"
                      onChange={() => {}} // El valor se toma del FormData
                      required
                      disabled={isCreating}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cliente_documento">Número de Documento</Label>
                  <Input type="text" id="cliente_documento" name="cliente_documento" placeholder="Ej: 900123456" required disabled={isCreating} />
                </div>

                <div>
                  <Label htmlFor="cliente_razon_social">Razón Social (o Nombre Completo)</Label>
                  <Input type= "text" id="cliente_razon_social" name="cliente_razon_social" placeholder="Ej: Cliente de Ejemplo S.A.S." required disabled={isCreating} />
                </div>

                <div>
                  <Label htmlFor="cliente_email">Email del Cliente (para envío)</Label>
                  <Input type="email" id="cliente_email" name="cliente_email" placeholder="facturacion@cliente.com" required disabled={isCreating} />
                </div>
              </fieldset>

              {/* --- SECCIÓN 3: Ítems (Formulario dinámico) --- */}
              <fieldset className="p-4 border rounded-lg dark:border-gray-700 mb-6">
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">Ítems de la Factura</legend>

                {/* Formulario para añadir ítem */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3 items-end p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="md:col-span-4">
                    <Label htmlFor="item_desc">Descripción</Label>
                    <Input type="text" id="item_desc" value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)} placeholder="Servicio de..." />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="item_qty">Cantidad</Label>
                    <Input type="number" id="item_qty" value={newItemQty} onChange={(e) => setNewItemQty(parseInt(e.target.value, 10) || 1)} min="1" step={1} />
                  </div>
                  <div className="md:col-span-3">
                    <Label htmlFor="item_valor">Valor Unitario</Label>
                    <Input type="number" id="item_valor" value={newItemValor} onChange={(e) => setNewItemValor(e.target.value === "" ? "" : Number(e.target.value))} min="0" step={0.01} placeholder="100000" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="item_iva">IVA (%)</Label>
                    <Input type="number" id="item_iva" value={newItemIVATasa} onChange={(e) => setNewItemIVATasa(Number(e.target.value))} min="0" step={1} placeholder="19" />
                  </div>
                  <div className="md:col-span-1">
                    <Button size="sm" type="button" onClick={handleAddItem} disabled={isCreating} className="w-full">
                      <PlusIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Tabla de ítems añadidos */}
                {items.length > 0 && (
                  <div className="mt-4 max-h-48 overflow-y-auto custom-scrollbar">
                    <Table>
                      <TableHeader className="border-gray-100 dark:border-gray-700 border-y">
                        <TableRow>
                          <TableCell isHeader className={baseHeaderClasses}>Ítem</TableCell>
                          <TableCell isHeader className={baseHeaderClasses}>Cant.</TableCell>
                          <TableCell isHeader className={baseHeaderClasses}>Vlr. Unit.</TableCell>
                          <TableCell isHeader className={baseHeaderClasses}>Total Ítem</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className={baseCellClasses}>{item.descripcion}</TableCell>
                            <TableCell className={baseCellClasses}>{item.cantidad}</TableCell>
                            <TableCell className={baseCellClasses}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.valor_unitario)}</TableCell>
                            <TableCell className={baseCellClasses}>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.total_con_iva)}</TableCell>
                            <TableCell className={baseCellClasses}>
                              <Button size="sm" variant="outline" type="button" onClick={() => handleRemoveItem(item.id)} disabled={isCreating} className="border-error-300 text-error-500 hover:bg-error-50 dark:border-error-500/30 dark:hover:bg-error-500/15">
                                <TrashBinIcon className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </fieldset>

              {/* --- SECCIÓN 4: Totales (Calculados y ReadOnly) --- */}
              <fieldset className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3 p-4 border rounded-lg dark:border-gray-700 mb-6">
                <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">Totales Calculados</legend>
                <div>
                  <Label htmlFor="total_sin_impuestos">Total Sin Impuestos (Subtotal)</Label>
                  <Input type="text" id="total_sin_impuestos" name="total_sin_impuestos"
                         value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totales.subtotal)}
                         readOnly
                         className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="total_impuestos">Total Impuestos (Ej: IVA)</Label>
                  <Input type="text" id="total_impuestos" name="total_impuestos"
                         value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totales.impuestos)}
                         readOnly
                         className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <Label htmlFor="total_con_impuestos">Total Factura (Valor Pagado)</Label>
                  <Input type="text" id="total_con_impuestos" name="total_con_impuestos"
                         value={new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totales.total)}
                         readOnly
                         className="bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </fieldset>
            </div>

            {/* --- Botones de Acción --- */}
            <div className="flex items-center gap-3 px-2 mt-8 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeCreateModal} type="button" disabled={isCreating}>
                Cancelar
              </Button>
              <Button size="sm" type="submit" disabled={isCreating || items.length === 0}>
                {isCreating ? 'Guardando Borrador...' : 'Guardar Borrador'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- Modal para VER DETALLE (ACTUALIZADO) --- */}
      {selectedFactura && isDetailOpen && (
        <Modal
          isOpen={isDetailOpen}
          onClose={closeDetailModal}
          className="max-w-[700px] p-5 lg:p-10"
        >
          <div className="p-4">
            <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Detalle Factura: {selectedFactura.consecutivo}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cliente: {selectedFactura.cliente_razon_social}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Estado DIAN: {selectedFactura.estado_dian.replace('_', ' ')}
            </p>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-4 break-all">
              CUFE: {selectedFactura.cufe || 'N/A'}
            </p>

            {isDetailLoading ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                Cargando documentos...
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Archivos de la factura (DIAN):
                </p>
                {/* --- INICIO: CAMBIOS BOTONES --- */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!selectedFactura) return; // <-- GUARDIA ADICIONADA
                      handleDownloadFile(xmlData.ubl || '', `FE-${selectedFactura.consecutivo}-UBL.xml`, 'application/xml')
                    }}
                    disabled={isDetailLoading || !selectedFactura || !xmlData.ubl} // <-- LÓGICA DISABLED ACTUALIZADA
                  >
                    Descargar XML (UBL 2.1)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (!selectedFactura) return; // <-- GUARDIA ADICIONADA
                      handleDownloadFile(xmlData.dian || '', `FE-${selectedFactura.consecutivo}-DIAN.xml`, 'application/xml')
                    }}
                    disabled={isDetailLoading || !selectedFactura || !xmlData.dian} // <-- LÓGICA DISABLED ACTUALIZADA
                  >
                    Descargar XML (ApplicationResponse)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadPDF(selectedFactura)}
                    disabled={isDetailLoading || !selectedFactura} // <-- Esta ya estaba correcta
                  >
                    PDF (Representación Gráfica)
                  </Button>
                </div>
                {/* --- FIN: CAMBIOS BOTONES --- */}
              </div>
            )}

            <div className="flex items-center gap-3 mt-8 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeDetailModal} type="button">
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
