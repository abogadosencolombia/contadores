import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

function isDbError(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error && typeof (error as { code: unknown }).code === 'string';
}

export async function POST(req: NextRequest) {
  try {
    // 1. Leer los datos del body (claves de 'SignUpForm.tsx')
    const {
      email,
      password,
      fullName, // <-- 'fullName' (enviado por el form)
      codigo_invitacion, // <-- 'codigo_invitacion' (enviado por el form)
      consentTerms, // <-- 'consentTerms' (enviado por el form)
      consentMarketing // <-- 'consentMarketing' (enviado por el form)
    } = await req.json();

    // 2. Validar datos (usando las claves del frontend)
    if (!email || !password || !fullName) {
      return NextResponse.json({ message: 'Correo, contraseña y nombre son requeridos.' }, { status: 400 });
    }
    if (password.length < 12) {
      return NextResponse.json({ message: 'La contraseña debe tener al menos 12 caracteres.' }, { status: 400 });
    }
    if (consentTerms !== true) {
      return NextResponse.json({ message: 'Debe aceptar la Política de Tratamiento de Datos (Ley 1581).' }, { status: 400 });
    }

    // 3. --- LÓGICA DE ASIGNACIÓN DE TENANT ---
    let tenantId: string;
    const fallbackTenant = 'default_tenant';

    if (codigo_invitacion) {
      // Si el usuario proveyó un código, lo buscamos
      const tenantRes = await db.query(
        'SELECT tenant_id FROM core.tenants WHERE codigo_invitacion = $1',
        [codigo_invitacion]
      );

      if (tenantRes.rows.length > 0) {
        tenantId = tenantRes.rows[0].tenant_id; // Ej: 'CCOL-001'
      } else {
        // --- ¡SOLUCIÓN AL SEGUNDO PROBLEMA! ---
        // Si el código es inválido, RECHAZAMOS el registro
        return NextResponse.json({ message: 'El código de franquicia ingresado no es válido.' }, { status: 400 });
      }
    } else {
      // Si no hay código, usamos el fallback
      tenantId = fallbackTenant;
    }
    // --- FIN LÓGICA DE TENANT ---

    // 4. Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. Insertar el nuevo usuario en la DB
    const result = await db.query(
      `INSERT INTO core.users (email, password_hash, full_name, tenant_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, tenant_id`,
      [email, hashedPassword, fullName, tenantId] // <-- usa fullName y el tenantId dinámico
    );

    const newUser = result.rows[0];
    const newUserId = newUser.id;

    // --- INICIO: Asignar rol de admin por defecto ---
    const adminRoleQuery = await db.query(`SELECT id FROM core.roles WHERE nombre_rol = 'admin'`);
    if (adminRoleQuery.rows.length === 0) {
      return NextResponse.json({ message: "El rol 'admin' no está configurado en el sistema." }, { status: 500 });
    }
    const adminRoleId = adminRoleQuery.rows[0].id;

    await db.query(
      'INSERT INTO core.user_roles (user_id, role_id) VALUES ($1, $2)',
      [newUserId, adminRoleId]
    );
    // --- FIN: Asignar rol de admin por defecto ---

    const userIp = req.headers.get('x-forwarded-for') || '127.0.0.1';


    // 6. Registrar consentimientos (Ley 1581 y Ley 2300)
    const consentLogQuery = `
      INSERT INTO core.consent_log (user_id, ip, version, finalidad, tenant)
      VALUES ($1, $2, $3, $4, $5);
    `;

    if (consentTerms === true) {
      await db.query(consentLogQuery, [newUserId, userIp, 'v3.0', 'registro', tenantId]);
    }

    if (consentMarketing === true) {
      await db.query(consentLogQuery, [newUserId, userIp, 'v3.0', 'marketing', tenantId]);
    }

    // 7. Devolver el usuario creado
    return NextResponse.json(newUser, { status: 201 });

  } catch (error: unknown) {
    console.error('Error en API de registro:', error);
    if (isDbError(error) && error.code === '23505') {
      return NextResponse.json({ message: 'El correo electrónico ya está registrado.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
