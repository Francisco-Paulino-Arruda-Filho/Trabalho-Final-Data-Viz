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
- CHRT-005 (must): Todo gráfico Vega-Lite é renderizado via `VegaChart`, usa a paleta de `src/lib/colors.ts` para agentes e participa do destaque entre gráficos (ver `cross-chart-highlight.md`). `CalendarChart` e a matriz SVG `NetworkChart` usam a paleta de agentes e respeitam o mesmo foco de agentes. Verification: manual read-through.
- CHRT-006 (must): O rodapé cita a fonte (AIDev, Li, Zhang e Hassan, 2026, subconjunto AIDev-pop), o intervalo de 24/12/2024 a 24/10/2025 e avisa que os meses de borda estão incompletos. Verification: manual.
- CHRT-007 (should): Os gráficos com brush interno (hoje `MonthlyChart` e `ScatterChart`) remontam quando `resetToken` muda (ver FILT-009). Verification: manual (`bun run dev`, brush + "limpar").
- CHRT-008 (could): A montagem de specs e agregações de cada gráfico deve ser extraída para funções puras exportadas e testadas em node. Verification: `bun run test`.
- CHRT-009 (must): `MonthlyChart` identifica visualmente o primeiro e o último mês como parciais, sem extrapolar contagens para os dias fora da cobertura observada; uma nota ou legenda explica esse marcador. `HourlyActivityChart` informa que dia e hora são apresentados conforme os campos recebidos no pipeline. O fuso desses campos é desconhecido com a evidência disponível e não deve ser rotulado como UTC, horário local ou outro fuso até que a proveniência seja confirmada. Verification: read-through do gráfico e do pipeline; manual (`bun run dev`).

- CHRT-010 (must; ALTA-03): `OutcomesChart` explicita que cada percentual de desfecho usa todos os PRs do agente (`total_agent`) como denominador, incluindo abertos. A taxa de merge no tooltip usa separadamente `merged / (merged + closed)` e informa a quantidade de PRs resolvidos como base; abertos não entram nessa taxa. O modo Quantidade mostra contagens absolutas dos mesmos segmentos. Verification: manual em `bun run dev`, conferindo um agente com PRs abertos e comparando os totais com `outcomes.json`.
- CHRT-011 (must; ALTA-04): `NetworkChart` é uma matriz de agentes × repositórios, baseada nas arestas de `agent_repository_network.json` (`source` agente, `target` repositório, `prs` valor da célula). Célula ausente representa ausência de relação. Cor sequencial usa escala raiz quadrada comum de PRs, com legenda e tooltip de agente, repositório e contagem. Mantém o recorte de até 100 repositórios de PIPE-005 e os filtros: seleção de agente destaca linhas e relações ativas; linguagem, estrelas e ocultar dominantes ocultam repositórios incompatíveis; clique seleciona agente ou repositório.
- CHRT-012 (must; ALTA-04): Colunas da matriz são agrupadas em compartilhados (grau ≥2) e exclusivos (grau 1), com classe e grau visíveis por coluna. Em cada grupo, ordenar por grau decrescente, total de PRs decrescente e nome crescente; linhas seguem `AGENTS` em `src/lib/colors.ts`. Rótulos completos permanecem consultáveis, com rolagem horizontal para a matriz. Verification: manual em `bun run dev`, verificar grau 1 e ≥2, filtros, cliques e contagens contra as arestas de entrada.

## Contract

- Adicionar, remover ou reordenar um gráfico, ou mudar o que ele filtra ou define, exige atualizar este spec.
- Fora do escopo: o estado de filtros (ver `filters-comparison.md`), o mecanismo de destaque (ver `cross-chart-highlight.md`) e a geração dos JSONs (ver `data-pipeline.md`).

## Verification

- `bun run build`, `bun run lint` e verificação manual no `bun run dev`, conforme a Definition of Done em `AGENTS.md`.
