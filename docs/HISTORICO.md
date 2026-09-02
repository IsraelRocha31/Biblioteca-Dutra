# Histórico completo do projeto

Este arquivo foi reconstruído diretamente do histórico Git do ZIP recebido. O ponto de partida é o **primeiro commit do Israel** (`7da277e`). Para cada commit, são registrados autor, data, mensagem, resumo técnico e lista exata de arquivos alterados.

> Além dos commits abaixo, a revisão atual remove `src/` legado e centraliza a documentação em `docs/`. Essas mudanças ainda não possuem hash porque fazem parte desta entrega.

## 1. `7da277e` — Primeiro commit do sistema

- **Autor:** IsraelRocha31
- **Data:** 01/09/2026 16:39
- **Hash completo:** `7da277eb1813f0cef801d4b1977e7c5f6fd089a8`

Baseline original do sistema. O repositório continha frontend React/Vite e backend Node/Express em `/src`, usando SQLite. Não havia Vercel, Supabase, PostgreSQL, pasta `backend/`, pasta `api/` ou documentação.

### Arquivos afetados

- `A` `.gitignore` — adicionado
- `A` `frontend/index.html` — adicionado
- `A` `frontend/package-lock.json` — adicionado
- `A` `frontend/package.json` — adicionado
- `A` `frontend/src/App.tsx` — adicionado
- `A` `frontend/src/api.ts` — adicionado
- `A` `frontend/src/components/BookCard.tsx` — adicionado
- `A` `frontend/src/components/BookDetails.tsx` — adicionado
- `A` `frontend/src/components/BookModal.tsx` — adicionado
- `A` `frontend/src/components/Dashboard.tsx` — adicionado
- `A` `frontend/src/components/LoginModal.tsx` — adicionado
- `A` `frontend/src/main.tsx` — adicionado
- `A` `frontend/src/types.ts` — adicionado
- `A` `frontend/src/vite-env.d.ts` — adicionado
- `A` `frontend/tsconfig.json` — adicionado
- `A` `frontend/vite.config.ts` — adicionado
- `A` `package-lock.json` — adicionado
- `A` `package.json` — adicionado
- `A` `src/database.js` — adicionado
- `A` `src/middleware/auth.js` — adicionado
- `A` `src/routes/auth.js` — adicionado
- `A` `src/routes/books.js` — adicionado
- `A` `src/seed.js` — adicionado
- `A` `src/server.js` — adicionado

## 2. `057581c` — Adiciona documentacao do projeto

- **Autor:** IsraelRocha31
- **Data:** 01/09/2026 16:47
- **Hash completo:** `057581cc05293db043bc630ffbb944d3b4690067`

Adicionou `DOCUMENTACAO.txt`, registrando a arquitetura inicial SQLite, os endpoints, credenciais padrão, execução local, funcionalidades e segurança do primeiro sistema.

### Arquivos afetados

- `A` `DOCUMENTACAO.txt` — adicionado

## 3. `15fc1ab` — feat: preparar projeto para Vercel e Supabase

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 20:31
- **Hash completo:** `15fc1abeb92cdfcd6cd2ba7ddbffd904cd0040e1`

Grande migração estrutural: criou o backend oficial em `backend/`, entrada serverless `api/index.js`, configuração Vercel, Supabase/migrations, PostgreSQL, workspaces npm, armazenamento de capas em BYTEA, paginação e busca no backend, nova camada CSS completamente separada e novos documentos/roadmap/guia de designers.

### Arquivos afetados

