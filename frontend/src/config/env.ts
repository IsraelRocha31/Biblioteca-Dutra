interface PublicAppConfig {
  name: string;
  schoolName: string;
  apiBasePath: string;
  superAdminEmail: string;
  authTokenStorageKey: string;
  searchDebounceMs: number;
  booksDefaultPageSize: number;
  coverMaxSizeMb: number;
  coverMaxSizeBytes: number;
  coverAllowedMimeTypes: readonly string[];
}

declare const __APP_CONFIG__: Readonly<PublicAppConfig>;

const formatLabels: Readonly<Record<string, string>> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP'
};

export const appConfig = Object.freeze({
  ...__APP_CONFIG__,
  coverFormatsLabel: __APP_CONFIG__.coverAllowedMimeTypes
    .map((type) => formatLabels[type] || type)
    .join(', ')
});
