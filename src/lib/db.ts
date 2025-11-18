// En: src/lib/db.ts

import { Pool } from 'pg';

// Asegúrate de que las variables de entorno se lean
// Next.js las carga automáticamente en .env.local

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// CORRECCIÓN: Exportar la instancia de 'pool' directamente.
// Esto permite que se usen tanto 'db.query(...)' (para consultas simples)
// como 'db.connect()' (para iniciar transacciones).
export default pool;
