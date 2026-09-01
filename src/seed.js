require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('./database');

const email = process.env.SUPER_ADMIN_EMAIL || 'admin@alfredodutra.edu.br';
const senha = process.env.SUPER_ADMIN_PASSWORD || 'Admin@2026';
const nome = 'Super Administrador';

console.log('Configurando super administrador inicial...');

db.get('SELECT * FROM admins WHERE email = ?', [email], (err, admin) => {
  if (err) {
    console.error('Erro ao verificar admin:', err.message);
    process.exit(1);
  }

  if (admin) {
    console.log('Super administrador já existe:', admin.email);
    process.exit(0);
  }

  const senhaHash = bcrypt.hashSync(senha, 10);

  db.run(
    'INSERT INTO admins (nome, email, senha, role) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, 'super_admin'],
    function (err) {
      if (err) {
        console.error('Erro ao criar admin:', err.message);
        process.exit(1);
      }

      console.log('\n========================================');
      console.log('  Super Administrador criado com sucesso!');
      console.log('========================================');
      console.log(`  Nome:    ${nome}`);
      console.log(`  Email:   ${email}`);
      console.log(`  Senha:   ${senha}`);
      console.log(`  Cargo:   super_admin`);
      console.log('========================================');
      console.log('\nIMPORTANTE: Altere a senha padrão após o primeiro login!\n');

      process.exit(0);
    }
  );
});
