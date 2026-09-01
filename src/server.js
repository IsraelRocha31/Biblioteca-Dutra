require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/livros', booksRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
  if (err instanceof require('multer').MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ erro: 'Arquivo muito grande. Tamanho máximo: 5MB.' });
    }
    return res.status(400).json({ erro: `Erro no upload: ${err.message}` });
  }
  if (err.message && err.message.includes('imagens')) {
    return res.status(400).json({ erro: err.message });
  }
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

app.listen(PORT, () => {
  console.log(`\n=== Sistema de Biblioteca - EE Alfredo Dutra ===`);
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação da API: http://localhost:${PORT}/`);
  console.log(`\nEndpoints disponíveis:`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  POST   /api/auth/criar-admin`);
  console.log(`  GET    /api/auth/perfil`);
  console.log(`  GET    /api/livros`);
  console.log(`  GET    /api/livros/:id`);
  console.log(`  GET    /api/livros/isbn/:isbn`);
  console.log(`  POST   /api/livros`);
  console.log(`  PUT    /api/livros/:id`);
  console.log(`  DELETE /api/livros/:id`);
  console.log('');
});

module.exports = app;
