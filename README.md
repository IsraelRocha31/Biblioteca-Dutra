# Biblioteca Dutra

Sistema de biblioteca escolar em um único repositório GitHub conectado à **Vercel** e ao **Supabase**.

- **Vercel:** frontend React/Vite + todo o backend Node/Express.
- **Supabase:** somente PostgreSQL e migrations.
- **GitHub:** fonte de verdade do código, do contrato `.env` e do schema do banco.

## `.env` como fonte única de configuração

O arquivo `/.env` da raiz é o **único arquivo de ambiente do repositório** e o contrato central de runtime. `frontend/`, `backend/`, `api/` e os comandos do projeto não possuem `.env` próprio.

- `backend/src/config/env.js` é o único loader de ambiente do backend.
- `frontend/src/config/env.ts` é o único loader usado pelos componentes React.
- `frontend/vite.config.ts` carrega o `.env` da raiz com `envDir`, inclusive no workspace `frontend/`.
- Variáveis secretas do servidor não são expostas ao bundle. O frontend recebe somente os prefixos seguros configurados no Vite.
- `supabase/migrations/` é a exceção: o schema é aplicado pela integração GitHub do Supabase e não depende do `.env` para saber qual projeto receberá a migration.
- CSS continua sendo a fonte de verdade visual e não é transformado em configuração de ambiente.

A checagem `npm run env:check` valida o contrato e acusa acessos a `process.env`/`import.meta.env` fora dos módulos centrais.

As principais categorias no `.env` são: integração Vercel/Supabase, identidade da aplicação, autenticação, desenvolvimento local, HTTP, pool PostgreSQL, paginação e upload de capas.


## Estrutura

```text
Biblioteca-Dutra/
├── frontend/                 # React + TypeScript + Vite -> Vercel
├── backend/                  # Node + Express -> Vercel
├── api/                      # entrada da Vercel para o backend
├── supabase/                 # somente PostgreSQL/migrations -> Supabase
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   └── README.md
├── .env                      # ÚNICO arquivo de configuração do projeto
├── package.json
├── vercel.json
└── .gitignore
```

`frontend/`, `backend/` e `supabase/` são pastas irmãs na raiz.

## Fluxo

```text
                         GitHub
                        /      \
                       v        v
                  Vercel       Supabase
                 /      \          |
          frontend     backend   PostgreSQL
                         |
                         +----------+
                           POSTGRES_URL
```

O navegador nunca acessa o Supabase diretamente.

## `.env` versionado

O arquivo `.env` da raiz **faz parte do Git** e é o contrato central de configuração.

Ele contém as 12 chaves da integração Vercel/Supabase:

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

No Git essas 12 chaves ficam sem valores. Os valores reais são injetados pela integração da Vercel e têm prioridade sobre o arquivo carregado pelo `dotenv`.

Isso é importante porque `POSTGRES_URL`, `POSTGRES_PASSWORD` e `SUPABASE_SECRET_KEY`, quando preenchidos, são credenciais reais e não devem ser commitados.

Não existe `.env.local`, `.env.example` nem `.env` dentro de subpastas: **somente `/.env` é aceito**.

## Administrador controlado pelo Git

O `.env` também define a conta administrativa gerenciada pelo projeto:

```text
SUPER_ADMIN_NAME=Super Administrador
SUPER_ADMIN_EMAIL=admin@alfredodutra.edu.br
SUPER_ADMIN_PASSWORD=admin123
```

Nesta versão de testes, a senha fica explícita no `.env` como `admin123`. O backend nunca grava esse texto puro no PostgreSQL: antes de persistir, gera um hash bcrypt.

Para trocar a credencial de teste, edite `SUPER_ADMIN_PASSWORD` no `.env` e depois:

```bash
git add .env
git commit -m "chore: atualizar administrador"
git push
```

No deploy, o backend sincroniza essa configuração com a tabela `admins`. Se o administrador gerenciado pelo `.env` não existir, ele é criado. Se nome, e-mail ou senha forem alterados, o registro é atualizado.

A sincronização também roda antes do login, então um primeiro deploy em que a migration ainda esteja terminando se recupera automaticamente no primeiro acesso.

## JWT

Nesta versão de testes, `JWT_SECRET` também possui um valor de teste versionado para o projeto funcionar imediatamente. Em produção, sobrescreva-o por uma Environment Variable segura da Vercel.

## Supabase conectado ao GitHub

Como `supabase/` está na raiz:

```text
Working directory: .
```

Com **Deploy to production** habilitado, novas migrations em `supabase/migrations/` são aplicadas à branch de produção.

O projeto não usa Supabase Auth, Storage ou Edge Functions.

## Banco e capas

As capas são persistidas no próprio PostgreSQL:

- `foto_capa BYTEA`;
- `foto_capa_mime TEXT`;
- limite de 4 MiB;
- leitura em `GET /api/livros/:id/capa`.

## Desenvolvimento local

```bash
npm install
```

Para desenvolvimento local, edite o mesmo `/.env` central. Não existe segundo arquivo de ambiente.

Defina o administrador versionado com:

```bash
edite `SUPER_ADMIN_PASSWORD` no `.env` e faça commit/push
```

Depois:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3000/api`

Health: `http://localhost:3000/api/health`

## Migrations

```bash
npm run db:new -- nome_da_mudanca
```

Os arquivos ficam em `supabase/migrations/`. Não altere migrations já aplicadas em produção; crie uma nova.

## Deploy

```text
git push
   |
   |-- Vercel   -> backend + frontend
   `-- Supabase -> migrations PostgreSQL
```

## CSS e equipe de design

React/TypeScript cuida de estrutura e comportamento. Toda aparência visual fica em `frontend/src/styles/`. Consulte `frontend/DESIGNERS.md`.
