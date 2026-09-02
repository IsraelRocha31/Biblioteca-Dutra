/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_NAME: string;
  readonly APP_SCHOOL_NAME: string;
  readonly APP_API_BASE_PATH: string;
  readonly SUPER_ADMIN_EMAIL: string;
  readonly VITE_AUTH_TOKEN_STORAGE_KEY: string;
  readonly UI_SEARCH_DEBOUNCE_MS: string;
  readonly BOOKS_DEFAULT_PAGE_SIZE: string;
  readonly BOOK_COVER_MAX_SIZE_MB: string;
  readonly BOOK_COVER_ALLOWED_MIME_TYPES: string;
  readonly VITE_HTML_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
