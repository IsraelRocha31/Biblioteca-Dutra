import { pool } from './database.js';
import { syncSuperAdminFromEnv } from './services/bootstrap-admin.js';

async function main() {
  const result = await syncSuperAdminFromEnv();
  console.log(`Sincronização do administrador: ${result.status}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
