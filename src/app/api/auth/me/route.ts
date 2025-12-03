// En: src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { UserPayload } from '@/lib/auth';

export async function GET(req: NextRequest) {
  
  const token = req.cookies.get('auth_token');

  if (!token) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET no está definido');
  }

  try {
    const payload = jwt.verify(token.value, secret) as UserPayload;

    return NextResponse.json({
      id: payload.userId,
      email: payload.email,
      tenant: payload.tenant,
      fullName: payload.fullName,
      roles: payload.roles,
    }, { status: 200 });

  } catch (_err) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }
}