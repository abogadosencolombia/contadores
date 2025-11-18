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
    // 1. Buscar al usuario (SELECT * ya incluye la nueva columna 'full_name')
    const userQuery = 'SELECT * FROM core.users WHERE email = $1';
    const userResult = await db.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = userResult.rows[0];

    // 2. Comparar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // --- INICIO: Obtener roles del usuario ---
    const rolesQuery = `
      SELECT r.nombre_rol 
      FROM core.user_roles ur
      JOIN core.roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
    `;
    const rolesResult = await db.query(rolesQuery, [user.id]);
    const roles = rolesResult.rows.map(row => row.nombre_rol);
    // --- FIN: Obtener roles del usuario ---

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

  } catch (err: any) {
    console.error('Error en /api/auth/signin:', err);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}