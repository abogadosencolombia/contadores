// src/app/(admin)/dashboard/tasas-cambio/Conversor.tsx

'use client';

import { useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import InputField from '@/components/form/input/InputField';
import Icon from '@/components/common/Icon';

// Recibimos las tasas que el Server Component obtuvo
interface Rates {
  USD_TO_COP: number;
  EUR_TO_COP: number;
}

interface ConversorProps {
  rates: Rates | null; // Aceptamos que 'rates' puede ser null
}

export default function Conversor({ rates }: ConversorProps) {
  const [copAmount, setCopAmount] = useState(100000);

  // Si no hay tasas (porque están cargando o hubo un error),
  // mostramos un estado de carga.
  if (!rates) {
    return (
      <ComponentCard title="Conversor Interactivo">
        <div className="flex h-20 items-center justify-center">
          <p className="text-gray-500">Cargando tasas de cambio...</p>
        </div>
      </ComponentCard>
    );
  }
  const usdAmount = copAmount / rates.USD_TO_COP;
  const eurAmount = copAmount / rates.EUR_TO_COP;

  const _copFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const eurFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

  return (
    <ComponentCard title="Conversor Interactivo">
      <div className="space-y-4">
        {/* Input para COP */}
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Monto en Pesos (COP)
          </label>
          <div className="relative">
            <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-lg font-bold">
              $
            </span>
            <InputField
              type="number"
              placeholder="Ingrese el monto en COP"
              value={copAmount.toString()}
              onChange={(e) => setCopAmount(Number(e.target.value))}
              className="pl-9"
            />
          </div>
        </div>

        {/* Resultados */}
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Icon name="dollar-line" className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-black dark:text-white">Dólares (USD)</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {usdFormatter.format(usdAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Icon name="dollar-line" className="h-5 w-5 text-green-500" />
              <span className="font-medium text-black dark:text-white">Euros (EUR)</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {eurFormatter.format(eurAmount)}
            </span>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
