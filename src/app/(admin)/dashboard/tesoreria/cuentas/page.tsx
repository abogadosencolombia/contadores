'use client';
import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import CrearCuentaModal from '@/components/tesoreria/CrearCuentaModal';

// Función auxiliar para formatear dinero
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function TesoreriaPage() {
  const [cuentas, setCuentas] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Esta función recarga los datos desde la BD
  const fetchCuentas = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tesoreria/cuentas');
      if (res.ok) {
        const data = await res.json();
        setCuentas(data);
      }
    } catch (error) {
      console.error("Error cargando cuentas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar al inicio
  useEffect(() => {
    fetchCuentas();
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Gestión de Tesorería" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Cuentas Bancarias
          </h2>
          <p className="text-sm font-medium text-bodydark dark:text-bodydark1 mt-1">
            Gestiona tus saldos y conciliaciones.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8"
        >
          <span>+ Nueva Cuenta</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-10 text-center">Cargando cuentas...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cuentas.map((cuenta) => (
            <div key={cuenta.id} className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   {/* Icono genérico de banco */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                    <span className="text-xl">🏦</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black dark:text-white">
                      {cuenta.nombre_banco}
                    </h4>
                    <p className="text-xs text-bodydark">{cuenta.moneda}</p>
                  </div>
                </div>
                <span className="inline-flex rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                  Activa
                </span>
              </div>

              <div className="mb-4 mt-6">
                <p className="text-sm font-medium text-bodydark2">Número de Cuenta</p>
                <p className="text-lg font-bold text-black dark:text-white tracking-wider">
                  {cuenta.numero_cuenta_display}
                </p>
              </div>

              <div className="flex items-end justify-between border-t border-stroke pt-4 dark:border-strokedark">
                <div>
                  <p className="text-xs font-medium text-bodydark2">Saldo en Libros</p>
                  <p className={`text-lg font-bold ${cuenta.saldo_actual < 0 ? 'text-danger' : 'text-primary'}`}>
                    {formatCurrency(cuenta.saldo_actual, cuenta.moneda)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {cuentas.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-sm border border-dashed border-stroke bg-gray-50 py-12 dark:border-strokedark dark:bg-boxdark-2">
              <div className="mb-3 text-4xl">📂</div>
              <h3 className="font-medium text-black dark:text-white">No hay cuentas registradas</h3>
              <p className="text-sm text-bodydark">Agrega tu primera cuenta bancaria para comenzar.</p>
            </div>
          )}
        </div>
      )}

      <CrearCuentaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchCuentas(); // ¡Esto actualiza la lista inmediatamente después de crear!
        }}
      />
    </div>
  );
}
