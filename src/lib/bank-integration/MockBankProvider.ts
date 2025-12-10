import { BankProviderAdapter, StandardBankTransaction } from './types';
import { v4 as uuidv4 } from 'uuid';

export class MockBankProvider implements BankProviderAdapter {
  async fetchTransactions(startDate: Date, endDate: Date): Promise<StandardBankTransaction[]> {
    const transactions: StandardBankTransaction[] = [];

    // 1. Generate 5 "matching" transactions (intended to match existing core.movimientos_caja records)
    // These are designed to be deterministic relative to the start date or just hardcoded if known.
    // Since we don't know the exact DB state, we generate plausible matches.
    // Ideally, the user of this mock would ensure these records exist in the DB for the match test to pass.
    
    // Match 1: Income
    transactions.push({
      fecha: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 1), // startDate + 1 day
      monto: 1500000,
      descripcion: "PAGO CLIENTE FACT-001",
      referencia: "REF-MATCH-001",
      id_externo: "TX-MATCH-001",
    });

    // Match 2: Expense
    transactions.push({
      fecha: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 2), // startDate + 2 days
      monto: -50000,
      descripcion: "COMPRA INSUMOS OFICINA",
      referencia: "REF-MATCH-002",
      id_externo: "TX-MATCH-002",
    });

    // Match 3: Income
    transactions.push({
      fecha: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 5), // startDate + 5 days
      monto: 3200500.50,
      descripcion: "TRANSFERENCIA ENTRANTE",
      referencia: "REF-MATCH-003",
      id_externo: "TX-MATCH-003",
    });

     // Match 4: Expense (Service payment)
     transactions.push({
      fecha: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 8), // startDate + 8 days
      monto: -120000,
      descripcion: "PAGO SERVICIO INTERNET",
      referencia: "REF-MATCH-004",
      id_externo: "TX-MATCH-004",
    });

    // Match 5: Income (Exact match scenario)
    transactions.push({
      fecha: new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * 10), // startDate + 10 days
      monto: 5000000,
      descripcion: "INVERSION SOCIO A",
      referencia: "REF-MATCH-005",
      id_externo: "TX-MATCH-005",
    });


    // 2. Generate 15 random transactions (non-matching)
    for (let i = 0; i < 15; i++) {
      const isIncome = Math.random() > 0.5;
      const amount = Math.floor(Math.random() * 1000000) / 100 * (isIncome ? 1 : -1);
      
      // Random date within start and end date
      const timeDiff = endDate.getTime() - startDate.getTime();
      const randomTime = Math.random() * timeDiff;
      const transactionDate = new Date(startDate.getTime() + randomTime);

      transactions.push({
        fecha: transactionDate,
        monto: amount,
        descripcion: isIncome ? `INGRESO VARIOS ${i}` : `GASTO OPERATIVO ${i}`,
        referencia: `REF-RAND-${i}-${Date.now()}`,
        id_externo: uuidv4(),
      });
    }

    // Filter to ensure all are within the requested range (though generation logic mostly ensures this)
    // and sort by date descending
    return transactions
      .filter(t => t.fecha >= startDate && t.fecha <= endDate)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }
}
