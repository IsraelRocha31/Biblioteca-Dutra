function required(name: string, value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`);
  return normalized;
}

function integer(name: string, value: string | undefined, min = 0): number {
  const raw = required(name, value);
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isSafeInteger(parsed) || parsed < min) {
    throw new Error(`Variável de ambiente inválida: ${name}`);
  }
  return parsed;
}

function csv(name: string, value: string | undefined): string[] {
  const values = required(name, value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (!values.length) throw new Error(`Variável de ambiente inválida: ${name}`);
  return values;
}

const coverMaxSizeMb = integer('BOOK_COVER_MAX_SIZE_MB', import.meta.env.BOOK_COVER_MAX_SIZE_MB, 1);
const coverAllowedMimeTypes = csv('BOOK_COVER_ALLOWED_MIME_TYPES', import.meta.env.BOOK_COVER_ALLOWED_MIME_TYPES);

const formatLabels: Record<string, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP'
};

export const appConfig = Object.freeze({
  name: required('APP_NAME', import.meta.env.APP_NAME),
  schoolName: required('APP_SCHOOL_NAME', import.meta.env.APP_SCHOOL_NAME),
  apiBasePath: required('APP_API_BASE_PATH', import.meta.env.APP_API_BASE_PATH).replace(/\/$/, ''),
  superAdminEmail: required('SUPER_ADMIN_EMAIL', import.meta.env.SUPER_ADMIN_EMAIL),
  authTokenStorageKey: required('VITE_AUTH_TOKEN_STORAGE_KEY', import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY),
  searchDebounceMs: integer('UI_SEARCH_DEBOUNCE_MS', import.meta.env.UI_SEARCH_DEBOUNCE_MS),
  booksDefaultPageSize: integer('BOOKS_DEFAULT_PAGE_SIZE', import.meta.env.BOOKS_DEFAULT_PAGE_SIZE, 1),
  coverMaxSizeMb,
  coverMaxSizeBytes: coverMaxSizeMb * 1024 * 1024,
  coverAllowedMimeTypes,
  coverFormatsLabel: coverAllowedMimeTypes.map((type) => formatLabels[type] || type).join(', ')
});
