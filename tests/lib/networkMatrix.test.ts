import { describe, expect, it } from "vitest"

import {
  buildNetworkMatrix,
  filterNetworkMatrix,
  networkAgentOpacity,
  networkRowCells,
} from "@/lib/networkMatrix"
import type { NetworkData, Repo } from "@/lib/types"

const data: NetworkData = {
  nodes: [
    { id: "agent:Codex", label: "Codex", type: "agent" },
    { id: "agent:Claude Code", label: "Claude Code", type: "agent" },
    { id: "repo:1", label: "org/shared", type: "repository", repo_id: 1 },
    { id: "repo:2", label: "org/only-codex", type: "repository", repo_id: 2 },
    { id: "repo:3", label: "org/only-claude", type: "repository", repo_id: 3 },
    { id: "repo:4", label: "org/tied-b", type: "repository", repo_id: 4 },
    { id: "repo:5", label: "org/tied-a", type: "repository", repo_id: 5 },
  ],
  edges: [
    { source: "agent:Codex", target: "repo:1", prs: 4 },
    { source: "agent:Claude Code", target: "repo:1", prs: 3 },
    { source: "agent:Codex", target: "repo:2", prs: 9 },
    { source: "agent:Claude Code", target: "repo:3", prs: 7 },
    { source: "agent:Codex", target: "repo:4", prs: 2 },
    { source: "agent:Codex", target: "repo:5", prs: 2 },
  ],
}

const repos = [1, 2, 3, 4, 5].map((repo_id) => ({
  repo_id,
  repo: data.nodes.find((node) => node.repo_id === repo_id)!.label,
})) as Repo[]

describe("ALTA-04: matriz agente–repositório", () => {
  it("agrupa compartilhados antes de exclusivos e ordena por grau, PRs e nome", () => {
    const matrix = buildNetworkMatrix(data, repos, ["Codex", "Claude Code"])

    expect(
      matrix.repositories.map(({ repo, shared, degree, totalPrs }) => ({
        repo,
        shared,
        degree,
        totalPrs,
      })),
    ).toEqual([
      { repo: "org/shared", shared: true, degree: 2, totalPrs: 7 },
      { repo: "org/only-codex", shared: false, degree: 1, totalPrs: 9 },
      { repo: "org/only-claude", shared: false, degree: 1, totalPrs: 7 },
      { repo: "org/tied-a", shared: false, degree: 1, totalPrs: 2 },
      { repo: "org/tied-b", shared: false, degree: 1, totalPrs: 2 },
    ])
  })

  it("alinha linhas à ordem recebida e usa null para relação ausente", () => {
    const matrix = buildNetworkMatrix(data, repos, ["Codex", "Claude Code"])

    expect(matrix.rows).toEqual([
      { agent: "Codex", values: [4, 9, null, 2, 2] },
      { agent: "Claude Code", values: [3, null, 7, null, null] },
    ])
  })

  it("remove colunas filtradas junto com seus cabeçalhos e valores de célula", () => {
    const matrix = buildNetworkMatrix(data, repos, ["Codex", "Claude Code"])
    const visible = filterNetworkMatrix(
      matrix,
      new Set(
        matrix.repositories.filter((repo) => repo.repo !== "org/shared").map((repo) => repo.repoId),
      ),
    )

    expect(visible.repositories.map((repo) => repo.repo)).toEqual([
      "org/only-codex",
      "org/only-claude",
      "org/tied-a",
      "org/tied-b",
    ])
    expect(visible.rows).toEqual([
      { agent: "Codex", values: [9, null, 2, 2] },
      { agent: "Claude Code", values: [null, 7, null, null] },
    ])
    expect(networkRowCells(visible, visible.rows[0])).toEqual([
      { repository: visible.repositories[0], value: 9, columnIndex: 0 },
      { repository: visible.repositories[2], value: 2, columnIndex: 2 },
      { repository: visible.repositories[3], value: 2, columnIndex: 3 },
    ])
  })

  it("CHRT-003/HIGH-004: foco da comparação tem prioridade sobre hover global", () => {
    expect(networkAgentOpacity("Codex", ["Codex"], "Claude Code")).toBe(0.25)
    expect(networkAgentOpacity("Claude Code", ["Codex"], "Claude Code")).toBe(0.12)
    expect(networkAgentOpacity("Claude Code", [], "Codex")).toBe(0.25)
    expect(networkAgentOpacity("Codex", [], "Codex")).toBe(1)
    expect(networkAgentOpacity("Codex", [], null)).toBe(1)
  })
})
