import { useMemo } from "react"
import VegaChart from "@/components/VegaChart"
import type { Repo } from "@/lib/types"
import { agentColorScale } from "@/lib/colors"
import { agentFromClick, legendValue, fmtInt } from "@/lib/vegaHelpers"
import { matchRepo, useFilters } from "@/context/FilterContext"

const TOP_N = 25

export default function ParetoChart({ data }: { data: Repo[] }) {
  const { filters, toggleAgent, toggleRepo } = useFilters()
  const { repo } = filters

  const { rows, totalRepositories, totalPrs, topShare } = useMemo(() => {
    const filtered = data.filter((row) => matchRepo(row, filters)).sort((a, b) => b.n_pr - a.n_pr)

    const totalPrs = filtered.reduce((sum, row) => sum + row.n_pr, 0)
    let cumulative = 0
    const rows = filtered.slice(0, TOP_N).map((row, index) => {
      cumulative += row.n_pr
      return {
        ...row,
        rank: index + 1,
        cumulative_share: totalPrs > 0 ? cumulative / totalPrs : 0,
      }
    })

    return {
      rows,
      totalRepositories: filtered.length,
      totalPrs,
      topShare: totalPrs > 0 ? cumulative / totalPrs : 0,
    }
  }, [data, filters])

  const spec = useMemo(() => {
    const selectedOpacity = repo
      ? {
          condition: {
            test: `datum.repo === ${JSON.stringify(repo)}`,
            value: 1,
          },
          value: 0.3,
        }
      : { value: 1 }

    return {
      width: "container",
      height: 330,
      data: { values: rows },
      layer: [
        {
          mark: { type: "bar", cursor: "pointer" },
          encoding: {
            x: {
              field: "rank",
              type: "ordinal",
              sort: "ascending",
              title: "Repositórios em ordem decrescente de PRs",
              axis: { titleLimit: 260, labelAngle: 0 },
            },
            y: {
              field: "n_pr",
              type: "quantitative",
              title: "Quantidade de PRs",
            },
            color: {
              field: "main_agent",
              type: "nominal",
              title: "Agente principal",
              scale: agentColorScale,
            },
            opacity: selectedOpacity,
            tooltip: [
              { field: "repo", title: "Repositório" },
              { field: "rank", title: "Posição" },
              { field: "n_pr", title: "Pull Requests", format: "," },
              { field: "main_agent", title: "Agente principal" },
              {
                field: "cumulative_share",
                title: "Participação acumulada",
                format: ".1%",
              },
            ],
          },
        },
        {
          mark: {
            type: "line",
            color: "#b45309",
            strokeWidth: 2.5,
            point: { filled: true, size: 55 },
          },
          encoding: {
            x: {
              field: "rank",
              type: "ordinal",
              sort: "ascending",
              title: "Repositórios em ordem decrescente de PRs",
            },
            y: {
              field: "cumulative_share",
              type: "quantitative",
              title: "Participação acumulada",
              scale: { domain: [0, 1] },
              axis: { orient: "right", format: "%" },
            },
            tooltip: [
              { field: "repo", title: "Até o repositório" },
              {
                field: "cumulative_share",
                title: "Participação acumulada",
                format: ".1%",
              },
            ],
          },
        },
      ],
      resolve: { scale: { y: "independent" } },
    }
  }, [rows, repo])

  if (rows.length === 0)
    return <p className="empty">Nenhum repositório atende aos filtros atuais.</p>

  return (
    <div>
      <VegaChart
        spec={spec}
        onClick={(datum, item) => {
          if (legendValue(datum, item)) {
            const agent = agentFromClick(datum, item)
            if (agent) toggleAgent(agent)
          } else if (datum?.repo) {
            toggleRepo(datum.repo)
          }
        }}
      />
      <p className="note">
        Exibindo os {rows.length} primeiros de {fmtInt(totalRepositories)} repositórios. Eles
        concentram
        {(topShare * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% dos{" "}
        {fmtInt(totalPrs)} PRs dos repositórios que atendem aos filtros. O período não altera este
        agregado.
      </p>
    </div>
  )
}
