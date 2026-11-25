import { useMemo, useState } from "react"

import VegaChart from "@/components/VegaChart"

import type { OutcomeRow } from "@/lib/types"

import { AGENTS, OUTCOMES, OUTCOME_COLORS, OUTCOME_LABEL_EXPR } from "@/lib/colors"

import { AGENT_FOCUS_PARAMS, agentFromClick, agentOpacity } from "@/lib/vegaHelpers"

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
    const merged = new Map<string, number>()
    const closed = new Map<string, number>()

    data.forEach((r) => {
      if (r.outcome === "merged") {
        merged.set(r.agent, r.count)
      }

      if (r.outcome === "closed") {
        closed.set(r.agent, r.count)
      }
    })

    // Taxa de merge entre PRs resolvidos.
    // PRs ainda abertos não entram no denominador.
    const rates = new Map<string, number>()

    AGENTS.forEach((agent) => {
      const m = merged.get(agent) ?? 0
      const c = closed.get(agent) ?? 0

      if (m + c > 0) {
        rates.set(agent, m / (m + c))
      }
    })

    const order = [...rates.keys()].sort((a, b) => (rates.get(b) ?? 0) - (rates.get(a) ?? 0))

    return {
      order,
      rates,

      rows: data.map((r) => ({
        ...r,
        ord: OUTCOMES.indexOf(r.outcome),
        resolved: rates.get(r.agent) ?? null,
      })),
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
                field: "resolved",
                title: "Taxa de merge (entre resolvidos)",
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
