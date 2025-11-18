"use client";

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para "rebotar" (debounce) un valor.
 * Solo actualiza el valor devuelto después de que el 'delay' (retraso) haya pasado
 * desde la última vez que cambió el 'value'.
 * @param value El valor a rebotar (ej. el texto de búsqueda).
 * @param delay El tiempo en milisegundos (ej. 300).
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Estado para guardar el valor rebotado
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Inicia un temporizador para actualizar el valor
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el 'value' cambia (ej. el usuario sigue escribiendo)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el valor o el retraso cambian

  return debouncedValue;
}
