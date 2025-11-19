// src/components/pagos/WompiConfigForm.tsx
'use client';
import { useState, useEffect } from 'react';

// Definimos la interfaz para las cuentas que vienen del API
interface CuentaBancaria {
  id: number;
  nombre_banco: string;
  numero_cuenta_display: string;
  moneda: string;
}

export default function WompiConfigForm() {
  const [loading, setLoading] = useState(false);
  const [loadingCuentas, setLoadingCuentas] = useState(true);
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([]);

  const [formData, setFormData] = useState({
    publicKey: '',
    privateKey: '',
    integritySecret: '',
    ambiente: 'SANDBOX',
    cuentaBancariaId: ''
  });

  // 1. Cargar cuentas bancarias reales al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar configuración existente
        const resConfig = await fetch('/api/pagos/configuracion');
        const dataConfig = await resConfig.json();

        // Cargar lista de bancos
        const resBancos = await fetch('/api/tesoreria/cuentas');
        const dataBancos = await resBancos.json();

        if (Array.isArray(dataBancos)) {
          setCuentas(dataBancos);
        }

        if (dataConfig.configured) {
          setFormData(prev => ({
            ...prev,
            publicKey: dataConfig.publicKey || '',
            ambiente: dataConfig.ambiente || 'SANDBOX',
            cuentaBancariaId: dataConfig.cuentaBancariaId?.toString() || ''
          }));
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoadingCuentas(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/pagos/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Configuración guardada correctamente. Ahora puedes recibir pagos en esta cuenta.');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark mb-6">
        <h3 className="font-medium text-black dark:text-white">
          Conexión con Wompi (Pasarela de Pagos)
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Configura las credenciales para que cada franquicia recaude directamente en su cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-4">
          <div>
            <label className="mb-3 block text-black dark:text-white">Ambiente</label>
            <select
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              value={formData.ambiente}
              onChange={(e) => setFormData({...formData, ambiente: e.target.value})}
            >
              <option value="SANDBOX">Pruebas (Sandbox)</option>
              <option value="PROD">Producción</option>
            </select>
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">
              Cuenta para Conciliación {loadingCuentas && '(Cargando...)'}
            </label>
            <select
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
              value={formData.cuentaBancariaId}
              onChange={(e) => setFormData({...formData, cuentaBancariaId: e.target.value})}
              required
              disabled={loadingCuentas}
            >
              <option value="">Selecciona una cuenta...</option>
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre_banco} - {c.numero_cuenta_display} ({c.moneda})
                </option>
              ))}
            </select>
            {cuentas.length === 0 && !loadingCuentas && (
               <p className="text-xs text-red-500 mt-1">
                 No hay cuentas bancarias registradas. Ve al módulo de Tesorería primero.
               </p>
            )}
          </div>
        </div>

        {/* ... (El resto de inputs de llaves sigue igual) ... */}
        <div className="mb-4">
          <label className="mb-3 block text-black dark:text-white">Llave Pública (Public Key)</label>
          <input
            type="text"
            placeholder="pub_test_..."
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            value={formData.publicKey}
            onChange={(e) => setFormData({...formData, publicKey: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-3 block text-black dark:text-white">Llave Privada (Private Key)</label>
          <input
            type="password"
            placeholder="prv_test_..."
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            value={formData.privateKey}
            onChange={(e) => setFormData({...formData, privateKey: e.target.value})}
            // No es required si ya está configurado (se asume que no se quiere cambiar)
            // Pero para simplificar lo dejamos así o añadimos lógica extra
          />
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-black dark:text-white">Secreto de Integridad (Integrity Secret)</label>
          <input
            type="password"
            placeholder="prod_integrity_..."
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            value={formData.integritySecret}
            onChange={(e) => setFormData({...formData, integritySecret: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </form>
    </div>
  );
}
