'use client';

import React, { useState, useEffect } from 'react';
import FileInput from '@/components/form/input/FileInput';

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
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !location) return;

    try {
      setErrorMessage(null);
      setStatus('uploading');

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

      setStatus('submitting');

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

      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Ocurrió un error inesperado.');
      setStatus('error');
    }
  };

  if (loadingLocation) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">Obteniendo ubicación para verificación de seguridad...</p>
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

  if (status === 'success') {
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
          disabled={!file || status !== 'idle'}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all
            ${!file || status !== 'idle' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {status === 'idle' && 'Iniciar Verificación'}
          {status === 'uploading' && (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando documentos...
            </span>
          )}
          {status === 'submitting' && (
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
