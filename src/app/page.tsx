import Link from "next/link";
import Image from "next/image"; // 1. Importar Image de next/image
import Button from "@/components/ui/button/Button";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function WelcomePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: _todos } = await supabase.from('todos').select()
  return (
    // Contenedor principal: Centrado y con fondo temático
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-dark sm:p-8">

      {/* 2. Tarjeta de bienvenida para agrupar el contenido */}
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-theme-lg dark:bg-gray-800 sm:p-10">
        <div className="text-center">

          {/* 3. Logo: Descomentado y centrado */}
          <Image
            src="/images/logo/logo.svg" // Asegúrate que esta ruta es correcta
            alt="Logo de la Plataforma"
            width={150}
            height={40}
            className="mx-auto mb-8" // Centrado y con margen inferior
          />

          {/* 4. Título: Usando variables de tamaño del tema */}
          <h1 className="text-title-sm font-bold tracking-tight text-gray-900 dark:text-white sm:text-title-md">
            Bienvenido a la Plataforma
          </h1>

          {/* Subtítulo: Colores de texto más suaves y mejor espaciado */}
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            Inicia sesión o regístrate para gestionar tu contabilidad.
          </p>

          {/* 5. Contenedor de botones: Apilado en móvil, en línea en escritorio */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-x-6">

            <Link href="/signin" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Iniciar Sesión
              </Button>
            </Link>

            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Registrarse
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
