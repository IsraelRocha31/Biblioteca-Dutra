const formatLabels: Record<string, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP'
};

const coverMaxSizeBytes = __APP_CONFIG__.coverMaxSizeMb * 1024 * 1024;

export const appConfig = Object.freeze({
  ...__APP_CONFIG__,
  coverMaxSizeBytes,
  coverFormatsLabel: __APP_CONFIG__.coverAllowedMimeTypes
    .map((type) => formatLabels[type] || type)
    .join(', ')
});
