---
name: test-and-verify
description: Escreve testes Vitest para este projeto (Bun + Vite, alias @, testes em tests/ espelhando src/) e roda a Definition of Done do AGENTS.md (format, lint, test, build) reportando o resultado real de cada comando. Use sempre que o pedido for escrever, corrigir ou rodar testes, "testa isso", "roda os testes", "verifica se está tudo ok", conferir lint/format/build, ou antes de declarar qualquer mudança pronta ou pedir um commit. Não use para criar gráficos (use chart-authoring) nem para testes de navegador ou capturas de tela.
---

# Test and verify

Este projeto roda só com Bun — não há Node instalado — e isso muda alguns detalhes do Vitest.
A configuração de teste fica no bloco `test` de `vite.config.ts`; não crie um
`vitest.config.ts` separado, porque ele deixaria de herdar o alias `@`.

## Comandos (todos verificados)

| Objetivo            | Comando                                    | Passa quando           |
| ------------------- | ------------------------------------------ | ---------------------- |
| Formatar            | `bun run format`                           | — (reescreve arquivos) |
| Checar formatação   | `bun run format:check`                     | sai com 0              |
| Lint                | `bun run lint`                             | sai com 0              |
| Testes (uma vez)    | `bun run test`                             | sai com 0              |
| Testes (watch)      | `bun run test:watch`                       | — (interativo)         |
| Um arquivo de teste | `bunx vitest run tests/lib/colors.test.ts` | sai com 0              |
| Tipos + build       | `bun run build`                            | sai com 0              |

Use `bun run` / `bunx`, nunca `npm`/`npx`/`node`: não existem nesta máquina, e o `bun.lock` é
o único lockfile.

## Escrevendo testes

- Local: `tests/` espelhando `src/` — `src/lib/colors.ts` → `tests/lib/colors.test.ts`. O
  Vitest só coleta `tests/**/*.test.{ts,tsx}`.
- Imports sempre pelo alias: `import { mergeRate } from "@/lib/vegaHelpers"`. Imports
  relativos são proibidos no projeto (TOOL-003).
- Importe a API de teste explicitamente: `import { describe, expect, it } from "vitest"` (não
  há globals).
- Estilo: sem ponto e vírgula, aspas duplas; rode `bun run format` ao terminar.
- Ambiente `node`, `pool: "threads"`. O pool `forks` padrão quebra sob o Bun
  (`child.channel?.unref is not a function`); se você vir esse erro, alguém removeu o
  `pool: "threads"` do `vite.config.ts`.
- Não há `jsdom` nem Testing Library: componentes React não são testáveis hoje (TOOL-009).
  Quando a lógica estiver dentro de um componente, extraia-a para uma função pura exportada
  (em `src/lib/` ou no próprio módulo) e teste a função — esse é o caminho indicado por
  CHRT-008 e FILT-011.
- Estado global em módulo (ex.: `hoverStore`) vaza entre testes: restaure no `afterEach`
  (`setHoveredAgent(null)`).
- Para objetos de tipos grandes (ex.: `Repo`), construa só os campos usados e faça cast,
  como em `tests/lib/vegaHelpers.test.ts`.

Bons testes aqui fixam requisitos dos specs: cite o ID no `describe`/`it` quando testar um
(`it("FILT-005: limites de estrelas são inclusivos", ...)`), assim fica claro que mudar o teste
é mudar o contrato.

## Verificação antes de dizer "pronto"

Rode os quatro comandos da Definition of Done, nesta ordem, e reporte a saída real de cada um:

1. `bun run format:check`
2. `bun run lint`
3. `bun run test`
4. `bun run build`

Nunca escreva "deve passar": rode. Se um comando falhar, diga qual, cole o erro relevante e
separe o que foi causado pela sua mudança do que já falhava antes (confira com `git stash`
se houver dúvida). Falhas conhecidas na data desta skill: `bun run lint` acusa 9 erros
`react(refs)`/`react(immutability)` em `ScatterChart`, `CalendarChart` e `NetworkChart`
(HIGH-007) — não as atribua à sua mudança, mas também não aumente a contagem.

Mudanças visuais (gráficos, CSS) ainda precisam de conferência no navegador com
`bun run dev`; testes e build não provam que um gráfico aparece certo.
