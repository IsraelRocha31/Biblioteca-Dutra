# Guia da equipe de Design

A equipe de design pode alterar a aparência do sistema trabalhando **somente em `src/styles/`**.

## Regra de separação

- `*.tsx` = estrutura semântica, conteúdo e comportamento.
- `api.ts` = comunicação com o backend.
- `src/styles/*.css` = toda a apresentação visual.

Não coloque estilos inline (`style={{ ... }}`) nem valores visuais em componentes React.

## Onde alterar cada coisa

- `tokens.css`: identidade visual global (cores, fontes, espaçamentos, bordas, sombras, símbolos decorativos).
- `reset.css`: normalização do navegador. Alterar raramente.
- `base.css`: aparência global de página e controles.
- `layout.css`: posicionamento, grid, largura e espaçamento estrutural.
- `components.css`: botões, cards, cabeçalho, busca, formulários e modais.
- `utilities.css`: classes utilitárias técnicas, como conteúdo apenas para leitores de tela.
- `responsive.css`: versões para celular/tablet e preferências de movimento.

## Contrato com os desenvolvedores

1. Designers podem mudar qualquer regra CSS sem alterar TypeScript.
2. Desenvolvedores não devem colocar cor, tamanho, margem, padding, sombra, fonte, animação ou layout em TSX.
3. Classes usadas pelo React são um contrato de integração: antes de renomeá-las, alinhar com os devs.
4. Estados funcionais (`disabled`, `is-empty`, etc.) podem vir do React; a aparência desses estados pertence ao CSS.
5. Acessibilidade não deve ser removida: foco visível, contraste, `sr-only` e `prefers-reduced-motion` fazem parte do produto.

## Trocar completamente o tema

Para uma mudança rápida de identidade, comece apenas por `tokens.css`. A maior parte da interface foi construída para consumir essas variáveis.
