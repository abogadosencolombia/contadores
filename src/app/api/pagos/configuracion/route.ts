// src/app/api/pagos/configuracion/route.ts
import { NextResponse } from 'next/server';
import { saveWompiConfig, getWompiConfig } from '@/lib/wompiService';
// Asumo que tienes una función para obtener la sesión del usuario
// import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Aquí deberías validar la sesión real
    // const user = await getCurrentUser();
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // MOCK TEMPORAL para probar:
    const tenantId = 'default_tenant'; // Esto debe venir de la sesión del usuario logueado

    const body = await request.json();

    await saveWompiConfig(tenantId, {
      publicKey: body.publicKey,
      privateKey: body.privateKey,
      integritySecret: body.integritySecret,
      ambiente: body.ambiente,
      cuentaBancariaId: Number(body.cuentaBancariaId)
    });

    return NextResponse.json({ success: true, message: 'Configuración guardada correctamente' });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ error: (error as Error) }, { status: 500 });
  }
}

export async function GET(_request: Request) {
  // Mismo mock de tenant
  const tenantId = 'default_tenant';

  const config = await getWompiConfig(tenantId);

  if (!config) return NextResponse.json({ configured: false });

  // NO devolvemos las llaves privadas al frontend por seguridad, solo indicamos que existen
  return NextResponse.json({
    configured: true,
    publicKey: config.publicKey,
    ambiente: config.ambiente,
    cuentaBancariaId: config.cuentaBancariaId
    // privateKey e integritySecret se omiten
  });
}
