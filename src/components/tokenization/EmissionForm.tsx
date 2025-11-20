"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import InputField from "@/components/form/input/InputField";
// Asumiendo que tienes un componente Select o usas HTML nativo estilizado
// Usaré HTML nativo con clases Tailwind para asegurar compatibilidad rápida

interface Inversionista {
  id: number;
  email: string;
  full_name: string;
  kyc_status: string;
}

interface DocumentoLegal {
  id: number;
  titulo: string;
  estado: string;
}

export default function EmissionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Listas para los selectores
  const [inversionistas, setInversionistas] = useState<Inversionista[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoLegal[]>([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    inversionistaId: "",
    documentoLegalId: "",
    montoInversion: "",
    cantidadTokens: "",
    lockupMeses: "12", // Default 1 año
  });

  // 1. Cargar datos iniciales (Llamar a APIs reales de listado)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch inversionistas
        const investorsRes = await fetch('/api/users/approved-investors');
        if (!investorsRes.ok) throw new Error('Failed to fetch approved investors');
        const investorsData = await investorsRes.json();
        setInversionistas(investorsData);

        // Fetch documentos legales (mantener el mock por ahora o crear API si es necesario)
        setDocumentos([
          { id: 19, titulo: "Contrato de Inversión #001 - Firmado", estado: "finalizado" },
          { id: 20, titulo: "Acuerdo de Accionistas 2025", estado: "borrador" }
        ]);

      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Error al cargar datos iniciales del formulario.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/tokenizacion/emitir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inversionistaId: Number(formData.inversionistaId),
          documentoLegalId: Number(formData.documentoLegalId),
          montoInversion: Number(formData.montoInversion),
          cantidadTokens: Number(formData.cantidadTokens),
          lockupMeses: Number(formData.lockupMeses),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Error al emitir token");
      }

      setSuccess(true);
      // Limpiar formulario o redirigir
      // router.push('/dashboard/tokenizacion')

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6.5">
      <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Selector de Inversionista */}
        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Seleccionar Inversionista (KYC Aprobado) <span className="text-meta-1">*</span>
          </label>
          <div className="relative z-20 bg-transparent dark:bg-form-input">
            <select
              name="inversionistaId"
              value={formData.inversionistaId}
              onChange={handleChange}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Seleccione...</option>
              {inversionistas.map((inv) => (
                <option key={inv.id} value={inv.id} disabled={inv.kyc_status !== 'aprobado'}>
                  {inv.full_name} ({inv.email}) {inv.kyc_status !== 'aprobado' ? '- KYC Pendiente ⚠️' : '✅'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selector de Documento Legal */}
        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Documento de Respaldo (Firmado) <span className="text-meta-1">*</span>
          </label>
          <div className="relative z-20 bg-transparent dark:bg-form-input">
            <select
              name="documentoLegalId"
              value={formData.documentoLegalId}
              onChange={handleChange}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="">Seleccione contrato...</option>
              {documentos.map((doc) => (
                <option key={doc.id} value={doc.id} disabled={doc.estado !== 'finalizado'}>
                  {doc.titulo} {doc.estado !== 'finalizado' ? '(No firmado)' : '✅'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Campos Numéricos */}
      <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Monto de Inversión (COP/USD)
          </label>
          <InputField
            type="number"
            name="montoInversion"
            placeholder="Ej: 10000000"
            value={formData.montoInversion}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Cantidad de Tokens/Acciones
          </label>
          <InputField
            type="number"
            name="cantidadTokens"
            placeholder="Ej: 500"
            value={formData.cantidadTokens}
            onChange={handleChange}
          />
        </div>

        <div className="w-full">
          <label className="mb-2.5 block text-black dark:text-white">
            Periodo Lockup (Meses)
          </label>
          <InputField
            type="number"
            name="lockupMeses"
            placeholder="12"
            value={formData.lockupMeses}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Feedback de UI */}
      {error && (
        <div className="mb-4 flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30">
          <div className="w-full">
            <h5 className="mb-3 font-semibold text-[#FFFFFF]">Error en Emisión</h5>
            <p className="leading-relaxed text-[#FFFFFF]">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-3 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30">
          <div className="w-full">
            <h5 className="mb-3 font-semibold text-[#FFFFFF]">¡Emisión Exitosa!</h5>
            <p className="leading-relaxed text-[#FFFFFF]">
              El token ha sido registrado, el Cap Table actualizado y la auditoría UIAF generada.
            </p>
          </div>
        </div>
      )}

      {/* Botón de Acción */}
      <Button
        type="submit"
        disabled={loading}
        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
      >
        {loading ? "Procesando Blockchain & DB..." : "Emitir Título Valor"}
      </Button>
    </form>
  );
}
