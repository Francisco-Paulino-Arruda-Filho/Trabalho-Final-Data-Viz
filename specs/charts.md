# charts spec

## Purpose

Os 12 gráficos do dashboard, agrupados em três seções narrativas. Cada gráfico responde a
uma pergunta explícita, declara sua codificação e justificativa e lista os filtros a que
reage. Os textos de cada `ChartCard` em `src/app/App.tsx` são a fonte da verdade e são
contrato do trabalho (ver `dashboard.md`, DASH-004); este spec não os duplica.

## Inventory

| Seção                             | Gráfico               | Dados                                                 | Reage a                                              | Define              |
| --------------------------------- | --------------------- | ----------------------------------------------------- | ---------------------------------------------------- | ------------------- |
| Quando cada agente entrou em cena | `CalendarChart`       | `calendar.json`                                       | agente                                               | período             |
|                                   | `MonthlyChart`        | `monthly_agents.json`                                 | agente, período                                      | —                   |
|                                   | `HourlyActivityChart` | `hourly_activity.json`                                | agente, período                                      | —                   |
| O que acontece com os PRs         | `OutcomesChart`       | `outcomes.json`                                       | agente                                               | —                   |
|                                   | `MergeTimesChart`     | `merge_times.json`                                    | agente                                               | —                   |
|                                   | `ReviewTypesChart`    | `review_types.json`                                   | agente                                               | —                   |
|                                   | `MergeBoxplotChart`   | `merge_times.json`                                    | agente                                               | —                   |
|                                   | `LanguagesChart`      | `languages.json`                                      | agente                                               | linguagem           |
| Onde a atividade se concentra     | `RepositoriesChart`   | `repositories.json`                                   | agente, linguagem, estrelas, dominantes              | repositório         |
|                                   | `ScatterChart`        | `repositories.json`                                   | agente, linguagem, dominantes, repositório           | estrelas            |
|                                   | `ParetoChart`         | `repositories.json`                                   | agente, linguagem, estrelas, dominantes, repositório | —                   |
|                                   | `NetworkChart`        | `agent_repository_network.json` + `repositories.json` | agente, linguagem, estrelas, dominantes              | agente, repositório |

## Requirements

- CHRT-001 (must): O dashboard exibe exatamente os 12 gráficos do inventário, nas três seções e na ordem acima. Verification: manual read-through de `src/app/App.tsx`.
- CHRT-002 (must): Cada gráfico reage exatamente aos filtros listados na coluna "Reage a" e, quando aplicável, define o filtro da coluna "Define" por interação (clique ou brush). A lista `reactsTo` do `ChartCard` reflete esse contrato. Verification: manual (`bun run dev`) + read-through.
- CHRT-003 (must): Os gráficos filtram com `filters` e recebem a comparação entre agentes como destaque, via `focusAgents` (ver `filters-comparison.md`, FILT-007). A migração para `focusFilters` está em FILT-012. Verification: manual read-through.
- CHRT-004 (must): Os gráficos por repositório filtram com `matchRepo`; os agregados por repositório cobrem todo o intervalo dos dados e não são recalculados por período, como diz o rodapé. Verification: manual read-through.
- CHRT-005 (must): Todo gráfico Vega-Lite é renderizado via `VegaChart`, usa a paleta de `src/lib/colors.ts` para agentes e participa do destaque entre gráficos (ver `cross-chart-highlight.md`). Os gráficos em D3 (`CalendarChart` e `NetworkChart`) usam a mesma paleta e respeitam o mesmo foco de agentes. Verification: manual read-through.
- CHRT-006 (must): O rodapé cita a fonte (AIDev, Li, Zhang e Hassan, 2026, subconjunto AIDev-pop), o intervalo de 24/12/2024 a 24/10/2025 e avisa que os meses de borda estão incompletos. Verification: manual.
- CHRT-007 (should): Os gráficos com brush interno (hoje `MonthlyChart` e `ScatterChart`) remontam quando `resetToken` muda (ver FILT-009). Verification: manual (`bun run dev`, brush + "limpar").
- CHRT-008 (could): A montagem de specs e agregações de cada gráfico deve ser extraída para funções puras exportadas e testadas em node. Verification: `bun run test`.

## Contract

- Adicionar, remover ou reordenar um gráfico, ou mudar o que ele filtra ou define, exige atualizar este spec.
- Fora do escopo: o estado de filtros (ver `filters-comparison.md`), o mecanismo de destaque (ver `cross-chart-highlight.md`) e a geração dos JSONs (ver `data-pipeline.md`).

## Verification

- `bun run build`, `bun run lint` e verificação manual no `bun run dev`, conforme a Definition of Done em `AGENTS.md`.
