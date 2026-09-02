import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rootEnv = fileURLToPath(new URL('../../../.env', import.meta.url));
if (existsSync(rootEnv)) dotenv.config({ path: rootEnv });

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`);
  return value;
}

function integer(name, { min = 0 } = {}) {
  const value = Number.parseInt(required(name), 10);
  if (!Number.isSafeInteger(value) || value < min) {
    throw new Error(`Variável de ambiente inválida: ${name}`);
  }
  return value;
}


function boolean(name) {
  const value = required(name).toLowerCase();
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Variável de ambiente inválida: ${name}`);
}

function csv(name) {
  const values = required(name)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (!values.length) throw new Error(`Variável de ambiente inválida: ${name}`);
  return values;
}

const bookCoverMaxSizeMb = integer('BOOK_COVER_MAX_SIZE_MB', { min: 1 });
const booksDefaultPageSize = integer('BOOKS_DEFAULT_PAGE_SIZE', { min: 1 });
const booksMaxPageSize = integer('BOOKS_MAX_PAGE_SIZE', { min: booksDefaultPageSize });

export const env = Object.freeze({
  appName: required('APP_NAME'),
  schoolName: required('APP_SCHOOL_NAME'),
  appApiName: required('APP_API_NAME'),
  appApiVersion: required('APP_API_VERSION'),
  appApiBasePath: required('APP_API_BASE_PATH').replace(/\/$/, ''),
  appServerLabel: required('APP_SERVER_LABEL'),
  appDatabaseLabel: required('APP_DATABASE_LABEL'),
  devProtocol: required('DEV_PROTOCOL'),
  devHost: required('DEV_HOST'),

  port: integer('PORT', { min: 1 }),
  corsOrigins: csv('CORS_ORIGIN'),
  jsonBodyLimit: required('HTTP_JSON_BODY_LIMIT'),
  urlencodedBodyLimit: required('HTTP_URLENCODED_BODY_LIMIT'),

  postgresUrl: required('POSTGRES_URL'),
  dbPoolMax: integer('DB_POOL_MAX', { min: 1 }),
  dbIdleTimeoutMs: integer('DB_IDLE_TIMEOUT_MS', { min: 1 }),
  dbConnectionTimeoutMs: integer('DB_CONNECTION_TIMEOUT_MS', { min: 1 }),
  dbSslUseLibpqCompat: boolean('DB_SSL_USE_LIBPQ_COMPAT'),

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: required('JWT_EXPIRES_IN'),
  bcryptCost: integer('BCRYPT_COST', { min: 4 }),
  adminMinPasswordLength: integer('ADMIN_MIN_PASSWORD_LENGTH', { min: 1 }),
  superAdminName: required('SUPER_ADMIN_NAME'),
  superAdminEmail: required('SUPER_ADMIN_EMAIL').toLowerCase(),
  superAdminPassword: required('SUPER_ADMIN_PASSWORD'),

  booksDefaultPageSize,
  booksMaxPageSize,
  bookCoverMaxSizeMb,
  bookCoverMaxSizeBytes: bookCoverMaxSizeMb * 1024 * 1024,
  bookCoverAllowedMimeTypes: csv('BOOK_COVER_ALLOWED_MIME_TYPES'),
  bookCoverCacheControl: required('BOOK_COVER_CACHE_CONTROL')
});
