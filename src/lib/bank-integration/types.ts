// src/lib/bank-integration/types.ts

export type StandardBankTransaction = {
  fecha: Date;
  monto: number;
  descripcion: string;
  referencia: string;
  id_externo: string;
};

export interface BankProviderAdapter {
  fetchTransactions(startDate: Date, endDate: Date): Promise<StandardBankTransaction[]>;
}
