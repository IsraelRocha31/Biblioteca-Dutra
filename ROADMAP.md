# Infraestrutura definida

- GitHub é a fonte de verdade do projeto.
- `frontend/`, `backend/` e `supabase/` ficam na raiz do mesmo repositório.
- Vercel executa frontend + todo o backend Node/Express.
- Supabase é usado somente como PostgreSQL e para aplicar migrations versionadas.
- O frontend conversa apenas com `/api` na Vercel.
- O backend acessa o banco usando `POSTGRES_URL`.
- Supabase Auth, Storage e Edge Functions não fazem parte da arquitetura atual.
- Capas são persistidas no PostgreSQL e servidas pelo backend.

---

# Roadmap — Biblioteca Dutra

## Visão

Transformar o protótipo de catálogo em um sistema de biblioteca escolar completo, com uma divisão clara entre desenvolvimento, design e dados.

## Prioridade 1 — Modelo real de biblioteca

### 1. Exemplares físicos
Hoje `livros` representa o título. Uma biblioteca precisa distinguir o **livro** de cada **exemplar físico**.

Sugestão de tabela `exemplares`:
- id
- livro_id
- tombo/patrimonio
- localizacao (estante/prateleira)
- status (`disponivel`, `emprestado`, `reservado`, `manutencao`, `perdido`)
- data_aquisicao

Isso permite ter, por exemplo, 8 exemplares de Dom Casmurro e saber exatamente quais estão disponíveis.

### 2. Alunos e equipe escolar
Criar cadastro de usuários da biblioteca:
- aluno
- professor
- funcionário
- bibliotecário
- administrador

Campos úteis: nome, matrícula, turma, contato, situação e data de cadastro.

### 3. Empréstimos e devoluções
Criar fluxo completo:
- retirar exemplar
- definir data prevista de devolução
- devolver
- renovar
- registrar atraso
- histórico por aluno e exemplar

### 4. Reservas
Quando todos os exemplares estiverem emprestados, permitir entrar numa fila de reserva.

## Prioridade 2 — Experiência que diferencia o projeto

### 5. QR Code / código de barras
Cada exemplar pode ter um QR Code ou código de barras. O bibliotecário escaneia para abrir o registro e realizar empréstimo/devolução rapidamente.

### 6. Busca avançada
Além de nome, autor e ISBN:
- gênero
- editora
- ano
- disponibilidade
- localização na biblioteca
- ordenação por título, autor, novos e mais emprestados

### 7. Página pública do livro
URL própria para cada título, com:
- capa
- sinopse
- autor
- disponibilidade em tempo real
- localização
- quantidade de exemplares
- livros relacionados

### 8. Painel administrativo
Indicadores realmente úteis:
- livros emprestados agora
- devoluções previstas hoje
- atrasos
- títulos mais lidos
- leitores mais ativos
- crescimento do acervo
- exemplares indisponíveis

### 9. Histórico e auditoria
Registrar ações administrativas importantes:
- quem cadastrou/alterou/excluiu livro
- quem realizou empréstimo/devolução
- data/hora
- valores anteriores quando necessário

## Prioridade 3 — Automação

### 10. Cadastro por ISBN
Ao digitar ou escanear o ISBN, consultar uma API bibliográfica e preencher automaticamente título, autor, editora, ano e capa; o usuário apenas revisa e salva.

### 11. Avisos de devolução
Notificar empréstimos próximos do vencimento e atrasados. Para o protótipo, pode começar com alertas internos; depois e-mail ou outro canal institucional.

### 12. Relatórios
Exportar relatórios de:
- acervo
- empréstimos
- atrasos
- uso por turma
- títulos mais procurados
- inventário

## Prioridade 4 — Produto e acessibilidade

### 13. PWA
Transformar o frontend em Progressive Web App para poder instalar no computador/tablet da biblioteca e ter cache de partes públicas.

### 14. Acessibilidade como requisito
- navegação completa por teclado
- foco visível
- contraste adequado
- labels associados aos campos
- diálogos acessíveis
- mensagens anunciadas por leitores de tela
- suporte a `prefers-reduced-motion`

### 15. Temas controlados exclusivamente por CSS
Manter o contrato atual: React entrega estrutura/estado e `frontend/src/styles/` controla a apresentação. Isso permite que a equipe de design evolua a identidade visual independentemente dos desenvolvedores.

## Arquitetura técnica recomendada para a próxima fase

O backend ainda é pequeno e pode continuar simples por enquanto. Quando empréstimos, usuários e reservas entrarem, separar cada domínio em:

`route -> controller -> service -> repository -> database`

Exemplo:

```text
backend/src/
├── modules/
│   ├── books/
│   ├── copies/
│   ├── users/
│   ├── loans/
│   └── reservations/
├── middleware/
├── config/
└── server.js
```

No frontend, crescer por funcionalidade em vez de jogar tudo em `components/`:

```text
frontend/src/
├── features/
│   ├── catalog/
│   ├── auth/
│   ├── loans/
│   └── admin/
├── components/
├── services/
├── styles/
└── App.tsx
```

## Diferencial para apresentação de fim de ano

Se houver tempo limitado, o conjunto com maior impacto demonstrável é:

1. catálogo bonito e responsivo;
2. exemplares físicos com status;
3. cadastro de alunos;
4. empréstimo/devolução por QR Code;
5. painel com estatísticas;
6. cadastro automático por ISBN;
7. acessibilidade bem demonstrada.

Isso transforma a demonstração de “um CRUD de livros” em um **sistema de biblioteca utilizável de verdade**.
