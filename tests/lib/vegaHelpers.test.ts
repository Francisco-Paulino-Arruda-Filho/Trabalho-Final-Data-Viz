import { describe, expect, it } from "vitest"
import type { Repo } from "@/lib/types"
import {
  AGENT_FOCUS_PARAMS,
  agentFromClick,
  agentOpacity,
  fmtDate,
  fmtHours,
  fmtInt,
  legendValue,
  mergeRate,
} from "@/lib/vegaHelpers"

const repo = (n_merged: number, n_closed: number, extra: object = {}) =>
  ({ n_merged, n_closed, ...extra }) as Repo

describe("mergeRate", () => {
  it("calcula merged / (merged + closed)", () => {
    expect(mergeRate(repo(3, 1))).toBe(0.75)
  })

  it("retorna 1 quando só há merged", () => {
    expect(mergeRate(repo(5, 0))).toBe(1)
  })

  it("retorna 0 quando só há closed", () => {
    expect(mergeRate(repo(0, 4))).toBe(0)
  })

  it("retorna null quando não há PRs resolvidos", () => {
    expect(mergeRate(repo(0, 0))).toBeNull()
  })

  it("ignora PRs abertos", () => {
    expect(mergeRate(repo(1, 1, { n_open: 100 }))).toBe(0.5)
  })
})

describe("AGENT_FOCUS_PARAMS", () => {
  it("declara focusAgents ([]) e hoverAgent (null)", () => {
    expect(AGENT_FOCUS_PARAMS).toEqual([
      { name: "focusAgents", value: [] },
      { name: "hoverAgent", value: null },
    ])
  })
})

describe("agentOpacity", () => {
  it('usa datum["agent"] por padrão', () => {
    const o = agentOpacity()
    expect(o.condition[0].test).toContain('datum["agent"]')
    expect(o.condition[1].test).toContain('datum["agent"]')
  })

  it("aceita campo customizado", () => {
    const o = agentOpacity("main_agent")
    expect(o.condition[0].test).toContain('datum["main_agent"]')
    expect(o.condition[0].test).not.toContain('datum["agent"]')
    expect(o.condition[1].test).toContain('datum["main_agent"]')
  })

  it("tem 2 condições (0.12 e 0.25) e valor base 1", () => {
    const o = agentOpacity()
    expect(o.condition).toHaveLength(2)
    expect(o.condition.map((c) => c.value)).toEqual([0.12, 0.25])
    expect(o.value).toBe(1)
  })

  it("os tests referenciam focusAgents e hoverAgent", () => {
    const o = agentOpacity()
    expect(o.condition[0].test).toContain("focusAgents")
    expect(o.condition[1].test).toContain("hoverAgent")
  })
})

describe("legendValue", () => {
  it.each(["legend-label", "legend-symbol"])("retorna o valor para role %s", (role) => {
    expect(legendValue({ value: "Codex" }, { mark: { role } })).toBe("Codex")
  })

  it("retorna null para role que não é de legenda", () => {
    expect(legendValue({ value: "Codex" }, { mark: { role: "mark" } })).toBeNull()
  })

  it("retorna null quando datum.value não é string", () => {
    expect(legendValue({ value: 3 }, { mark: { role: "legend-label" } })).toBeNull()
  })

  it("retorna null para datum/item null ou undefined", () => {
    expect(legendValue(null, { mark: { role: "legend-label" } })).toBeNull()
    expect(legendValue(undefined, { mark: { role: "legend-label" } })).toBeNull()
    expect(legendValue({ value: "Codex" }, null)).toBeNull()
    expect(legendValue({ value: "Codex" }, undefined)).toBeNull()
    expect(legendValue({ value: "Codex" }, {})).toBeNull()
  })
})

describe("agentFromClick", () => {
  const legend = { mark: { role: "legend-label" } }

  it("retorna agente válido vindo da legenda", () => {
    expect(agentFromClick({ value: "Devin" }, legend)).toBe("Devin")
  })

  it("legenda com valor que não é agente cai para datum.agent", () => {
    expect(agentFromClick({ value: "foo", agent: "Jules" }, legend)).toBe("Jules")
  })

  it("legenda com valor que não é agente e sem agent retorna null", () => {
    expect(agentFromClick({ value: "foo" }, legend)).toBeNull()
  })

  it("usa datum.agent válido", () => {
    expect(agentFromClick({ agent: "Cursor" }, {})).toBe("Cursor")
  })

  it("usa datum.main_agent", () => {
    expect(agentFromClick({ main_agent: "Copilot" }, {})).toBe("Copilot")
  })

  it("agente desconhecido retorna null", () => {
    expect(agentFromClick({ agent: "Skynet" }, {})).toBeNull()
  })

  it("datum undefined retorna null", () => {
    expect(agentFromClick(undefined, {})).toBeNull()
  })

  it("agent não-string retorna null", () => {
    expect(agentFromClick({ agent: 42 }, {})).toBeNull()
  })
})

describe("fmtHours", () => {
  it("menos de 60s em segundos", () => {
    expect(fmtHours(30 / 3600)).toBe("30 s")
    expect(fmtHours(0)).toBe("0 s")
  })

  it("minutos", () => {
    expect(fmtHours(0.5)).toBe("30 min")
  })

  it("horas com vírgula decimal", () => {
    expect(fmtHours(1.5)).toBe("1,5 h")
  })

  it("limite de 48h", () => {
    expect(fmtHours(47.9)).toBe("47,9 h")
    expect(fmtHours(48)).toBe("2,0 dias")
  })

  it("dias", () => {
    expect(fmtHours(72)).toBe("3,0 dias")
  })
})

describe("fmtDate", () => {
  it("converte ISO para dd/mm/aaaa", () => {
    expect(fmtDate("2025-03-07")).toBe("07/03/2025")
  })

  it("entrada sem hífen é devolvida igual", () => {
    expect(fmtDate("20250307")).toBe("20250307")
  })
})

describe("fmtInt", () => {
  it("separa milhares no estilo pt-BR", () => {
    // normaliza qualquer separador de milhar (ponto, NBSP, espaço fino) para "."
    const out = fmtInt(1234567).replace(/[\s  ,]/g, ".")
    expect(out).toBe("1.234.567")
  })

  it("não altera números pequenos", () => {
    expect(fmtInt(42)).toBe("42")
    expect(fmtInt(0)).toBe("0")
  })
})
