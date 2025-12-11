import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// GET: Listar Riesgos Contables
export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { searchParams } = new URL(req.url);
  const estado = searchParams.get('estado');

  let query = supabase
    .schema('core')
    .from('riesgos_contables')
    .select('*, validado_por:validado_por_user_id(full_name)')
    .order('fecha_deteccion', { ascending: false });

  if (estado) query = query.eq('estado', estado);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH: Validar o Descartar (Rol Revisor Fiscal)
export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const body = await req.json();
  const { id, estado, comentarios_revisor } = body;

  // Obtener usuario actual
  const { data: { user } } = await supabase.auth.getUser();

  /* OPCIONAL: Aquí podrías verificar si el usuario tiene rol de 'REVISOR_FISCAL'
     const { data: roles } = await supabase.from('user_roles')...
  */

  const { data, error } = await supabase
    .schema('core')
    .from('riesgos_contables')
    .update({
      estado,
      comentarios_revisor,
      validado_por_user_id: user?.id, // ID numérico mapeado en tu lógica real
      fecha_validacion: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
