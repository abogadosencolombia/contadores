import { db } from '../db';
import { MockBankProvider } from './MockBankProvider';
import { StandardBankTransaction } from './types';

export class BankSyncService {
  private provider: MockBankProvider;

  constructor() {
    this.provider = new MockBankProvider();
  }

  async syncAccount(cuentaId: number) {
    const startDate = new Date('2025-12-10T00:00:00Z');
    const endDate = new Date('2026-01-10T00:00:00Z');

    const transactions = await this.provider.fetchTransactions(startDate, endDate);

    for (const tx of transactions) {
      const exists = await this.checkTransactionExists(cuentaId, tx.id_externo);
      if (!exists) {
        await this.saveTransaction(cuentaId, tx);
      }
    }

    // Ejecutamos solo la conciliación automática segura
    await this.autoReconcileStrict(cuentaId);
  }

  private async checkTransactionExists(cuentaId: number, externalId: string): Promise<boolean> {
    const result = await db.query(
      `SELECT 1 FROM core.transacciones_bancarias_externas
       WHERE cuenta_bancaria_id = $1 AND pasarela_id_transaccion = $2`,
      [cuentaId, externalId]
    );
    return (result.rowCount ?? 0) > 0;
  }

  private async saveTransaction(cuentaId: number, tx: StandardBankTransaction) {
    await db.query(
      `INSERT INTO core.transacciones_bancarias_externas
       (cuenta_bancaria_id, pasarela_id_transaccion, fecha, descripcion_original, monto, conciliado)
       VALUES ($1, $2, $3, $4, $5, false)`,
      [cuentaId, tx.id_externo, tx.fecha, tx.descripcion, tx.monto]
    );
  }

  // Nivel 1: Match Automático (Mismo monto, Mismo día)
  private async autoReconcileStrict(cuentaId: number) {
    const result = await db.query(
      `SELECT * FROM core.transacciones_bancarias_externas
       WHERE cuenta_bancaria_id = $1 AND conciliado = false`,
      [cuentaId]
    );

    const externalTxns = result.rows;

    for (const extTx of externalTxns) {
        const amountNum = Number(extTx.monto);
        const isExpense = amountNum < 0;
        const absAmount = Math.abs(amountNum);
        const tipoMovimiento = isExpense ? 'egreso' : 'ingreso';

        // CORRECCIÓN: Comparamos solo la fecha (CAST as DATE), ignorando la hora
        const matchQuery = `
            SELECT id FROM core.movimientos_caja
            WHERE tenant_id = (SELECT tenant_id FROM core.cuentas_bancarias WHERE id = $1)
              AND conciliado = false
              AND tipo_movimiento = $2
              AND monto = $3
              AND fecha::date = $4::date
            LIMIT 1
        `;

        const matchResult = await db.query(matchQuery, [
            cuentaId,
            tipoMovimiento,
            absAmount,
            extTx.fecha
        ]);

        if (matchResult.rows.length > 0) {
            const matchId = matchResult.rows[0].id;
            await this.executeMatch(matchId, extTx.id);
        }
    }
  }

  public async executeMatch(internalId: number, externalId: number) {
     const client = await db.connect();
     try {
         await client.query('BEGIN');
         await client.query(`UPDATE core.movimientos_caja SET conciliado = true WHERE id = $1`, [internalId]);
         await client.query(
             `UPDATE core.transacciones_bancarias_externas
              SET conciliado = true, movimiento_caja_id = $1
              WHERE id = $2`,
             [internalId, externalId]
         );
         await client.query('COMMIT');
     } catch (e) {
         await client.query('ROLLBACK');
         throw e;
     } finally {
         client.release();
     }
  }

  // Nivel 2: Sugerencias Inteligentes (Para mostrar en Frontend)
  public async getSuggestions(cuentaId: number) {
    // Busca transacciones externas NO conciliadas
    const externalUnmatched = await db.query(
        `SELECT * FROM core.transacciones_bancarias_externas
         WHERE cuenta_bancaria_id = $1 AND conciliado = false`,
        [cuentaId]
    );

    const suggestions = [];

    for (const extTx of externalUnmatched.rows) {
        const amountNum = Number(extTx.monto);
        const absAmount = Math.abs(amountNum);
        const tipo = amountNum < 0 ? 'egreso' : 'ingreso';

        // Lógica Heurística:
        // 1. Mismo monto exacto dentro de un rango de +/- 3 días
        const possibleMatches = await db.query(`
            SELECT * FROM core.movimientos_caja
            WHERE tenant_id = (SELECT tenant_id FROM core.cuentas_bancarias WHERE id = $1)
            AND conciliado = false
            AND tipo_movimiento = $2
            AND monto = $3
            AND fecha >= ($4::date - INTERVAL '3 days')
            AND fecha <= ($4::date + INTERVAL '3 days')
        `, [cuentaId, tipo, absAmount, extTx.fecha]);

        if (possibleMatches.rows.length > 0) {
            suggestions.push({
                external: extTx,
                candidates: possibleMatches.rows
            });
        }
    }
    return suggestions;
  }
}
