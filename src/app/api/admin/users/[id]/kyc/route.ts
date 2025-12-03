import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Autenticación
    let user;
    try {
      user = verifyAuth(req);
    } catch {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const hasAllowedRole = user.roles.some(role => ['admin', 'finance_ai', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // 2. Parsear body
    const body = await req.json();
    const { status, _motivoRechazo } = body;

    if (!['aprobado', 'rechazado'].includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    // 3. Actualizar usuario
    // Si es rechazado, podríamos querer guardar el motivo en algún log o campo,
    // por ahora solo actualizamos el estado.

    const query = `
      UPDATE core.users
      SET kyc_status = $1
      WHERE id = $2
      RETURNING id, email, kyc_status
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // 4. Log de auditoría (Opcional pero recomendado)
    // Podríamos insertar en core.aml_log si existiera una acción de 'KYC_REVIEW'
    /*
    await pool.query(
      `INSERT INTO core.aml_log (inversionista_id, tipo_operacion, riesgo, fecha, detalles)
       VALUES ($1, 'KYC_REVIEW', 'BAJO', NOW(), $2)`,
      [id, `Estado actualizado a ${status} por admin ${user.email}`]
    );
    */

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error: unknown) {
    console.error('Error updating KYC status:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar estado' },
      { status: 500 }
    );
  }
}
