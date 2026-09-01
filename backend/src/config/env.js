import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const backendEnv = fileURLToPath(new URL('../../.env', import.meta.url));
const rootEnvLocal = fileURLToPath(new URL('../../../.env.local', import.meta.url));

if (existsSync(backendEnv)) dotenv.config({ path: backendEnv });
if (existsSync(rootEnvLocal)) dotenv.config({ path: rootEnvLocal });

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  postgresUrl: required('POSTGRES_URL'),
  postgresPrismaUrl: process.env.POSTGRES_PRISMA_URL || '',
  postgresUrlNonPooling: process.env.POSTGRES_URL_NON_POOLING || '',
  jwtSecret: required('JWT_SECRET'),
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@alfredodutra.edu.br',
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || ''
};
