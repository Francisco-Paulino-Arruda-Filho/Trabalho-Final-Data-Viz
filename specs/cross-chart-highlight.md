# cross-chart-highlight spec

## Purpose

Destaque coordenado de agentes entre todos os gráficos: passar o mouse sobre um agente em
qualquer gráfico esmaece os outros agentes em todas as visões, e o foco (filtro ou
comparação) esmaece os agentes fora de foco. Contrato do trabalho: mudanças de
comportamento exigem atualizar este spec.

## Requirements

- HIGH-001 (must): O agente sob o mouse fica num store global fora do React (`src/context/hoverStore.ts`) com `get`, `set` e `subscribe`; `set` com o valor atual não notifica ninguém. Verification: `bun run test` (`tests/context/hoverStore.test.ts`).
- HIGH-002 (must): Mudanças de hover e de foco não recriam nenhuma visualização: o `VegaChart` empurra os valores para a view com `view.signal(...)`, preservando brushes e tooltips. Verification: manual (`bun run dev`, fazer um brush e passar o mouse em outro gráfico).
- HIGH-003 (must): Specs que participam do destaque declaram `AGENT_FOCUS_PARAMS` (`focusAgents`, `hoverAgent`) e usam `agentOpacity(field)` como codificação de opacidade. Verification: `bun run test` (`tests/lib/vegaHelpers.test.ts`).
- HIGH-004 (must): Opacidade: agente fora de `focusAgents` (quando não vazio) = 0,12; agente diferente do `hoverAgent` (quando há hover) = 0,25; caso contrário = 1. O foco tem prioridade sobre o hover. Verification: `bun run test`.
- HIGH-005 (must): Gráficos emissores de hover (`MonthlyChart`, `OutcomesChart`, `MergeTimesChart`, `ReviewTypesChart` e `NetworkChart`) atualizam o store global ao passar sobre um agente. No `NetworkChart`, entrar/sair de uma linha de agente ou focar/desfocar seu rótulo define/limpa o agente em hover. No `VegaChart`, sair do gráfico chama `onHover(null, null)` e o hover global volta a `null`. `reset` dos filtros também limpa o hover. Verification: manual (`bun run dev`).
- HIGH-006 (must): Clique em legenda, barra, linha ou ponto resolve o agente com `agentFromClick`, que só aceita os agentes conhecidos de `AGENTS`. Verification: `bun run test`.
- HIGH-007 (should): Corrigir os 8 erros `react(refs)` e o erro `react(immutability)` do `oxlint` em `ScatterChart`, `CalendarChart` e `NetworkChart` sem quebrar HIGH-002. Verification: `bun run lint` sai com 0.

## Contract

- API pública: `getHoveredAgent`, `setHoveredAgent`, `subscribeHoveredAgent`, `AGENT_FOCUS_PARAMS`, `agentOpacity`, `agentFromClick`, `legendValue`, componente `VegaChart` (props `signalValues`, `hoverSignal`, `signals`, `onClick`, `onHover`).
- Fora do escopo: os filtros e a comparação em si (ver `filters-comparison.md`); a lógica de cada gráfico (ver `charts.md`).

## Verification

- `bun run test`, `bun run lint`, `bun run build`, conforme a Definition of Done em `AGENTS.md`.
