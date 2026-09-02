# Arquitetura GitHub + Vercel + Supabase

Este documento descreve a arquitetura atual e como ela evoluiu desde o backend SQLite do primeiro commit.

## Visão geral

```text
GitHub repository
├── frontend/ ───────────────┐
├── backend/                 ├──> Vercel
├── api/ ────────────────────┘
├── .env ───────────────────────> contrato versionado
└── supabase/ ──────────────────> Supabase PostgreSQL
```

## Responsabilidades

### Vercel

A Vercel executa:

- build e publicação do frontend React/Vite;
- Function `api/index.js`;
- aplicação Express carregada de `backend/src/app.js`;
- autenticação JWT;
- CRUD REST;
- upload/entrega de capas;
- conexão ao PostgreSQL do Supabase.

O `vercel.json` atual define:

- `framework: null`;
- `installCommand: npm install --package-lock=false`;
- `buildCommand: npm run vercel-build`;
- `outputDirectory: frontend/dist`;
- Function `api/index.js` com `maxDuration: 30`;
- `includeFiles: ".env"`;
- rewrites de `/api` e `/api/:path*` para a Function.

### Supabase

O Supabase é usado somente para:

- PostgreSQL;
- aplicação de migrations versionadas;
- desenvolvimento local pela Supabase CLI, quando necessário.

O sistema **não usa**:

- Supabase Auth;
- Supabase Storage;
- Supabase Edge Functions;
- acesso direto do frontend à Data API.

## Fluxo HTTP

```text
Browser
  -> frontend na Vercel
  -> /api/*
  -> rewrite do vercel.json
  -> api/index.js
  -> backend/src/app.js
  -> pg Pool
  -> POSTGRES_URL
  -> Supabase PostgreSQL
```

`api/index.js` faz carregamento dinâmico do runtime e captura falhas de inicialização, devolvendo `SERVER_INIT_FAILED` em vez de deixar a Function falhar sem resposta controlada.

## Evolução da integração

### `15fc1ab` — preparação para Vercel e Supabase

Foi criada a arquitetura nova em paralelo ao backend antigo:

- `backend/` passou a conter o servidor Express;
- `api/index.js` virou a entrada da Vercel;
- `supabase/` passou a conter configuração e migration inicial;
- SQLite foi substituído por PostgreSQL no backend novo;
- capas passaram de arquivos no disco para `BYTEA` no PostgreSQL;
- `vercel.json` passou a fazer rewrites de `/api`;
- o projeto passou a usar npm workspaces para `frontend` e `backend`.

### `3f3d18f` — configuração central

A configuração foi centralizada em `/.env`:

- backend passou a ler apenas o `.env` da raiz;
- parâmetros de app, HTTP, banco, autenticação, paginação e upload deixaram de ficar hardcoded;
- frontend passou a carregar configuração da raiz via Vite;
- foi criado `scripts/check-env-contract.mjs`;
- foi criada a migration `managed_by_env` para o super administrador;
- foi criado o comando `admin:sync`.

### `ea1973d` — inicialização segura da API

A Function deixou de importar o backend estaticamente. O runtime passou a ser carregado dentro do handler, permitindo capturar erros de configuração/conexão e responder JSON controlado. O `admin:sync` também foi removido do build da Vercel para evitar corrida entre deploy e migrations.

### `8b8468f` — `includeFiles`

A sintaxe de `includeFiles` foi corrigida para o formato aceito pela configuração atual:

```json
"includeFiles": ".env"
```

### `009e330` — build do monorepo

Foram corrigidos pontos de compatibilidade com a Vercel:

- Node fixado em `22.x` no root, frontend e backend;
- npm fixado em `10.9.2` no root;
- lockfiles foram removidos;
- instalação da Vercel passou a usar `npm install --package-lock=false`;
- `vercel-build` foi reduzido para o build do frontend.

### `310f7ca` — inicialização do frontend

O frontend ganhou `AppErrorBoundary`, validação explícita do elemento `#root` e uma primeira tentativa de injetar configuração pública no bundle em vez de expor diversas variáveis por `envPrefix`.

### `3dcfd33` — SSL do Supabase

Foi adicionada `DB_SSL_USE_LIBPQ_COMPAT=true`. O backend passou a acrescentar `uselibpqcompat=true` à `POSTGRES_URL` quando necessário, corrigindo a conexão com o PostgreSQL do Supabase em ambientes que apresentavam erro de cadeia de certificado.

### `bc9cf68` — correção definitiva da interface

O frontend deixou de acessar `import.meta.env` em runtime. `frontend/vite.config.ts` passou a validar os valores públicos e injetar um único objeto `__APP_CONFIG__`. O `AppErrorBoundary` foi ajustado e recebeu CSS próprio.

## `.env` central

O `.env` atual possui 45 variáveis divididas em grupos:

- 12 chaves da integração Vercel/Supabase;
- identidade e rotas da aplicação;
- administrador/autenticação;
- frontend/desenvolvimento local;
- backend/HTTP;
- PostgreSQL;
- livros/upload/paginação.

A aplicação usa diretamente `POSTGRES_URL` para conexão. As demais chaves do Marketplace/Supabase permanecem no contrato, mesmo quando não são consumidas pelo runtime.

## Super administrador gerenciado pelo ambiente

A migration `20260901234122_env_managed_admin.sql` adicionou `managed_by_env` à tabela `admins` e garante no máximo uma conta gerenciada pelo `.env`.

Antes de cada login, `syncSuperAdminFromEnv()`:

1. procura a conta `managed_by_env = TRUE`;
2. atualiza nome, e-mail e hash da senha se ela existir;
3. adota uma conta do mesmo e-mail caso exista sem a flag;
4. cria uma nova conta gerenciada caso não exista nenhuma.

O build da Vercel **não acessa o banco** para sincronizar o administrador.

## GitHub Integration do Supabase

A pasta `supabase/` fica na raiz. Para a integração GitHub do Supabase, o Working Directory continua sendo a raiz do repositório (`.`), e as migrations ficam em `supabase/migrations/`.
