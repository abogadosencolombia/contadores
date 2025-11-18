// src/app/(admin)/dashboard/capital-extranjero/registrar/page.tsx
'use client';

import React, { useState } from 'react';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import Alert from '@/components/ui/alert/Alert';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import Select from '@/components/form/Select';
import SearchableSelect from '@/components/form/SearchableSelect'; // Importar el nuevo componente
import { useAuth } from '@/hooks/useAuth';
import paises from '@/data/paises.json'; // Importar la lista de países

const RegistrarInversionPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre_inversionista_extranjero: '',
    id_inversionista: '',
    pais_origen: 'USA',
    fecha_inversion: new Date(),
    monto_inversion: '',
    moneda_inversion: 'USD',
    monto_equivalente_cop: '',
    otra_moneda: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const countryOptions = paises
    .filter(pais => pais.code) // Filtrar países sin código
    .map(pais => ({
      value: pais.code,
      label: `${pais.name} (${pais.code})`,
    }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'moneda_inversion' && value !== 'OTRA') {
        newState.otra_moneda = '';
      }
      return newState;
    });
  };

  const handleDateChange = (selectedDates: Date[]) => {
    if (selectedDates.length > 0) {
      setFormData((prev) => ({ ...prev, fecha_inversion: selectedDates[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!user) {
      setError('No estás autenticado.');
      setIsLoading(false);
      return;
    }

    const monedaFinal = formData.moneda_inversion === 'OTRA'
      ? formData.otra_moneda.toUpperCase()
      : formData.moneda_inversion;

    if (!monedaFinal || monedaFinal.length !== 3) {
      setError('El código de la moneda debe tener 3 caracteres (ISO 4217).');
      setIsLoading(false);
      return;
    }

    const payload = {
      nombre_inversionista_extranjero: formData.nombre_inversionista_extranjero,
      id_inversionista: formData.id_inversionista,
      pais_origen: formData.pais_origen,
      fecha_inversion: new Date(formData.fecha_inversion).toISOString().split('T')[0],
      monto_inversion: parseFloat(formData.monto_inversion),
      moneda_inversion: monedaFinal,
      monto_equivalente_cop: parseFloat(formData.monto_equivalente_cop),
    };

    try {
      const response = await fetch('/api/capital-extranjero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error desconocido al registrar.');
      }

      setSuccess(`Inversión de ${result.nombre_inversionista_extranjero} registrada exitosamente (ID: ${result.id}).`);
      // Resetear formulario
      setFormData({
        nombre_inversionista_extranjero: '',
        id_inversionista: '',
        pais_origen: 'USA',
        fecha_inversion: new Date(),
        monto_inversion: '',
        moneda_inversion: 'USD',
        monto_equivalente_cop: '',
        otra_moneda: '',
      });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Registrar Inversión Extranjera" />

      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          Nueva Inversión de Capital
        </h3>

        {error && <Alert variant="error" title="Error" message={error} />}
        {success && <Alert variant="success" title="Éxito" message={success} />}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre_inversionista_extranjero">Nombre del Inversionista*</Label>
                <InputField
                  id="nombre_inversionista_extranjero"
                  name="nombre_inversionista_extranjero"
                  value={formData.nombre_inversionista_extranjero}
                  onChange={handleChange}
                  placeholder="Ej: Global Investments Inc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="id_inversionista">ID Inversionista (Fiscal/Pasaporte)</Label>
                <InputField
                  id="id_inversionista"
                  name="id_inversionista"
                  value={formData.id_inversionista}
                  onChange={handleChange}
                  placeholder="Ej: 811001234"
                />
              </div>
              <div>
                <Label htmlFor="pais_origen">País de Origen (ISO 3)*</Label>
                <SearchableSelect
                  id="pais_origen"
                  name="pais_origen"
                  value={formData.pais_origen}
                  options={countryOptions}
                  onChange={handleSelectChange}
                  placeholder="Selecciona un país..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha_inversion">Fecha de la Inversión*</Label>
                <DatePicker
                  id="fecha_inversion"
                  defaultDate={formData.fecha_inversion}
                  onChange={handleDateChange}
                />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="moneda_inversion">Moneda de Inversión*</Label>
                <Select
                    id="moneda_inversion"
                    name="moneda_inversion"
                    defaultValue={formData.moneda_inversion}
                    options={[
                        { value: 'USD', label: 'USD - Dólar Estadounidense' },
                        { value: 'EUR', label: 'EUR - Euro' },
                        { value: 'CAD', label: 'CAD - Dólar Canadiense' },
                        { value: 'OTRA', label: 'Otra' },
                    ]}
                    onChange={(value) => handleSelectChange('moneda_inversion', value)}
                />
              </div>
              {formData.moneda_inversion === 'OTRA' && (
                <div>
                  <Label htmlFor="otra_moneda">Especificar Moneda (ISO 3)*</Label>
                  <InputField
                    id="otra_moneda"
                    name="otra_moneda"
                    value={formData.otra_moneda}
                    onChange={handleChange}
                    placeholder="Ej: JPY"
                    required
                  />
                </div>
              )}
               <div>
                <Label htmlFor="monto_inversion">Monto en Moneda de Inversión*</Label>
                <InputField
                  id="monto_inversion"
                  name="monto_inversion"
                  type="number"
                  step={0.01}
                  value={formData.monto_inversion}
                  onChange={handleChange}
                  placeholder="Ej: 50000.00"
                  required
                />
              </div>
               <div>
                <Label htmlFor="monto_equivalente_cop">Monto Equivalente en COP*</Label>
                <InputField
                  id="monto_equivalente_cop"
                  name="monto_equivalente_cop"
                  type="number"
                  step={0.01}
                  value={formData.monto_equivalente_cop}
                  onChange={handleChange}
                  placeholder="Ej: 200000000.00"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Inversión'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrarInversionPage;