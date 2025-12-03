// en: src/components/pagos/AuditoriaOrdenPagoModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from '@/components/ui/modal';
import Badge from '../ui/badge/Badge';

interface AuditoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordenId: number | null;
}

interface OrdenDetails {
  id: number;
  monto: number;
  moneda: string;
  monto_equivalente_cop: number;
  requiere_doble_firma: boolean;
}

interface AuditLog {
  accion: string;
  usuario: string;
  fecha: string;
  hash_evidencia: string;
  detalles: string;
}

const AuditoriaOrdenPagoModal: React.FC<AuditoriaModalProps> = ({ isOpen, onClose, ordenId }) => {
  const [orden, setOrden] = useState<OrdenDetails | null>(null);
  const [log, setLog] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && ordenId) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/pagos/ordenes/${ordenId}/auditoria`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'No se pudo cargar la auditoría.');
          }
          return res.json();
        })
        .then((data) => {
          setOrden(data.orden);
          setLog(data.log);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, ordenId]);

  const renderContent = () => {
    if (isLoading) {
      return <p>Cargando auditoría...</p>;
    }
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
    if (!orden) {
      return null;
    }

    const UMBRAL_COP = 10000000;
    const cumpleRegla = orden.monto_equivalente_cop > UMBRAL_COP === orden.requiere_doble_firma;

    return (
      <div className="space-y-6">
        {/* Sección de Detalles de la Orden */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">Detalles de la Orden #{orden.id}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Monto Original</p>
              <p className="font-medium text-gray-900 dark:text-gray-200">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: orden.moneda }).format(orden.monto)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Monto Equivalente</p>
              <p className="font-medium text-gray-900 dark:text-gray-200">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(orden.monto_equivalente_cop)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 dark:text-gray-400">Regla de Doble Firma (Límite: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(UMBRAL_COP)})</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-medium text-gray-900 dark:text-gray-200">
                  {orden.requiere_doble_firma ? "Requiere Doble Firma" : "No Requiere Doble Firma"}
                </p>
                <Badge color={cumpleRegla ? 'success' : 'error'}>
                  {cumpleRegla ? 'Cumple' : 'No Cumple'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Trazabilidad */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-white">Trazabilidad de Eventos</h3>
          <div className="border rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {log.map((entry, index) => (
                <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-brand-500">{entry.accion.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Usuario:</span> {entry.usuario || 'Sistema'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.fecha).toLocaleString('es-CO')}
                      </p>
                    </div>
                    <Badge color="info" size="sm">{entry.detalles.split(': ')[1]}</Badge>
                  </div>
                  {entry.hash_evidencia && (
                    <div className="mt-3 bg-gray-100 dark:bg-gray-900 rounded p-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                        <span className="font-semibold">Evidencia (SHA-256):</span> {entry.hash_evidencia}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <ModalHeader title="Auditoría de Orden de Pago" onClose={onClose} />
      <ModalBody>
        {renderContent()}
      </ModalBody>
    </Modal>
  );
};

export default AuditoriaOrdenPagoModal;
