import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(_req: NextRequest) {
  try {
    const client = await db.connect();

    // 1. Agregar fecha_ingreso a core.accionistas
    await client.query(`
      ALTER TABLE core.accionistas 
      ADD COLUMN IF NOT EXISTS fecha_ingreso DATE DEFAULT CURRENT_DATE;
    `);

    // 2. Crear tabla de configuración de dividendos
    // Se usa tenant_id como PK compuesta o simple para tener 1 config por tenant
    await client.query(`
      CREATE TABLE IF NOT EXISTS core.configuracion_dividendos (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL,
        ano_fiscal INTEGER NOT NULL,
        valor_accion NUMERIC(15, 2) NOT NULL DEFAULT 0,
        porcentaje_dividendo NUMERIC(5, 2) NOT NULL DEFAULT 0,
        porcentaje_retencion NUMERIC(5, 2) NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tenant_id, ano_fiscal)
      );
    `);

    client.release();
    return NextResponse.json({ message: 'Migración completada exitosamente' });
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(error); // Keep original error for full context in logs
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
