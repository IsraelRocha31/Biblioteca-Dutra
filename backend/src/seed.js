import { pool } from './database.js';
import { env } from './config/env.js';
import { ensureSuperAdmin } from './services/bootstrap-admin.js';

async function main() {
  if (!env.superAdminPassword || env.superAdminPassword.length < 8) {
    throw new Error('Defina SUPER_ADMIN_PASSWORD com pelo menos 8 caracteres.');
  }

  const created = await ensureSuperAdmin();
  console.log(created ? 'Super administrador criado.' : 'Super administrador já existe.');
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
