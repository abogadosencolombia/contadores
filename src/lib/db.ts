import { Pool } from 'pg';
import dns from 'dns';

// Configuración para evitar problemas con IPv6 en Supabase/AWS
// Esto fuerza a Node a usar IPv4 primero si está disponible.
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

declare global {
   
  var postgresPool: Pool | undefined;
}

let pool: Pool;

// Configuración de la conexión
const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras a Supabase
  },
  connectionTimeoutMillis: 10000, // Tiempo máximo de espera para conectar (10s)
  idleTimeoutMillis: 30000,       // Tiempo antes de cerrar conexión inactiva (30s)
  max: process.env.NODE_ENV === 'production' ? 20 : 5 // Menos conexiones en desarrollo para evitar saturación
};

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(config);
} else {
  // En desarrollo, usamos una variable global para no crear múltiples pools
  // cada vez que Next.js recarga los archivos (Hot Reload).
  if (!global.postgresPool) {
    global.postgresPool = new Pool(config);
  }
  pool = global.postgresPool;
}

// Manejo de errores del pool para que no tumbe el backend silenciosamente
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL', err);
  // No salimos del proceso aquí, dejamos que el pool intente reconectar
});

// Exportamos un wrapper consistente
export const db = {
  query: (text: string, params?: unknown[]) => pool.query(text, params),
  connect: () => pool.connect(),
};

export default db;