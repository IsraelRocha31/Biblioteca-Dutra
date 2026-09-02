# Supabase — PostgreSQL e migrations

O Supabase neste projeto é **somente a camada de banco PostgreSQL e migrations**. O backend continua executando na Vercel.

## Estrutura

```text
supabase/
├── config.toml
├── migrations/
│   ├── 20260901225459_initial_schema.sql
│   └── 20260901234122_env_managed_admin.sql
└── seed.sql
```

A documentação que antes ficava em `supabase/README.md` foi movida para `docs/SUPABASE.md` junto com os demais documentos.

## Migration inicial

`20260901225459_initial_schema.sql` criou:

### Extensão

- `pg_trgm` para índices de busca textual.

### Tabela `admins`

- `id BIGINT IDENTITY`;
- `nome`;
- `email`;
- `senha` com hash bcrypt;
- `role`, atualmente restrita a `super_admin`;
- `criado_em`.

O e-mail possui índice único case-insensitive por `lower(email)`.

### Tabela `livros`

- `id BIGINT IDENTITY`;
- `isbn` único;
- `nome`;
- `foto_capa BYTEA`;
- `foto_capa_mime`;
- `descricao`;
- `autor`;
- `criado_em`;
- `atualizado_em`.

A capa é armazenada no próprio PostgreSQL. A constraint `livros_capa_consistente` exige que bytes e MIME estejam ambos presentes ou ambos ausentes.

Foram criados índices trigram para:

- `nome`;
- `autor`;
- `isbn`.

RLS foi habilitado em `admins` e `livros`, sem policies públicas. O frontend não usa Data API; o backend se conecta diretamente ao PostgreSQL.

## Migration de administrador por ambiente

`20260901234122_env_managed_admin.sql` adicionou:

```text
managed_by_env BOOLEAN NOT NULL DEFAULT FALSE
```

Também foi criado um índice único parcial para garantir somente um registro `managed_by_env = TRUE`.

## Capas

No backend, as capas são recebidas pelo Multer em memória e gravadas como `BYTEA`.

Tipos aceitos pelo `.env` atual:

- JPEG;
- PNG;
- WebP.

A API entrega a imagem por:

```text
GET /api/livros/:id/capa
```

A listagem de livros não carrega os bytes da imagem. Ela retorna uma URL de capa versionada pelo timestamp de atualização do livro.

## Comandos

Criar migration:

```bash
npm run db:new -- nome_da_mudanca
```

Ambiente local Supabase:

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:stop
```

Validação/diff:

```bash
npm run db:lint
npm run db:diff
```

Reset local:

```bash
npm run db:reset
```

## Regra de migrations

Não edite uma migration já aplicada em produção. Toda alteração de schema deve entrar em uma nova migration.

## O que não existe no projeto

- `supabase/functions/`;
- backend no Supabase;
- Supabase Auth;
- Storage para capas;
- buckets declarados;
- acesso direto do navegador à Data API.
