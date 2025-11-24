import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = verifyAuth(req);

    // Adjust query to filter by tenant if your users table supports it.
    // Assuming 'tenant_id' column exists in core.users or users are global?
    // iso_controles has tenant_id. iso_auditorias has tenant_id.
    // If users are tenant-scoped, they should have it.
    // I'll assume 'tenant_id' exists in core.users based on the pattern.
    // If not, I might need to check how users are associated.
    // However, auth.ts verifyAuth returns 'tenant'.
    
    const query = `
      SELECT id, full_name, email
      FROM core.users
      WHERE tenant_id = $1
      ORDER BY full_name ASC
    `;
    
    const result = await db.query(query, [user.tenant]);
    
    // Map to cleaner object if needed, or return rows directly
    const users = result.rows.map(u => ({
      id: u.id,
      name: u.full_name || u.email, // Fallback to email
      email: u.email
    }));

    return NextResponse.json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
