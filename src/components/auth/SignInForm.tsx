"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { useRouter } from 'next/navigation'; // Importar useRouter
import Alert from "../ui/alert/Alert"; // Importar Alerta

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  // --- Estados para retroalimentación ---
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter(); // Instancia del router

  // --- Función de envío ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al iniciar sesión.');
      } else {
        // ¡Éxito! Redirigir al dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor. Inténtelo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col flex-1 w-full lg:w-1/2">
      <div className="w-full max-w-md mx-auto sm:pt-10 mb-5">
        <Link
          href="/dashboard" // Corregido
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Volver al dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu correo y contraseña para iniciar sesión
            </p>
          </div>
          <div>
            {/* ... (Botones Google/X) ... */}
            
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
              <div className="space-y-6">
                
                {/* --- Alerta de Error --- */}
                {error && <Alert variant="error" title="Error de Inicio de Sesión" message={error} />}

                <div>
                  <Label htmlFor="email">
                    Correo <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    id="email"
                    name="email"
                    placeholder="info@gmail.com" 
                    type="email" 
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Contraseña <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id="remember-me"
                      checked={isChecked} 
                      onChange={setIsChecked} 
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember-me" className="mb-0">
                      Mantenerme conectado
                    </Label>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div>
                  <button 
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </div>
              </div>
            </form>
            {/* --- FIN DEL FORMULARIO --- */}

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿No tienes una cuenta? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}