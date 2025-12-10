'use server';

import { db } from '@/lib/db';
import { BankSyncService } from '@/lib/bank-integration/BankSyncService';
import { revalidatePath } from 'next/cache';

const service = new BankSyncService();

export async function getBankAccounts() {
  const result = await db.query('SELECT id, nombre_banco, numero_cuenta_display FROM core.cuentas_bancarias ORDER BY id ASC');
  return result.rows;
}

export async function syncAccountAction(cuentaId: number) {
  await service.syncAccount(cuentaId);
  revalidatePath('/dashboard/conciliacion');
  return { success: true };
}

export async function confirmMatchAction(internalId: number, externalId: number) {
    try {
        await service.executeMatch(internalId, externalId);
        revalidatePath('/dashboard/conciliacion');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Error al conciliar' };
    }
}

export async function createMovementFromBankAction(externalId: number) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Get External Transaction
    const txResult = await client.query(
      `SELECT * FROM core.transacciones_bancarias_externas WHERE id = $1`,
      [externalId]
    );

    if (txResult.rows.length === 0) {
      throw new Error('Transacción bancaria no encontrada');
    }
    const tx = txResult.rows[0];

    // 2. Get Tenant ID
    const accountResult = await client.query(
      `SELECT tenant_id FROM core.cuentas_bancarias WHERE id = $1`,
      [tx.cuenta_bancaria_id]
    );

    if (accountResult.rows.length === 0) {
      throw new Error('Cuenta bancaria no encontrada');
    }
    const tenantId = accountResult.rows[0].tenant_id;

    // 3. Prepare Data
    const amountNum = Number(tx.monto);
    const tipoMovimiento = amountNum < 0 ? 'egreso' : 'ingreso';
    const absAmount = Math.abs(amountNum);

    // 4. Insert into movimientos_caja
    const insertResult = await client.query(
      `INSERT INTO core.movimientos_caja 
       (tenant_id, fecha, tipo_movimiento, monto, moneda, descripcion, referencia_pasarela, cuenta_bancaria_id, conciliado)
       VALUES ($1, $2, $3, $4, 'COP', $5, $6, $7, true)
       RETURNING id`,
      [
        tenantId,
        tx.fecha,
        tipoMovimiento,
        absAmount,
        tx.descripcion_original || 'Movimiento creado desde Banco',
        tx.pasarela_id_transaccion,
        tx.cuenta_bancaria_id
      ]
    );

    const newId = insertResult.rows[0].id;

    // 5. Update External Transaction
    await client.query(
      `UPDATE core.transacciones_bancarias_externas 
       SET conciliado = true, movimiento_caja_id = $1 
       WHERE id = $2`,
      [newId, externalId]
    );

    await client.query('COMMIT');
    revalidatePath('/dashboard/conciliacion');
    return { success: true };

  } catch (e: any) {
    await client.query('ROLLBACK');
    console.error('Error creating movement from bank:', e);
    return { success: false, error: e.message || 'Error al crear movimiento' };
  } finally {
    client.release();
  }
}

export async function getReconciliationData(cuentaId: number) {
  // 1. Ya conciliados (Histórico)
  const reconciledResult = await db.query(
    `SELECT t.*, m.descripcion as descripcion_interna
     FROM core.transacciones_bancarias_externas t
     JOIN core.movimientos_caja m ON t.movimiento_caja_id = m.id
     WHERE t.cuenta_bancaria_id = $1 AND t.conciliado = true
     ORDER BY t.fecha DESC LIMIT 20`,
    [cuentaId]
  );

  // 2. Pendientes sin match obvio
  const unmatchedResult = await db.query(
    `SELECT * FROM core.transacciones_bancarias_externas
     WHERE cuenta_bancaria_id = $1 AND conciliado = false
     ORDER BY fecha DESC`,
    [cuentaId]
  );

  // 3. Sugerencias (IA/Heurística)
  const suggestions = await service.getSuggestions(cuentaId);

  return {
    reconciled: reconciledResult.rows,
    unmatched: unmatchedResult.rows,
    suggestions: suggestions
  };
}