- `A` `.env.example` — adicionado
- `M` `.gitignore` — modificado
- `M` `DOCUMENTACAO.txt` — modificado
- `A` `README.md` — adicionado
- `A` `ROADMAP.md` — adicionado
- `A` `VERCEL-SUPABASE.md` — adicionado
- `A` `api/index.js` — adicionado
- `A` `backend/.env.example` — adicionado
- `A` `backend/package.json` — adicionado
- `A` `backend/src/app.js` — adicionado
- `A` `backend/src/config/env.js` — adicionado
- `A` `backend/src/database.js` — adicionado
- `A` `backend/src/middleware/auth.js` — adicionado
- `A` `backend/src/routes/auth.js` — adicionado
- `A` `backend/src/routes/books.js` — adicionado
- `A` `backend/src/seed.js` — adicionado
- `A` `backend/src/server.js` — adicionado
- `A` `backend/src/services/bootstrap-admin.js` — adicionado
- `A` `frontend/DESIGNERS.md` — adicionado
- `M` `frontend/package.json` — modificado
- `M` `frontend/src/api.ts` — modificado
- `M` `frontend/src/components/BookCard.tsx` — modificado
- `M` `frontend/src/components/BookDetails.tsx` — modificado
- `M` `frontend/src/components/BookModal.tsx` — modificado
- `A` `frontend/src/components/ConfirmModal.tsx` — adicionado
- `M` `frontend/src/components/Dashboard.tsx` — modificado
- `M` `frontend/src/components/LoginModal.tsx` — modificado
- `M` `frontend/src/main.tsx` — modificado
- `A` `frontend/src/styles/base.css` — adicionado
- `A` `frontend/src/styles/components.css` — adicionado
- `A` `frontend/src/styles/index.css` — adicionado
- `A` `frontend/src/styles/layout.css` — adicionado
- `A` `frontend/src/styles/reset.css` — adicionado
- `A` `frontend/src/styles/responsive.css` — adicionado
- `A` `frontend/src/styles/tokens.css` — adicionado
- `A` `frontend/src/styles/utilities.css` — adicionado
- `M` `frontend/src/vite-env.d.ts` — modificado
- `M` `frontend/vite.config.ts` — modificado
- `M` `package.json` — modificado
- `A` `supabase/README.md` — adicionado
- `A` `supabase/config.toml` — adicionado
- `A` `supabase/migrations/20260901225459_initial_schema.sql` — adicionado
- `A` `supabase/seed.sql` — adicionado
- `A` `vercel.json` — adicionado

## 4. `3f3d18f` — refactor: centralizar configuracao no env e integrar Vercel Supabase

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 21:22
- **Hash completo:** `3f3d18f3cc82e3a4694c09f69bde91d1fafccb83`

Centralizou a configuração no `/.env`, criou validação do contrato de ambiente, tornou parâmetros do backend/frontend configuráveis, criou sincronização do super administrador gerenciado pelo ambiente e a migration `managed_by_env`.

### Arquivos afetados

- `A` `.env` — adicionado
- `M` `.gitignore` — modificado
- `M` `DOCUMENTACAO.txt` — modificado
- `M` `README.md` — modificado
- `M` `VERCEL-SUPABASE.md` — modificado
- `M` `api/index.js` — modificado
- `M` `backend/package.json` — modificado
- `M` `backend/src/app.js` — modificado
- `M` `backend/src/config/env.js` — modificado
- `M` `backend/src/database.js` — modificado
- `M` `backend/src/routes/auth.js` — modificado
- `M` `backend/src/routes/books.js` — modificado
- `A` `backend/src/scripts/sync-admin.js` — adicionado
- `M` `backend/src/seed.js` — modificado
- `M` `backend/src/server.js` — modificado
- `M` `backend/src/services/bootstrap-admin.js` — modificado
- `M` `frontend/index.html` — modificado
- `M` `frontend/src/api.ts` — modificado
- `M` `frontend/src/components/BookModal.tsx` — modificado
- `M` `frontend/src/components/Dashboard.tsx` — modificado
- `M` `frontend/src/components/LoginModal.tsx` — modificado
- `A` `frontend/src/config/env.ts` — adicionado
- `M` `frontend/src/vite-env.d.ts` — modificado
- `M` `frontend/vite.config.ts` — modificado
- `M` `package.json` — modificado
- `A` `scripts/check-env-contract.mjs` — adicionado
- `A` `supabase/migrations/20260901234122_env_managed_admin.sql` — adicionado
- `M` `vercel.json` — modificado

## 5. `ea1973d` — fix: corrigir inicializacao da API na Vercel

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 21:28
- **Hash completo:** `ea1973d4c274767a20942ca426dd961c2815bdbb`

Corrigiu a inicialização da API na Vercel com imports dinâmicos e resposta controlada de erro. Removeu sincronização de admin do build para não depender da ordem das migrations e incluiu `.env` no runtime da Function.

### Arquivos afetados

- `M` `README.md` — modificado
- `M` `VERCEL-SUPABASE.md` — modificado
- `M` `api/index.js` — modificado
- `M` `package.json` — modificado
- `M` `vercel.json` — modificado

## 6. `8b8468f` — fix: corrigir includeFiles da Vercel

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 21:31
- **Hash completo:** `8b8468f2de739c5bda9f38eccb4eee3c92b5344b`

Corrigiu a sintaxe de `includeFiles` no `vercel.json`, passando de array para string.

### Arquivos afetados

- `M` `vercel.json` — modificado

## 7. `009e330` — fix: corrigir build do monorepo na Vercel

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 21:53
- **Hash completo:** `009e33070c55f88d45c8d6586d1b38f0e208b0ed`

