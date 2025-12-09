'use client';

import React, { useState, useEffect } from 'react';
import FileInput from '@/components/form/input/FileInput';
import { KycStatus } from '@/types/aml-kyc';

interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function KycVerificationForm() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(true);

  const [file, setFile] = useState<File | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'uploading' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentKycStatus, setCurrentKycStatus] = useState<KycStatus | null>(null);
  const [loadingKycStatus, setLoadingKycStatus] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no es soportada por este navegador.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoadingLocation(false);
      },
      (error) => {
        let msg = 'Error obteniendo la ubicación.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Acceso a la ubicación denegado. Es necesario para continuar.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            msg = 'Tiempo de espera agotado al obtener ubicación.';
            break;
        }
        setLocationError(msg);
        setLoadingLocation(false);
      }
    );
  }, []);

  // Fetch current KYC status on component mount
  useEffect(() => {
    async function fetchKycStatus() {
      try {
        const res = await fetch('/api/aml/status', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          console.log('KYC Status fetched:', data.status);
          setCurrentKycStatus(data.status);
        } else {
          // Handle cases where user might not have a KYC status yet, or an error occurs
          // For now, treat any error as 'unknown' or allow submission
          setCurrentKycStatus(null); // No known status, allow submission
        }
      } catch (error) {
        console.error('Error fetching KYC status:', error);
        setCurrentKycStatus(null); // Network error, allow submission for now
      } finally {
        setLoadingKycStatus(false);
      }
    }
    fetchKycStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !location) return;

    // Prevent submission if already pending or approved (double check)
    const normalizedStatus = currentKycStatus?.toLowerCase();
    if (normalizedStatus === 'pending' || normalizedStatus === 'approved') {
      setErrorMessage('No es posible subir documentos en este estado.');
      return;
    }

    try {
      setErrorMessage(null);
      setSubmissionStatus('uploading');

      // 1. Upload File
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('Error al subir el documento.');
      }

      const uploadData = await uploadRes.json();
      const documentUrl = uploadData.url;

      setSubmissionStatus('submitting');

      // 2. Submit KYC
      const kycRes = await fetch('/api/aml/submit-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentUrl,
          geoLocation: location,
        }),
      });

      if (!kycRes.ok) {
        const errorData = await kycRes.json();
        throw new Error(errorData.error || 'Error al iniciar verificación KYC.');
      }

      setSubmissionStatus('success');
    } catch (err: unknown) {
      console.error(err);
      let message = 'Ocurrió un error inesperado.';
      if (err instanceof Error) {
        message = err.message;
      }
      setErrorMessage(message);
      setSubmissionStatus('error');
    }
  };

    if (loadingLocation || loadingKycStatus) {
      return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
          <p className="text-gray-600 dark:text-gray-300 animate-pulse">Cargando estado de verificación de identidad...</p>
        </div>
      );
    }

    if (locationError) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm text-center">
          <div className="text-red-600 dark:text-red-400 font-semibold mb-2">Requerimiento de Seguridad</div>
          <p className="text-gray-700 dark:text-gray-300">{locationError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    // Display message if KYC is pending or approved
    const normalizedStatus = currentKycStatus?.toLowerCase();

    if (normalizedStatus === 'pending' || normalizedStatus === 'approved') {
      let message = '';
      let bgColor = '';
      let textColor = '';
      let icon = '';
      if (normalizedStatus === 'pending') {
              message = 'Tu verificación de identidad está en revisión. Te notificaremos el resultado pronto.';
              bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
              textColor = 'text-yellow-700 dark:text-yellow-400';
              icon = '⏳';
            } else if (normalizedStatus === 'approved') {
              message = 'Tu verificación de identidad ha sido aprobada. No necesitas subir más documentos.';
              bgColor = 'bg-green-50 dark:bg-green-900/20';
              textColor = 'text-green-700 dark:text-green-400';
              icon = '✓';
            }
            return (
              <div className={`p-4 ${bgColor} border rounded-lg shadow-sm`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold ${textColor} mb-1`}>KYC {currentKycStatus?.toUpperCase()}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
                  </div>
                </div>
              </div>
            );
    }

    // If status is 'success' after submission, show verification initiated message
    if (submissionStatus === 'success') {
      return (
        <div className="p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm text-center">
          <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">Verificación Iniciada</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Hemos recibido tu documento y ubicación. El análisis de seguridad está en proceso.
            Te notificaremos el resultado en breve.
          </p>
        </div>
      );
    }
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">

      {currentKycStatus?.toLowerCase() === 'rejected' && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Verificación Rechazada</h3>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
              Tu documento anterior no pudo ser validado o fue rechazado por nuestros sistemas de seguridad. Por favor, asegúrate de subir una imagen clara y válida.
            </p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Verificación de Identidad (KYC)</h2>

      <div className="space-y-6">
        {/* Location Indicator */}
        <div className="flex items-center gap-3 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Ubicación asegurada correctamente</span>
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Documento de Identidad (PDF, JPG, PNG)
          </label>
          <FileInput
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Máximo 5MB. Asegúrate de que sea legible.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!file || submissionStatus !== 'idle'}
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all
                    ${!file || submissionStatus !== 'idle'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {submissionStatus === 'idle' && 'Iniciar Verificación'}
                  {submissionStatus === 'uploading' && (            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando documentos...
            </span>
          )}
          {submissionStatus === 'submitting' && (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Análisis en proceso...
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
