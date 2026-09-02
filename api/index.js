import app from '../backend/src/app.js';
import { env } from '../backend/src/config/env.js';

export default function handler(req, res) {
  const rewrittenPath = req.query?.path;

  if (rewrittenPath) {
    const path = Array.isArray(rewrittenPath) ? rewrittenPath.join('/') : rewrittenPath;
    const url = new URL(req.url, `${env.devProtocol}://${env.devHost}`);
    url.searchParams.delete('path');
    const query = url.searchParams.toString();
    req.url = `${env.appApiBasePath}/${path}${query ? `?${query}` : ''}`;
  } else if (
    req.url === `${env.appApiBasePath}/index` ||
    req.url?.startsWith(`${env.appApiBasePath}/index?`)
  ) {
    req.url = env.appApiBasePath;
  }

  return app(req, res);
}
