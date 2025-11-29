import React from "react";
import KycVerificationForm from "@/components/kyc/KycVerificationForm"; // Ajusta la ruta si es necesario
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verificación de Identidad | Admin Dashboard",
  description: "Formulario de validación KYC y escaneo AML.",
};

export default function KycPage() {
  return (
    <div className="mx-auto max-w-270">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Verificación de Identidad (KYC)
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* Componente del Formulario */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Carga de Documentos
              </h3>
            </div>
            <div className="p-6.5">
              <p className="mb-6 text-sm text-gray-500">
                Por favor, habilita tu ubicación y sube tu documento de identidad para realizar el análisis de riesgos.
              </p>
              <KycVerificationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
