# data-pipeline spec

## Purpose

Como os dados chegam ao dashboard. Os CSVs agregados do AIDev-pop são gerados fora deste
repositório e versionados em `data/`. Dois notebooks em `scripts/` transformam esses CSVs nos
JSONs pré-agregados de `public/data/`, que o app carrega por fetch. O app nunca lê `data/`
diretamente.

## Inventory

| Etapa                              | Arquivos                                                                                                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entrada (gerada fora do repo)      | `data/pr_slim.csv`, `data/repos.csv`, `data/meta.json`                                                                                                           |
| `scripts/prepare_data.ipynb`       | `meta.json`, `monthly_agents.json`, `outcomes.json`, `merge_times.json`, `calendar.json`, `languages.json`, `repositories.json`, `agent_repository_network.json` |
| `scripts/prepare_extra_data.ipynb` | `review_types.json`, `hourly_activity.json`                                                                                                                      |
| Saída (consumida pelo app)         | `public/data/*.json`                                                                                                                                             |

## Requirements

- PIPE-001 (must): `data/` é o local canônico dos CSVs de entrada; eles vêm do AIDev-pop (Li, Zhang e Hassan, 2026) e são produzidos fora deste repositório. Verification: manual read-through.
- PIPE-002 (must): `public/data/` contém exatamente os 10 JSONs do inventário, e cada um é gerado por um dos dois notebooks. Verification: `ls public/data` + manual read-through dos notebooks.
- PIPE-003 (must): O formato de cada JSON corresponde aos tipos em `src/lib/types.ts` (`Meta`, `DayData`, `MonthlyRow`, `OutcomeRow`, `MergeTimesData`, `LanguageRow`, `Repo`, `NetworkData`, `ReviewTypeRow`, `HourlyActivityRow`). Mudar um formato exige atualizar o tipo e este spec juntos. Verification: `bun run build` sai com 0 + manual (`bun run dev` carrega sem erro).
- PIPE-004 (must): Os JSONs em `public/data/` são artefatos gerados: não são editados à mão nem reformatados por ferramentas (eles estão no ignore do `oxfmt`). Verification: `bunx oxfmt --check` não lista `public/data`.
- PIPE-005 (must): A rede agente–repositório inclui só os 100 repositórios com mais PRs (`NETWORK_TOP = 100` em `prepare_data.ipynb`). Verification: manual read-through.
- PIPE-006 (should): Os dois notebooks devem ler de `data/` e gravar em `public/data/` a partir da raiz do projeto, qualquer que seja o diretório de execução. Hoje `prepare_data.ipynb` lê de `out/agg/`, e `prepare_extra_data.ipynb` grava em `<cwd>/public/data/`. Verification: rodar os dois notebooks a partir de `scripts/` e conferir `git status` em `public/data/`.
- PIPE-007 (could): Os notebooks devem rodar de forma reprodutível por comando (por exemplo, `jupyter nbconvert --execute`), com as dependências Python declaradas. Verification: comando executa com saída 0.

## Contract

- O app depende apenas de `public/data/*.json`; `data/` e `scripts/` não entram no bundle.
- Fora do escopo: a extração original do AIDev (fora do repo), a interpretação dos gráficos (ver `charts.md`).

## Verification

- `bun run build` e verificação manual no `bun run dev` após regenerar os dados, conforme a Definition of Done em `AGENTS.md`.