Corrigiu o build do monorepo na Vercel: Node `22.x`, npm `10.9.2`, instalação sem package-lock, remoção de lockfiles e simplificação do `vercel-build`.

### Arquivos afetados

- `M` `backend/package.json` — modificado
- `D` `frontend/package-lock.json` — removido
- `M` `frontend/package.json` — modificado
- `D` `package-lock.json` — removido
- `M` `package.json` — modificado
- `M` `vercel.json` — modificado

## 8. `310f7ca` — fix: corrigir inicializacao do frontend

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 23:03
- **Hash completo:** `310f7cabda9a767f30dfc59336d2d7cfff45c5c2`

Corrigiu a inicialização do frontend: criou `AppErrorBoundary`, validou `#root`, começou a injetar configuração pública via `__APP_CONFIG__` e restringiu `import.meta.env` no runtime React.

### Arquivos afetados

- `A` `frontend/src/components/AppErrorBoundary.tsx` — adicionado
- `M` `frontend/src/config/env.ts` — modificado
- `M` `frontend/src/main.tsx` — modificado
- `M` `frontend/src/vite-env.d.ts` — modificado
- `M` `frontend/vite.config.ts` — modificado
- `M` `scripts/check-env-contract.mjs` — modificado

## 9. `8a5e62d` — chore: redeploy com Supabase correto

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 23:21
- **Hash completo:** `8a5e62d33512e8227ae4f05043787710c5171dfb`

Commit de redeploy sem alterações de arquivos, usado para disparar nova implantação com a integração correta do Supabase.

### Arquivos afetados

- Nenhum arquivo alterado neste commit.

## 10. `3dcfd33` — fix: corrigir frontend e SSL da conexão com Supabase

- **Autor:** JoaoDEVWHADS
- **Data:** 01/09/2026 23:36
- **Hash completo:** `3dcfd33ca6dbcf2e4954d1a6eda02638bbce8aba`

Corrigiu conexão SSL com Supabase usando `DB_SSL_USE_LIBPQ_COMPAT` e `uselibpqcompat=true`; também fez uma alteração intermediária na estratégia de configuração do frontend.

### Arquivos afetados

- `M` `.env` — modificado
- `M` `backend/src/config/env.js` — modificado
- `M` `backend/src/database.js` — modificado
- `M` `frontend/src/config/env.ts` — modificado
- `M` `frontend/src/main.tsx` — modificado
- `M` `frontend/src/vite-env.d.ts` — modificado
- `M` `frontend/vite.config.ts` — modificado
- `M` `scripts/check-env-contract.mjs` — modificado

## 11. `bc9cf68` — fix: corrigir inicializacao da interface

- **Autor:** JoaoDEVWHADS
- **Data:** 02/09/2026 07:55
- **Hash completo:** `bc9cf6834666dca7f896291e30c67f031110dea3`

Corrigiu definitivamente a interface e configuração do frontend: Vite valida/injeta `__APP_CONFIG__`, React não lê `import.meta.env`, Error Boundary foi refinado e ganhou estilo CSS próprio. Também atualizou documentos técnicos.

### Arquivos afetados

- `M` `DOCUMENTACAO.txt` — modificado
- `M` `README.md` — modificado
- `M` `VERCEL-SUPABASE.md` — modificado
- `M` `frontend/src/components/AppErrorBoundary.tsx` — modificado
- `M` `frontend/src/config/env.ts` — modificado
- `M` `frontend/src/main.tsx` — modificado
- `M` `frontend/src/styles/components.css` — modificado
- `M` `frontend/src/vite-env.d.ts` — modificado
- `M` `frontend/vite.config.ts` — modificado
- `M` `scripts/check-env-contract.mjs` — modificado

## Revisão atual — organização solicitada em 02/09/2026

### Remoção do backend legado

Foram removidos da raiz:

- `src/database.js`
- `src/middleware/auth.js`
- `src/routes/auth.js`
- `src/routes/books.js`
- `src/seed.js`
- `src/server.js`

Esses arquivos pertenciam ao backend SQLite original. O runtime atual usa `backend/src/` e `api/index.js`.

### Centralização dos documentos

- `DOCUMENTACAO.txt` → `docs/DOCUMENTACAO.txt`
- `README.md` → `docs/README.md`
- `ROADMAP.md` → `docs/ROADMAP.md`
- `VERCEL-SUPABASE.md` → `docs/VERCEL-SUPABASE.md`
- `frontend/DESIGNERS.md` → `docs/DESIGNERS.md`
- `supabase/README.md` → `docs/SUPABASE.md`
- novo `docs/HISTORICO.md`

Assim, toda documentação passa a ter um único local: `docs/`.
