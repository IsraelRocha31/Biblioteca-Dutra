import express from 'express';
import multer from 'multer';
import { query } from '../database.js';
import { autenticar, superAdmin } from '../middleware/auth.js';

const router = express.Router();
const MAX_COVER_SIZE = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const BOOK_FIELDS = `
  id, isbn, nome, descricao, autor, criado_em, atualizado_em,
  (foto_capa IS NOT NULL) AS tem_capa
`;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_COVER_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) return cb(null, true);
    return cb(new Error('Apenas imagens JPG, PNG ou WebP são aceitas.'));
  }
});

function parsePagination(page, limit) {
  const parsedPage = Number.parseInt(String(page || '1'), 10);
  const parsedLimit = Number.parseInt(String(limit || '20'), 10);
  const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safeLimit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 20;
  return { page: safePage, limit: safeLimit, offset: (safePage - 1) * safeLimit };
}

function parseBookId(value) {
  const id = Number.parseInt(String(value), 10);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function serializeBook(book) {
  const id = Number(book.id);
  const version = new Date(book.atualizado_em).getTime();
  const fotoCapa = book.tem_capa ? `/api/livros/${id}/capa?v=${version}` : null;
  const { tem_capa: _temCapa, ...data } = book;
  return { ...data, id, foto_capa: fotoCapa };
}

router.get('/', async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query.page, req.query.limit);
    const conditions = [];
    const params = [];
    const busca = String(req.query.busca || '').trim();
    const autor = String(req.query.autor || '').trim();

    if (busca) {
      params.push(`%${busca}%`);
      const p = `$${params.length}`;
      conditions.push(`(nome ILIKE ${p} OR isbn ILIKE ${p} OR autor ILIKE ${p} OR descricao ILIKE ${p})`);
    }

    if (autor) {
      params.push(`%${autor}%`);
      conditions.push(`autor ILIKE $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const countParams = [...params];
    params.push(limit, offset);

    const [booksResult, countResult] = await Promise.all([
      query(
        `SELECT ${BOOK_FIELDS}
         FROM livros
         ${where}
         ORDER BY criado_em DESC
         LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
      ),
      query(`SELECT COUNT(*)::int AS total FROM livros ${where}`, countParams)
    ]);

    const total = Number(countResult.rows[0]?.total || 0);
    return res.json({
      livros: booksResult.rows.map(serializeBook),
      paginacao: {
        total,
        pagina: page,
        limite: limit,
        paginas: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/isbn/:isbn', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT ${BOOK_FIELDS} FROM livros WHERE isbn = $1 LIMIT 1`,
      [req.params.isbn]
    );
    const livro = result.rows[0];

    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado com este ISBN.' });
    return res.json({ livro: serializeBook(livro) });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/capa', async (req, res, next) => {
  try {
    const id = parseBookId(req.params.id);
    if (!id) return res.status(400).json({ erro: 'ID de livro inválido.' });

    const result = await query(
      `SELECT foto_capa, foto_capa_mime
       FROM livros
       WHERE id = $1
       LIMIT 1`,
      [id]
    );
    const livro = result.rows[0];

    if (!livro?.foto_capa) return res.status(404).json({ erro: 'Capa não encontrada.' });

    res.set('Content-Type', livro.foto_capa_mime || 'application/octet-stream');
    res.set('Content-Length', String(livro.foto_capa.length));
    res.set('Cache-Control', 'public, max-age=86400, immutable');
    return res.send(livro.foto_capa);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseBookId(req.params.id);
    if (!id) return res.status(400).json({ erro: 'ID de livro inválido.' });

    const result = await query(
      `SELECT ${BOOK_FIELDS} FROM livros WHERE id = $1 LIMIT 1`,
      [id]
    );
    const livro = result.rows[0];

    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado.' });
    return res.json({ livro: serializeBook(livro) });
  } catch (error) {
    return next(error);
  }
});

router.post('/', autenticar, superAdmin, upload.single('foto_capa'), async (req, res, next) => {
  try {
    const isbn = String(req.body?.isbn || '').trim();
    const nome = String(req.body?.nome || '').trim();
    const autor = String(req.body?.autor || '').trim();
    const descricao = String(req.body?.descricao || '').trim() || null;

    if (!isbn || !nome || !autor) {
      return res.status(400).json({ erro: 'ISBN, nome e autor são obrigatórios.' });
    }

    const result = await query(
      `INSERT INTO livros (isbn, nome, foto_capa, foto_capa_mime, descricao, autor)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${BOOK_FIELDS}`,
      [
        isbn,
        nome,
        req.file?.buffer || null,
        req.file?.mimetype || null,
        descricao,
        autor
      ]
    );

    return res.status(201).json({
      mensagem: 'Livro cadastrado com sucesso.',
      livro: serializeBook(result.rows[0])
    });
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ erro: 'Já existe um livro com este ISBN.' });
    }
    return next(error);
  }
});

router.put('/:id', autenticar, superAdmin, upload.single('foto_capa'), async (req, res, next) => {
  try {
    const id = parseBookId(req.params.id);
    if (!id) return res.status(400).json({ erro: 'ID de livro inválido.' });

    const existingResult = await query(
      `SELECT id, isbn, nome, descricao, autor
       FROM livros
       WHERE id = $1
       LIMIT 1`,
      [id]
    );
    const existing = existingResult.rows[0];

    if (!existing) return res.status(404).json({ erro: 'Livro não encontrado.' });

    const isbn = String(req.body?.isbn || existing.isbn).trim();
    const nome = String(req.body?.nome || existing.nome).trim();
    const autor = String(req.body?.autor || existing.autor).trim();
    const descricao = req.body?.descricao !== undefined
      ? String(req.body.descricao).trim() || null
      : existing.descricao;

    const result = await query(
      `UPDATE livros
       SET isbn = $1,
           nome = $2,
           foto_capa = COALESCE($3, foto_capa),
           foto_capa_mime = COALESCE($4, foto_capa_mime),
           descricao = $5,
           autor = $6,
           atualizado_em = now()
       WHERE id = $7
       RETURNING ${BOOK_FIELDS}`,
      [
        isbn,
        nome,
        req.file?.buffer || null,
        req.file?.mimetype || null,
        descricao,
        autor,
        id
      ]
    );

    return res.json({
      mensagem: 'Livro atualizado com sucesso.',
      livro: serializeBook(result.rows[0])
    });
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ erro: 'Já existe outro livro com este ISBN.' });
    }
    return next(error);
  }
});

router.delete('/:id', autenticar, superAdmin, async (req, res, next) => {
  try {
    const id = parseBookId(req.params.id);
    if (!id) return res.status(400).json({ erro: 'ID de livro inválido.' });

    const result = await query('DELETE FROM livros WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) return res.status(404).json({ erro: 'Livro não encontrado.' });

    return res.json({ mensagem: 'Livro removido com sucesso.' });
  } catch (error) {
    return next(error);
  }
});

export default router;
