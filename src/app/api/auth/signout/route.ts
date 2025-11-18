// En: src/app/api/auth/signout/route.ts

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // 1. Crear una cookie "vacía" que expire en el pasado.
  // Esto le dice al navegador que la elimine.
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1, // Expira inmediatamente
    path: '/',
  });

  // 2. Enviar la respuesta
  const response = NextResponse.json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  }, { status: 200 });

  // 3. Establecer la cookie expirada en la cabecera
  response.headers.set('Set-Cookie', cookie);

  return response;
}