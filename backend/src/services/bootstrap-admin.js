import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { query } from '../database.js';

function getConfiguredAdmin() {
  if (env.superAdminPassword.length < env.adminMinPasswordLength) {
    throw new Error(
      `SUPER_ADMIN_PASSWORD deve ter no mínimo ${env.adminMinPasswordLength} caracteres.`
    );
  }

  return {
    nome: env.superAdminName,
    email: env.superAdminEmail,
    senha: env.superAdminPassword
  };
}

function passwordHashFor(currentHash, plainPassword) {
  if (currentHash && bcrypt.compareSync(plainPassword, currentHash)) return currentHash;
  return bcrypt.hashSync(plainPassword, env.bcryptCost);
}

export async function syncSuperAdminFromEnv() {
  const configured = getConfiguredAdmin();
  const managed = await query(
    `SELECT id, senha
     FROM admins
     WHERE managed_by_env = TRUE
     LIMIT 1`
  );

  if (managed.rowCount) {
    const current = managed.rows[0];
    const senhaHash = passwordHashFor(current.senha, configured.senha);
    const result = await query(
      `UPDATE admins
       SET nome = $1,
           email = $2,
           senha = $3,
           role = 'super_admin'
       WHERE id = $4
       RETURNING id, nome, email, role`,
      [configured.nome, configured.email, senhaHash, current.id]
    );
    return { status: 'updated', admin: result.rows[0] };
  }

  const sameEmail = await query(
    `SELECT id, senha
     FROM admins
     WHERE lower(email) = $1
     LIMIT 1`,
    [configured.email]
  );

  if (sameEmail.rowCount) {
    const current = sameEmail.rows[0];
    const senhaHash = passwordHashFor(current.senha, configured.senha);
    const result = await query(
      `UPDATE admins
       SET nome = $1,
           senha = $2,
           role = 'super_admin',
           managed_by_env = TRUE
       WHERE id = $3
       RETURNING id, nome, email, role`,
      [configured.nome, senhaHash, current.id]
    );
    return { status: 'adopted', admin: result.rows[0] };
  }

  const senhaHash = bcrypt.hashSync(configured.senha, env.bcryptCost);
  const result = await query(
    `INSERT INTO admins (nome, email, senha, role, managed_by_env)
     VALUES ($1, $2, $3, 'super_admin', TRUE)
     RETURNING id, nome, email, role`,
    [configured.nome, configured.email, senhaHash]
  );

  return { status: 'created', admin: result.rows[0] };
}
