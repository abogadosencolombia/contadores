import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 1. Auth check
    let user;
    try {
      user = verifyAuth(req);
    } catch (e) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Role check
    const hasAllowedRole = user.roles.some(role => ['admin', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // 3. Parse Body
    const body = await req.json();
    const { estado, evidencia_respuesta, detalle_resolucion } = body;

    // Validation
    if (!['RESUELTO', 'RECHAZADO'].includes(estado)) {
      return NextResponse.json(
        { error: "El estado debe ser 'RESUELTO' o 'RECHAZADO'" },
        { status: 400 }
      );
    }

    // Prepare resolution text (combining evidence and details if both present)
    let finalEvidence = evidencia_respuesta || '';
    if (detalle_resolucion) {
        finalEvidence = finalEvidence ? `${finalEvidence}\n\nDetalle: ${detalle_resolucion}` : detalle_resolucion;
    }

    // 4. Update Database
    const query = `
      UPDATE core.solicitudes_arco
      SET 
        estado = $1,
        fecha_resolucion = NOW(),
        responsable_id = $2,
        evidencia_respuesta = $3
      WHERE id = $4
      RETURNING *
    `;

    const values = [
      estado,
      user.userId,
      finalEvidence,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    const updatedRequest = result.rows[0];

    // 5. Send Email Notification (Async - Fire and forget logic within the request context)
    // We wrap it in a separate try/catch so it doesn't block the response if it fails
    try {
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Actualización de Solicitud ARCO</h2>
                <p>Estimado usuario,</p>
                <p>Su solicitud de derechos ARCO ha sido actualizada al estado: <strong style="color: ${estado === 'RESUELTO' ? 'green' : 'red'}">${estado}</strong>.</p>
                
                <h3>Detalle de la resolución:</h3>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ccc;">
                    ${detalle_resolucion || 'Sin detalles adicionales.'}
                </p>
                
                ${evidencia_respuesta ? `<p><strong>Evidencia/Respuesta adjunta:</strong> ${evidencia_respuesta}</p>` : ''}
                
                <p>Atentamente,<br>El equipo de Privacidad y Cumplimiento</p>
            </div>
        `;

        await sendEmail({
            to: updatedRequest.email_solicitante,
            subject: `Actualización Solicitud ARCO: ${estado}`,
            html: emailHtml
        });
    } catch (emailError) {
        console.error('FAILED TO SEND EMAIL NOTIFICATION:', emailError);
        // We proceed to return the response even if email fails
    }

    return NextResponse.json(updatedRequest);

  } catch (error: any) {
    console.error('Error resolving ARCO request:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}