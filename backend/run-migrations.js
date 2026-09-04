import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnv = path.join(__dirname, '..', '.env');
console.log('Loading env from:', rootEnv);
if (existsSync(rootEnv)) dotenv.config({ path: rootEnv, override: true });
console.log('POSTGRES_URL:', process.env.POSTGRES_URL);

import { pool } from './src/database.js';

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Encontradas ${files.length} migração(ões)`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`\nExecutando: ${file}`);
    try {
      await pool.query(sql);
      console.log(`✓ ${file} executada com sucesso`);
    } catch (error) {
      console.error(`✗ Erro ao executar ${file}:`, error.message);
      throw error;
    }
  }

  console.log('\n✓ Todas as migrações executadas com sucesso!');
  await pool.end();
}

runMigrations().catch(err => {
  console.error('Falha nas migrações:', err);
  process.exit(1);
});