import { describe, expect, it } from "vitest"
import { prepareMonthlyRows } from "@/lib/monthlyChartData"
import type { MonthlyRow } from "@/lib/types"

const rows: MonthlyRow[] = [
  { month: "2024-12", agent: "Codex", prs: 8 },
  { month: "2025-01", agent: "Codex", prs: 10 },
  { month: "2025-10", agent: "Codex", prs: 2 },
]

describe("CHRT-009: cobertura mensal", () => {
  it("marca somente os meses de borda como parciais e preserva os valores observados", () => {
    const result = prepareMonthlyRows(rows)

    expect(result.rows.map(({ month, partial, prs }) => ({ month, partial, prs }))).toEqual([
      { month: "2024-12", partial: true, prs: 8 },
      { month: "2025-01", partial: false, prs: 10 },
      { month: "2025-10", partial: true, prs: 2 },
    ])
  })

  it("não marca nenhum mês como parcial quando não há dados", () => {
    expect(prepareMonthlyRows([])).toEqual({ rows: [], ticks: [] })
  })
})
