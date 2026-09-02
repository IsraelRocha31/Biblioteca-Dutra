# Biblioteca Dutra

Sistema de biblioteca escolar em um único repositório GitHub, com frontend React/Vite, backend Node/Express, deploy na Vercel e PostgreSQL no Supabase.

## Estrutura do projeto

```text
Biblioteca-Dutra/
├── api/                         # entrada serverless da Vercel
├── backend/                     # backend Node.js + Express
│   └── src/
├── frontend/                    # frontend React + TypeScript + Vite
│   └── src/
├── supabase/                    # configuração, migrations e seed do PostgreSQL
├── docs/                        # toda a documentação detalhada do projeto
├── scripts/                     # scripts de validação/manutenção
├── .env                         # contrato central de configuração
├── package.json
├── vercel.json
└── README.md                    # ponto de entrada da documentação
```

A antiga pasta `src/` da raiz foi removida. O backend atual fica exclusivamente em `backend/src/`.

## Arquitetura

```text
GitHub
   |
   +-------------------+
   |                   |
   v                   v
Vercel              Supabase
   |                   |
   +-- frontend         +-- PostgreSQL
   +-- backend              + migrations
          |
          +----------------> PostgreSQL
```

O navegador não acessa o Supabase diretamente. O frontend chama a API e o backend acessa o PostgreSQL.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Por padrão:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API: `http://localhost:3000/api`
- Health: `http://localhost:3000/api/health`

## Verificações

```bash
npm run env:check
npm run check
npm run build
```

## Migrations

```bash
npm run db:new -- nome_da_mudanca
```

As migrations ficam em `supabase/migrations/`. Não altere migrations já aplicadas em produção; crie uma nova migration.

## Documentação

Toda documentação detalhada fica exclusivamente em [`docs/`](docs/):

- [`docs/DOCUMENTACAO.txt`](docs/DOCUMENTACAO.txt) — documentação técnica consolidada;
- [`docs/HISTORICO.md`](docs/HISTORICO.md) — evolução do sistema desde o primeiro commit do Israel;
- [`docs/VERCEL-SUPABASE.md`](docs/VERCEL-SUPABASE.md) — arquitetura de deploy e integração;
- [`docs/SUPABASE.md`](docs/SUPABASE.md) — banco, schema e migrations;
- [`docs/DESIGNERS.md`](docs/DESIGNERS.md) — contrato da camada visual/CSS para designers;
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — próximas evoluções;
- [`docs/README.md`](docs/README.md) — índice completo da documentação.

O `README.md` da raiz é a única exceção: ele serve apenas como porta de entrada do repositório e aponta para `docs/`.
