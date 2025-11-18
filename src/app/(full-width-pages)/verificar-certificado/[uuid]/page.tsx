'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, ErrorIcon } from '@/icons'; // Using existing icons

interface CertificadoData {
  ano_fiscal: number;
  verification_uuid: string;
  file_path: string;
  file_hash_sha256: string;
  fecha_emision: string;
  accionista_nombre: string;
  accionista_tipo_documento: string;
  accionista_numero_documento: string;
}

interface ApiResponse {
  valido: boolean;
  certificado?: CertificadoData;
  message?: string;
  error?: string;
}

export default function VerificarCertificadoPage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [isLoading, setIsLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    if (uuid) {
      const verifyCertificate = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/contabilidad/certificados-dividendos/verificar/${uuid}`);
          const data: ApiResponse = await res.json();
          setApiResponse(data);
        } catch (error) {
          setApiResponse({ valido: false, error: 'No se pudo conectar con el servidor.' });
        } finally {
          setIsLoading(false);
        }
      };

      verifyCertificate();
    }
  }, [uuid]);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-lg text-gray-600 dark:text-gray-400">Verificando certificado, por favor espere...</p>;
    }

    if (!apiResponse || !apiResponse.valido) {
      return (
        <div className="text-center">
          <ErrorIcon className="w-16 h-16 mx-auto text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-red-700 dark:text-red-500">Certificado Inválido o no Encontrado</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            El identificador único no corresponde a ningún certificado en nuestros registros o ha expirado.
          </p>
        </div>
      );
    }

    const { certificado } = apiResponse;
    if (!certificado) {
        return null; // Should not happen if valido is true
    }

    return (
      <div className="text-center">
        <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-green-700 dark:text-green-500">Certificado Válido</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          La autenticidad de este certificado ha sido confirmada.
        </p>

        <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-left max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalles del Certificado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium text-gray-500">Accionista:</p>
                    <p className="text-gray-800 dark:text-gray-200">{certificado.accionista_nombre}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-500">Identificación:</p>
                    <p className="text-gray-800 dark:text-gray-200">{certificado.accionista_tipo_documento} {certificado.accionista_numero_documento}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-500">Año Fiscal:</p>
                    <p className="text-gray-800 dark:text-gray-200">{certificado.ano_fiscal}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-500">Fecha de Emisión:</p>
                    <p className="text-gray-800 dark:text-gray-200">{new Date(certificado.fecha_emision).toLocaleString('es-CO')}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="font-medium text-gray-500">Ruta del Archivo:</p>
                    <p className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all">{certificado.file_path}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="font-medium text-gray-500">Hash del Archivo (SHA-256):</p>
                    <p className="text-gray-800 dark:text-gray-200 font-mono text-xs break-all">{certificado.file_hash_sha256}</p>
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Verificación de Autenticidad de Certificado</h1>
        {renderContent()}
      </div>
    </div>
  );
}
