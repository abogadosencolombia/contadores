import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { storageService } from '@/lib/storage';

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
    // Sanitize filename
    const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');
    
    const bucketName = 'kyc';
    // Upload to Supabase 'kyc' bucket
    await storageService.uploadFile(filename, buffer, file.type, bucketName);

    // Get public URL
    const url = storageService.getPublicUrl(filename, bucketName);

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}