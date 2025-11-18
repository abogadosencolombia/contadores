// src/app/(admin)/dashboard/tasas-cambio/page.tsx

import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import Conversor from './Conversor'; // Importamos el nuevo componente

// Definimos la estructura de la respuesta de nuestra API
interface RatesData {
  USD_TO_COP: number;
  EUR_TO_COP: number;
  EUR_TO_USD: number;
  lastUpdated: string;
  trmSourceDate: string;
}

// 1. Función para obtener las tasas desde TU API interna
async function getRates(): Promise<RatesData | null> {
  try {
    // Para fetch en Server Components, usamos la URL absoluta.
    // ¡Asegúrate de tener NEXT_PUBLIC_URL en tus archivos .env!
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/tasas-cambio`, {
      // Revalidamos esta página cada hora. El API route tiene su propio cache de 24h.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Respuesta de API no fue exitosa');
    }
    return res.json();
  } catch (error) {
    console.error("Error en getRates:", error);
    return null; // Devolvemos null en caso de error
  }
}

// 2. La página (Server Component)
export default async function TasasCambioPage() {
  const rates = await getRates();

  return (
    <>
      <PageBreadCrumb pageTitle="Tasas de Cambio" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        <ComponentCard title="TRM Oficial (USD - COP)">
          {rates ? (
            <div className="space-y-2">
              <p className="text-3xl font-bold text-blue-600">
                ${rates.USD_TO_COP.toLocaleString('es-CO', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vigente desde: {new Date(rates.trmSourceDate).toLocaleDateString('es-CO', { timeZone: 'UTC' })}
              </p>
            </div>
          ) : (
            <p className="text-red-500">No se pudo cargar la tasa.</p>
          )}
        </ComponentCard>

        <ComponentCard title="Tasa Calculada (EUR - COP)">
          {rates ? (
            <div className="space-y-2">
              <p className="text-3xl font-bold text-green-600">
                ${rates.EUR_TO_COP.toLocaleString('es-CO', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                Referencia EUR/USD: {rates.EUR_TO_USD.toFixed(4)}
              </p>
            </div>
          ) : (
            <p className="text-red-500">No se pudo cargar la tasa.</p>
          )}
        </ComponentCard>
        
        {/* Aquí agregamos el conversor en la misma fila en pantallas grandes */}
        <div className="md:col-span-2 xl:col-span-1">
          <Conversor rates={rates} />
        </div>
      </div>

      <div className="mt-4 text-xs text-center text-gray-400">
        {rates ? `Última actualización de la API: ${new Date(rates.lastUpdated).toLocaleString('es-CO')}` : ''}
      </div>
    </>
  );
}
