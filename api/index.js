let runtimePromise;

function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = Promise.all([
      import('../backend/src/app.js'),
      import('../backend/src/config/env.js')
    ]);
  }
  return runtimePromise;
}

export default async function handler(req, res) {
  try {
    const [{ default: app }, { env }] = await loadRuntime();
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
  } catch (error) {
    console.error('Falha ao inicializar a API da Biblioteca Dutra:', error);
    return res.status(500).json({
      erro: 'Falha ao inicializar o servidor.',
      codigo: 'SERVER_INIT_FAILED'
    });
  }
}
