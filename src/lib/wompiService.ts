// src/lib/wompiService.ts
import pool from './db';
import { encrypt, decrypt } from './crypto';
import crypto from 'crypto';

export interface WompiConfig {
  publicKey: string;
  privateKey: string;
  integritySecret: string;
  ambiente: 'PROD' | 'SANDBOX';
  cuentaBancariaId: number;
}

// 1. Guardar o Actualizar Configuración
export async function saveWompiConfig(tenantId: string, config: WompiConfig) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO core.configuracion_pagos
      (tenant_id, public_key, private_key_enc, integrity_secret_enc, ambiente, cuenta_bancaria_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (tenant_id, proveedor)
      DO UPDATE SET
        public_key = EXCLUDED.public_key,
        private_key_enc = EXCLUDED.private_key_enc,
        integrity_secret_enc = EXCLUDED.integrity_secret_enc,
        ambiente = EXCLUDED.ambiente,
        cuenta_bancaria_id = EXCLUDED.cuenta_bancaria_id,
        is_active = true;
    `;

    const values = [
      tenantId,
      config.publicKey,
      encrypt(config.privateKey),
      encrypt(config.integritySecret),
      config.ambiente,
      config.cuentaBancariaId
    ];

    await client.query(query, values);
  } finally {
    client.release();
  }
}

// 2. Obtener Configuración (Desencriptada) para uso interno
export async function getWompiConfig(tenantId: string): Promise<WompiConfig | null> {
  const res = await pool.query(
    `SELECT public_key, private_key_enc, integrity_secret_enc, ambiente, cuenta_bancaria_id
     FROM core.configuracion_pagos
     WHERE tenant_id = $1 AND proveedor = 'WOMPI' AND is_active = true`,
    [tenantId]
  );

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  return {
    publicKey: row.public_key,
    privateKey: decrypt(row.private_key_enc),
    integritySecret: decrypt(row.integrity_secret_enc),
    ambiente: row.ambiente,
    cuentaBancariaId: row.cuenta_bancaria_id
  };
}

// 3. Generar Firma de Integridad (Para el Widget de Pago)
export async function generateIntegritySignature(reference: string, amountInCents: number, currency: string, secret: string) {
  const chain = `${reference}${amountInCents}${currency}${secret}`;
  const hash = crypto.createHash('sha256').update(chain).digest('hex');
  return hash;
}
