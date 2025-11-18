"use client";
import React, { useState } from 'react';
import { Modal, ModalBody } from '@/components/ui/modal';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import Label from '@/components/form/Label';

interface GenerarCertificadosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiResponse {
    message: string;
    certificados?: { accionista: string; archivo: string; uuid: string }[];
    error?: string;
}

const GenerarCertificadosModal: React.FC<GenerarCertificadosModalProps> = ({ isOpen, onClose }) => {
  const [anoFiscal, setAnoFiscal] = useState<string>(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch('/api/contabilidad/certificados-dividendos/generar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ano_fiscal: parseInt(anoFiscal) }),
          credentials: 'include',
        });


        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Ocurrió un error');
        }

        setSuccess(data.message);
        onClose();

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Ocurrió un error al generar los certificados.');
        } else {
          setError('Ocurrió un error al generar los certificados.');
        }
      } finally {
        setIsLoading(false);
      }
    };

  const handleClose = () => {
    // Reset state on close
    setAnoFiscal(new Date().getFullYear().toString());
    setError(null);
    setSuccess(null);
    setIsLoading(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md p-6">
      <ModalBody>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Generar Certificados de Dividendos
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Introduce el año fiscal para el cual deseas generar los certificados. El sistema buscará los dividendos pagados y creará un PDF por cada accionista.
        </p>

        {error && <Alert variant="error" title="Error en la Generación" message={error} />}
        {success && <Alert variant="success" title="Proceso Completado" message={success} />}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="ano_fiscal">Año Fiscal</Label>
            <InputField
              id="ano_fiscal"
              name="ano_fiscal"
              type="number"
              placeholder="Ej: 2024"
              value={anoFiscal}
              onChange={(e) => setAnoFiscal(e.target.value)}
              required
              min="2000"
              max={new Date().getFullYear().toString()}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Generando...' : 'Generar Certificados'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default GenerarCertificadosModal;
