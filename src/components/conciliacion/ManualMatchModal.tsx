'use client';

import React, { useState, useEffect } from 'react';
import { confirmMatchAction } from '@/app/(admin)/dashboard/conciliacion/actions';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

interface ExternalTx {
  id: number;
  fecha: string;
  descripcion_original: string;
  monto: string;
}

interface InternalTx {
  id: number;
  fecha: string;
  tipo_movimiento: string;
  monto: string;
  descripcion: string;
  conciliado: boolean;
}

interface ManualMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTx: ExternalTx | null;
  onMatchSuccess: () => void;
  fetchInternalCandidates: (params: { minAmount?: number, maxAmount?: number, date?: string }) => Promise<InternalTx[]>;
}

export default function ManualMatchModal({
  isOpen,
  onClose,
  selectedTx,
  onMatchSuccess,
  fetchInternalCandidates
}: ManualMatchModalProps) {
  const [candidates, setCandidates] = useState<InternalTx[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const [searchAmount, setSearchAmount] = useState('');

  // Initial load when modal opens
  useEffect(() => {
    if (isOpen && selectedTx) {
      // Default filters: +/- 10% amount, same date
      const amount = Math.abs(Number(selectedTx.monto));
      setSearchAmount(amount.toString());
      setSearchDate(selectedTx.fecha.split('T')[0]); // YYYY-MM-DD
      handleSearch(amount, selectedTx.fecha.split('T')[0]);
    }
  }, [isOpen, selectedTx]);

  const handleSearch = async (amountVal?: number, dateVal?: string) => {
    if (!selectedTx) return;
    setLoading(true);
    try {
      const amt = amountVal !== undefined ? amountVal : (searchAmount ? Number(searchAmount) : undefined);
      
      // Define a loose range if searching by amount
      const minAmount = amt ? amt * 0.9 : undefined;
      const maxAmount = amt ? amt * 1.1 : undefined;

      const results = await fetchInternalCandidates({
        minAmount,
        maxAmount,
        date: dateVal || searchDate || undefined
      });
      setCandidates(results);
    } catch (error) {
      console.error("Error fetching candidates", error);
      toast.error("Error buscando candidatos");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (internalId: number) => {
    if (!selectedTx) return;
    if (!confirm('¿Confirmar esta conciliación manual?')) return;

    setLoading(true);
    try {
      const result = await confirmMatchAction(internalId, selectedTx.id);
      if (result.success) {
        toast.success("Conciliación manual exitosa");
        onMatchSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al conciliar");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !selectedTx) return null;

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(Number(amount));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conciliación Manual
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          
          {/* Selected External Transaction Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Transacción Bancaria Seleccionada</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Fecha:</span>
              <span className="font-medium text-gray-900 dark:text-white">{selectedTx.fecha.split('T')[0]}</span>
              
              <span className="text-gray-500 dark:text-gray-400">Descripción:</span>
              <span className="font-medium text-gray-900 dark:text-white truncate" title={selectedTx.descripcion_original}>
                {selectedTx.descripcion_original}
              </span>
              
              <span className="text-gray-500 dark:text-gray-400">Monto:</span>
              <span className={`font-bold ${Number(selectedTx.monto) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(selectedTx.monto)}
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-end bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
             <div className="w-full sm:w-1/3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Monto Aproximado</label>
                <input 
                  type="number" 
                  value={searchAmount} 
                  onChange={(e) => setSearchAmount(e.target.value)}
                  className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2"
                  placeholder="Ej. 150000"
                />
             </div>
             <div className="w-full sm:w-1/3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                <input 
                  type="date" 
                  value={searchDate} 
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2"
                />
             </div>
             <button 
               onClick={() => handleSearch()}
               className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 dark:bg-white dark:text-gray-900"
             >
               Buscar
             </button>
          </div>

          {/* Candidates List */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Candidatos Internos ({candidates.length})</h4>
            <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Buscando...</div>
              ) : candidates.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No se encontraron movimientos coincidentes con los filtros.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Fecha</th>
                      <th className="px-3 py-2">Descripción</th>
                      <th className="px-3 py-2 text-right">Monto</th>
                      <th className="px-3 py-2 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {candidates.map(cand => (
                      <tr key={cand.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-3 py-2 text-gray-900 dark:text-white whitespace-nowrap">{cand.fecha.split('T')[0]}</td>
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-300 truncate max-w-[150px]" title={cand.descripcion}>
                          {cand.descripcion}
                        </td>
                        <td className={`px-3 py-2 text-right font-medium ${cand.tipo_movimiento === 'egreso' ? 'text-red-600' : 'text-green-600'}`}>
                          {cand.tipo_movimiento === 'egreso' ? '-' : ''}{formatCurrency(cand.monto)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button 
                            onClick={() => handleConfirm(cand.id)}
                            className="text-xs bg-brand-500 text-white px-2 py-1 rounded hover:bg-brand-600 transition-colors"
                          >
                            Conciliar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // Render modal in portal
  return createPortal(modalContent, document.body);
}
