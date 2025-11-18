"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [consentTerms, setConsentTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const fname = formData.get('fname') as string;
    const lname = formData.get('lname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    // --- CAMBIO 1: Leer el nuevo campo ---
    const codigo_invitacion = formData.get('codigo_invitacion') as string;

    if (!fname || !lname || !email || !password) {
      setError('Por favor, completa todos los campos obligatorios.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }
    if (password.length < 12) {
      setError('La contraseña debe tener al menos 12 caracteres.');
      setIsLoading(false);
      return;
    }
    if (!consentTerms) {
      setError('Debe aceptar la Política de Tratamiento de Datos (Ley 1581).');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- CAMBIO 2: Enviar las claves correctas que la API espera ---
        body: JSON.stringify({
          email: email,
          password: password,
          fullName: `${fname} ${lname}`, // API espera 'full_name'
          codigo_invitacion: codigo_invitacion || null, // API espera 'codigo_invitacion'
          consentTerms: consentTerms, // API espera 'has_consented'
          consentMarketing: consentMarketing // API espera 'consent_marketing'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Ocurrió un error durante el registro.');
      } else {
        setSuccess('¡Registro exitoso! Redirigiendo a Iniciar Sesión...');
        (event.target as HTMLFormElement).reset();
        setConsentTerms(false);
        setConsentMarketing(false);
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al servidor. Inténtelo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md mx-auto sm:pt-10 mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Volver al inicio
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Crear Cuenta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tus datos para registrarte
            </p>
          </div>
          <div>
            {/* ... (Botones de Google/X omitidos por brevedad) ... */}

            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  O
                </span>
              </div>
            </div>

            {/* --- INICIO DEL FORMULARIO --- */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">

                {/* --- Alertas de Estado --- */}
                <div className="space-y-2">
                  {error && <Alert variant="error" title="Error de Registro" message={error} />}
                  {success && <Alert variant="success" title="Éxito" message={success} />}
                </div>

                {/* --- CAMBIO 3: Añadir el campo de Código de Franquicia --- */}
                <div>
                  <Label htmlFor="codigo_invitacion">
                    Código de Franquicia (Opcional)
                  </Label>
                  <Input
                    type="text"
                    id="codigo_invitacion"
                    name="codigo_invitacion" // Este 'name' es leído por formData.get()
                    placeholder="Ej: CCOL_ADMIN"
                    disabled={isLoading}
                  />
                </div>
                {/* --- FIN CAMBIO 3 --- */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label htmlFor="fname">
                      Nombre<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Ingresa tu nombre"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label htmlFor="lname">
                      Apellido<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Ingresa tu apellido"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">
                    Correo<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Ingresa tu correo"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Contraseña<span className="text-error-500">*</span> (Mín. 12 caracteres)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Ingresa tu contraseña"
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm-password">
                    Confirmar Contraseña<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Confirma tu contraseña"
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={consentTerms}
                    onChange={setConsentTerms} // <- Controlado por estado
                    id="consent-terms"
                    disabled={isLoading}
                  />
                  <Label htmlFor="consent-terms" className="mb-0">
                    Acepto los <a className="text-gray-800 dark:text-white/90" href="/legal/habeasdata" target="_blank" rel="noopener noreferrer">Términos y la Política de Tratamiento de Datos (Ley 1581)</a>
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={consentMarketing}
                    onChange={setConsentMarketing} // <- Controlado por estado
                    id="consent-marketing"
                    disabled={isLoading}
                  />
                  <Label htmlFor="consent-marketing" className="mb-0">
                    Acepto recibir comunicaciones comerciales (Ley 2300)
                  </Label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Registrando...' : 'Registrarme'}
                  </button>
                </div>
              </div>
            </form>
            {/* --- FIN DEL FORMULARIO --- */}

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
