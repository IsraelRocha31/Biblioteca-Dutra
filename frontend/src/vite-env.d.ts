/// <reference types="vite/client" />

interface PublicAppConfig {
  readonly name: string;
  readonly schoolName: string;
  readonly apiBasePath: string;
  readonly superAdminEmail: string;
  readonly authTokenStorageKey: string;
  readonly searchDebounceMs: number;
  readonly booksDefaultPageSize: number;
  readonly coverMaxSizeMb: number;
  readonly coverAllowedMimeTypes: readonly string[];
}

declare const __APP_CONFIG__: Readonly<PublicAppConfig>;

interface ImportMetaEnv {
  readonly VITE_HTML_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
