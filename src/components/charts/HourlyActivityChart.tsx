import { useMemo } from "react"
import VegaChart from "@/components/VegaChart"
import type { HourlyActivityRow } from "@/lib/types"
import { useFilters } from "@/context/FilterContext"

const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

export default function HourlyActivityChart({ data }: { data: HourlyActivityRow[] }) {
  const { filters } = useFilters()
  const { agents, range } = filters

  const cells = useMemo(() => {
    const totals = new Map<string, number>()

    data.forEach((row) => {
      if (agents.length > 0 && !agents.includes(row.agent)) return
      if (range && (row.date < range[0] || row.date > range[1])) return

      const key = `${row.dow}-${row.hour}`
      totals.set(key, (totals.get(key) ?? 0) + row.count)
    })

    return WEEKDAYS.flatMap((weekday, dow) =>
      HOURS.map((hour) => ({
        dow,
        weekday,
        hour,
        count: totals.get(`${dow}-${hour}`) ?? 0,
      })),
    )
  }, [data, agents, range])

  const spec = useMemo(
    () => ({
      width: "container",
      height: 230,
      data: { values: cells },
      mark: {
        type: "rect",
        stroke: "#ffffff",
        strokeWidth: 1,
        cornerRadius: 2,
      },
      encoding: {
        x: {
          field: "hour",
          type: "ordinal",
          sort: HOURS,
          title: "Hora do dia",
          axis: {
            values: [0, 3, 6, 9, 12, 15, 18, 21, 23],
            labelExpr: "datum.value + 'h'",
            labelAngle: 0,
          },
        },
        y: {
          field: "weekday",
          type: "ordinal",
          sort: WEEKDAYS,
          title: null,
        },
        color: {
          field: "count",
          type: "quantitative",
          title: "PRs",
          scale: { scheme: "tealblues", domainMin: 0 },
        },
        tooltip: [
          { field: "weekday", title: "Dia" },
          { field: "hour", title: "Hora", format: "02d" },
          { field: "count", title: "Pull Requests", format: "," },
        ],
      },
    }),
    [cells],
  )

  return (
    <div>
      <VegaChart spec={spec} />
      <p className="note">
        Cada célula soma os PRs registrados naquele dia da semana e hora. A visualização responde
        aos filtros globais de agente e período.
      </p>
    </div>
  )
}
