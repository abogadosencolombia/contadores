// app/api/debug-dns/route.ts
import { NextResponse } from 'next/server';
import dns from 'node:dns/promises';

export async function GET() {
  try {
    const addr = await dns.lookup('db.nrrgqajzlpaqpnnkckzy.supabase.co');
    return NextResponse.json({ ok: true, address: addr });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error) });
  }
}
