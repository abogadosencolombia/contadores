'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import { IsoControl, IsoHallazgoInput } from '@/types/iso-27001';

interface RegistrarHallazgoModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditoriaId: number;
  onSuccess?: () => void;
}

const TIPO_HALLAZGO_OPTIONS = [
  { value: 'NO_CONFORMIDAD_MAYOR', label: 'No Conformidad Mayor' },
  { value: 'NO_CONFORMIDAD_MENOR', label: 'No Conformidad Menor' },
  { value: 'OBSERVACION', label: 'Observación' },
  { value: 'OPORTUNIDAD_MEJORA', label: 'Oportunidad de Mejora' },
];

export default function RegistrarHallazgoModal({
  isOpen,
  onClose,
  auditoriaId,
  onSuccess,
}: RegistrarHallazgoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Listas para Selects
  const [controles, setControles] = useState<IsoControl[]>([]);
  const [usuarios, setUsuarios] = useState<{id: number, name: string}[]>([]); // Placeholder si no hay API de users pública
  
  // Form state
  const [formData, setFormData] = useState<IsoHallazgoInput>({
    auditoriaId: auditoriaId,
    descripcion: '',
    tipoHallazgo: 'NO_CONFORMIDAD_MENOR',
    controlIsoId: null,
    responsableId: null,
    accionCorrectiva: '',
    fechaCompromiso: '',
    estado: 'ABIERTO'
  });

  // Fetch controles and users al montar
  useEffect(() => {
    if (isOpen) {
      fetch('/api/iso/controles')
        .then(res => res.json())
        .then(data => setControles(data))
        .catch(console.error);
        
      fetch('/api/users/list')
        .then(res => res.json())
        .then(data => setUsuarios(data))
        .catch(console.error);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
     setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/iso/hallazgos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            auditoriaId: Number(auditoriaId),
            controlIsoId: formData.controlIsoId ? Number(formData.controlIsoId) : null,
            responsableId: formData.responsableId ? Number(formData.responsableId) : null
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al registrar hallazgo');
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const controlOptions = controles.map(c => ({
      value: String(c.id),
      label: `${c.codigo} - ${c.nombre}`
  }));

  const userOptions = usuarios.map(u => ({
      value: String(u.id),
      label: u.name
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <ModalHeader title="Registrar Hallazgo" onClose={onClose} />
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de Hallazgo
          </label>
          <Select
            options={TIPO_HALLAZGO_OPTIONS}
            onChange={(val) => handleSelectChange('tipoHallazgo', val)}
            value={formData.tipoHallazgo}
            placeholder="Seleccione tipo..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción del Hallazgo
          </label>
          <TextArea
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleChange(e)}
            rows={3}
            required
            placeholder="Detalle el hallazgo encontrado..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Control ISO Afectado
          </label>
          <Select
            options={controlOptions}
            onChange={(val) => handleSelectChange('controlIsoId', val)}
            value={formData.controlIsoId ? String(formData.controlIsoId) : ''}
            placeholder="Seleccione control (opcional)..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Responsable de la Acción
          </label>
          <Select
            options={userOptions}
            onChange={(val) => handleSelectChange('responsableId', val)}
            value={formData.responsableId ? String(formData.responsableId) : ''}
            placeholder="Asignar responsable..."
          />
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Acción Correctiva Propuesta
          </label>
          <TextArea
            name="accionCorrectiva"
            value={formData.accionCorrectiva || ''}
            onChange={(e) => handleChange(e)}
            rows={2}
            placeholder="Descripción de la acción correctiva..."
          />
        </div>

        <div>
             <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha Compromiso
             </label>
             <Input
                type="date"
                name="fechaCompromiso"
                value={formData.fechaCompromiso as string}
                onChange={handleChange}
             />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Registrar'}
          </Button>
        </div>
      </form>
      </ModalBody>
    </Modal>
  );
}
