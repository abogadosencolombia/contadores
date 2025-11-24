import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getIsoStats } from '@/lib/isoService';

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);
    const stats = await getIsoStats(user.tenant);
    return NextResponse.json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
