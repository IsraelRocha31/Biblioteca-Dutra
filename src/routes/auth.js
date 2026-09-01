const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { autenticar, superAdmin } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca_dutra_secret_key_2026';
const JWT_EXPIRES = '24h';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  db.get('SELECT * FROM admins WHERE email = ?', [email], (err, admin) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }

    if (!admin) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaValida = bcrypt.compareSync(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, nome: admin.nome },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role
      }
    });
  });
});

// POST /api/auth/criar-admin  (apenas super admin pode criar novos admins)
router.post('/criar-admin', autenticar, superAdmin, (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  if (senha.length < 8) {
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 8 caracteres.' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);

  db.run(
    'INSERT INTO admins (nome, email, senha, role) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, 'super_admin'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ erro: 'Já existe um administrador com este email.' });
        }
        return res.status(500).json({ erro: 'Erro ao criar administrador.' });
      }

      return res.status(201).json({
        mensagem: 'Administrador criado com sucesso.',
        admin: { id: this.lastID, nome, email, role: 'super_admin' }
      });
    }
  );
});

// GET /api/auth/perfil
router.get('/perfil', autenticar, (req, res) => {
  res.json({
    admin: {
      id: req.admin.id,
      nome: req.admin.nome,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

module.exports = router;
