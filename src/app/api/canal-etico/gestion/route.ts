// En: src/app/api/canal-etico/gestion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth, UserPayload } from '@/lib/auth';

// --- GET (Listar Casos para el Comité) ---
export async function GET(req: NextRequest) {
  let decoded: UserPayload;
  try {
    decoded = verifyAuth(req);
  } catch (err: unknown) {
    return NextResponse.json({ message: (err as Error).message }, { status: 401 });
  }

  try {
    const tenantId = decoded.tenant;
    const result = await db.query(
      `SELECT id, caso_uuid, titulo, tipo_irregularidad, estado, fecha_creacion
       FROM core.canal_etico_casos
       WHERE tenant_id = $1
       ORDER BY fecha_creacion DESC`,
      [tenantId]
    );
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/canal-etico/gestion:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
