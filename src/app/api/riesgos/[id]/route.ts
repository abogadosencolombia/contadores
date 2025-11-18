// En: src/app/api/riesgos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAuth } from '@/lib/auth'; // Importamos nuestro helper

interface RiesgoParams {
  params: {
    id: string;
  }
}

/**
 * ACTUALIZA (Edita) un riesgo específico por ID
 */
export async function PATCH(req: NextRequest, { params }: RiesgoParams) {
  try {
    const user = verifyAuth(req); // 1. Verificar autenticación
    const { id } = params;         // 2. Obtener ID de la URL
    const body = await req.json(); // 3. Obtener datos del formulario

    const { dominio, riesgo, probabilidad, impacto, control, estado } = body;

    // 4. Validación
    if (!dominio || !riesgo || !probabilidad || !impacto || !control || !estado) {
      return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // 5. Ejecutar la actualización en la BD
    const query = `
      UPDATE core.riesgos
      SET
        dominio = $1,
        riesgo = $2,
        probabilidad = $3,
        impacto = $4,
        control = $5,
        estado = $6
      WHERE id = $7
      RETURNING *;
    `;
    const result = await db.query(query, [
      dominio,
      riesgo,
      parseInt(probabilidad, 10),
      parseInt(impacto, 10),
      control,
      estado,
      id
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Riesgo no encontrado' }, { status: 404 });
    }

    // 6. Devolver el riesgo actualizado
    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (err: any) {
    if (err.message.includes('No autenticado')) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error('Error en PATCH /api/riesgos/[id]:', err);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

/**
 * ELIMINA un riesgo específico por ID
 */
export async function DELETE(req: NextRequest, { params }: RiesgoParams) {
  try {
    const user = verifyAuth(req); // 1. Verificar autenticación
    const { id } = params;         // 2. Obtener ID de la URL

    // 3. Ejecutar la eliminación en la BD
    const query = 'DELETE FROM core.riesgos WHERE id = $1 RETURNING *;';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Riesgo no encontrado' }, { status: 404 });
    }

    // 4. Devolver confirmación
    return NextResponse.json({ message: 'Riesgo eliminado exitosamente' }, { status: 200 });

  } catch (err: any) {
    if (err.message.includes('No autenticado')) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }
    console.error('Error en DELETE /api/riesgos/[id]:', err);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
