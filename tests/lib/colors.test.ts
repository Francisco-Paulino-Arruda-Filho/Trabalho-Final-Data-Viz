import { describe, expect, it } from "vitest"
import {
  AGENT_COLORS,
  AGENTS,
  OUTCOME_COLORS,
  OUTCOME_LABEL_EXPR,
  OUTCOMES,
  REVIEW_TYPE_COLORS,
  REVIEW_TYPE_LABEL_EXPR,
  REVIEW_TYPES,
  SEQUENTIAL_RANGE,
  agentColorScale,
  reviewTypeColorScale,
} from "@/lib/colors"

const HEX = /^#[0-9A-Fa-f]{6}$/

describe("agentes", () => {
  it("AGENTS tem 6 itens únicos", () => {
    expect(AGENTS).toHaveLength(6)
    expect(new Set(AGENTS).size).toBe(6)
  })

  it("AGENT_COLORS tem cor hex para cada agente", () => {
    for (const a of AGENTS) expect(AGENT_COLORS[a]).toMatch(HEX)
    expect(Object.keys(AGENT_COLORS).sort()).toEqual([...AGENTS].sort())
  })

  it("cores de agentes são únicas", () => {
    expect(new Set(Object.values(AGENT_COLORS)).size).toBe(AGENTS.length)
  })

  it("agentColorScale alinha domain e range", () => {
    expect(agentColorScale.domain).toEqual([...AGENTS])
    expect(agentColorScale.range).toHaveLength(agentColorScale.domain.length)
    agentColorScale.domain.forEach((d, i) => {
      expect(agentColorScale.range[i]).toBe(AGENT_COLORS[d])
    })
  })
})

describe("desfechos", () => {
  it("OUTCOMES e OUTCOME_COLORS têm o mesmo tamanho", () => {
    expect(OUTCOME_COLORS).toHaveLength(OUTCOMES.length)
  })

  it("cores de desfecho são hex válidas", () => {
    for (const c of OUTCOME_COLORS) expect(c).toMatch(HEX)
  })

  it("OUTCOME_LABEL_EXPR tem uma entrada para cada desfecho", () => {
    for (const o of OUTCOMES)
      expect(OUTCOME_LABEL_EXPR).toMatch(new RegExp(`'${o}'\\s*:\\s*'[^']+'`))
    expect(OUTCOME_LABEL_EXPR).toContain("[datum.label]")
  })
})

describe("tipos de revisão", () => {
  it("REVIEW_TYPE_COLORS tem exatamente as chaves de REVIEW_TYPES", () => {
    expect(Object.keys(REVIEW_TYPE_COLORS).sort()).toEqual([...REVIEW_TYPES].sort())
  })

  it("cores de revisão são hex válidas", () => {
    for (const c of Object.values(REVIEW_TYPE_COLORS)) expect(c).toMatch(HEX)
  })

  it("reviewTypeColorScale alinha domain e range", () => {
    expect(reviewTypeColorScale.domain).toEqual([...REVIEW_TYPES])
    expect(reviewTypeColorScale.range).toHaveLength(REVIEW_TYPES.length)
    reviewTypeColorScale.domain.forEach((d, i) => {
      expect(reviewTypeColorScale.range[i]).toBe(REVIEW_TYPE_COLORS[d])
    })
  })

  it("REVIEW_TYPE_LABEL_EXPR tem uma entrada para cada tipo", () => {
    for (const t of REVIEW_TYPES)
      expect(REVIEW_TYPE_LABEL_EXPR).toMatch(new RegExp(`'${t}'\\s*:\\s*'[^']+'`))
    expect(REVIEW_TYPE_LABEL_EXPR).toContain("[datum.label]")
  })
})

describe("escala sequencial", () => {
  it("SEQUENTIAL_RANGE tem 2 cores hex", () => {
    expect(SEQUENTIAL_RANGE).toHaveLength(2)
    for (const c of SEQUENTIAL_RANGE) expect(c).toMatch(HEX)
  })
})
