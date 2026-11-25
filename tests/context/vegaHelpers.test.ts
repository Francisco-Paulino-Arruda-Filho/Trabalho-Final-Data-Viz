import { describe, expect, it } from "vitest"
import * as ctx from "@/context/vegaHelpers"
import * as lib from "@/lib/vegaHelpers"
import type { Repo } from "@/lib/types"

// src/context/vegaHelpers.ts é uma cópia duplicada de src/lib/vegaHelpers.ts.
// Este teste garante que as duas não divergem enquanto a duplicata existir.

const repo = (n_merged: number, n_closed: number) => ({ n_merged, n_closed }) as Repo

describe("paridade context/vegaHelpers x lib/vegaHelpers", () => {
  it("expõem as mesmas exportações", () => {
    expect(Object.keys(ctx).sort()).toEqual(Object.keys(lib).sort())
    expect(Object.keys(lib).length).toBeGreaterThan(0)
  })

  it("mergeRate", () => {
    for (const [m, c] of [
      [3, 1],
      [0, 0],
      [0, 5],
      [7, 0],
    ] as const) {
      expect(ctx.mergeRate(repo(m, c))).toBe(lib.mergeRate(repo(m, c)))
    }
    expect(ctx.mergeRate(repo(3, 1))).toBe(0.75)
  })

  it("AGENT_FOCUS_PARAMS", () => {
    expect(ctx.AGENT_FOCUS_PARAMS).toEqual(lib.AGENT_FOCUS_PARAMS)
    expect(ctx.AGENT_FOCUS_PARAMS.map((p) => p.name)).toEqual(["focusAgents", "hoverAgent"])
  })

  it("agentOpacity", () => {
    expect(ctx.agentOpacity()).toEqual(lib.agentOpacity())
    expect(ctx.agentOpacity("main_agent")).toEqual(lib.agentOpacity("main_agent"))
  })

  it("legendValue e agentFromClick", () => {
    const cases: [any, any][] = [
      [{ value: "Codex" }, { mark: { role: "legend-label" } }],
      [{ value: "Codex" }, { mark: { role: "mark" } }],
      [{ value: "Outro" }, { mark: { role: "legend-symbol" } }],
      [{ agent: "Devin" }, {}],
      [{ main_agent: "Jules" }, undefined],
      [{ agent: "Desconhecido" }, {}],
      [undefined, undefined],
      [{ value: 3 }, { mark: { role: "legend-label" } }],
    ]
    for (const [d, i] of cases) {
      expect(ctx.legendValue(d, i)).toBe(lib.legendValue(d, i))
      expect(ctx.agentFromClick(d, i)).toBe(lib.agentFromClick(d, i))
    }
    expect(ctx.agentFromClick({ value: "Codex" }, { mark: { role: "legend-label" } })).toBe("Codex")
  })

  it("fmtHours, fmtDate e fmtInt", () => {
    for (const h of [0.001, 0.5, 1, 47.9, 48, 100]) {
      expect(ctx.fmtHours(h)).toBe(lib.fmtHours(h))
    }
    expect(ctx.fmtDate("2025-05-31")).toBe(lib.fmtDate("2025-05-31"))
    expect(ctx.fmtDate("2025-05-31")).toBe("31/05/2025")
    expect(ctx.fmtInt(1234567)).toBe(lib.fmtInt(1234567))
  })
})
