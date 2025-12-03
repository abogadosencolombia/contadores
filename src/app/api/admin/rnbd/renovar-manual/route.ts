import { NextRequest, NextResponse } from 'next/server';
import { RnbdService } from '@/lib/rnbdService';
import { verifyAuth } from '@/lib/auth';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticación y permisos
    let user;
    try {
      user = verifyAuth(req);
    } catch {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const hasAllowedRole = user.roles.some(role => ['admin', 'superadmin', 'compliance'].includes(role));
    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'Acceso denegado: Requiere rol de administrador, superadmin o cumplimiento' }, { status: 403 });
    }

    // 2. Obtener y validar body (FormData)
    const formData = await req.formData();
    const tenantId = formData.get('tenantId') as string; // Tenant al que se intenta aplicar la renovación
    const numeroRadicado = formData.get('numeroRadicado') as string;
    const fechaRadicacionStr = formData.get('fechaRadicacion') as string;
    const evidenciaFile = formData.get('evidencia') as File | null;

    if (!tenantId || !numeroRadicado || !fechaRadicacionStr) {
      return NextResponse.json({ error: 'Faltan campos requeridos: tenantId, numeroRadicado o fechaRadicacion' }, { status: 400 });
    }

    // --- Validación de seguridad por tenant ---
    // Si el usuario no es superadmin Y el tenant del request NO coincide con el tenant del usuario logueado
    if (!user.roles.includes('superadmin') && user.tenant !== tenantId) {
        return NextResponse.json(
            { error: 'No tienes permiso para modificar este tenant. Solo puedes renovar registros de tu propia empresa.' },
            { status: 403 }
        );
    }
    // --- Fin Validación de seguridad por tenant ---

    // 3. Guardar archivo localmente (simulando almacenamiento cloud)
    let urlEvidencia = '';
    if (evidenciaFile) {
      const bytes = await evidenciaFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Nombre de archivo único: timestamp-nombre_original
      const filename = `${Date.now()}-${evidenciaFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads/rnbd');
      const filePath = path.join(uploadDir, filename);
      
      await writeFile(filePath, buffer);
      urlEvidencia = `/uploads/rnbd/${filename}`;
      console.log(`Archivo guardado en: ${filePath}`);
    }

    // 4. Ejecutar registro manual
    console.log(`Registrando renovación manual RNBD para tenant: ${tenantId} por usuario ${user.email}`);
    
    const fecha = new Date(fechaRadicacionStr);
    if (isNaN(fecha.getTime())) {
      return NextResponse.json({ error: 'fechaRadicacion inválida' }, { status: 400 });
    }

    const nuevoRegistro = await RnbdService.registrarRenovacionManual(
      tenantId, 
      numeroRadicado, 
      fecha, 
      urlEvidencia
    );

    // 5. Retornar éxito
    return NextResponse.json({
      success: true,
      message: 'Registro manual exitoso',
      registro: nuevoRegistro
    });

  } catch (error: unknown) {
    console.error('Error en renovación manual RNBD:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno al procesar la renovación manual';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
