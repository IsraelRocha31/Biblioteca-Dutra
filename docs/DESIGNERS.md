# Guia da equipe de Design

Este documento foi movido de `frontend/DESIGNERS.md` para `docs/DESIGNERS.md` para centralizar toda a documentação.

## Objetivo

A equipe de design deve conseguir alterar **a aparência da interface sem editar o código React/TypeScript**.

A fonte de verdade visual é:

```text
frontend/src/styles/
├── tokens.css
├── reset.css
├── base.css
├── layout.css
├── components.css
├── utilities.css
└── responsive.css
```

`frontend/src/main.tsx` importa apenas `styles/index.css`, que agrega os demais arquivos.

## Separação de responsabilidades

- `*.tsx` = estrutura semântica, conteúdo, estados e comportamento.
- `api.ts` = comunicação com o backend.
- `config/env.ts` = configuração pública já validada pelo Vite.
- `src/styles/*.css` = apresentação visual.

A arquitetura atual não usa estilos inline nos componentes React e não escreve propriedades visuais diretamente por JavaScript. Para impedir a rolagem da página quando um modal está aberto, o React apenas alterna a classe `modal-open` no `<body>`; a regra `overflow: hidden` permanece em `base.css`.

## O que o CSS controla

Os designers podem alterar via CSS:

- cores;
- tipografia;
- tamanhos;
- espaçamentos;
- margens e paddings;
- bordas e raios;
- sombras;
- grid e flexbox;
- posicionamento;
- largura/altura;
- responsividade;
- estados de hover/focus/active;
- transições e animações;
- aparência de botões, cards, busca, formulários e modais;
- símbolos decorativos;
- aparência do estado de erro do aplicativo.

## O que continua no React/TSX

CSS não cria a estrutura funcional da aplicação. O React continua definindo:

- quais elementos existem;
- textos funcionais;
- ordem semântica;
- formulários e campos;
- eventos e ações;
- abertura/fechamento de modais;
- autenticação;
- estados de loading/erro;
- atributos de acessibilidade;
- classes que conectam componentes ao CSS.

## Onde alterar cada coisa

### `tokens.css`

Fonte principal de identidade visual:

- paleta;
- fontes;
- escala de espaçamento;
- raios;
- sombras;
- container;
- altura do cabeçalho;
- velocidades de transição;
- símbolos decorativos.

Para trocar a identidade visual rapidamente, comece aqui.

### `reset.css`

Normalização do navegador. Deve mudar pouco.

### `base.css`

Regras globais de página, tipografia e controles básicos.

### `layout.css`

Estrutura espacial:

- cabeçalho;
- container;
- grid de livros;
- alinhamentos;
- regiões da página.

### `components.css`

Visual dos componentes:

- logo;
- botões;
- cards;
- modais;
- busca;
- formulários;
- detalhes;
- mensagens de erro.

### `utilities.css`

Classes técnicas reutilizáveis, incluindo conteúdo apenas para leitor de tela.

### `responsive.css`

Breakpoints, ajustes mobile/tablet e preferências de movimento.

## Contrato entre designers e desenvolvedores

1. Designers podem mudar qualquer regra CSS.
2. Desenvolvedores não devem colocar cor, fonte, sombra, spacing, animação ou layout direto em TSX.
3. Nomes de classes usados pelos componentes são contrato de integração. Não renomeie uma classe sem atualizar o TSX correspondente.
4. Estados funcionais podem vir do React (`disabled`, `is-empty`, `modal-open`, etc.); a aparência desses estados pertence ao CSS.
5. Foco visível, contraste, conteúdo `sr-only` e `prefers-reduced-motion` são requisitos de acessibilidade e não devem ser removidos.
6. Se uma mudança exigir criar/remover/reordenar elementos, ela deixa de ser apenas visual e precisa de alteração no React.

## Histórico dessa separação

A separação visual foi introduzida no commit `15fc1ab`, que criou os sete arquivos CSS acima, adicionou `frontend/DESIGNERS.md` e removeu estilos/decisões visuais dos componentes em favor de classes CSS.

No commit `bc9cf68`, o CSS ganhou também o estado `.app-error` usado pelo `AppErrorBoundary`, mantendo até o fallback visual fora do TSX.


## Acessibilidade dos modais

O componente `frontend/src/components/AccessibleModal.tsx` centraliza o comportamento acessível de todos os diálogos. Ele controla foco, `Tab`/`Shift+Tab`, `Escape`, `aria-modal`, `inert` e devolução do foco. O componente **não define aparência**; `modal-overlay`, `modal-box` e o bloqueio de rolagem são estilizados exclusivamente em CSS.
