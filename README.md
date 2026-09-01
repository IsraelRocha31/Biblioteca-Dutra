# Biblioteca Dutra

Sistema de biblioteca escolar com um único repositório GitHub conectado à **Vercel** e ao **Supabase**.

A separação é intencional e simples:

- **Vercel:** executa todo o sistema web: frontend React e backend Node/Express.
- **Supabase:** fornece somente o banco PostgreSQL e recebe as migrations versionadas.
- **GitHub:** é a fonte de verdade compartilhada pelos dois serviços.

## Estrutura definitiva

```text
Biblioteca-Dutra/
├── frontend/                 # React + TypeScript + Vite -> Vercel
├── backend/                  # Node + Express -> Vercel
├── api/                      # adaptador da Vercel para o backend
├── supabase/                 # SOMENTE PostgreSQL/migrations -> Supabase
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   └── README.md
├── package.json
├── vercel.json
├── .env.example
└── .gitignore
```

`frontend/`, `backend/` e `supabase/` são pastas irmãs na raiz do repositório.

## Fluxo

```text
                         GitHub
                        /      \
                       /        \
                      v          v
                  Vercel       Supabase
                 /      \          |
          frontend     backend   PostgreSQL
                         |
                         +----------+
                           POSTGRES_URL
```

O navegador nunca acessa o Supabase diretamente. Toda operação passa pelo backend hospedado na Vercel.

## Supabase conectado ao GitHub

Como a pasta `supabase/` está na raiz, a integração Supabase + GitHub deve usar:

```text
Working directory: .
```

Com **Deploy to production** habilitado, novas migrations em `supabase/migrations/` são aplicadas automaticamente quando chegam à branch de produção.

Neste projeto não há Edge Functions nem buckets de Storage declarados no Supabase.

## Banco e capas dos livros

O Supabase é usado somente como PostgreSQL.

As capas também são persistidas no banco:

- conteúdo da imagem: `BYTEA`;
- MIME type: `foto_capa_mime`;
- limite da aplicação: 4 MiB;
- rota pública de leitura: `GET /api/livros/:id/capa`.

Isso evita filesystem persistente na Vercel e evita usar Supabase Storage.

## Integração Vercel + Supabase

A integração nativa pode sincronizar estas variáveis para a Vercel:

```text
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_URL
```

O backend atual precisa do banco através de:

```text
POSTGRES_URL
```

As chaves `SUPABASE_*` e `NEXT_PUBLIC_SUPABASE_*` podem existir por causa da integração, mas **não são usadas pelo código da aplicação**.

Variáveis próprias da aplicação:

```text
JWT_SECRET=<chave longa e aleatória>
SUPER_ADMIN_EMAIL=admin@alfredodutra.edu.br
SUPER_ADMIN_PASSWORD=<senha forte com pelo menos 8 caracteres>
```

O primeiro superadministrador pode ser criado automaticamente na primeira tentativa de login com `SUPER_ADMIN_EMAIL`, desde que `SUPER_ADMIN_PASSWORD` esteja configurada.

## Desenvolvimento local

Pré-requisitos:

- Node.js 22+
- npm
- Docker, somente se quiser executar um PostgreSQL/Supabase local através da CLI

Instale:

```bash
npm install
```

Para usar o banco remoto, copie `backend/.env.example` para `backend/.env` e preencha ao menos:

```text
POSTGRES_URL
JWT_SECRET
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
```

Depois:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000/api`
- Health: `http://localhost:3000/api/health`

## Migrations

Crie uma migration nova:

```bash
npm run db:new -- nome_da_mudanca
```

Ela ficará em:

```text
supabase/migrations/<timestamp>_nome_da_mudanca.sql
```

Não edite migrations que já tenham sido aplicadas em produção.

## Deploy

Depois que Vercel e Supabase estiverem ligados ao mesmo GitHub:

```text
git push
   |
   |-- Vercel   -> build do frontend + servidor/API
   `-- Supabase -> migrations PostgreSQL
```

## CSS e equipe de design

A regra do projeto continua:

- React/TypeScript: estrutura, comportamento, estado, acessibilidade e API.
- `frontend/src/styles/`: toda a aparência visual.

Consulte `frontend/DESIGNERS.md`.
