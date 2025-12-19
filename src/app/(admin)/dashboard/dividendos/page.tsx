'use client';
import { useState } from 'react';
import Breadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import { useAuth } from '@/hooks/useAuth';

// Tipos para la respuesta de n8n
interface DividendoCalculado {
  accionista_id: number;
  nombre: string;
  email: string;
  monto_bruto: number;
  retencion: number;
  monto_neto: number;
  moneda: string;
}

export default function DividendosPage() {
  const { user } = useAuth(); // Asumiendo que usas tu hook de auth
  const [dividendos, setDividendos] = useState<DividendoCalculado[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Llamar a n8n para calcular (Solo lectura)
  const handleGenerarCalculo = async () => {
    setLoading(true);
    try {
      // CAMBIO AQUÍ: Llamamos a nuestra propia API local
      const response = await fetch('/api/proxy/n8n-calculo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Error en la petición');

      const data = await response.json();
      setDividendos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error calculando:", error);
      alert("Error conectando con el motor de cálculo");
    } finally {
      setLoading(false);
    }
  };

  // 2. Guardar en Base de Datos (Sin pasarela real por ahora)
  const handleEjecutarPagos = async () => {
    if (!confirm('¿Estás seguro de registrar estas órdenes de pago?')) return;

    setSaving(true);
    try {
      // Enviamos el lote completo a tu API interna
      const res = await fetch('/api/pagos/ordenes/lote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dividendos })
      });

      if (res.ok) {
        alert('Órdenes de pago creadas exitosamente. Estado: Pendiente de Pago');
        setDividendos([]); // Limpiar tabla
      } else {
        throw new Error('Fallo al guardar');
      }
    } catch (error) {
      alert("Error guardando órdenes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Breadcrumb pageTitle="Distribución de Dividendos" />

      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow dark:bg-gray-800">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Simulación Fiscal 2025
          </h2>
          <p className="text-sm text-gray-500">Calcula ROI y Retenciones DIAN antes de pagar</p>
        </div>
        <Button
          variant="primary"
          onClick={handleGenerarCalculo}
          disabled={loading}
        >
          {loading ? 'Calculando...' : 'Generar Cálculo IA'}
        </Button>
      </div>
      {!loading && dividendos.length === 0 && (
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-center text-gray-500">
          <p>No hay dividendos pendientes para procesar en este periodo.</p>
        </div>
      )}
      {dividendos.length > 0 && (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Accionista</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Monto Bruto</th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Retención (DIAN)</th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Neto a Pagar</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Estado</th>
                </tr>
              </thead>
              <tbody>
                {dividendos.map((item, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">{item.nombre}</h5>
                      <p className="text-sm">{item.email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: item.moneda }).format(item.monto_bruto)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-red-500">
                        -{new Intl.NumberFormat('es-CO', { style: 'currency', currency: item.moneda }).format(item.retencion)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="font-bold text-success">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: item.moneda }).format(item.monto_neto)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                        Calculado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end gap-4 pb-6">
             <div className="text-right mr-4">
                <p className="text-sm text-gray-500">Total a Dispersar:</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                    dividendos.reduce((acc, curr) => acc + curr.monto_neto, 0)
                  )}
                </p>
             </div>
             <Button
               variant="primary"
               className='bg-blue-600 hover:bg-blue-700'
               onClick={handleEjecutarPagos}
               disabled={saving}
             >
               {saving ? 'Registrando...' : 'Confirmar y Registrar Órdenes'}
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
