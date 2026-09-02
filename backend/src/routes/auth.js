import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database.js';
import { env } from '../config/env.js';
import { autenticar, superAdmin } from '../middleware/auth.js';
import { syncSuperAdminFromEnv } from '../services/bootstrap-admin.js';

const router = express.Router();
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const senha = String(req.body?.senha || '');

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    await syncSuperAdminFromEnv();

    const result = await query(
      `SELECT id, nome, email, senha, role
       FROM admins
       WHERE lower(email) = $1
       LIMIT 1`,
      [email]
    );

    const admin = result.rows[0];
    if (!admin || !bcrypt.compareSync(senha, admin.senha)) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, nome: admin.nome },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      admin: {
        id: Number(admin.id),
        nome: admin.nome,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/criar-admin', autenticar, superAdmin, async (req, res, next) => {
  try {
    const nome = String(req.body?.nome || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const senha = String(req.body?.senha || '');

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }

    if (senha.length < env.adminMinPasswordLength) {
      return res.status(400).json({
        erro: `A senha deve ter no mínimo ${env.adminMinPasswordLength} caracteres.`
      });
    }

    const senhaHash = bcrypt.hashSync(senha, env.bcryptCost);

    try {
      const result = await query(
        `INSERT INTO admins (nome, email, senha, role, managed_by_env)
         VALUES ($1, $2, $3, 'super_admin', FALSE)
         RETURNING id, nome, email, role`,
        [nome, email, senhaHash]
      );

      const admin = result.rows[0];
      return res.status(201).json({
        mensagem: 'Administrador criado com sucesso.',
        admin: { ...admin, id: Number(admin.id) }
      });
    } catch (error) {
      if (error?.code === '23505') {
        return res.status(409).json({ erro: 'Já existe um administrador com este email.' });
      }
      throw error;
    }
  } catch (error) {
    return next(error);
  }
});

router.get('/perfil', autenticar, (req, res) => {
  return res.json({
    admin: {
      id: Number(req.admin.id),
      nome: req.admin.nome,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

export default router;
