import pg from 'pg';
import { attachDatabasePool } from '@vercel/functions';
import { env } from './config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.postgresUrl,
  max: 1,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  allowExitOnIdle: true
});

attachDatabasePool(pool);

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
