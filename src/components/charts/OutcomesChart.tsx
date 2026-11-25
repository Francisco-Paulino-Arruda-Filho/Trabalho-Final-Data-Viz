import { useMemo, useState } from "react"

import VegaChart from "@/components/VegaChart"

import type { OutcomeRow } from "@/lib/types"

import { AGENTS, OUTCOMES, OUTCOME_COLORS, OUTCOME_LABEL_EXPR } from "@/lib/colors"

import { AGENT_FOCUS_PARAMS, agentFromClick, agentOpacity } from "@/lib/vegaHelpers"
import { prepareOutcomeRows } from "@/lib/outcomeChart"

import { useFilters } from "@/context/FilterContext"
import { setHoveredAgent } from "@/context/hoverStore"

type Mode = "percent" | "count"

export default function OutcomesChart({ data }: { data: OutcomeRow[] }) {
  const { focusAgents, toggleAgent } = useFilters()

  const [mode, setMode] = useState<Mode>("percent")

  // ======================================================
  // 1. PREPARAÇÃO DOS DADOS
  // ======================================================

  const { rows, order, rates } = useMemo(() => {
    const prepared = prepareOutcomeRows(data, AGENTS)
    const rates = new Map<string, number>()
    prepared.forEach((row) => {
      if (row.resolvedMergeRate !== null) rates.set(row.agent, row.resolvedMergeRate)
    })
    const order = [...rates.keys()].sort((a, b) => (rates.get(b) ?? 0) - (rates.get(a) ?? 0))
    return {
      order,
      rates,
      rows: prepared.map((row) => ({ ...row, ord: OUTCOMES.indexOf(row.outcome) })),
    }
  }, [data])

  // ======================================================
  // 3. ESPECIFICAÇÃO VEGA-LITE
  // ======================================================

  const spec = useMemo(() => {
    const pct = mode === "percent"

    return {
      width: "container",

      height: {
        step: 36,
      },

      data: {
        values: rows,
      },

      params: [...AGENT_FOCUS_PARAMS],

      encoding: {
        y: {
          field: "agent",
          type: "nominal",
          sort: order,
          title: null,

          axis: {
            labelFontSize: 12,
          },
        },

        x: {
          field: "count",
          type: "quantitative",

          stack: pct ? "normalize" : "zero",

          title: pct ? "Proporção dos PRs do agente" : "Quantidade de PRs",

          axis: {
            format: pct ? "%" : "~s",
          },
        },

        color: {
          field: "outcome",
          type: "nominal",
          title: "Desfecho",

          scale: {
            domain: [...OUTCOMES],
            range: OUTCOME_COLORS,
          },

          legend: {
            labelExpr: OUTCOME_LABEL_EXPR,
          },
        },

        order: {
          field: "ord",
          type: "quantitative",
        },

        // Dirigida pelos params focusAgents / hoverAgent.
        opacity: agentOpacity(),
      },

      layer: [
        // Barras empilhadas
        {
          mark: {
            type: "bar",
            cursor: "pointer",
            stroke: "#fff",
            strokeWidth: 1,
          },

          encoding: {
            tooltip: [
              {
                field: "agent",
                title: "Agente",
              },
              {
                field: "outcome",
                title: "Desfecho",
              },
              {
                field: "count",
                title: "PRs",
                format: ",",
              },
              {
                field: "percentage",
                title: "% do agente",
                format: ".1f",
              },
              {
                field: "total_agent",
                title: "Base do percentual: todos os PRs",
                format: ",",
              },
              {
                field: "resolvedTotal",
                title: "Base da taxa: PRs resolvidos",
                format: ",",
              },
              {
                field: "resolvedMergeRate",
                title: "Taxa de merge (integrados ÷ resolvidos)",
                format: ".1%",
              },
            ],
          },
        },

        // Rótulos das proporções
        ...(pct
          ? [
              {
                transform: [
                  {
                    filter: "datum.percentage > 7",
                  },
                  {
                    calculate: "format(datum.percentage, '.0f') + '%'",
                    as: "label",
                  },
                ],

                mark: {
                  type: "text",
                  align: "right",
                  dx: -5,
                  fontSize: 11,
                  fontWeight: 600,
                },

                encoding: {
                  text: {
                    field: "label",
                    type: "nominal",
                  },

                  color: {
                    condition: {
                      test: "datum.outcome === 'open'",
                      value: "#1f2933",
                    },
                    value: "#ffffff",
                  },
                },
              },
            ]
          : []),
      ],
    }
  }, [rows, order, mode])

  // ======================================================
  // 4. EVENTOS
  // ======================================================

  function handleAgentHover(datum: unknown, item: unknown) {
    setHoveredAgent(agentFromClick(datum, item))
  }

  // ======================================================
  // 5. RENDERIZAÇÃO
  // ======================================================

  return (
    <div>
      <div className="seg" role="group" aria-label="Escala das barras">
        <button
          className={mode === "percent" ? "on" : ""}
          aria-pressed={mode === "percent"}
          onClick={() => setMode("percent")}
        >
          Proporção
        </button>

        <button
          className={mode === "count" ? "on" : ""}
          aria-pressed={mode === "count"}
          onClick={() => setMode("count")}
        >
          Quantidade
        </button>
      </div>

      <p className="note">
        Proporções usam todos os PRs do agente como base, incluindo os abertos. A taxa de merge usa
        apenas PRs resolvidos (integrados + fechados sem merge); PRs abertos ficam fora dessa taxa.
      </p>

      <VegaChart
        spec={spec}
        signalValues={{ focusAgents }}
        hoverSignal="hoverAgent"
        onClick={(datum, item) => {
          const agent = agentFromClick(datum, item)

          if (agent) {
            toggleAgent(agent)
          }
        }}
        onHover={handleAgentHover}
      />

      <p className="note">
        Ordenado pela taxa de merge entre PRs resolvidos:{" "}
        {order
          .map((agent) => `${agent} ${((rates.get(agent) ?? 0) * 100).toFixed(0)}%`)
          .join(" · ")}
        .
      </p>
    </div>
  )
}
