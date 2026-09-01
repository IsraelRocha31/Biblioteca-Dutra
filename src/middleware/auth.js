const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'biblioteca_dutra_secret_key_2026';

function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

function superAdmin(req, res, next) {
  if (!req.admin || req.admin.role !== 'super_admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas super administradores podem acessar este recurso.' });
  }
  next();
}

module.exports = { autenticar, superAdmin };
