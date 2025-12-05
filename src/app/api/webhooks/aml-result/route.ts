// src/app/api/webhooks/aml-result/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AmlRiskLevel } from '@/types/aml-kyc';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar header de seguridad
    const secretHeader = req.headers.get('x-aml-webhook-secret');
    const envSecret = process.env.AML_WEBHOOK_SECRET;

    if (!envSecret || secretHeader !== envSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing secret header' },
        { status: 401 }
      );
    }

    // 2. Recibir body
    const body = await req.json();
    const { userId, riskScore, analysisSummary, rosDraft } = body;

    if (!userId || riskScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId or riskScore' },
        { status: 400 }
      );
    }

    // 3. Determinar Risk Level
    let riskLevel: AmlRiskLevel = 'low';
    const score = Number(riskScore);

    if (score > 80) {
      riskLevel = 'critical';
    } else if (score > 60) {
      riskLevel = 'high';
    } else if (score > 20) {
      riskLevel = 'medium';
    }

    // 4. Insertar en BD
    // Usamos una transacción para asegurar consistencia si hay que actualizar el usuario
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // Insertar evaluación de riesgo
      const insertQuery = `
        INSERT INTO core.aml_risk_assessments
        (user_id, risk_score, risk_level, ai_analysis_summary, ros_report_draft)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;

      await client.query(insertQuery, [
        userId,
        score,
        riskLevel,
        analysisSummary || null,
        rosDraft || null
      ]);

      // 5. Acciones automáticas para riesgo CRÍTICO
      if (riskLevel === 'critical') {
        // Actualizar estado del usuario a rejected (bloquear acceso futuro si la app lo usa)
        await client.query(
          `UPDATE core.users SET kyc_status = 'rechazado' WHERE id = $1`,
          [userId]
        );

        // Rechazar todos los logs de KYC pendientes para este usuario
        await client.query(
          `UPDATE core.kyc_logs SET status = 'rechazado' WHERE user_id = $1 AND status = 'pendiente'`,
          [userId]
        );
      } else {
        // Si el riesgo no es crítico, se considera aprobado
        await client.query(
          `UPDATE core.users SET kyc_status = 'aprobado' WHERE id = $1`,
          [userId]
        );
        // Actualizar todos los logs de KYC pendientes a 'approved' para este usuario
        await client.query(
          `UPDATE core.kyc_logs SET status = 'aprobado' WHERE user_id = $1 AND status = 'pendiente'`,
          [userId]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: `Risk assessment processed. Level: ${riskLevel}`,
        riskLevel
      });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error en webhook aml-result:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}
