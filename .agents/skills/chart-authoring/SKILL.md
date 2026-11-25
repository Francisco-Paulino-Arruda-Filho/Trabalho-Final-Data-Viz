---
name: chart-authoring
description: Cria ou altera um gráfico deste dashboard (Vega-Lite via VegaChart ou D3) já integrado aos filtros globais, à comparação de agentes, ao destaque por hover e ao ChartCard, e atualiza specs/charts.md. Use sempre que o pedido envolver adicionar, remover, trocar ou ajustar um gráfico, visualização, spec Vega-Lite, encoding, tooltip, legenda, brush, cores de agente ou textos de cartão (pergunta, codificação, justificativa) em src/components/charts — mesmo que o usuário só diga "muda o gráfico X" ou "coloca uma visualização de Y". Não use para a lógica do FilterContext em si, para gerar os JSONs de public/data (notebooks) nem para escrever testes isolados (use test-and-verify).
---

# Chart authoring

Todo gráfico deste projeto é parte de um sistema coordenado: ele lê os mesmos filtros, responde
à mesma comparação de agentes, participa do mesmo destaque por hover e vive dentro de um
`ChartCard` cujo texto é contrato do trabalho acadêmico. Um gráfico que "funciona sozinho" mas
ignora esse sistema está quebrado. Os contratos estão em `specs/charts.md` (CHRT),
`specs/filters-comparison.md` (FILT) e `specs/cross-chart-highlight.md` (HIGH) — leia o que
for relevante antes de mudar comportamento.

## Antes de codar

1. Leia `specs/charts.md`. Se o pedido muda o inventário (novo gráfico, remoção, outra seção,
   outros filtros que reage/define), isso é mudança de spec: proponha o delta (via
   `spec-workflow`) e obtenha aprovação antes de implementar.
2. Escolha o gráfico existente mais parecido como modelo e leia-o inteiro
   (`src/components/charts/*.tsx`). Ex.: barras por agente → `OutcomesChart`; série temporal
   com brush → `MonthlyChart`; dispersão por repositório → `ScatterChart`.
3. Confirme o formato dos dados em `src/lib/types.ts` e o JSON em `public/data/`. Se faltar um
   campo, o caminho é o notebook (`specs/data-pipeline.md`), não inventar dados no front.

## Anatomia de um gráfico Vega-Lite

Arquivo em `src/components/charts/<Nome>Chart.tsx`, default export, recebendo `data` tipado.

```tsx
const { filters, focusAgents, toggleAgent } = useFilters()

const rows = useMemo(() => /* agrega/filtra com filters e matchRepo */, [data, filters])

const spec = useMemo(() => ({
  width: "container",
  data: { values: rows },
  params: [...AGENT_FOCUS_PARAMS],        // declara focusAgents e hoverAgent
  encoding: {
    color: { field: "agent", type: "nominal", scale: agentColorScale },  // paleta de src/lib/colors.ts
    opacity: agentOpacity(),              // foco/hover sem recriar a view
  },
  // ...
}), [rows])                               // NÃO inclua focusAgents nem hover aqui

<VegaChart
  spec={spec}
  signalValues={{ focusAgents }}          // empurrado via view.signal
  hoverSignal="hoverAgent"
  onClick={(d, i) => { const a = agentFromClick(d, i); if (a) toggleAgent(a) }}
  onHover={(d, i) => setHoveredAgent(agentFromClick(d, i))}   // só se o gráfico emite hover
/>
```

Por que assim: se `focusAgents` ou o hover entrarem nas dependências do `spec`, o Vega recria a
visualização a cada movimento do mouse e perde brushes e tooltips (HIGH-002). Valores
dinâmicos entram por `signalValues`/`hoverSignal`; o spec só muda quando os dados mudam.

Regras que vêm dos specs:

- Filtre com `filters`, como todos os gráficos atuais; a comparação chega como destaque via `focusAgents` (CHRT-003). Não troque um gráfico isolado para `focusFilters`: a migração é de todos de uma vez (FILT-012), senão as visões ficam incoerentes entre si.
- Gráficos por repositório usam `matchRepo(repo, filters, opts)`; não reimplemente o filtro (FILT-005).
- Gráfico que define período/estrelas por brush: registre o sinal em `signals`, chame `setRange`/`setStarsRange` e remonte quando `resetToken` mudar (`key={resetToken}`), como `MonthlyChart` e `ScatterChart` (CHRT-007).
- Cores de agente e de desfecho vêm de `src/lib/colors.ts` (`agentColorScale`, `AGENT_COLORS`, `OUTCOME_COLORS`).
- Formatação de números/datas em pt-BR: `fmtInt`, `fmtDate`, `fmtHours` de `src/lib/vegaHelpers.ts`.
- Textos visíveis ao usuário em português.

## Gráficos em D3

`CalendarChart` e `NetworkChart` usam D3 direto e não passam pelo `VegaChart`, então não ganham
foco nem hover de graça. Hoje eles leem `focusAgents`/filtros do contexto e aplicam opacidade
via atributos do D3 (o `NetworkChart` usa as mesmas 0,12/0,25 de `agentOpacity`); nenhum dos
dois assina o hover global. Se um gráfico D3 precisar reagir ao hover de outros gráficos,
assine `subscribeHoveredAgent` num `useEffect` com cleanup e atualize só os atributos, sem
re-renderizar o React. Acesse refs só dentro de efeitos e handlers — ler `ref.current` durante
o render é o que gera os erros `react(refs)` do oxlint (HIGH-007).

## Encaixe no App

Adicione o gráfico em `src/app/App.tsx`, na seção certa, dentro de um `ChartCard`:

- `title`, `question`: a pergunta que o gráfico responde.
- `encoding`: quais canais visuais codificam o quê.
- `why`: por que esta forma e não outra (expressividade/efetividade).
- `reactsTo`: filtros a que reage; prefixe com `(define)` o que ele define por interação.
- `wide` para gráficos que precisam da largura toda.

Esses textos são contrato (DASH-004): não reescreva os de gráficos existentes sem pedido
explícito. Se o JSON for novo, carregue-o com `useJson` no `App` e inclua-o na lista `all`.

## Fechamento

1. Atualize `specs/charts.md` (linha do inventário + requisitos afetados) se o contrato mudou.
2. Se extraiu lógica pura (agregação, montagem de linhas), teste-a em `tests/` — ver `test-and-verify`.
3. Rode a Definition of Done do `AGENTS.md` (via `test-and-verify`) e verifique no navegador com
   `bun run dev`: o gráfico reage aos filtros listados, à comparação e ao hover de outro gráfico,
   e um brush existente sobrevive a um hover.
4. Para conferir layout em celular, tablet e desktop sem abrir o navegador, use as capturas do
   Playwright descritas em `specs/visual-inspection.md` (`bun run visual -- --help`) e leia as
   imagens geradas.
