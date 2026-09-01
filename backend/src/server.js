import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`Biblioteca Dutra API local: http://localhost:${env.port}/api`);
});
