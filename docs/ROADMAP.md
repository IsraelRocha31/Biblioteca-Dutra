# Roadmap — Biblioteca Dutra

O estado atual é um catálogo público com administração de livros. O próximo passo é evoluir para um sistema operacional de biblioteca escolar sem perder a arquitetura já construída: frontend React, backend Express na Vercel, PostgreSQL no Supabase e apresentação isolada em CSS.


## Próximos incrementos de baixo risco

Antes das grandes entidades de empréstimos e leitores, o código atual já oferece pontos de expansão que podem ser entregues sem uma mudança estrutural grande:

### A. Paginação real no frontend

O backend já devolve `paginacao`, mas `Dashboard.tsx` utiliza apenas a primeira página. Adicionar **Anterior/Próxima**, número da página e total de resultados aproveita uma capacidade que já existe na API.

### B. Filtros avançados usando a API atual

`GET /api/livros` já aceita `autor`, mas o frontend usa somente `busca`. A interface pode ganhar filtros por autor e, depois, novos campos como gênero, editora e ano.

### C. Uso do endpoint de ISBN

Já existe `GET /api/livros/isbn/:isbn`. O formulário pode consultar o ISBN antes de salvar para avisar imediatamente que o título já existe e, futuramente, integrar uma API bibliográfica para preencher dados automaticamente.

### D. Remover ou trocar a capa

Hoje a edição preserva a capa antiga quando nenhuma nova imagem é enviada. Falta uma ação explícita para **remover a capa existente** sem excluir o livro.

### E. Gestão de administradores

O backend já possui `POST /api/auth/criar-admin`, mas não existe tela para essa função. Criar uma área de administração permite gerenciar contas sem chamadas manuais à API.

### F. Testes automatizados e CI

Adicionar Vitest/Testing Library para componentes e testes de API, além de uma ação do GitHub que execute `env:check`, backend check, TypeScript/build e testes em cada pull request. O fluxo de acessibilidade dos modais deve entrar como teste crítico.

### G. Segurança de login

Adicionar rate limiting no endpoint de login, registro de tentativas suspeitas e política de sessão. Em uma evolução maior, avaliar autenticação com cookie `HttpOnly` em vez de token no `localStorage`.

### H. Estado de erro e retry no catálogo

Hoje uma falha em `getLivros()` termina visualmente como lista vazia. Diferenciar **“nenhum livro encontrado”** de **“falha ao carregar”**, com botão **Tentar novamente**, evita esconder problemas de rede/API.

### I. URL compartilhável para busca e livro

Persistir busca/página na query string e criar rota pública por livro permite copiar links e voltar à mesma posição do catálogo.

### J. Auditoria de acessibilidade contínua

Além do modal já corrigido, incluir axe/Playwright no CI, testar zoom de 200%, contraste, navegação somente por teclado e `prefers-reduced-motion`.

## Prioridade 1 — transformar catálogo em biblioteca

### 1. Exemplares físicos

Separar **título bibliográfico** de **exemplar físico**.

Sugestão de entidade `exemplares`:

- id;
- livro_id;
- tombo/patrimônio;
- código de barras/QR Code;
- localização (estante/prateleira);
- status (`disponivel`, `emprestado`, `reservado`, `manutencao`, `perdido`);
- estado de conservação;
- data de aquisição.

Isso permite ter várias cópias do mesmo ISBN e controlar cada uma separadamente.

### 2. Leitores da biblioteca

Cadastrar:

- alunos;
- professores;
- funcionários;
- bibliotecários.

Campos úteis:

- nome;
- matrícula;
- turma;
- contato;
- situação;
- data de cadastro.

### 3. Empréstimos e devoluções

Fluxo completo:

- retirar exemplar;
- definir vencimento;
- devolver;
- renovar;
- marcar atraso;
- registrar perda/dano;
- histórico por leitor e exemplar.

### 4. Reservas

Quando todos os exemplares de um título estiverem indisponíveis, permitir fila de reserva.

## Prioridade 2 — operação diária

### 5. QR Code / código de barras

