'use client';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BANCOS_COLOMBIA = [
  "Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Banco de Occidente",
  "Colpatria", "Banco Caja Social", "AV Villas", "Nequi", "Daviplata", "Nubank"
];

export default function CrearCuentaModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_banco: '',
    numero_cuenta: '',
    moneda: 'COP',
    descripcion: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/tesoreria/cuentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({ nombre_banco: '', numero_cuenta: '', moneda: 'COP', descripcion: '' });
      } else {
        alert('Error al crear la cuenta');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-boxdark">
        <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
          Registrar Nueva Cuenta Bancaria
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block font-medium text-black dark:text-white">Banco</label>
            <select
              className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
              value={formData.nombre_banco}
              onChange={(e) => setFormData({...formData, nombre_banco: e.target.value})}
              required
            >
              <option value="">Seleccionar Banco...</option>
              {BANCOS_COLOMBIA.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">No. Cuenta (Visible)</label>
              <input
                type="text"
                placeholder="Ej: **** 5678"
                className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
                value={formData.numero_cuenta}
                onChange={(e) => setFormData({...formData, numero_cuenta: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">Moneda</label>
              <select
                className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
                value={formData.moneda}
                onChange={(e) => setFormData({...formData, moneda: e.target.value})}
              >
                <option value="COP">COP (Pesos)</option>
                <option value="USD">USD (Dólares)</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-medium text-black dark:text-white">Descripción / Alias</label>
            <input
              type="text"
              placeholder="Ej: Cuenta Principal Recaudo"
              className="w-full rounded border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-meta-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
            >
              {loading ? 'Guardando...' : 'Guardar Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
