import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // CAMBIO IMPORTANTE: Usa la URL de Producción (sin -test)
    const n8nUrl = 'https://cobrocartera-n8n.hrymiz.easypanel.host/webhook/calcular-dividendos';

    const response = await fetch(n8nUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      // Leemos el error que devuelve n8n para saber qué pasa
      const errorText = await response.text();
      console.error('Error n8n response:', errorText);
      throw new Error(`Error n8n: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error proxy n8n:', error);
    return NextResponse.json(
      { error: 'Fallo al comunicar con el motor de cálculo', details: error.message },
      { status: 500 }
    );
  }
}
