# Supabase — somente banco de dados

Esta pasta fica na raiz do repositório e contém somente os arquivos necessários para versionar o PostgreSQL do projeto Supabase.

## Estrutura

```text
supabase/
├── config.toml
├── migrations/
└── seed.sql
```

Não existem neste projeto:

- `supabase/functions/`;
- buckets de Storage declarados;
- código de Auth do Supabase;
- backend executado no Supabase.

Todo o servidor roda na Vercel.

## GitHub Integration

Como esta pasta é `./supabase/`, use:

```text
Working directory: .
```

Quando uma migration nova chega à branch de produção, a integração do Supabase pode aplicá-la automaticamente.

## Criando alterações

```bash
npm run db:new -- nome_da_mudanca
```

Depois edite o SQL criado em `supabase/migrations/`, valide e faça commit/push.

Nunca modifique uma migration já executada em produção; crie outra.
