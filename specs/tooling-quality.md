# tooling-quality spec

## Purpose

Ferramentas, convenções de código e critérios de qualidade do projeto. Define a base da
Definition of Done em `AGENTS.md`.

## Requirements

- TOOL-001 (must): Bun é o único runtime e gerenciador de pacotes (não há Node instalado); `bun.lock` é o lockfile versionado e não existe `package-lock.json`. Verification: `bun install --frozen-lockfile` sai com 0.
- TOOL-002 (must): Vite 8, com Rolldown como bundler, faz o dev server e o build; `bun run build` roda `tsc -b` e `vite build`. Verification: `bun run build` sai com 0.
- TOOL-003 (must): Imports internos usam o alias `@/` (→ `src/`), configurado em `vite.config.ts` e em `tsconfig.app.json`; não há imports relativos `./` ou `../` em `src/` nem em `tests/`. Verification: `grep -rnE "from ['\"]\.\.?/" src tests` não retorna nada.
- TOOL-004 (must): O formatador é o `oxfmt`, sem ponto e vírgula (`.oxfmtrc.json`), ignorando dados gerados (`public/data`, `data`), `dist` e `bun.lock`. Verification: `bun run format:check` sai com 0.
- TOOL-005 (must): O linter é o `oxlint` (`.oxlintrc.json`, plugins typescript, react, react-perf e import; categoria correctness como erro). Verification: `bun run lint` sai com 0 (hoje falha com os 9 erros cobertos por HIGH-007).
- TOOL-006 (must): Os testes usam Vitest, em `tests/` espelhando `src/`, com ambiente `node` e `pool: "threads"` (o pool `forks` padrão não funciona sob o Bun). Verification: `bun run test` sai com 0.
- TOOL-007 (must): O deploy no GitHub Pages roda no GitHub Actions com `oven-sh/setup-bun`, `bun install --frozen-lockfile` e `bun run build`. Verification: workflow `deploy.yml` verde no GitHub.
- TOOL-008 (should): O ESLint (`eslint.config.js` e suas dependências) é legado, substituído pelo `oxlint`, e deve ser removido. Verification: `package.json` sem pacotes `eslint*` e `bun run build` sai com 0.
- TOOL-010 (must): Playwright fornece capturas parametrizáveis e matriz visual; ver `visual-inspection.md`. Verification: `bun run visual:matrix` sai com 0.
- TOOL-009 (could): Testes de componentes React exigem adicionar `jsdom` e `@testing-library/react` e um ambiente por arquivo. Verification: `bun run test` sai com 0 com pelo menos um teste de componente.

## Contract

- Scripts públicos do `package.json`: `dev`, `build`, `preview`, `lint`, `format`, `format:check`, `test`, `test:watch`, `visual`, `visual:matrix`, `visual:install`.
- Fora do escopo: o pipeline Python de dados (ver `data-pipeline.md`).

## Verification

- `bun run format:check`, `bun run lint`, `bun run test` e `bun run build`.
