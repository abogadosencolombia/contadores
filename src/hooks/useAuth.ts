// En: src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Definimos la estructura de los datos del usuario que esperamos de la API
interface User {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  tenant: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        
        if (!res.ok) {
          // Si la respuesta no es OK (ej. 401 No autenticado), redirigimos a signin
          router.push('/signin');
          return;
        }

        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        setError('No se pudo obtener la información del usuario.');
        // Opcional: redirigir también en caso de error de red
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  return { user, isLoading, error };
}
