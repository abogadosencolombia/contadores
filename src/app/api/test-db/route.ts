// En: src/app/api/test-db/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Importamos nuestra conexión a la BD

// Esta función maneja las peticiones GET
export async function GET() {
  try {
    // 1. Ejecutamos una consulta simple
    const result = await db.query('SELECT NOW()', []);

    // 2. Devolvemos el éxito y la hora del servidor de BD
    return NextResponse.json({
      success: true,
      message: 'Base de datos conectada exitosamente desde Next.js',
      timestamp: result.rows[0].now,
    }, { status: 200 });

  } catch (err: any) {
    // 3. Devolvemos un error si falla
    console.error('Error al conectar con la base de datos:', err);
    return NextResponse.json({
      success: false,
      message: 'Error al conectar con la base de datos',
      error: err.message,
    }, { status: 500 });
  }
}