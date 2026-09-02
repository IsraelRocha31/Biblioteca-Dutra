import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const envDir = fileURLToPath(new URL('..', import.meta.url));

function required(env: Record<string, string>, name: string): string {
  const value = process.env[name] || env[name];
  if (!value?.trim()) {
    throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`);
  }
  return value.trim();
}

function integer(env: Record<string, string>, name: string, min = 0): number {
  const value = Number.parseInt(required(env, name), 10);
  if (!Number.isSafeInteger(value) || value < min) {
    throw new Error(`Variável de ambiente inválida: ${name}`);
  }
  return value;
}

function csv(env: Record<string, string>, name: string): string[] {
  const values = required(env, name)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (!values.length) {
    throw new Error(`Variável de ambiente inválida: ${name}`);
  }

  return values;
}

export default defineConfig(({ mode }) => {
  const loaded = loadEnv(mode, envDir, '');
  const apiBasePath = required(loaded, 'APP_API_BASE_PATH').replace(/\/$/, '');
  const coverMaxSizeMb = integer(loaded, 'BOOK_COVER_MAX_SIZE_MB', 1);

  const publicAppConfig = {
    name: required(loaded, 'APP_NAME'),
    schoolName: required(loaded, 'APP_SCHOOL_NAME'),
    apiBasePath,
    superAdminEmail: required(loaded, 'SUPER_ADMIN_EMAIL'),
    authTokenStorageKey: required(loaded, 'VITE_AUTH_TOKEN_STORAGE_KEY'),
    searchDebounceMs: integer(loaded, 'UI_SEARCH_DEBOUNCE_MS', 0),
    booksDefaultPageSize: integer(loaded, 'BOOKS_DEFAULT_PAGE_SIZE', 1),
    coverMaxSizeMb,
    coverMaxSizeBytes: coverMaxSizeMb * 1024 * 1024,
    coverAllowedMimeTypes: csv(loaded, 'BOOK_COVER_ALLOWED_MIME_TYPES')
  };

  return {
    envDir,
    plugins: [react()],
    define: {
      __APP_CONFIG__: JSON.stringify(publicAppConfig)
    },
    server: {
      port: integer(loaded, 'FRONTEND_PORT', 1),
      proxy: {
        [apiBasePath]: `${required(loaded, 'DEV_PROTOCOL')}://${required(loaded, 'DEV_HOST')}:${integer(loaded, 'PORT', 1)}`
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
