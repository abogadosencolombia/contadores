// src/app/(admin)/dashboard/inversionistas/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/common/PageBreadCrumb";
import { toast } from "react-toastify";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Modal, ModalBody, ModalHeader } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import DatePicker from "@/components/form/date-picker";
import { PaperPlaneIcon, BoltIcon } from "@/icons";

interface Inversionista {
  id: string;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  numero_acciones: number;
  fecha_ingreso?: string;
}

interface Certificado {
  id: number;
  ano_fiscal: number;
  verification_uuid: string;
  fecha_emision: string;
  file_path: string;
  accionista_nombre: string;
  accionista_documento: string;
}

const ITEMS_PER_PAGE = 10;

export default function InversionistasPage() {
  const [inversionistas, setInversionistas] = useState<Inversionista[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para Certificados
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [isLoadingCert, setIsLoadingCert] = useState(true);
  const [certPage, setCertPage] = useState(1);
  const [certTotalPages, setCertTotalPages] = useState(0);
  const [sendingId, setSendingId] = useState<number | null>(null);

  // Estados para Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDividendOpen, setIsDividendOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false); // Nuevo

  // Estado para formularios
  const [selectedInvestor, setSelectedInvestor] = useState<Inversionista | null>(null);
  const [formData, setFormData] = useState<Partial<Inversionista>>({});
  const [dividendData, setDividendData] = useState({
    ano_fiscal: new Date().getFullYear(),
    monto_bruto: 0,
    retencion: 0,
    monto_neto: 0,
    fecha_pago: new Date().toISOString().split('T')[0]
  });

  // Estado Configuración Global
  const [configData, setConfigData] = useState({
    valor_accion: 0,
    porcentaje_dividendo: 0,
    porcentaje_retencion: 0,
  });

  const docOptions = [
    { value: "CC", label: "CC" },
    { value: "NIT", label: "NIT" },
    { value: "CE", label: "CE" },
    { value: "PAS", label: "PAS" },
  ];

  const fetchInversionistas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inversionistas");
      if (!res.ok) {
         // Manejar error silenciosamente para evitar overlay
         toast.error("No se pudieron cargar los datos");
         setInversionistas([]);
         return;
      }
      const data = await res.json();
      setInversionistas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
      setInversionistas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async (year: number) => {
    try {
      const res = await fetch(`/api/inversionistas/configuracion?ano=${year}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.valor_accion) {
          setConfigData({
            valor_accion: Number(data.valor_accion),
            porcentaje_dividendo: Number(data.porcentaje_dividendo),
            porcentaje_retencion: Number(data.porcentaje_retencion),
          });
        } else {
          // Default or reset if not found
           setConfigData({ valor_accion: 0, porcentaje_dividendo: 0, porcentaje_retencion: 0 });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await fetch("/api/inversionistas/configuracion", {
        method: "POST",
        body: JSON.stringify({
          ano_fiscal: dividendData.ano_fiscal,
          ...configData
        }),
      });
      setIsConfigOpen(false);
      toast.success("Configuración guardada");
    } catch (error) {
      console.error(error);
      toast.error("Error guardando configuración");
    }
  };

  const fetchCertificados = async (page: number) => {
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
  };

  useEffect(() => {
    fetchInversionistas();
  }, []);

  useEffect(() => {
    fetchCertificados(certPage);
  }, [certPage]);

  // --- Handlers ---

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/inversionistas", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        // Mostrar error directamente sin lanzar excepción para evitar el overlay de Next.js
        toast.error(errorData.error || "Error al crear inversionista");
        return;
      }

      setIsCreateOpen(false);
      fetchInversionistas();
      toast.success("Inversionista creado");
    } catch (error) {
      console.error(error); // Solo para errores de red reales
      toast.error("Error de conexión al servidor");
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`/api/inversionistas/${selectedInvestor!.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      setIsEditOpen(false);
      fetchInversionistas();
      toast.success("Inversionista actualizado");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar");
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

      toast.success('Correo enviado exitosamente');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error desconocido al enviar el correo.");
    } finally {
      setSendingId(null);
    }
  };

  const handleOpenPayModal = async (inv: Inversionista) => {
    setSelectedInvestor(inv);
    const year = dividendData.ano_fiscal;

    let config = { valor_accion: 0, porcentaje_dividendo: 0, porcentaje_retencion: 0 };
    try {
        const res = await fetch(`/api/inversionistas/configuracion?ano=${year}`);
        if (res.ok) {
            const data = await res.json();
            if (data.valor_accion) config = {
                valor_accion: Number(data.valor_accion),
                porcentaje_dividendo: Number(data.porcentaje_dividendo),
                porcentaje_retencion: Number(data.porcentaje_retencion)
            };
            setConfigData(config); // Update state too just in case
        }
    } catch(e) { console.error(e); }

    const totalEquity = (inv.numero_acciones || 0) * (config.valor_accion || 0);
    let gross = totalEquity * ((config.porcentaje_dividendo || 0) / 100);

    if (inv.fecha_ingreso) {
        const entryDate = new Date(inv.fecha_ingreso);
        const fiscalYearEnd = new Date(year, 11, 31);

        if (entryDate.getFullYear() === year) {
            const diffTime = fiscalYearEnd.getTime() - entryDate.getTime();
            const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            const factor = diffDays / 365;
            gross = gross * factor;
            toast.info(`Cálculo prorrateado: ${diffDays} días activos.`);
        } else if (entryDate.getFullYear() > year) {
            gross = 0;
            toast.warning("Inversionista ingresó después del año fiscal.");
        }
    }

    const retention = gross * ((config.porcentaje_retencion || 0) / 100);
    const net = gross - retention;

    setDividendData({
        ...dividendData,
        monto_bruto: Math.round(gross) || 0,
        retencion: Math.round(retention) || 0,
        monto_neto: Math.round(net) || 0
    });
    setIsDividendOpen(true);
  };

  // 2. Proceso Completo: Registrar -> Generar -> (Enviar - pendiente de implementación backend específica)
  const handleProcesarCertificado = async () => {
    try {
      toast.info("Registrando pago...");

      // PASO A: Registrar el pago en base de datos
      const regRes = await fetch("/api/inversionistas/dividendos", {
        method: "POST",
        body: JSON.stringify({
          accionista_id: selectedInvestor!.id,
          ...dividendData
        }),
      });

      if (!regRes.ok) {
        const errData = await regRes.json();
        throw new Error(errData.message || errData.error || "Error registrando pago");
      }

      toast.info("Generando PDF firmado...");

      // PASO B: REUTILIZAR tu API existente de generación (con el filtro nuevo)
      const genRes = await fetch("/api/contabilidad/certificados-dividendos/generar", {
        method: "POST",
        body: JSON.stringify({
            ano_fiscal: dividendData.ano_fiscal,
            accionista_id: selectedInvestor!.id
        }),
      });

      if (!genRes.ok) {
        const errData = await genRes.json();
        throw new Error(errData.message || errData.error || "Error generando PDF");
      }

      const genData = await genRes.json();
      // Tu API devuelve un array 'certificados', tomamos el primero (y único)
      const certificadoGenerado = genData.certificados ? genData.certificados[0] : null;

      if (certificadoGenerado) {
         toast.success("Certificado generado y listo.");
         setIsDividendOpen(false);
         fetchCertificados(1); // Recargar la tabla de certificados
      } else {
         toast.warning("El proceso terminó pero no se obtuvo el certificado en la respuesta.");
      }

    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Ocurrió un error en el proceso");
    }
  };

  // Mantenemos esta función por si se quiere regenerar solo el certificado sin registrar pago
  const handleSoloGenerarCertificado = async (inversionista: Inversionista) => {
    const year = prompt("Ingrese el año fiscal para el certificado:", new Date().getFullYear().toString());
    if (!year) return;

    toast.info("Generando certificado...");

    try {
      const genRes = await fetch("/api/contabilidad/certificados-dividendos/generar", {
        method: "POST",
        body: JSON.stringify({
            ano_fiscal: parseInt(year),
            accionista_id: inversionista.id
        }),
      });

      if (!genRes.ok) {
        const errData = await genRes.json();
        throw new Error(errData.message || errData.error || "Error generando PDF");
      }

      const genData = await genRes.json();
      const cert = genData.certificados ? genData.certificados[0] : null;

      if (cert) {
         toast.success("Certificado generado correctamente.");
         fetchCertificados(1); // Recargar la tabla
      } else {
         toast.warning("No se encontró información para generar el certificado.");
      }

    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error en el proceso");
    }
  };

  const baseHeaderClasses = "px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";
  const baseCellClasses = "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400";

  return (
    <div>
      <Breadcrumb pageTitle="Gestión de Inversionistas" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <div>
                 <h3 className="font-medium text-black dark:text-white">
                  Lista de Inversionistas
                 </h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { fetchConfig(dividendData.ano_fiscal); setIsConfigOpen(true); }}
                  className="inline-flex items-center justify-center rounded-md border border-primary px-4 py-2 text-center font-medium text-primary hover:bg-opacity-90"
                >
                  <BoltIcon className="w-4 h-4 mr-2" /> Configurar
                </button>
                <button
                  onClick={() => { setFormData({}); setIsCreateOpen(true); }}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                >
                  Agregar Inversionista
                </button>
              </div>
            </div>

            <div className="p-6.5">
              {loading ? (
                  <div className="text-center py-10">Cargando inversionistas...</div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                  <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1000px]">
                      <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/5">
                          <TableRow>
                            <TableCell isHeader className={baseHeaderClasses}>Nombre</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Documento</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Email</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Acciones Poseídas</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:border-white/5">
                          {inversionistas.length === 0 ? (
                             <TableRow>
                               <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={5}>
                                 No hay inversionistas registrados.
                               </TableCell>
                             </TableRow>
                          ) : (
                              inversionistas.map((inv: Inversionista) => (
                                <TableRow key={inv.id}>
                                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="flex flex-col">
                                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{inv.nombre_completo}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className={baseCellClasses}>
                                     {inv.tipo_documento} {inv.numero_documento}
                                  </TableCell>
                                  <TableCell className={baseCellClasses}>{inv.email}</TableCell>
                                  <TableCell className={baseCellClasses + " font-bold"}>
                                     <Badge size="sm" color="success">{inv.numero_acciones} Acciones</Badge>
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <div className="flex space-x-3">
                                      <button
                                        onClick={() => { setSelectedInvestor(inv); setFormData(inv); setIsEditOpen(true); }}
                                        className="text-sm text-primary hover:underline"
                                      >
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => handleOpenPayModal(inv)}
                                        className="text-sm text-success-500 hover:underline"
                                      >
                                        Pagar y Certificar
                                      </button>
                                      <button
                                        onClick={() => handleSoloGenerarCertificado(inv)}
                                        className="text-sm text-warning-500 hover:underline"
                                      >
                                        Solo Certificado
                                      </button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- Tabla de Certificados --- */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Certificados de Dividendos Inversionistas</h3>
            </div>
            <div className="p-6.5">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[1000px]">
                    {isLoadingCert ? <p className="text-center py-10">Cargando certificados...</p> : (
                      <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/5">
                          <TableRow>
                            <TableCell isHeader className={baseHeaderClasses}>Año Fiscal</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Accionista</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Documento</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Fecha Emisión</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Verificación UUID</TableCell>
                            <TableCell isHeader className={baseHeaderClasses}>Acciones</TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:border-white/5">
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
                </div>
              </div>
              {!isLoadingCert && certTotalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination currentPage={certPage} totalPages={certTotalPages} onPageChange={setCertPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear */}      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} className="max-w-[500px]">
        <ModalHeader title="Nuevo Inversionista" onClose={() => setIsCreateOpen(false)} />
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div>
                <Label>Nombre Completo</Label>
                <Input placeholder="Ej. Juan Perez" onChange={e => setFormData({...formData, nombre_completo: e.target.value})} />
            </div>
            <div>
                <Label>Tipo Documento</Label>
                <Select
                    options={docOptions}
                    placeholder="Seleccione tipo"
                    onChange={val => setFormData({...formData, tipo_documento: val})}
                />
            </div>
            <div>
                <Label>Número Documento</Label>
                <Input placeholder="Ej. 123456789" onChange={e => setFormData({...formData, numero_documento: e.target.value})} />
            </div>
            <div>
                <Label>Email</Label>
                <Input placeholder="juan@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
                <Label>Número de Acciones</Label>
                <Input type="number" placeholder="Ej. 1000" onChange={e => setFormData({...formData, numero_acciones: parseInt(e.target.value)})} />
            </div>
            <div>
                <DatePicker
                    id="create-fecha-ingreso"
                    label="Fecha de Ingreso"
                    placeholder="YYYY-MM-DD"
                    onChange={(_dates, dateStr) => setFormData({...formData, fecha_ingreso: dateStr})}
                />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300">Cancelar</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">Guardar</button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-[500px]">
        <ModalHeader title="Editar Inversionista" onClose={() => setIsEditOpen(false)} />
        <ModalBody>
           <div className="flex flex-col gap-4">
            <div>
                <Label>Nombre Completo</Label>
                <Input value={formData.nombre_completo || ''} onChange={e => setFormData({...formData, nombre_completo: e.target.value})} />
            </div>
            <div>
                <Label>Email</Label>
                <Input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
                <Label>Número de Acciones</Label>
                <Input type="number" value={formData.numero_acciones || ''} onChange={e => setFormData({...formData, numero_acciones: parseInt(e.target.value)})} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300">Cancelar</button>
                <button onClick={handleUpdate} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">Actualizar</button>
            </div>
           </div>
        </ModalBody>
      </Modal>

      {/* Modal Registrar Dividendos */}
      <Modal isOpen={isDividendOpen} onClose={() => setIsDividendOpen(false)} className="max-w-[500px]">
        <ModalHeader title={`Registrar Dividendos - ${selectedInvestor?.nombre_completo}`} onClose={() => setIsDividendOpen(false)} />
        <ModalBody>
            <div className="flex flex-col gap-4">
                <div>
                    <Label>Año Fiscal</Label>
                    <Input type="number" value={dividendData.ano_fiscal} onChange={e => setDividendData({...dividendData, ano_fiscal: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                    <Label>Monto Bruto</Label>
                    <Input type="number" value={dividendData.monto_bruto} onChange={e => setDividendData({...dividendData, monto_bruto: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                    <Label>Retención</Label>
                    <Input type="number" value={dividendData.retencion} onChange={e => setDividendData({...dividendData, retencion: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                    <Label>Monto Neto (Calculado o Manual)</Label>
                    <Input type="number" value={dividendData.monto_neto} onChange={e => setDividendData({...dividendData, monto_neto: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setIsDividendOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300">Cancelar</button>
                    <button onClick={handleProcesarCertificado} className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-opacity-90">Generar y Enviar</button>
                </div>
            </div>
        </ModalBody>
      </Modal>

      {/* Modal Configuración Dividendos */}
      <Modal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} className="max-w-[500px]">
        <ModalHeader title="Configuración de Dividendos" onClose={() => setIsConfigOpen(false)} />
        <ModalBody>
            <div className="flex flex-col gap-4">
                <div>
                    <Label>Año Fiscal</Label>
                    <Input type="number" value={dividendData.ano_fiscal} onChange={e => {
                        const year = parseInt(e.target.value) || 0;
                        setDividendData({...dividendData, ano_fiscal: year});
                        if (year > 0) fetchConfig(year);
                    }} />
                </div>
                <div>
                    <Label>Valor por Acción (COP)</Label>
                    <Input type="number" value={configData.valor_accion} onChange={e => setConfigData({...configData, valor_accion: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                    <Label>Rentabilidad / Dividendo (%)</Label>
                    <Input type="number" value={configData.porcentaje_dividendo} onChange={e => setConfigData({...configData, porcentaje_dividendo: parseFloat(e.target.value) || 0})} />
                </div>
                 <div>
                    <Label>Porcentaje Retención (%)</Label>
                    <Input type="number" value={configData.porcentaje_retencion} onChange={e => setConfigData({...configData, porcentaje_retencion: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setIsConfigOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300">Cancelar</button>
                    <button onClick={handleSaveConfig} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">Guardar Configuración</button>
                </div>
            </div>
        </ModalBody>
      </Modal>

    </div>
  );
}
