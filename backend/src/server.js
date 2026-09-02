import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`${env.appApiName} local: ${env.devProtocol}://${env.devHost}:${env.port}${env.appApiBasePath}`);
});
