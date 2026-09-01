import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { env } from './config/env.js';
import { query } from './database.js';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/api/health', async (_req, res, next) => {
  try {
    await query('SELECT 1 AS ok');
    return res.json({
      status: 'ok',
      server: 'Vercel',
      database: 'Supabase PostgreSQL'
    });
  } catch (error) {
    return next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/livros', booksRoutes);

app.get('/api', (_req, res) => {
  return res.json({
    nome: 'Biblioteca Dutra API',
    status: 'online',
    versao: '3.0.0',
    servidor: 'Vercel',
    banco: 'Supabase PostgreSQL'
  });
});

app.use((_req, res) => {
  return res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ erro: 'Arquivo muito grande. Tamanho máximo: 4MB.' });
    }
    return res.status(400).json({ erro: `Erro no upload: ${err.message}` });
  }

  if (err?.message?.includes('Apenas imagens')) {
    return res.status(400).json({ erro: err.message });
  }

  console.error('Erro não tratado:', err);
  return res.status(500).json({ erro: 'Erro interno no servidor.' });
});

export default app;
