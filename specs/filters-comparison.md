# filters-comparison spec

## Purpose

Estado global de filtros e de comparação entre agentes, compartilhado por todos os gráficos
via `FilterProvider` / `useFilters` (`src/context/FilterContext.tsx`). Contrato do trabalho:
qualquer mudança de comportamento exige atualizar este spec.

## Requirements

- FILT-001 (must): Os filtros globais são: agentes (multi), período `[início, fim]`, linguagem (única), repositório (único), faixa de estrelas `[min, max]` e ocultar repositórios dominantes. O estado inicial é vazio (`EMPTY_FILTERS`). Verification: `bun run test` (`tests/context/FilterContext.test.ts`).
- FILT-002 (must): Agente, linguagem e repositório alternam: aplicar o mesmo valor de novo o remove. Verification: manual (`bun run dev`).
- FILT-003 (must): Período e faixa de estrelas iguais ao valor atual não geram novo estado (evita re-render e laço com brushes). Verification: manual read-through.
- FILT-004 (must): Um repositório é dominante quando tem `n_pr >= 1000` (`DOMINANT_MIN_PRS`); com `hideDominant` ativo ele sai de todas as visões por repositório. Verification: `bun run test`.
- FILT-005 (must): `matchRepo(repo, filters, opts)` aplica agente principal, linguagem, dominantes e estrelas (limites inclusivos); `ignoreAgents` e `ignoreStars` pulam os respectivos critérios. Período e repositório não são aplicados por `matchRepo`. Verification: `bun run test`.
- FILT-006 (must): A comparação guarda até dois agentes distintos; escolher o mesmo agente nos dois lados mantém só o primeiro. Verification: manual.
- FILT-007 (must): Com pelo menos um agente na comparação, ela tem prioridade sobre o filtro de agentes: `focusAgents` vira os agentes comparados e `focusFilters` é `filters` com `agents = focusAgents`. Hoje os gráficos recebem a comparação só como destaque (opacidade via `focusAgents`) e filtram com `filters`; a comparação não remove repositórios das visões. Verification: manual read-through + `bun run dev`.
- FILT-012 (should): Os gráficos devem passar a filtrar com `focusFilters`, para que a comparação também filtre as visões por repositório. Verification: `grep -n "matchRepo(" src/components/charts` mostra só `focusFilters` + `bun run dev`.
- FILT-008 (must): `isFiltered` é verdadeiro se qualquer filtro global estiver ativo ou houver comparação. Verification: manual.
- FILT-009 (must): `reset` limpa filtros, comparação e hover global e incrementa `resetToken`; `clearStarsRange` também incrementa `resetToken`. Gráficos com brush interno remontam quando `resetToken` muda. Verification: manual (`bun run dev`).
- FILT-010 (must): `useFilters` fora de um `FilterProvider` lança erro. Verification: manual read-through.
- FILT-011 (could): A lógica de estado (toggle, set, reset, foco) deve ser extraída para funções puras testáveis em node. Verification: `bun run test` com testes do reducer.

## Contract

- API pública: `FilterProvider`, `useFilters`, `matchRepo`, `EMPTY_FILTERS`, `DOMINANT_MIN_PRS`, tipos `Filters` e `CompareAgents`.
- Fora do escopo: o hover entre gráficos (ver `cross-chart-highlight.md`), persistência de filtros em URL ou storage.

## Verification

- `bun run test`, `bun run build`, conforme a Definition of Done em `AGENTS.md`.
