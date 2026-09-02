import { pool } from '../database.js';
import { syncSuperAdminFromEnv } from '../services/bootstrap-admin.js';

try {
  const result = await syncSuperAdminFromEnv();
  console.log(`Sincronização do administrador: ${result.status}.`);
} catch (error) {
  if (error?.code === '42P01' || error?.code === '42703') {
    console.warn('Schema do Supabase ainda não está pronto; sincronização será refeita no primeiro login.');
  } else {
    throw error;
  }
} finally {
  await pool.end();
}
