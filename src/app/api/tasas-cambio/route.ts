// src/app/api/tasas-cambio/route.ts
import { NextResponse } from 'next/server';

const REVALIDATE_SECONDS = 86400; // 24 horas

export async function GET() {
  try {
    // 1. Obtener la TRM (USD/COP)
    const trmResponse = await fetch(
      'https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1',
      {
        method: 'GET',
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!trmResponse.ok) {
      const errorBody = await trmResponse.text();
      console.error(`[SODA API Error] Status: ${trmResponse.status} ${trmResponse.statusText}`);
      console.error(`[SODA API Error] Body: ${errorBody}`);
      throw new Error(`Fallo al obtener la TRM (Status: ${trmResponse.status})`);
    }

    const trmData = await trmResponse.json();

    // Pequeña validación por si trmData[0] no existe
    if (!trmData || trmData.length === 0 || !trmData[0].valor) {
        console.error("[SODA API Error] La respuesta no contiene datos válidos:", trmData);
        throw new Error("La API de SODA devolvió una respuesta vacía o inesperada.");
    }

    const usdToCopRate = parseFloat(trmData[0].valor);

    // 2. Obtener la tasa EUR/USD (Esta no necesita token)
    const eurUsdResponse = await fetch(
      'https://api.frankfurter.app/latest?from=EUR&to=USD',
      {
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!eurUsdResponse.ok) {
      throw new Error('Fallo al obtener la tasa EUR/USD');
    }

    const eurUsdData = await eurUsdResponse.json();
    const eurToUsdRate = eurUsdData.rates.USD;

    // 3. Calcular la tasa cruzada EUR/COP
    const eurToCopRate = eurToUsdRate * usdToCopRate;

    // 4. Devolver las tasas
    const rates = {
      USD_TO_COP: usdToCopRate,
      EUR_TO_COP: eurToCopRate,
      EUR_TO_USD: eurToUsdRate,
      lastUpdated: new Date().toISOString(),
      trmSourceDate: trmData[0].vigenciadesde,
    };

    return NextResponse.json(rates);

  } catch (error) {
    let errorMessage = 'Error desconocido';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json(
      { error: 'No se pudieron obtener las tasas de cambio', details: errorMessage },
      { status: 500 }
    );
  }
}
