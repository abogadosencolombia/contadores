'use client';

import React, { useState, useEffect } from 'react';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import Alert from '@/components/ui/alert/Alert';
import WompiConfigForm from '@/components/pagos/WompiConfigForm';

// Define the type for the Wompi object and its initialize callback parameters
declare global {
  interface Window {
    $wompi: {
      initialize: (callback: (data: WompiInitializeData, error: WompiInitializeError | null) => void) => void;
    };
  }
}

interface WompiInitializeData {
  sessionId: string;
}

interface WompiInitializeError {
  message: string;
  // Add other properties if known
}

export default function CajaPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [wompiError, setWompiError] = useState<string | null>(null);

  const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;

  useEffect(() => {
    if (!wompiPublicKey) {
      return;
    }

    // Wompi's script is loaded globally in layout.tsx.
    // We poll for the global $wompi object to be available.
    const interval = setInterval(() => {
      if (window.$wompi) {
        clearInterval(interval);
        window.$wompi.initialize((data: WompiInitializeData, error: WompiInitializeError | null) => {
          if (error === null) {
            setSessionId(data.sessionId);
            console.log('Wompi sessionId:', data.sessionId);
          } else {
            setWompiError(error.message || 'Error al inicializar Wompi JS.');
            console.error('Wompi initialization error:', error);
          }
        });
      }
    }, 500); // Check every 500ms

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [wompiPublicKey]);

  return (
    <>
      <PageBreadCrumb pageTitle="Gestión de Caja" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold mb-4">Flujo de Caja y Presupuestos</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Este módulo permitirá gestionar el flujo de caja, controlar vencimientos de cuentas por pagar y por cobrar, y recibir alertas de mora.
          La integración con pasarelas de pago como Wompi facilitará la conciliación bancaria.
        </p>

        {wompiPublicKey ? (
            <>
                {wompiError && <Alert variant="error" title="Error de Wompi" message={wompiError} className="mb-4" />}
                {sessionId && <Alert variant="success" title="Wompi Conectado" message={`Session ID: ${sessionId}`} className="mb-4" />}
                {!sessionId && !wompiError && <Alert variant="info" title="Wompi" message="Inicializando SDK de Wompi..." className="mb-4" />}
            </>
        ) : (
            <Alert variant="warning" title="Configuración Requerida" message="La llave pública de Wompi no está configurada en las variables de entorno (NEXT_PUBLIC_WOMPI_PUBLIC_KEY)." />
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Placeholder for Budgets */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-md mb-2">Presupuestos</h3>
            <p className="text-sm text-gray-500">Visualizar y gestionar los presupuestos mensuales y anuales.</p>
          </div>

          {/* Placeholder for Accounts Payable */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-md mb-2">Cuentas por Pagar</h3>
            <p className="text-sm text-gray-500">Seguimiento de facturas de proveedores y fechas de vencimiento.</p>
          </div>

          {/* Placeholder for Accounts Receivable */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-md mb-2">Cuentas por Cobrar</h3>
            <p className="text-sm text-gray-500">Monitorización de facturas de clientes y alertas de mora.</p>
          </div>
        </div>

        <div className="mt-8">
            <WompiConfigForm />
        </div>
      </div>
    </>
  );
}
