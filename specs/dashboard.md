# dashboard spec

## Purpose

Dashboard web estático, trabalho final da disciplina de visualização de dados do mestrado.
Permite explorar como seis agentes de código de IA abrem pull requests em repositórios
open source do GitHub com mais de 100 estrelas. Público: avaliadores e leitores do trabalho.
Sucesso: comunicar os achados com clareza e justificar cada escolha de codificação visual.

## Requirements

- DASH-001 (must): A página exibe um cabeçalho com o total de PRs e de repositórios lidos de `meta.json`. Verification: manual (`bun run dev`).
- DASH-002 (must): Todos os dados são carregados por fetch de JSONs estáticos em `public/data/`, relativos a `import.meta.env.BASE_URL`; não há backend. Verification: manual read-through de `src/app/App.tsx`.
- DASH-003 (must): Se qualquer JSON falhar, a página mostra uma mensagem de erro em vez dos gráficos; enquanto houver arquivo pendente, mostra "Carregando dados...". Verification: manual (renomear um JSON e abrir a página).
- DASH-004 (must): Os gráficos ficam agrupados em seções temáticas, cada um dentro de um `ChartCard` com título, pergunta, codificação, justificativa e a lista de filtros a que reage. Os textos desses cartões são contrato do trabalho e só mudam com atualização de spec. Verification: manual read-through.
- DASH-005 (must): Uma barra de filtros global (`FilterBar`) e uma barra de comparação (`ComparisonBar`) ficam acima dos gráficos e afetam todas as visões (ver `filters-comparison.md`). Verification: manual.
- DASH-006 (must): O build é publicado no GitHub Pages pelo workflow `.github/workflows/deploy.yml`, com `base` `/Trabalho-Final-Data-Viz/`. Verification: `bun run build` sai com 0; workflow verde no GitHub.
- DASH-007 (should, inferido): Os agentes são exatamente Claude Code, Codex, Copilot, Cursor, Devin e Jules, cada um com uma cor fixa definida em `src/lib/colors.ts`. Verification: `bun run test` (`tests/lib/colors.test.ts`).
- DASH-008 (should): O código legado `src/hooks/useDashboardData.ts`, `src/context/vegaHelpers.ts` e `src/components/charts/MonthlyAgentsChart.tsx`, que não é importado, deve ser removido. Verification: `grep` sem referências e `bun run build` sai com 0.

## Contract

- Entrada: `index.html` → `src/main.tsx` → `src/app/App.tsx`.
- Fora do escopo: autenticação, backend, atualização de dados em tempo real, edição de dados.
- Specs relacionados: `filters-comparison.md`, `cross-chart-highlight.md`, `charts.md`, `data-pipeline.md`, `tooling-quality.md`.

## Verification

- `bun run build`, `bun run test` e `bun run lint`, conforme a Definition of Done em `AGENTS.md`.
