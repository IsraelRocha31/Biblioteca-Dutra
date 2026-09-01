import app from '../backend/src/app.js';

export default function handler(req, res) {
  const rewrittenPath = req.query?.path;

  if (rewrittenPath) {
    const path = Array.isArray(rewrittenPath) ? rewrittenPath.join('/') : rewrittenPath;
    const url = new URL(req.url, 'http://localhost');
    url.searchParams.delete('path');
    const query = url.searchParams.toString();
    req.url = `/api/${path}${query ? `?${query}` : ''}`;
  } else if (req.url === '/api/index' || req.url?.startsWith('/api/index?')) {
    req.url = '/api';
  }

  return app(req, res);
}
