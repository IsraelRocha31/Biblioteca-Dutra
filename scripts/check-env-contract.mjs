import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const envPath = join(root, '.env');

const REQUIRED_KEYS = [
  'POSTGRES_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_USER',
  'POSTGRES_HOST',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'APP_NAME',
  'APP_SCHOOL_NAME',
  'APP_API_NAME',
  'APP_API_VERSION',
  'APP_API_BASE_PATH',
  'APP_SERVER_LABEL',
  'APP_DATABASE_LABEL',
  'VITE_HTML_TITLE',
  'SUPER_ADMIN_NAME',
  'SUPER_ADMIN_EMAIL',
  'SUPER_ADMIN_PASSWORD',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'BCRYPT_COST',
  'ADMIN_MIN_PASSWORD_LENGTH',
  'VITE_AUTH_TOKEN_STORAGE_KEY',
  'DEV_PROTOCOL',
  'DEV_HOST',
  'FRONTEND_PORT',
  'UI_SEARCH_DEBOUNCE_MS',
  'PORT',
  'CORS_ORIGIN',
  'HTTP_JSON_BODY_LIMIT',
  'HTTP_URLENCODED_BODY_LIMIT',
  'DB_POOL_MAX',
  'DB_IDLE_TIMEOUT_MS',
  'DB_CONNECTION_TIMEOUT_MS',
  'DB_SSL_USE_LIBPQ_COMPAT',
  'BOOKS_DEFAULT_PAGE_SIZE',
  'BOOKS_MAX_PAGE_SIZE',
  'BOOK_COVER_MAX_SIZE_MB',
  'BOOK_COVER_ALLOWED_MIME_TYPES',
  'BOOK_COVER_CACHE_CONTROL'
];

function parseEnv(path) {
  const values = new Map();
  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const separator = line.indexOf('=');
    values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }
  return values;
}

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (/\.(js|mjs|ts|tsx)$/.test(entry)) files.push(path);
  }
  return files;
}

const envValues = parseEnv(envPath);
const envKeys = new Set(envValues.keys());
const errors = [];

function findExtraEnvFiles(dir) {
  const extras = [];
  for (const entry of readdirSync(dir)) {
    if (['node_modules', '.git', 'dist', '.vercel', '.temp', '.branches'].includes(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      extras.push(...findExtraEnvFiles(path));
      continue;
    }
    if (entry.startsWith('.env') && path !== envPath) extras.push(path);
  }
  return extras;
}

for (const path of findExtraEnvFiles(root)) {
  errors.push(`${relative(root, path).replaceAll('\\', '/')} existe; somente /.env é permitido`);
}

for (const key of REQUIRED_KEYS) {
  if (!envKeys.has(key)) errors.push(`.env sem ${key}`);
}



const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const apiBasePath = envValues.get('APP_API_BASE_PATH');
const rewriteSources = new Set((vercel.rewrites || []).map((rewrite) => rewrite.source));
if (!rewriteSources.has(apiBasePath) || !rewriteSources.has(`${apiBasePath}/:path*`)) {
  errors.push('vercel.json não acompanha APP_API_BASE_PATH do .env');
}

const sourceRoots = ['backend/src', 'frontend/src', 'api'];
const allowedProcessEnv = new Set(['backend/src/config/env.js']);
const allowedImportMetaEnv = new Set(['frontend/src/config/env.ts']);

for (const sourceRoot of sourceRoots) {
  for (const file of walk(join(root, sourceRoot))) {
    const rel = relative(root, file).replaceAll('\\', '/');
    const content = readFileSync(file, 'utf8');

    if (content.includes('process.env') && !allowedProcessEnv.has(rel)) {
      errors.push(`${rel} acessa process.env fora do loader central`);
    }
    if (content.includes('import.meta.env') && !allowedImportMetaEnv.has(rel)) {
      errors.push(`${rel} acessa import.meta.env fora do loader central`);
    }
  }
}

const runtimeFiles = sourceRoots.flatMap((sourceRoot) => walk(join(root, sourceRoot)));
const forbiddenRuntimeLiterals = [
  'admin@alfredodutra.edu.br',
  'admin123',
  'http://localhost:3000',
  'http://localhost:5173',
  "'24h'",
  '4 * 1024 * 1024',
  'max-age=86400'
];

for (const file of runtimeFiles) {
  const rel = relative(root, file).replaceAll('\\', '/');
  const content = readFileSync(file, 'utf8');
  for (const literal of forbiddenRuntimeLiterals) {
    if (content.includes(literal)) errors.push(`${rel} contém configuração hardcoded: ${literal}`);
  }
}

if (errors.length) {
  console.error('Falha no contrato central do .env:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Contrato do .env válido: único arquivo /.env, ${envKeys.size} variáveis versionadas e acesso centralizado.`);
