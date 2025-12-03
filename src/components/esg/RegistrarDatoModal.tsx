"use client";

import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EsgMetrica } from "@/types/esg";

interface RegistrarDatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback para recargar datos
}

export default function RegistrarDatoModal({
  isOpen,
  onClose,
  onSuccess,
}: RegistrarDatoModalProps) {
  const [metricas, setMetricas] = useState<EsgMetrica[]>([]);
  const [loadingMetricas, setLoadingMetricas] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    metricaId: "",
    valor: "",
    periodoFecha: new Date().toISOString().split("T")[0], // Hoy por defecto
  });

  // Cargar métricas al abrir el modal (o al montar si preferimos)
  useEffect(() => {
    if (isOpen) {
      fetchMetricas();
      // Reset form
      setFormData({
        metricaId: "",
        valor: "",
        periodoFecha: new Date().toISOString().split("T")[0],
      });
      setError(null);
    }
  }, [isOpen]);

  const fetchMetricas = async () => {
    try {
      setLoadingMetricas(true);
      const res = await fetch("/api/esg/metricas");
      if (!res.ok) throw new Error("Error al cargar métricas");
      const data = await res.json();
      setMetricas(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las métricas disponibles.");
    } finally {
      setLoadingMetricas(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, metricaId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.metricaId || !formData.valor || !formData.periodoFecha) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/esg/registros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metricaId: parseInt(formData.metricaId),
          valor: parseFloat(formData.valor),
          periodoFecha: formData.periodoFecha,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar el registro");
      }

      // Éxito
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      let errorMessage = "Ocurrió un error inesperado.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Opciones para el Select
  const metricaOptions = metricas.map((m) => ({
    value: m.id.toString(),
    label: `${m.nombre} (${m.categoriaNombre})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] p-0"
      showCloseButton={false} // Usamos el de ModalHeader
    >
      <ModalHeader title="Registrar Dato ESG" onClose={onClose} />
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Métrica */}
          <div>
            <Label htmlFor="metricaId">Métrica</Label>
            <Select
              id="metricaId"
              name="metricaId"
              options={metricaOptions}
              value={formData.metricaId}
              onChange={handleSelectChange}
              placeholder={
                loadingMetricas ? "Cargando..." : "Selecciona una métrica"
              }
              className="w-full"
            />
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              type="number"
              id="valor"
              name="valor"
              placeholder="Ej: 120.5"
              value={formData.valor}
              onChange={handleChange}
              step={0.01}
              required
            />
          </div>

          {/* Fecha */}
          <div>
            <Label htmlFor="periodoFecha">Fecha del Periodo</Label>
            <Input
              type="date"
              id="periodoFecha"
              name="periodoFecha"
              value={formData.periodoFecha}
              onChange={handleChange}
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Guardando..." : "Guardar Registro"}
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
