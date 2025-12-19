import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // URL de Producción de n8n
    const n8nUrl = 'https://cobrocartera-n8n.hrymiz.easypanel.host/webhook/calcular-dividendos';

    const response = await fetch(n8nUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error n8n: ${response.status} ${errorText}`);
    }

    // --- CORRECCIÓN ROBUSTA ---
    // Leemos el texto crudo primero para ver si vino vacío
    const text = await response.text();

    // Si n8n no devolvió nada (cadena vacía), significa que no hubo datos para procesar.
    // Devolvemos un array vacío a nuestro frontend.
    if (!text) {
      return NextResponse.json([]);
    }

    try {
      // Intentamos parsear el JSON
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      // Si n8n devolvió algo que no es JSON (ej: "Workflow started"), también asumimos vacío o error controlado
      console.warn("Respuesta no-JSON recibida de n8n:", text);
      return NextResponse.json([]);
    }

  } catch (error: any) {
    console.error('Error proxy n8n:', error);
    return NextResponse.json(
      { error: 'Fallo al comunicar con el motor de cálculo', details: error.message },
      { status: 500 }
    );
  }
}
