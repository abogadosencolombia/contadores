// En: src/lib/db.ts

import { Pool, PoolConfig } from 'pg';

const getPoolConfig = (): PoolConfig => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      // Required for Supabase and many cloud providers
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '', // Prevent crash if undefined, though auth will fail
    port: Number(process.env.DB_PORT) || 5432,
  };
};

const pool = new Pool(getPoolConfig());

export default pool;
