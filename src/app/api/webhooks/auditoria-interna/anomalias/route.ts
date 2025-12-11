import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Cliente con service_role para escribir sin restricciones de sesión
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      tenant_id,
      titulo,
      descripcion,
      categoria_niif,
      nivel_confianza_ia,
      explicacion_ia,
      datos_relacionados
    } = body;

    // Validación básica
    if (!tenant_id || !titulo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .schema('core')
      .from('riesgos_contables')
      .insert({
        tenant_id,
        titulo,
        descripcion,
        categoria_niif,
        nivel_confianza_ia,
        explicacion_ia, // Aquí va la bitácora explicativa de la IA
        datos_relacionados,
        estado: 'DETECTADO'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
