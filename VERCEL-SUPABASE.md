# Arquitetura GitHub + Vercel + Supabase

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

Executa todo o servidor da aplicação:

- frontend React/Vite;
- backend Node/Express;
- autenticação JWT;
- endpoints REST;
- upload/entrega de capas;
- acesso ao PostgreSQL.

### Supabase

É usado somente como PostgreSQL e para aplicar migrations versionadas em `supabase/migrations/`.

Não são usados Supabase Auth, Storage, Edge Functions ou acesso direto do navegador à Data API.

## `.env` como contrato

O `.env` da raiz é commitado e contém as 12 chaves esperadas pela integração, porém vazias no Git. A Vercel fornece os valores reais no ambiente do build/runtime.

O `dotenv` não sobrescreve variáveis já existentes da plataforma, portanto `process.env.POSTGRES_URL` fornecido pela Vercel continua sendo o valor utilizado.

Não existe `.env.local`, `.env.example` ou `.env` por subprojeto. O único arquivo de ambiente é `/.env`.

## Administrador sincronizado

Configuração versionada:

```text
SUPER_ADMIN_NAME
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
```

Nesta versão de testes, `SUPER_ADMIN_PASSWORD=admin123` fica versionado. Para trocar a senha, edite essa variável e faça commit/push. O backend converte a senha em bcrypt antes de armazená-la no PostgreSQL.

Depois do commit/push, o backend sincroniza o registro `managed_by_env = TRUE` no PostgreSQL. A alteração do e-mail também move a mesma conta gerenciada, em vez de criar contas duplicadas.

A Vercel executa `admin:sync` durante o build. Se o Supabase ainda estiver aplicando a migration inicial, o build não quebra por ausência da coluna/tabela: a sincronização é repetida no primeiro login.

## Comunicação

```text
Browser
  -> Vercel frontend
  -> /api/*
  -> Vercel backend
  -> POSTGRES_URL
  -> Supabase PostgreSQL
```

## GitHub Integration do Supabase

A pasta é `./supabase/`, portanto o Working directory é `.` e a branch de produção é `main`.


## Contrato central de ambiente

Todo runtime da aplicação lê configuração a partir do único `/.env` da raiz. A Vercel pode sobrescrever esses valores com Environment Variables do projeto; isso é usado principalmente pelas 12 variáveis sincronizadas pela integração com Supabase.

O backend acessa ambiente somente por `backend/src/config/env.js`. O frontend acessa ambiente somente por `frontend/src/config/env.ts`; o Vite usa `envDir` apontando para a raiz e limita os prefixos expostos ao navegador.

Use `npm run env:check` antes do commit para verificar se o contrato continua centralizado. O diretório `supabase/migrations/` permanece independente do `.env`, pois a integração GitHub do próprio Supabase é responsável por aplicar o schema.
