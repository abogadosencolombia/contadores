// src/app/api/aml/status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { KycStatus } from '@/types/aml-kyc';

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);

    const result = await db.query(
      `SELECT kyc_status FROM core.users WHERE id = $1`,
      [user.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const kycStatus: KycStatus = result.rows[0].kyc_status;

    return NextResponse.json({ status: kycStatus });

  } catch (error: unknown) {
    console.error('Error in API aml/status:', error);

    if (error instanceof Error && (error.message.includes('No autenticado') || error.message.includes('Token'))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    return NextResponse.json(
      { error: (error instanceof Error) ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
