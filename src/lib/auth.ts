// En: src/lib/auth.ts

import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Esta es la "plantilla" de los datos que guardamos en nuestro token
export interface UserPayload {
  userId: number;
  email: string;
  tenant: string;
  fullName: string; 
  roles: string[];
}

/**
 * Verifica el token de autenticación de la solicitud.
 * Si el token es válido, devuelve el payload (datos del usuario).
 * Si no, lanza un error.
 */
export function verifyAuth(req: NextRequest): UserPayload {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    throw new Error('No autenticado: Token no encontrado.');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('Error: JWT_SECRET no está definido');
    throw new Error('Error de configuración del servidor.');
  }

  try {
    // Verificar el token y devolver los datos del usuario
    const payload = jwt.verify(token, secret) as UserPayload;
    return payload;
  } catch (_err) {
    // Token inválido o expirado
    throw new Error('No autenticado: Token inválido.');
  }
}

/**
 * Verifica si el usuario autenticado tiene un rol específico.
 * Devuelve true si el usuario tiene el rol, false en caso contrario o si no está autenticado.
 */
export function hasRole(req: NextRequest, roleName: string): boolean {
  try {
    const user = verifyAuth(req);
    return user.roles && user.roles.includes(roleName);
  } catch (_error) {
    // Si verifyAuth lanza un error (ej. no autenticado, token inválido), el usuario no tiene el rol.
    return false;
  }
}