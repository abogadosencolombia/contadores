// src/components/reportes/GenerarDcinModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Select from '@/components/form/Select';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { PencilIcon } from '@/icons'; // O algún ícono de dinero/banco

// Tipo para la data que cargamos
type InversionPendiente = {
  id: number;
  fecha_inversion: string;
  nombre_inversionista_extranjero: string;
  monto_inversion: number;
  moneda_inversion: string;
};

interface GenerarDcinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (nuevoReporte: any) => void;
}

const GenerarDcinModal: React.FC<GenerarDcinModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [inversiones, setInversiones] = useState<InversionPendiente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inversionId, setInversionId] = useState('');
  const [inversionOptions, setInversionOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Apuntamos al nuevo endpoint de inversiones pendientes
      fetch('/api/capital-extranjero')
        .then((res) => res.json())
        .then((data) => {
          if (!data || !Array.isArray(data.data)) {
            throw new Error('Respuesta inesperada de la API de inversiones');
          }
          const pendientes: InversionPendiente[] = data.data;
          setInversiones(pendientes);

          setInversionOptions(
            pendientes.map((inv) => ({
              value: inv.id.toString(),
              label: `(${inv.moneda_inversion} ${inv.monto_inversion}) - ${inv.nombre_inversionista_extranjero} - ${new Date(inv.fecha_inversion).toLocaleDateString()}`,
            }))
          );
        })
        .catch((err) => {
          setError(`No se pudieron cargar las inversiones: ${err.message}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inversionId) {
      setError('Debe seleccionar una inversión a reportar.');
      return;
    }
    setIsLoadingSubmit(true);
    setError(null);

    try {
      // Apuntamos al nuevo endpoint de generación de reportes DCIN
      const response = await fetch('/api/reportes-dcin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inversionId: parseInt(inversionId),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Error desconocido al generar el reporte.');
      }
      onSubmitSuccess(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-5 lg:p-10"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <span className="inline-block p-3 mx-auto text-brand-500 bg-brand-50 rounded-full dark:bg-brand-500/10 mb-4">
          <PencilIcon className="w-8 h-8" />
        </span>
        <h4 className="mb-6 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
          Generar Reporte DCIN 83 (BanRep)
        </h4>

        {error && <Alert variant="error" title="Error" message={error} />}

        <div className="space-y-5">
          <div>
            <Label htmlFor="inversionId">Inversión a Reportar (Pendientes)</Label>
            <Select
              id="inversionId"
              name="inversionId"
              value={inversionId}
              options={inversionOptions}
              onChange={(value) => setInversionId(value)}
              disabled={isLoading}
              placeholder={
                isLoading
                  ? 'Cargando inversiones...'
                  : 'Seleccione una inversión...'
              }
            />
            {inversiones.length === 0 && !isLoading && (
              <p className="text-sm text-error-500 mt-1.5">
                No hay inversiones pendientes por reportar.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoadingSubmit || inversiones.length === 0 || !inversionId}
          >
            {isLoadingSubmit ? 'Generando...' : 'Generar Reporte DCIN'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GenerarDcinModal;
