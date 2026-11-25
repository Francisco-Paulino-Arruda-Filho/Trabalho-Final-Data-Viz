import type { NetworkData, Repo } from "@/lib/types"

export interface NetworkMatrixRepository {
  repo: string
  repoId: number
  degree: number
  totalPrs: number
  shared: boolean
}

export interface NetworkMatrix {
  agents: readonly string[]
  repositories: NetworkMatrixRepository[]
  rows: Array<{ agent: string; values: Array<number | null> }>
}

export function filterNetworkMatrix(
  matrix: NetworkMatrix,
  visibleRepoIds: ReadonlySet<number>,
): NetworkMatrix {
  const indexes = matrix.repositories.flatMap((repo, index) =>
    visibleRepoIds.has(repo.repoId) ? [index] : [],
  )
  const repositories = indexes.map((index) => matrix.repositories[index])

  return {
    agents: matrix.agents,
    repositories,
    rows: matrix.rows.map((row) => ({
      agent: row.agent,
      values: indexes.map((index) => row.values[index]),
    })),
  }
}

export function networkRowCells(matrix: NetworkMatrix, row: NetworkMatrix["rows"][number]) {
  return row.values.flatMap((value, columnIndex) =>
    value === null ? [] : [{ repository: matrix.repositories[columnIndex], value, columnIndex }],
  )
}

export function networkAgentOpacity(
  agent: string,
  focusAgents: readonly string[],
  hoveredAgent: string | null,
): number {
  if (focusAgents.length > 0 && !focusAgents.includes(agent)) return 0.12
  if (hoveredAgent !== null && hoveredAgent !== agent) return 0.25
  return 1
}

export function buildNetworkMatrix(
  data: NetworkData,
  repos: Repo[],
  agents: readonly string[],
): NetworkMatrix {
  const labelById = new Map(
    data.nodes
      .filter((node) => node.type === "repository" && node.repo_id !== undefined)
      .map((node) => [node.id, node.repo_id!] as const),
  )
  const nameById = new Map(repos.map((repo) => [repo.repo_id, repo.repo] as const))
  const edgeCounts = new Map<string, Map<number, number>>()

  data.edges.forEach((edge) => {
    const agent = edge.source.replace(/^agent:/, "")
    const repoId = labelById.get(edge.target)
    if (repoId === undefined || !agents.includes(agent)) return
    const counts = edgeCounts.get(agent) ?? new Map<number, number>()
    counts.set(repoId, (counts.get(repoId) ?? 0) + edge.prs)
    edgeCounts.set(agent, counts)
  })

  const repositories = [...labelById.values()]
    .filter((repoId) => nameById.has(repoId))
    .map((repoId) => {
      const connectedAgents = agents.filter(
        (agent) => (edgeCounts.get(agent)?.get(repoId) ?? 0) > 0,
      )
      const totalPrs = connectedAgents.reduce(
        (total, agent) => total + (edgeCounts.get(agent)?.get(repoId) ?? 0),
        0,
      )
      return {
        repo: nameById.get(repoId)!,
        repoId,
        degree: connectedAgents.length,
        totalPrs,
        shared: connectedAgents.length >= 2,
      }
    })
    .filter((repo) => repo.degree > 0)
    .sort(
      (a, b) =>
        Number(b.shared) - Number(a.shared) ||
        b.degree - a.degree ||
        b.totalPrs - a.totalPrs ||
        a.repo.localeCompare(b.repo),
    )

  return {
    agents,
    repositories,
    rows: agents.map((agent) => ({
      agent,
      values: repositories.map((repo) => edgeCounts.get(agent)?.get(repo.repoId) ?? null),
    })),
  }
}
