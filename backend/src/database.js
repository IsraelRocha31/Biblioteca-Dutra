import pg from 'pg';
import { attachDatabasePool } from '@vercel/functions';
import { env } from './config/env.js';

const { Pool } = pg;

function getConnectionString() {
  const url = new URL(env.postgresUrl);
  if (env.dbSslUseLibpqCompat && !url.searchParams.has('uselibpqcompat')) {
    url.searchParams.set('uselibpqcompat', 'true');
  }
  return url.toString();
}

export const pool = new Pool({
  connectionString: getConnectionString(),
  max: env.dbPoolMax,
  idleTimeoutMillis: env.dbIdleTimeoutMs,
  connectionTimeoutMillis: env.dbConnectionTimeoutMs,
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
