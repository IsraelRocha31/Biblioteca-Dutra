const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { autenticar, superAdmin } = require('../middleware/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = `livro_${Date.now()}${ext}`;
    cb(null, nome);
  }
});

const fileFilter = (req, file, cb) => {
  const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens JPG, PNG ou WebP são aceitas.'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/livros - listar todos os livros
router.get('/', (req, res) => {
  const { busca, autor, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM livros';
  let params = [];
  const conditions = [];

  if (busca) {
    conditions.push('(nome LIKE ? OR isbn LIKE ? OR autor LIKE ? OR descricao LIKE ?)');
    const termo = `%${busca}%`;
    params.push(termo, termo, termo, termo);
  }

  if (autor) {
    conditions.push('autor LIKE ?');
    params.push(`%${autor}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY criado_em DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  db.all(sql, params, (err, livros) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar livros.' });
    }

    let countSql = 'SELECT COUNT(*) as total FROM livros';
    const countParams = params.slice(0, -2);

    db.get(countSql, countParams, (err, resultado) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao contar livros.' });
      }

      return res.json({
        livros,
        paginacao: {
          total: resultado.total,
          pagina: Number(page),
          limite: Number(limit),
          paginas: Math.ceil(resultado.total / limit)
        }
      });
    });
  });
});

// GET /api/livros/:id - buscar livro por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM livros WHERE id = ?', [id], (err, livro) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar livro.' });
    }

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }

    return res.json({ livro });
  });
});

// GET /api/livros/isbn/:isbn - buscar livro por ISBN
router.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  db.get('SELECT * FROM livros WHERE isbn = ?', [isbn], (err, livro) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar livro.' });
    }

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado com este ISBN.' });
    }

    return res.json({ livro });
  });
});

// POST /api/livros - cadastrar livro (apenas super admin)
router.post('/', autenticar, superAdmin, upload.single('foto_capa'), (req, res) => {
  const { isbn, nome, descricao, autor } = req.body;

  if (!isbn || !nome || !autor) {
    return res.status(400).json({ erro: 'ISBN, nome e autor são obrigatórios.' });
  }

  const fotoCapa = req.file ? `/uploads/${req.file.filename}` : null;

  db.run(
    'INSERT INTO livros (isbn, nome, foto_capa, descricao, autor) VALUES (?, ?, ?, ?, ?)',
    [isbn, nome, fotoCapa, descricao || null, autor],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ erro: 'Já existe um livro com este ISBN.' });
        }
        return res.status(500).json({ erro: 'Erro ao cadastrar livro.' });
      }

      return res.status(201).json({
        mensagem: 'Livro cadastrado com sucesso.',
        livro: {
          id: this.lastID,
          isbn,
          nome,
          foto_capa: fotoCapa,
          descricao: descricao || null,
          autor
        }
      });
    }
  );
});

// PUT /api/livros/:id - atualizar livro (apenas super admin)
router.put('/:id', autenticar, superAdmin, upload.single('foto_capa'), (req, res) => {
  const { id } = req.params;
  const { isbn, nome, descricao, autor } = req.body;

  db.get('SELECT * FROM livros WHERE id = ?', [id], (err, livroExistente) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar livro.' });
    }

    if (!livroExistente) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }

    let fotoCapa = livroExistente.foto_capa;

    if (req.file) {
      if (livroExistente.foto_capa) {
        const caminhoAntigo = path.join(__dirname, '..', '..', livroExistente.foto_capa);
        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
        }
      }
      fotoCapa = `/uploads/${req.file.filename}`;
    }

    const novoIsbn = isbn || livroExistente.isbn;
    const novoNome = nome || livroExistente.nome;
    const novaDescricao = descricao !== undefined ? descricao : livroExistente.descricao;
    const novoAutor = autor || livroExistente.autor;

    db.run(
      `UPDATE livros SET isbn = ?, nome = ?, foto_capa = ?, descricao = ?, autor = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?`,
      [novoIsbn, novoNome, fotoCapa, novaDescricao, novoAutor, id],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(409).json({ erro: 'Já existe outro livro com este ISBN.' });
          }
          return res.status(500).json({ erro: 'Erro ao atualizar livro.' });
        }

        return res.json({
          mensagem: 'Livro atualizado com sucesso.',
          livro: {
            id: Number(id),
            isbn: novoIsbn,
            nome: novoNome,
            foto_capa: fotoCapa,
            descricao: novaDescricao,
            autor: novoAutor
          }
        });
      }
    );
  });
});

// DELETE /api/livros/:id - deletar livro (apenas super admin)
router.delete('/:id', autenticar, superAdmin, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM livros WHERE id = ?', [id], (err, livro) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar livro.' });
    }

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }

    if (livro.foto_capa) {
      const caminhoFoto = path.join(__dirname, '..', '..', livro.foto_capa);
      if (fs.existsSync(caminhoFoto)) {
        fs.unlinkSync(caminhoFoto);
      }
    }

    db.run('DELETE FROM livros WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao deletar livro.' });
      }

      return res.json({ mensagem: 'Livro removido com sucesso.' });
    });
  });
});

module.exports = router;
