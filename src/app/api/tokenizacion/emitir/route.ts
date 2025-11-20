import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';
import { ethers } from 'ethers';
import { verifyAuth, UserPayload } from '@/lib/auth'; // Import UserPayload explicitly
import crypto from 'crypto';

// Definimos la interfaz del request esperado
interface TokenRequest {
  inversionistaId: number;   // ID del usuario en core.users
  montoInversion: number;    // Valor monetario total de la inversión
  cantidadTokens: number;    // Número de acciones/tokens a emitir
  documentoLegalId: number;  // ID del PDF firmado en core.documentos_legales
  lockupMeses?: number;      // Opcional: Meses de restricción de venta
}

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticación y Autorización (Solo admin o roles financieros)
    let user: UserPayload; // Explicitly type user as UserPayload
    try {
      user = verifyAuth(req);
    } catch (e) {
      console.error('Authentication error:', e);
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const hasAllowedRole = user.roles.some(role => ['admin', 'finance_ai'].includes(role));

    if (!hasAllowedRole) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body: TokenRequest = await req.json();
    const {
      inversionistaId,
      montoInversion,
      cantidadTokens,
      documentoLegalId,
      lockupMeses = 12 // Default: 1 año de lockup si no se especifica
    } = body;

    // ----------------------------------------------------------------------
    // 2. Validaciones Previas (KYC y Documento)
    // ----------------------------------------------------------------------

    // Verificar si el usuario tiene estado 'aprobado' en KYC
    const inversionistaResult = await pool.query(
      `SELECT id, kyc_status, email FROM core.users WHERE id = $1`,
      [inversionistaId]
    );
    const inversionista = inversionistaResult.rows[0];

    if (!inversionista || inversionista.kyc_status !== 'aprobado') {
      return NextResponse.json(
        { error: 'El inversionista no ha completado el proceso KYC/AML' },
        { status: 400 }
      );
    }

    // Verificar documento legal firmado
    const documentoResult = await pool.query(
      `SELECT hash_sha256_original FROM core.documentos_legales WHERE id = $1 AND estado = 'finalizado'`,
      [documentoLegalId]
    );
    const documento = documentoResult.rows[0];

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento legal no encontrado o no está firmado (finalizado)' },
        { status: 400 }
      );
    }
    const docHash = documento.hash_sha256_original;

    // ----------------------------------------------------------------------
    // 3. Cálculo de Cap Table y Porcentajes
    // ----------------------------------------------------------------------

    // Obtenemos el total de acciones actuales (Mundo Físico/Legal)
    const totalAccionesResult = await pool.query(
      `SELECT COALESCE(SUM(numero_acciones), 0) as total FROM core.accionistas`
    );
    const totalAccionesActuales = Number(totalAccionesResult.rows[0].total);

    // El nuevo universo accionario será lo actual + lo nuevo
    const nuevoTotalAcciones = totalAccionesActuales + cantidadTokens;

    // Calculamos el porcentaje que representan estos nuevos tokens
    // Evitamos división por cero si es la primera emisión
    const porcentajeCalculado = nuevoTotalAcciones > 0
      ? (cantidadTokens / nuevoTotalAcciones) * 100
      : 100;

    // ----------------------------------------------------------------------
    // 4. Emisión en Blockchain (Simulación / Integración ERC1400)
    // ----------------------------------------------------------------------

    const tokenId = crypto.randomUUID(); // UUID único para el token en DB
    const mockTxHash = ethers.id(`tx-${tokenId}-${Date.now()}`);

    // NOTA: Aquí conectarías con TokenFactory usando el servicio que subiste:
    // const tokenService = TokenFactory.getService('ERC1400');
    // const txHash = await tokenService.mintToken(...)

    // ----------------------------------------------------------------------
    // 5. Persistencia en Base de Datos
    // ----------------------------------------------------------------------

    // A. Registro del Título Valor Digital
    const nuevoTokenResult = await pool.query(
      `INSERT INTO core.tokenizacion_legal
      (token_id, inversionista_id, porcentaje, valor_inicial, hash_firma, registro_cambiario, fecha, estado_blockchain, tx_hash, documento_legal_id)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9)
      RETURNING *`,
      [
        tokenId,
        inversionistaId,
        porcentajeCalculado.toFixed(2), // Guardamos el % calculado
        montoInversion,
        docHash,      // Hash del contrato firmado
        false,        // Pendiente de reporte al Banco de la República
        'CONFIRMADO', // Estado simulado
        mockTxHash,
        documentoLegalId
      ]
    );

    // B. Actualización del Cap Table (Libro de Accionistas Digital)
    // Calculamos fecha de desbloqueo
    const fechaLockup = new Date();
    fechaLockup.setMonth(fechaLockup.getMonth() + lockupMeses);

    await pool.query(
      `INSERT INTO core.cap_table
      (inversionista_id, token_id, porcentaje, fecha, lockup_hasta, calificado)
      VALUES ($1, $2, $3, NOW(), $4, $5)`,
      [
        inversionistaId,
        tokenId,
        porcentajeCalculado.toFixed(3), // Mayor precisión para el Cap Table
        fechaLockup,
        false // Por defecto no calificado, salvo lógica adicional
      ]
    );

    // C. Auditoría AML/UIAF
    await pool.query(
      `INSERT INTO core.aml_log (inversionista_id, tipo_operacion, monto, riesgo, fecha)
       VALUES ($1, 'EMISION_TOKEN', $2, 'BAJO', NOW())`,
      [inversionistaId, montoInversion]
    );

    // D. (Opcional) Sincronización con core.accionistas
    // Si el usuario ya es accionista, sumamos las acciones. Si no, habría que crearlo.
    // Aquí asumimos un update simple por email para mantener consistencia.
    await pool.query(
      `UPDATE core.accionistas
       SET numero_acciones = numero_acciones + $1
       WHERE email = $2`,
      [cantidadTokens, inversionista.email]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...nuevoTokenResult.rows[0],
        cap_table_update: {
          nuevo_total_acciones: nuevoTotalAcciones,
          porcentaje_asignado: porcentajeCalculado.toFixed(3) + '%'
        }
      },
      blockchain: {
        standard: 'ERC-1400',
        network: 'Private EVM',
        txHash: mockTxHash
      }
    });

  } catch (error: unknown) {
    console.error('Error en tokenización:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error interno en el proceso de tokenización', details: errorMessage },
      { status: 500 }
    );
  }
}