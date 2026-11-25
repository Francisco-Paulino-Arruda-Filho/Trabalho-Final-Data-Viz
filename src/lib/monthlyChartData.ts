import type { MonthlyRow } from "@/lib/types"

export interface PreparedMonthlyRow extends MonthlyRow {
  date: string
  share: number
  partial: boolean
}

export function prepareMonthlyRows(data: MonthlyRow[]): {
  rows: PreparedMonthlyRow[]
  ticks: number[]
} {
  const months = [...new Set(data.map((row) => row.month))].sort()
  const first = months[0]
  const last = months[months.length - 1]
  const totals = new Map<string, number>()

  data.forEach((row) => {
    totals.set(row.month, (totals.get(row.month) ?? 0) + row.prs)
  })

  return {
    rows: data.map((row) => ({
      ...row,
      date: `${row.month}-01`,
      share: row.prs / (totals.get(row.month) || 1),
      partial: row.month === first || row.month === last,
    })),
    ticks: months.map((month) =>
      Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, 1),
    ),
  }
}
