'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { getBankAccounts, syncAccountAction, getReconciliationData, confirmMatchAction, createMovementFromBankAction } from './actions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Account {
  id: number;
  nombre_banco: string;
  numero_cuenta_display: string;
}

interface ExternalTx {
  id: number;
  fecha: string; // ISO string from JSON
  descripcion_original: string;
  monto: string; // numeric string
  conciliado: boolean;
  movimiento_caja_id?: number;
  descripcion_interna?: string; // Added for reconciled transactions
}

interface InternalTx {
  id: number;
  fecha: string;
  tipo_movimiento: string;
  monto: string;
  descripcion: string;
  conciliado: boolean;
}

interface Suggestion {
    external: ExternalTx;
    candidates: InternalTx[]; // Using InternalTx type for candidates
}

export default function ConciliacionPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [externalUnmatched, setExternalUnmatched] = useState<ExternalTx[]>([]);
  const [reconciled, setReconciled] = useState<ExternalTx[]>([]); // Assuming reconciled from external perspective
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const loadAccounts = useCallback(async () => {
    try {
      const accs = await getBankAccounts();
      setAccounts(accs);
      if (accs.length > 0) {
        setSelectedAccount(accs[0].id);
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast.error("Error al cargar cuentas bancarias");
    }
  }, []);

  const loadData = useCallback(async (accountId: number) => {
    setLoading(true);
    try {
      const data = await getReconciliationData(accountId);
      
      setReconciled(data.reconciled);
      setExternalUnmatched(data.unmatched);
      setSuggestions(data.suggestions);

    } catch (error) {
      console.error("Error loading reconciliation data:", error);
      toast.error("Error al cargar datos de conciliación");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (selectedAccount) {
      loadData(selectedAccount);
    } else {
        setReconciled([]);
        setExternalUnmatched([]);
        setSuggestions([]);
    }
  }, [selectedAccount, loadData]);

  const handleSync = async () => {
    if (!selectedAccount) return;
    setLoading(true);
    try {
      await syncAccountAction(selectedAccount);
      toast.success("Sincronización completada y conciliación automática ejecutada");
      if(selectedAccount) loadData(selectedAccount); // Reload data after sync
    } catch (error) {
      console.error("Error syncing:", error);
      toast.error("Error al sincronizar con el banco");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMatch = async (internalId: number, externalId: number) => {
      setLoading(true); // Disable buttons during reconciliation
      const result = await confirmMatchAction(internalId, externalId);
      if (result.success) {
          toast.success("Conciliación manual exitosa!");
          if(selectedAccount) loadData(selectedAccount); // Reload data to reflect changes
      } else {
          toast.error("Error al conciliar manualmente: " + result.error);
      }
      setLoading(false); // Re-enable buttons
  };

  const handleCreateMovement = async (externalId: number, isExpense: boolean) => {
      const actionText = isExpense ? "crear GASTO" : "crear INGRESO";
      if (!confirm(`¿Estás seguro de que deseas ${actionText} a partir de este movimiento bancario?`)) {
          return;
      }

      setLoading(true);
      try {
          const result = await createMovementFromBankAction(externalId);
          if (result.success) {
              toast.success(`Movimiento creado y conciliado correctamente.`);
              if (selectedAccount) loadData(selectedAccount);
          } else {
              toast.error(`Error al crear movimiento: ${result.error}`);
          }
      } catch (error) {
          console.error("Error creating movement:", error);
          toast.error("Error inesperado al crear movimiento.");
      } finally {
          setLoading(false);
      }
  };


  const formatCurrency = (amount: string | number) => {
    const num = Number(amount);
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageBreadCrumb pageTitle="Conciliación Bancaria Inteligente" />
      <ToastContainer style={{ zIndex: 999999 }} />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cuenta Bancaria
            </label>
            <select
              className="block w-full md:w-64 rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 p-2.5"
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(Number(e.target.value))}
              disabled={accounts.length === 0 || loading}
            >
              {accounts.length === 0 && <option value="">No hay cuentas disponibles</option>}
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.nombre_banco} - {acc.numero_cuenta_display}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSync}
            disabled={!selectedAccount || loading}
            className={`flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-all ${
              (!selectedAccount || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              'Sincronizar y Conciliar'
            )}
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: SUGERENCIAS DE IA (Lo más importante) */}
      {suggestions.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center gap-2">
                ✨ Sugerencias de Conciliación ({suggestions.length})
            </h3>
            <div className="space-y-4">
                {suggestions.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Banco detectó:</p>
                            <div className="font-medium text-gray-900 dark:text-white">{item.external.descripcion_original}</div>
                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatCurrency(item.external.monto)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.external.fecha)}</div>
                        </div>
                        
                        <div className="hidden md:block text-gray-400">↔️</div>

                        <div className="flex-1 md:border-l md:pl-4">
                            <p className="text-sm text-gray-500">Posible coincidencia en Libros:</p>
                            {item.candidates.map((cand: any) => (
                                <div key={cand.id} className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <div className="font-medium text-gray-900 dark:text-white">{cand.descripcion}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(cand.fecha)}</div>
                                    <button 
                                        onClick={() => handleConfirmMatch(cand.id, item.external.id)}
                                        disabled={loading}
                                        className="mt-2 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Confirmar Coincidencia
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* SECCIÓN 2: GRID DE DATOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla Izquierda: Movimientos Bancarios Sin Resolver */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Por Conciliar en Banco ({externalUnmatched.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">Fecha</th>
                  <th scope="col" className="px-4 py-3">Descripción</th>
                  <th scope="col" className="px-4 py-3 text-right">Monto</th>
                  <th scope="col" className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {externalUnmatched.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Todas las transacciones externas están conciliadas o sugeridas.</td></tr>
                ) : (
                    externalUnmatched.map((tx) => (
                    <tr key={tx.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatDate(tx.fecha)}
                        </td>
                        <td className="px-4 py-3 truncate max-w-[200px]" title={tx.descripcion_original}>
                        {tx.descripcion_original}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${Number(tx.monto) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {formatCurrency(tx.monto)}
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button 
                                onClick={() => handleCreateMovement(tx.id, Number(tx.monto) < 0)}
                                disabled={loading}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {Number(tx.monto) < 0 ? '+ Crear Gasto' : '+ Crear Ingreso'}
                            </button>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Tabla Derecha: Historial Reciente */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Últimos Conciliados ({reconciled.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">Fecha Banco</th>
                  <th scope="col" className="px-4 py-3">Descripción Banco</th>
                  <th scope="col" className="px-4 py-3 text-right">Monto</th>
                  <th scope="col" className="px-4 py-3">Descripción Interna</th>
                </tr>
              </thead>
              <tbody>
                {reconciled.length === 0 ? (
                     <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No hay transacciones conciliadas recientemente.</td></tr>
                ) : (
                    reconciled.map((tx) => (
                    <tr key={tx.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 bg-green-50 dark:bg-green-900/20">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatDate(tx.fecha)}
                        </td>
                        <td className="px-4 py-3 truncate max-w-[150px]" title={tx.descripcion_original}>
                        {tx.descripcion_original}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${Number(tx.monto) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {formatCurrency(tx.monto)}
                        </td>
                        <td className="px-4 py-3 truncate max-w-[150px]" title={tx.descripcion_interna}>
                        {/* Assuming descripcion_interna comes from the joined movements_caja */}
                        {tx.descripcion_interna}
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}