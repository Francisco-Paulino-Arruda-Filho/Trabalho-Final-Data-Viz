import { useMemo } from "react"
import VegaChart from "@/components/VegaChart"
import type { MergeTimesData } from "@/lib/types"
import { AGENTS, agentColorScale } from "@/lib/colors"
import { agentFromClick } from "@/lib/vegaHelpers"
import { useFilters } from "@/context/FilterContext"

export default function MergeBoxplotChart({ data }: { data: MergeTimesData }) {
  const { filters, toggleAgent } = useFilters()
  const { agents } = filters

  const rows = useMemo(
    () => data.summary.filter((row) => agents.length === 0 || agents.includes(row.agent)),
    [data.summary, agents],
  )

  const spec = useMemo(
    () => ({
      width: "container",
      height: { step: 48 },
      data: { values: rows },
      encoding: {
        y: {
          field: "agent",
          type: "nominal",
          sort: [...AGENTS],
          title: null,
        },
      },
      layer: [
        {
          mark: { type: "rule", color: "#64748b", strokeWidth: 1.5 },
          encoding: {
            x: {
              field: "min",
              type: "quantitative",
              scale: { type: "log" },
              title: "Tempo até merge (horas, escala log)",
            },
            x2: { field: "max" },
            tooltip: [
              { field: "agent", title: "Agente" },
              { field: "min", title: "Mínimo", format: ".3g" },
              { field: "max", title: "Máximo", format: ".3g" },
            ],
          },
        },
        {
          mark: { type: "bar", size: 24, cursor: "pointer" },
          encoding: {
            x: {
              field: "q1",
              type: "quantitative",
              scale: { type: "log" },
              title: "Tempo até merge (horas, escala log)",
            },
            x2: { field: "q3" },
            color: {
              field: "agent",
              type: "nominal",
              scale: agentColorScale,
              legend: null,
            },
            tooltip: [
              { field: "agent", title: "Agente" },
              { field: "n", title: "PRs integrados", format: "," },
              { field: "q1", title: "Q1", format: ".3g" },
              { field: "median", title: "Mediana", format: ".3g" },
              { field: "q3", title: "Q3", format: ".3g" },
            ],
          },
        },
        {
          mark: {
            type: "tick",
            orient: "vertical",
            color: "#17202a",
            thickness: 2.5,
            size: 30,
          },
          encoding: {
            x: {
              field: "median",
              type: "quantitative",
              scale: { type: "log" },
              title: "Tempo até merge (horas, escala log)",
            },
          },
        },
      ],
    }),
    [rows],
  )

  if (rows.length === 0) return <p className="empty">Nenhum agente atende à seleção atual.</p>

  return (
    <div>
      <VegaChart
        spec={spec}
        onClick={(datum, item) => {
          const agent = agentFromClick(datum, item)
          if (agent) toggleAgent(agent)
        }}
      />
      <p className="note">
        Caixa = intervalo entre Q1 e Q3; traço escuro = mediana; linha = mínimo a máximo. É um
        resumo tipo boxplot construído com os quantis agregados disponíveis; não apresenta pontos
        individuais de outliers.
      </p>
    </div>
  )
}
