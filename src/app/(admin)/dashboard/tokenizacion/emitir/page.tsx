import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EmissionForm from "@/components/tokenization/EmissionForm";

export default function TokenEmissionPage() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Emisión de Títulos Valor Digitales"
      />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* Contenedor Principal del Formulario */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Nueva Emisión (ERC-1400)
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Este proceso registrará legalmente el título valor y actualizará el Cap Table automáticamente.
              </p>
            </div>

            {/* Componente del Formulario */}
            <EmissionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
