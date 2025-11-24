'use client';

import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import TextArea from '@/components/form/input/TextArea';

interface CerrarHallazgoModalProps {
  isOpen: boolean;
  onClose: () => void;
  hallazgoId: number;
  onSuccess?: () => void;
}

export default function CerrarHallazgoModal({
  isOpen,
  onClose,
  hallazgoId,
  onSuccess,
}: CerrarHallazgoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Debe adjuntar una evidencia para cerrar el hallazgo.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload File
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Error al subir el archivo');
      const { url } = await uploadRes.json();

      // 2. Update Hallazgo
      const updateRes = await fetch(`/api/iso/hallazgos/${hallazgoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'CERRADO',
          evidenciaCierreUrl: url,
          evidenciaCierre: description || 'Cierre con evidencia adjunta.', // Mapping to text field as well
          fechaCierre: new Date().toISOString(),
        }),
      });

      if (!updateRes.ok) throw new Error('Error al cerrar el hallazgo');

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <ModalHeader title="Cerrar Hallazgo" onClose={onClose} />
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center dark:bg-gray-800 dark:border-gray-600">
            <input
              type="file"
              id="evidencia"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png,.jpeg"
            />
            <label htmlFor="evidencia" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">📎</span>
                <span className="text-sm font-medium text-brand-500 hover:text-brand-600">
                  {file ? file.name : 'Haga clic para subir evidencia (PDF/Imagen)'}
                </span>
                {!file && <span className="text-xs text-gray-500">Obligatorio para cerrar</span>}
              </div>
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción del Cierre / Comentarios
            </label>
            <TextArea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalle cómo se resolvió el hallazgo..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Cerrando...' : 'Cerrar Hallazgo'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
