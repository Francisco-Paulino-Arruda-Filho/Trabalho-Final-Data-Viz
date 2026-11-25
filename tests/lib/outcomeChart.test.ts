import { describe, expect, it } from "vitest"

import { prepareOutcomeRows } from "@/lib/outcomeChart"
import type { OutcomeRow } from "@/lib/types"

const rows: OutcomeRow[] = [
  { agent: "Codex", outcome: "merged", count: 6, total_agent: 10, percentage: 60 },
  { agent: "Codex", outcome: "closed", count: 2, total_agent: 10, percentage: 20 },
  { agent: "Codex", outcome: "open", count: 2, total_agent: 10, percentage: 20 },
]

describe("ALTA-03: bases do OutcomesChart", () => {
  it("preserva total_agent como denominador dos percentuais e exclui abertos da taxa de merge", () => {
    const prepared = prepareOutcomeRows(rows, ["Codex"])

    expect(prepared).toEqual([
      expect.objectContaining({
        agent: "Codex",
        outcome: "merged",
        percentage: 60,
        total_agent: 10,
        resolvedTotal: 8,
        resolvedMergeRate: 0.75,
      }),
      expect.objectContaining({
        agent: "Codex",
        outcome: "closed",
        percentage: 20,
        total_agent: 10,
        resolvedTotal: 8,
        resolvedMergeRate: 0.75,
      }),
      expect.objectContaining({
        agent: "Codex",
        outcome: "open",
        percentage: 20,
        total_agent: 10,
        resolvedTotal: 8,
        resolvedMergeRate: 0.75,
      }),
    ])
  })

  it("não inventa taxa quando não há PRs resolvidos", () => {
    const prepared = prepareOutcomeRows(
      [{ agent: "Codex", outcome: "open", count: 3, total_agent: 3, percentage: 100 }],
      ["Codex"],
    )

    expect(prepared[0]).toMatchObject({ resolvedTotal: 0, resolvedMergeRate: null })
  })
})