Escanear exemplar para abrir seu registro e realizar empréstimo/devolução rapidamente.

### 6. Inventário

Modo de conferência física do acervo:

- escanear os livros presentes;
- detectar exemplares não conferidos;
- listar perdidos/deslocados;
- exportar resultado da conferência.

### 7. Localização física

Registrar estante, seção e prateleira e exibir isso na consulta pública.

### 8. Condição do exemplar

Estados sugeridos:

- novo;
- bom;
- desgastado;
- danificado;
- em manutenção;
- perdido.

## Prioridade 3 — automação e catálogo

### 9. Cadastro por ISBN

Consultar uma API bibliográfica e preencher automaticamente:

- título;
- autor;
- editora;
- ano;
- descrição;
- capa.

Quando o ISBN já existir, oferecer **criar novo exemplar** em vez de bloquear o fluxo.

### 10. Busca avançada

Filtros por:

- nome;
- autor;
- ISBN;
- gênero;
- editora;
- ano;
- disponibilidade;
- localização.

### 11. Importação em massa

Importar CSV/XLSX para cadastrar títulos/exemplares em lote, com pré-validação e relatório de erros.

### 12. Sugestão de aquisição

Permitir que alunos/professores indiquem livros que ainda não existem no acervo; o administrador aprova, rejeita ou marca como adquirido.

## Prioridade 4 — experiência do leitor

### 13. Página pública do livro

URL própria com:

- capa;
- sinopse;
- autor;
- disponibilidade;
- número de exemplares;
- localização;
- relacionados.

### 14. Lista “quero ler”

Leitores podem salvar títulos para consultar depois.

### 15. Novidades e coleções

Áreas como:

- recém-chegados;
- vestibular;
- literatura brasileira;
- temas pedagógicos;
- seleções temporárias da escola.

### 16. Histórico de leitura

Ficha do leitor com empréstimos anteriores, quantidade de livros e gêneros mais lidos, respeitando as regras de privacidade da instituição.

## Prioridade 5 — gestão

### 17. Dashboard administrativo

Indicadores:

- títulos cadastrados;
- total de exemplares;
- disponíveis;
- emprestados;
- atrasados;
- perdidos;
- manutenção;
- devoluções do dia;
- títulos mais emprestados;
- uso por turma.

### 18. Auditoria

Registrar:

- quem cadastrou/alterou/excluiu;
- quem realizou empréstimo/devolução;
- data/hora;
- valores anteriores quando necessário.

### 19. Relatórios

Exportar:

- acervo;
- empréstimos;
- atrasos;
- inventário;
- utilização por turma;
- títulos mais procurados.

### 20. Termos/comprovantes

Gerar comprovante ou termo de responsabilidade para operações que exijam registro formal.

## Prioridade 6 — produto e acessibilidade

### 21. Temas apenas por CSS

Manter o contrato atual em `frontend/src/styles/`, podendo criar temas como:

```text
frontend/src/styles/themes/
├── dutra.css
├── dark.css
└── high-contrast.css
```

### 22. Acessibilidade

Garantir:

- navegação por teclado;
- foco visível;
- contraste;
- labels e nomes acessíveis;
- modais acessíveis;
- mensagens anunciáveis;
- suporte a `prefers-reduced-motion`;
- tema de alto contraste;
- opção de fonte ampliada.

### 23. PWA

Permitir instalação em computadores/tablets da biblioteca e cache de partes públicas.

## Arquitetura recomendada quando o sistema crescer

### Backend

```text
backend/src/
├── modules/
│   ├── books/
│   ├── copies/
│   ├── readers/
│   ├── loans/
│   └── reservations/
├── config/
├── middleware/
└── server.js
```

Fluxo sugerido por domínio:

```text
route -> controller -> service -> repository -> database
```

### Frontend

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

## Conjunto de maior impacto para uma demonstração

1. catálogo responsivo;
2. exemplares físicos;
3. leitores/alunos;
4. empréstimo e devolução por QR Code;
5. dashboard;
6. cadastro por ISBN;
7. acessibilidade e tema de alto contraste.
