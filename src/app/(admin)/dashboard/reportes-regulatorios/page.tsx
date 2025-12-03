'use client';
import Button from '@/components/ui/button/Button';
import React, { useState, useEffect, useCallback } from 'react';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import GenerarReporteModal from '@/components/reportes/GenerarReporteModal';
import { useAuth } from '@/hooks/useAuth';
import Alert from '@/components/ui/alert/Alert';

type ReporteRegulatorio = {
  id: number;
  entidad_regulatoria: string;
  tipo_reporte: string;
  periodo_reportado: string;
  fecha_generacion: string;
  estado: string;
  storage_path_reporte: string;
};

const ReportesPage = () => {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth();
  const [reportes, setReportes] = useState<ReporteRegulatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // Nuevo estado para errores de API

  const fetchReportes = useCallback(() => {
    setLoading(true);
    setApiError(null);
    fetch('/api/reportes-regulatorios')
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || errorText);
          } catch {
            throw new Error(errorText || `Error de red o servidor: ${res.status}`);
          }
        }
        return res.json();
      })
      .then((data) => {
        setReportes(data);
      })
      .catch(err => {
        console.error("Error cargando reportes:", err.message);
        setApiError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user) {
      fetchReportes();
    }
  }, [user, fetchReportes]);

  const handleGenerarSuccess = (nuevoReporte: unknown) => {
    console.log('Reporte generado exitosamente:', nuevoReporte);
    setIsModalOpen(false);
    fetchReportes();
  };

  const handleEnviarReporte = (reporteId: number) => {
    console.log('Enviando reporte...', reporteId);
    setApiError(null);
    fetch(`/api/reportes-regulatorios/${reporteId}/enviar`, {
      method: 'POST'
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || errorText);
        } catch {
          throw new Error(errorText || `Error de red o servidor: ${res.status}`);
        }
      }
      return res.json();
    })
    .then(data => {
      console.log('Respuesta de envío:', data);
      fetchReportes();
    })
    .catch(err => {
      console.error("Error enviando reporte:", err);
      setApiError(err.message);
    });
  };

  const handleDownloadReporte = (reporteId: number) => {
    console.log('Descargando reporte...', reporteId);
    setApiError(null);
    fetch(`/api/reportes-regulatorios/${reporteId}/descargar`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.error || errorText);
          } catch {
            throw new Error(errorText || `Error al descargar el reporte: ${res.status}`);
          }
        }
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = `reporte_${reporteId}.xml`;
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        return { blob: await res.blob(), filename };
      })
      .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log('Reporte descargado exitosamente.');
      })
      .catch((err) => {
        console.error('Error descargando reporte:', err.message);
        setApiError(err.message);
      });
  };

  if (isAuthLoading) {
    return <p className="text-center py-20">Verificando autenticación...</p>;
  }

  if (authError || !user) {
    return <Alert variant="error" title="Acceso Denegado" message={authError || "Debes iniciar sesión para ver esta página."} />;
  }

  return (
    <>
      <PageBreadCrumb pageTitle="Reportes Regulatorios" />
      {apiError && <Alert variant="error" title="Error" message={apiError} className="mb-4" />}

      <div className="flex justify-end mb-4">
        {user.roles.includes('admin') && (
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="sm"
          >
            Generar Nuevo Reporte
          </Button>
        )}
      </div>

      <GenerarReporteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleGenerarSuccess}
      />

      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 rounded-lg">
        {loading ? (
          <p>Cargando reportes...</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reportes.length === 0 && (
              <li className="py-3 text-center text-gray-500 dark:text-gray-400">
                No se han generado reportes.
              </li>
            )}
            {reportes.map((r) => (
              <li key={r.id} className="py-3 px-2 flex justify-between items-center">
                <div>
                  <span className="font-medium text-black dark:text-white">{r.entidad_regulatoria} - {r.tipo_reporte}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Período: {new Date(r.periodo_reportado).toLocaleDateString()} | Estado:
                    <strong className={`ml-1 ${r.estado === 'GENERADO' ? 'text-yellow-500' : r.estado === 'ENVIADO' ? 'text-green-500' : 'text-red-500'}`}>
                      {r.estado}
                    </strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  {user.roles.includes('admin') && r.estado === 'GENERADO' && (
                    <Button
                      onClick={() => handleEnviarReporte(r.id)}
                      variant="primary"
                      size="sm"
                      className="bg-success-500 hover:bg-success-600 dark:bg-success-500 dark:hover:bg-success-600"
                    >
                      Enviar
                    </Button>
                  )}
                  {user.roles.includes('admin') && (r.estado === 'GENERADO' || r.estado === 'ENVIADO') && (
                    <Button
                      onClick={() => handleDownloadReporte(r.id)}
                      variant="secondary"
                      size="sm"
                      className="ml-2"
                    >
                      Descargar
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ReportesPage;
