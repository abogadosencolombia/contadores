
import React, { useState, FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import Alert from '@/components/ui/alert/Alert';

interface CrearOrdenPagoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const monedaOptions = [
  { value: 'COP', label: 'COP - Peso Colombiano' },
  { value: 'USD', label: 'USD - Dólar Americano' },
];

export default function CrearOrdenPagoModal({ isOpen, onClose, onSuccess }: CrearOrdenPagoModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsCreating(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      proveedor_nit: formData.get('proveedor_nit'),
      proveedor_nombre: formData.get('proveedor_nombre'),
      monto: Number(formData.get('monto')),
      moneda: formData.get('moneda'),
      descripcion: formData.get('descripcion'),
    };

    if (!data.proveedor_nit || !data.proveedor_nombre || data.monto <= 0 || !data.moneda) {
      setError('Por favor, complete todos los campos requeridos (Proveedor, NIT, Monto > 0 y Moneda).');
      setIsCreating(false);
      return;
    }

    try {
      const res = await fetch('/api/pagos/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Error al crear la orden de pago.');
      }

      // Si todo fue bien, llamar a la función onSuccess después de un breve retraso
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-5 lg:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Crear Nueva Orden de Pago
        </h4>

        {error && <Alert variant="error" title="Error de Validación" message={error} className="mb-4" />}

        <div className="space-y-4">
          <div>
            <Label htmlFor="proveedor_nombre">Nombre del Proveedor</Label>
            <Input id="proveedor_nombre" name="proveedor_nombre" type="text" required disabled={isCreating} />
          </div>
          <div>
            <Label htmlFor="proveedor_nit">NIT del Proveedor</Label>
            <Input id="proveedor_nit" name="proveedor_nit" type="text" required disabled={isCreating} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monto">Monto</Label>
              <Input id="monto" name="monto" type="number" step="0.01" required disabled={isCreating} />
            </div>
            <div>
              <Label htmlFor="moneda">Moneda</Label>
              <Select id="moneda" name="moneda" options={monedaOptions} required disabled={isCreating} />
            </div>
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <TextArea id="descripcion" name="descripcion" rows={3} disabled={isCreating} />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose} type="button" disabled={isCreating}>
            Cancelar
          </Button>
          <Button size="sm" type="submit" disabled={isCreating}>
            {isCreating ? 'Creando Orden...' : 'Crear Orden'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
