import axios from 'axios';
import { BankProviderAdapter, StandardBankTransaction } from './types';

export class PrometeoBankProvider implements BankProviderAdapter {
  private apiKey: string;
  private baseUrl: string;
  private sessionKey: string | null = null;

  constructor(apiKey: string, environment: 'sandbox' | 'production' = 'sandbox') {
    this.apiKey = apiKey;

    // CORRECCIÓN FINAL: Usamos la URL que respondió con JSON
    // Nota: Aunque dice .net, es la que está respondiendo a tu API Key (o intentándolo)
    this.baseUrl = 'https://api.sandbox.prometeoapi.com';
  }

  async fetchTransactions(startDate: Date, endDate: Date): Promise<StandardBankTransaction[]> {
    try {
      if (!this.sessionKey) {
        await this.login();
      }

      // IMPORTANTE: Cuenta de prueba genérica
      const accountNumber = '1234567890';
      const url = `${this.baseUrl}/account/${accountNumber}/movement/`;

      console.log('📡 Consultando movimientos en:', url);

      const response = await axios.get(url, {
        params: {
          date_start: this.formatDate(startDate),
          date_end: this.formatDate(endDate),
          currency: 'COP'
        },
        headers: {
          'X-API-Key': this.apiKey,
          'Authorization': this.sessionKey
        }
      });

      const movimientos = response.data.movements || [];
      return movimientos.map((tx: any) => ({
        fecha: this.parseDate(tx.date),
        monto: Number(tx.amount),
        descripcion: tx.detail || 'Sin descripción',
        referencia: tx.id,
        id_externo: `PROMETEO-${tx.id}`
      }));

    } catch (error: any) {
      console.error('❌ Error fetching transactions:', error.message);
      if (error.response) {
          console.error('   Status:', error.response.status);
          console.error('   Data:', JSON.stringify(error.response.data));
      }
      return [];
    }
  }

  private async login() {
    const loginUrl = `${this.baseUrl}/login/`;
    console.log('🔐 Autenticando en:', loginUrl);

    try {
      const params = new URLSearchParams();
      // Ajuste: A veces en este entorno el provider es 'test' o 'testing'
      params.append('provider', 'test');
      params.append('username', 'test');
      params.append('password', '1234');

      const response = await axios.post(loginUrl, params, {
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.status === 'logged_in') {
        this.sessionKey = response.data.key;
        console.log('✅ Login exitoso.');
      } else {
        throw new Error('Login fallido: ' + response.data.status);
      }
    } catch (error: any) {
      console.error(`❌ Fallo Login: ${error.message}`);
      if (error.response) console.error('   Respuesta:', error.response.data);
      throw error;
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
}
