import { describe, expect, it } from "vitest"
import { DOMINANT_MIN_PRS, EMPTY_FILTERS, matchRepo, type Filters } from "@/context/FilterContext"
import type { Repo } from "@/lib/types"

const repo = (over: Partial<Repo> = {}): Repo => ({
  repo_id: 1,
  repo: "owner/name",
  language: "Python",
  stars: 100,
  forks: 10,
  n_pr: 50,
  n_merged: 30,
  n_closed: 10,
  median_ttm_h: 5,
  pct_human_review: 0.5,
  main_agent: "Codex",
  ...over,
})

const filters = (over: Partial<Filters> = {}): Filters => ({ ...EMPTY_FILTERS, ...over })

describe("constantes", () => {
  it("EMPTY_FILTERS tem os valores neutros", () => {
    expect(EMPTY_FILTERS).toEqual({
      agents: [],
      range: null,
      language: null,
      repo: null,
      starsRange: null,
      hideDominant: false,
    })
  })

  it("DOMINANT_MIN_PRS é 1000", () => {
    expect(DOMINANT_MIN_PRS).toBe(1000)
  })
})

describe("matchRepo", () => {
  it("filtros vazios aceitam qualquer repo", () => {
    expect(matchRepo(repo(), EMPTY_FILTERS)).toBe(true)
  })

  it("agents: aceita main_agent incluído e barra o excluído", () => {
    const f = filters({ agents: ["Codex", "Devin"] })
    expect(matchRepo(repo({ main_agent: "Codex" }), f)).toBe(true)
    expect(matchRepo(repo({ main_agent: "Jules" }), f)).toBe(false)
  })

  it("ignoreAgents ignora o filtro de agentes", () => {
    const f = filters({ agents: ["Devin"] })
    expect(matchRepo(repo({ main_agent: "Codex" }), f)).toBe(false)
    expect(matchRepo(repo({ main_agent: "Codex" }), f, { ignoreAgents: true })).toBe(true)
  })

  it("language: igual passa, diferente barra", () => {
    const f = filters({ language: "Python" })
    expect(matchRepo(repo({ language: "Python" }), f)).toBe(true)
    expect(matchRepo(repo({ language: "Go" }), f)).toBe(false)
  })

  it("hideDominant: 999 passa, 1000 e 1001 barram", () => {
    const f = filters({ hideDominant: true })
    expect(matchRepo(repo({ n_pr: 999 }), f)).toBe(true)
    expect(matchRepo(repo({ n_pr: 1000 }), f)).toBe(false)
    expect(matchRepo(repo({ n_pr: 1001 }), f)).toBe(false)
  })

  it("sem hideDominant, repos dominantes passam", () => {
    expect(matchRepo(repo({ n_pr: 5000 }), EMPTY_FILTERS)).toBe(true)
  })

  it("starsRange: limites inclusivos, fora barra", () => {
    const f = filters({ starsRange: [10, 20] })
    expect(matchRepo(repo({ stars: 10 }), f)).toBe(true)
    expect(matchRepo(repo({ stars: 20 }), f)).toBe(true)
    expect(matchRepo(repo({ stars: 15 }), f)).toBe(true)
    expect(matchRepo(repo({ stars: 9 }), f)).toBe(false)
    expect(matchRepo(repo({ stars: 21 }), f)).toBe(false)
  })

  it("ignoreStars ignora a faixa de estrelas", () => {
    const f = filters({ starsRange: [10, 20] })
    expect(matchRepo(repo({ stars: 500 }), f, { ignoreStars: true })).toBe(true)
  })

  it("combinação: todos os filtros precisam passar", () => {
    const f = filters({
      agents: ["Codex"],
      language: "Python",
      hideDominant: true,
      starsRange: [10, 200],
    })
    expect(matchRepo(repo(), f)).toBe(true)
    expect(matchRepo(repo({ main_agent: "Devin" }), f)).toBe(false)
    expect(matchRepo(repo({ language: "Go" }), f)).toBe(false)
    expect(matchRepo(repo({ n_pr: 1000 }), f)).toBe(false)
    expect(matchRepo(repo({ stars: 201 }), f)).toBe(false)
  })

  it("não muta os filtros", () => {
    const f = filters({ agents: ["Codex"], starsRange: [1, 2], hideDominant: true })
    const snapshot = structuredClone(f)
    matchRepo(repo(), f)
    matchRepo(repo(), f, { ignoreAgents: true, ignoreStars: true })
    expect(f).toEqual(snapshot)
    expect(EMPTY_FILTERS.agents).toEqual([])
  })
})
