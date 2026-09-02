# Biblioteca Dutra — documentação

Esta pasta concentra **toda a documentação detalhada do projeto Biblioteca Dutra**. O único documento mantido fora dela é o `README.md` da raiz, usado como porta de entrada do repositório.

O repositório começou no commit `7da277e` de IsraelRocha31 como uma aplicação com frontend React/Vite e backend Node/Express + SQLite em `src/`. A partir dos commits seguintes, o sistema foi migrado para uma arquitetura de monorepo com `frontend/`, `backend/`, Vercel e PostgreSQL do Supabase. O histórico completo está em [HISTORICO.md](HISTORICO.md).

## Documentos

- [DOCUMENTACAO.txt](DOCUMENTACAO.txt) — documentação técnica consolidada do estado atual, incluindo a evolução desde o primeiro commit.
- [HISTORICO.md](HISTORICO.md) — histórico commit a commit, com as alterações e os arquivos afetados.
- [VERCEL-SUPABASE.md](VERCEL-SUPABASE.md) — arquitetura de deploy, runtime, banco e integração GitHub/Vercel/Supabase.
- [SUPABASE.md](SUPABASE.md) — schema, migrations e regras de uso do Supabase.
- [DESIGNERS.md](DESIGNERS.md) — contrato entre desenvolvimento e design; toda aparência visual fica em `frontend/src/styles/`.
- [ROADMAP.md](ROADMAP.md) — próximas evoluções sugeridas para transformar o catálogo em um sistema completo de biblioteca.

## Arquitetura atual

```text
Biblioteca-Dutra/
├── api/                         # entrada serverless da Vercel
│   └── index.js
├── backend/                     # Node.js + Express
│   ├── package.json
│   └── src/
├── frontend/                    # React + TypeScript + Vite
│   ├── package.json
│   └── src/
├── supabase/                    # migrations e configuração do PostgreSQL
│   ├── config.toml
│   ├── migrations/
│   └── seed.sql
├── docs/                        # toda a documentação
├── scripts/
│   └── check-env-contract.mjs
├── .env                         # único arquivo de ambiente e contrato central
├── package.json
└── vercel.json
```

A antiga pasta `src/` da raiz, que continha o backend SQLite do primeiro commit, foi removida nesta revisão porque o runtime atual usa exclusivamente `backend/src/`.

## Fluxo de execução

```text
Navegador
   |
   v
Frontend React/Vite na Vercel
   |
   v
/api/*
   |
   v
api/index.js
   |
   v
backend/src/app.js (Express)
   |
   v
POSTGRES_URL
   |
   v
PostgreSQL do Supabase
```

O navegador não acessa o Supabase diretamente.

## Tecnologias atuais

### Frontend

- React 18
- React DOM 18
- TypeScript 5
- Vite 5
- CSS separado por responsabilidade em `frontend/src/styles/`
- modal reutilizável acessível com foco inicial, focus trap, `Escape`, retorno de foco e conteúdo de fundo inerte

### Backend

- Node.js 22.x
- Express 4
- PostgreSQL via `pg`
- `@vercel/functions`
- JWT via `jsonwebtoken`
- bcrypt via `bcryptjs`
- Multer em memória para capas
- CORS
- dotenv

### Infraestrutura

- GitHub como repositório
- Vercel para frontend e backend serverless
- Supabase apenas para PostgreSQL e migrations
- Supabase CLI para desenvolvimento/migrations

## Configuração

O projeto foi refatorado para tratar `/.env` como contrato central. O backend lê esse arquivo em `backend/src/config/env.js`; o Vite lê e valida os valores públicos durante o build e injeta somente `__APP_CONFIG__` no frontend.

O script:

```bash
npm run env:check
```

verifica o contrato de configuração, o uso de `process.env`/`import.meta.env`, os rewrites da Vercel e valores hardcoded proibidos.

### Contrato de ambiente validado

O projeto mantém **somente `/.env`**. Os arquivos legados `/.env.example` e `backend/.env.example` foram removidos para que a regra criada em `scripts/check-env-contract.mjs` corresponda ao próprio repositório. Arquivos `.env` em subpastas continuam bloqueados pelo `.gitignore` e pelo validador.

O comando `npm run env:check` passa com 45 variáveis e acesso centralizado.

## Desenvolvimento local

Instale as dependências na raiz:

```bash
npm install
```

Execute frontend e backend juntos:

```bash
npm run dev
```

Endereços definidos pelo `.env` atual:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health`

## Verificações

```bash
npm run env:check
npm run check
npm run build
```

`npm run check` agrega validação de ambiente, checagem sintática do backend e build do frontend.

## Banco e migrations

Criar uma migration:

```bash
npm run db:new -- nome_da_mudanca
```

As migrations ficam em `supabase/migrations/`. Não altere migrations já aplicadas em produção; crie uma nova.

## Estado atual da documentação

Antes desta reorganização, os documentos estavam espalhados na raiz, em `frontend/` e em `supabase/`. Agora todos ficam em `docs/`, conforme solicitado. O histórico original de cada documento foi preservado no Git por movimentação/renomeação dos arquivos.

A revisão de 02/09/2026 também documenta o commit de acessibilidade `1136ccf` e a correção posterior que eliminou arquivos `.env*` duplicados e removeu a escrita direta de `document.body.style` do modal.
