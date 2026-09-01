# Arquitetura GitHub + Vercel + Supabase

## Responsabilidades

```text
GitHub repository
├── frontend/ ───────────────┐
├── backend/                 ├──> Vercel
├── api/ ────────────────────┘
└── supabase/ ──────────────────> Supabase PostgreSQL
```

### Vercel

A Vercel executa **todo o servidor da aplicação**:

- frontend React/Vite;
- backend Node/Express;
- autenticação JWT;
- upload de capas;
- endpoints REST;
- acesso ao PostgreSQL.

### Supabase

O projeto usa Supabase **somente como banco PostgreSQL**.

Não são usados pela aplicação:

- Supabase Auth;
- Supabase Storage;
- Supabase Edge Functions;
- acesso direto do frontend à Data API.

A pasta `supabase/` existe para versionar o schema e as migrations do PostgreSQL.

## GitHub Integration do Supabase

A pasta está em:

```text
./supabase/
```

Portanto:

```text
Working directory: .
Production branch: main
```

Com Deploy to production habilitado, migrations novas em `supabase/migrations/` são aplicadas automaticamente.

## Comunicação em produção

```text
Browser
   |
   v
Vercel frontend
   |
   | /api/*
   v
Vercel backend (Express)
   |
   | POSTGRES_URL
   v
Supabase PostgreSQL
```

Não existe comunicação Browser -> Supabase.

## Variáveis sincronizadas pela integração

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

O código atual usa `POSTGRES_URL` para a conexão em runtime. As demais variáveis podem continuar sendo sincronizadas pela integração, mas nenhuma chave Supabase é enviada ao bundle do frontend.

Além delas, configure na Vercel:

```text
JWT_SECRET
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
```

## Capas

Como Supabase Storage não faz parte da arquitetura, as capas são armazenadas diretamente na tabela `livros`:

```text
foto_capa       BYTEA
foto_capa_mime  TEXT
```

A API não inclui os bytes nas listagens. Ela retorna uma URL própria da Vercel:

```text
/api/livros/:id/capa?v=<versao>
```

A rota consulta os bytes no PostgreSQL e responde com o MIME correto.

## Segurança do Data API

As tabelas permanecem com RLS habilitado e sem policies públicas. Assim, chaves anon/authenticated do Supabase não têm um caminho autorizado pela aplicação para ler essas tabelas. O backend conecta diretamente ao PostgreSQL usando a credencial de servidor.
