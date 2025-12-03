// src/components/reportes/GenerarReporteModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
// Importa tus componentes de UI existentes
import { Modal } from '@/components/ui/modal';
import Select from '@/components/form/Select';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { PencilIcon } from '@/icons';

// Tipo para la data que cargamos del API de balances
type BalanceDisponible = {
  id: number;
  periodo_fecha: string;
  tipo_empresa: string;
  normativa: string;
  estado_firma: 'pendiente' | 'firmado';
};

// Props que el modal recibe de la página
interface GenerarReporteModalProps {
  isOpen: boolean; // <--- 1. ACEPTAR LA PROP 'isOpen'
  onClose: () => void;
  onSubmitSuccess: (nuevoReporte: unknown) => void;
}

// Opciones para los Selects
const entidadOptions = [
  { value: 'Supersociedades', label: 'Supersociedades' },
  { value: 'Superfinanciera', label: 'Superfinanciera' },
];

const tipoReporteOptions = [
  { value: '42-Empresarial', label: '42-Empresarial (Supersociedades)' },
  { value: 'XBRL-NIIF-Plena', label: 'XBRL NIIF Plena (Superfinanciera)' },
];

const GenerarReporteModal: React.FC<GenerarReporteModalProps> = ({
  isOpen, // <--- 1. RECIBIR LA PROP 'isOpen'
  onClose,
  onSubmitSuccess,
}) => {
  const [balances, setBalances] = useState<BalanceDisponible[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario
  const [balanceId, setBalanceId] = useState('');
  const [entidad, setEntidad] = useState('Supersociedades');
  const [tipoReporte, setTipoReporte] = useState('42-Empresarial');

  // Opciones para el Select de Balances (se poblarán desde la API)
  const [balanceOptions, setBalanceOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Cargar balances firmados al abrir el modal
  useEffect(() => {
    // Solo cargar si el modal está abierto
    if (isOpen) {
      setIsLoadingBalances(true);
      fetch('/api/contabilidad/balances')
        .then((res) => res.json())
        .then((data) => {
          if (!data || !Array.isArray(data.data)) {
            throw new Error('Respuesta inesperada de la API de balances');
          }
          // Solo queremos reportar balances que ya están FIRMADOS
          const firmados: BalanceDisponible[] = data.data.filter(
            (b: BalanceDisponible) => b.estado_firma === 'firmado'
          );
          setBalances(firmados);

          // Convertir los balances en opciones para el componente Select
          setBalanceOptions(
            firmados.map((b) => ({
              value: b.id.toString(),
              label: `Período: ${new Date(
                b.periodo_fecha
              ).toLocaleDateString()} (${b.normativa})`,
            }))
          );
        })
        .catch((err) => {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          setError(`No se pudieron cargar los balances: ${msg}`);
        })
        .finally(() => {
          setIsLoadingBalances(false);
        });
    }
  }, [isOpen]); // Depende de 'isOpen' para recargar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceId) {
      setError('Debe seleccionar un balance.');
      return;
    }

    setIsLoadingSubmit(true);
    setError(null);

    try {
      const response = await fetch('/api/reportes-regulatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          balanceId: parseInt(balanceId),
          entidad,
          tipoReporte,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'Error desconocido al generar el reporte.'
        );
      }

      onSubmitSuccess(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    // 2. PASAR 'isOpen' AL COMPONENTE BASE <Modal>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-5 lg:p-10"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Usamos un layout similar a tus otros modales (ej: Canal Ético) */}
        <span className="inline-block p-3 mx-auto text-brand-500 bg-brand-50 rounded-full dark:bg-brand-500/10 mb-4">
          <PencilIcon className="w-8 h-8" />
        </span>
        <h4 className="mb-6 text-2xl font-semibold text-center text-gray-800 dark:text-white/90">
          Generar Nuevo Reporte Regulatorio
        </h4>

        {error && (
          // 3. USAR EL COMPONENTE 'Alert' CORRECTAMENTE
          <Alert variant="error" title="Error" message={error} />
        )}

        <div className="space-y-5">
          <div>
            <Label htmlFor="entidad">Entidad Regulatoria</Label>
            {/* 4. USAR EL COMPONENTE 'Select' CORRECTAMENTE */}
            <Select
              id="entidad"
              name="entidad"
              defaultValue={entidad}
              options={entidadOptions}
              onChange={(value) => setEntidad(value)}
            />
          </div>

          <div>
            <Label htmlFor="tipoReporte">Tipo de Reporte</Label>
            <Select
              id="tipoReporte"
              name="tipoReporte"
              defaultValue={tipoReporte}
              options={tipoReporteOptions}
              onChange={(value) => setTipoReporte(value)}
            />
          </div>

          <div>
            <Label htmlFor="balanceId">Balance a Reportar (Solo firmados)</Label>
            <Select
              id="balanceId"
              name="balanceId"
              value={balanceId}
              options={balanceOptions}
              onChange={(value) => setBalanceId(value)}
              disabled={isLoadingBalances}
              placeholder={
                isLoadingBalances
                  ? 'Cargando balances...'
                  : 'Seleccione un balance...'
              }
            />
            {balances.length === 0 && !isLoadingBalances && (
              <p className="text-sm text-error-500 mt-1.5">
                No hay balances firmados disponibles para reportar.
              </p>
            )}
          </div>
        </div>

        {/* 5. USAR EL COMPONENTE 'Button' CORRECTAMENTE */}
        <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoadingSubmit || balances.length === 0 || !balanceId}
          >
            {isLoadingSubmit ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GenerarReporteModal;
