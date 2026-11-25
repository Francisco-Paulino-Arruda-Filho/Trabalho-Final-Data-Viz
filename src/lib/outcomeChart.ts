import type { OutcomeRow } from "@/lib/types"

export interface PreparedOutcomeRow extends OutcomeRow {
  resolvedTotal: number
  resolvedMergeRate: number | null
}

export function prepareOutcomeRows(data: OutcomeRow[], agents: readonly string[]) {
  const counts = new Map<string, { merged: number; closed: number }>()

  agents.forEach((agent) => counts.set(agent, { merged: 0, closed: 0 }))
  data.forEach((row) => {
    const value = counts.get(row.agent)
    if (!value) return
    if (row.outcome === "merged") value.merged = row.count
    if (row.outcome === "closed") value.closed = row.count
  })

  return data.map((row) => {
    const { merged, closed } = counts.get(row.agent) ?? { merged: 0, closed: 0 }
    const resolvedTotal = merged + closed

    return {
      ...row,
      resolvedTotal,
      resolvedMergeRate: resolvedTotal ? merged / resolvedTotal : null,
    }
  }) satisfies PreparedOutcomeRow[]
}
