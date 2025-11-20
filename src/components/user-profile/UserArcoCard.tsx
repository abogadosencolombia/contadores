"use client";
import React, { useEffect, useState } from "react";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { createArcoRequest, getArcoHistory } from "@/lib/privacyService";
import { ArcoRequest } from "@/types/privacy";

export default function UserArcoCard() {
  const [history, setHistory] = useState<ArcoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "",
    detalle: "",
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const loadHistory = async () => {
    try {
      const data = await getArcoHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load ARCO history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tipo || !formData.detalle) {
        setAlert({ type: 'error', message: 'Por favor complete todos los campos.' });
        return;
    }

    setSubmitting(true);
    setAlert(null);
    try {
      await createArcoRequest(formData);
      setAlert({ type: 'success', message: 'Solicitud enviada correctamente.' });
      setFormData({ tipo: "", detalle: "" });
      loadHistory();
    } catch (error) {
        console.error(error);
      setAlert({ type: 'error', message: 'Error al enviar la solicitud. Intente nuevamente.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return <Badge color="warning" variant="light">Pendiente</Badge>;
      case 'EN_PROCESO':
        return <Badge color="info" variant="light">En Proceso</Badge>;
      case 'RESUELTO':
        return <Badge color="success" variant="light">Resuelto</Badge>;
      case 'RECHAZADO':
        return <Badge color="error" variant="light">Rechazado</Badge>;
      default:
        return <Badge color="light" variant="light">{status}</Badge>;
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-6">
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Derechos ARCO
        </h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ejerce tus derechos de Acceso, Rectificación, Cancelación y Oposición sobre tus datos personales.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 mb-8">
        {alert && (
          <div className={`p-4 text-sm rounded-lg ${alert.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
            {alert.message}
          </div>
        )}
        
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                Tipo de Solicitud
            </label>
            <Select
            options={[
                { value: "ACCESO", label: "Acceso (Ver mis datos)" },
                { value: "RECTIFICACION", label: "Rectificación (Corregir mis datos)" },
                { value: "CANCELACION", label: "Cancelación (Borrar mis datos)" },
                { value: "OPOSICION", label: "Oposición (No usar mis datos)" },
            ]}
            placeholder="Seleccione el tipo de derecho"
            onChange={(value) => setFormData({ ...formData, tipo: value })}
            defaultValue={formData.tipo} // Changed to value to control the input
            className="w-full"
            />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
             Detalle de la Solicitud
          </label>
          <TextArea
            rows={4}
            placeholder="Describa detalladamente su solicitud..."
            onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
            defaultValue={formData.detalle} // Changed to value to control the input
          />
        </div>

        <div className="flex justify-end">
          <Button size="sm" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </div>
      </form>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
        <h5 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
          Historial de Solicitudes
        </h5>
        
        {loading ? (
             <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
                <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
             </div>
        ) : history.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay solicitudes registradas.</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha</th>
                    <th className="p-3 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                </tr>
                </thead>
                <tbody>
                {history.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                    <td className="p-3 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-white/90 font-medium">
                        {req.tipo_solicitud}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(req.fecha_solicitud).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-b border-gray-200 dark:border-gray-800">
                        {getStatusBadge(req.estado)}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
}
