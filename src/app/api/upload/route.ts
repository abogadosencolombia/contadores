import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify auth
    verifyAuth(req);

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');
    const uploadDir = path.join(process.cwd(), 'public/uploads/iso');
    
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/iso/${filename}`;

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
