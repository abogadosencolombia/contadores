// En: src/app/api/auth/signin/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
  }

  try {
    // 1. Buscar al usuario y sus roles (Optimizado con JOIN y array_agg)
    console.log('[DEBUG] Intento de login para:', email);
    console.log('[DEBUG] Verificando variables de entorno DB:', {
      DB_USER: !!process.env.DB_USER,
      DB_HOST: !!process.env.DB_HOST,
      DB_NAME: !!process.env.DB_NAME,
      DB_PASSWORD_SET: !!process.env.DB_PASSWORD,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
    });

    const query = `
      SELECT u.*, 
             COALESCE(array_agg(r.nombre_rol) FILTER (WHERE r.nombre_rol IS NOT NULL), '{}') as roles
      FROM core.users u
      LEFT JOIN core.user_roles ur ON u.id = ur.user_id
      LEFT JOIN core.roles r ON ur.role_id = r.id
      WHERE u.email = $1
      GROUP BY u.id
    `;
    
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = result.rows[0];

    // 2. Comparar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const roles = user.roles || [];

    // 3. Crear el Token (Sesión)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está definido');
    }

    // --- CAMBIO: Añadir 'full_name' y 'roles' al token ---
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        tenant: user.tenant_id,
        fullName: user.full_name,
        roles: roles // <--- AÑADIDO
      },
      secret,
      { expiresIn: '1h' } 
    );

    // 4. Serializar el token en una cookie
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    // 5. Enviar la respuesta
    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
    }, { status: 200 });

    response.headers.set('Set-Cookie', cookie);
    return response;

  } catch (error) {
    console.error('Error en /api/auth/signin:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}