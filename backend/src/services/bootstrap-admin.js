import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { query } from '../database.js';

export async function ensureSuperAdmin(candidateEmail = env.superAdminEmail) {
  const email = env.superAdminEmail.trim().toLowerCase();
  if (String(candidateEmail || '').trim().toLowerCase() !== email) return false;
  if (!env.superAdminPassword || env.superAdminPassword.length < 8) return false;

  const existing = await query(
    'SELECT id FROM admins WHERE lower(email) = $1 LIMIT 1',
    [email]
  );

  if (existing.rowCount) return false;

  const passwordHash = await bcrypt.hash(env.superAdminPassword, 12);

  try {
    const result = await query(
      `INSERT INTO admins (nome, email, senha, role)
       VALUES ($1, $2, $3, 'super_admin')
       RETURNING id`,
      ['Super Administrador', email, passwordHash]
    );
    return result.rowCount === 1;
  } catch (error) {
    if (error?.code === '23505') return false;
    throw error;
  }
}
