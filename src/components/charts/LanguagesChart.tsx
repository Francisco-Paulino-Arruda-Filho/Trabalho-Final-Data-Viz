import { useMemo } from "react"

import VegaChart from "@/components/VegaChart"

import type { LanguageRow } from "@/lib/types"

import { AGENTS, SEQUENTIAL_RANGE } from "@/lib/colors"

import { useFilters } from "@/context/FilterContext"

const MIN_RESOLVED = 30

const LAST = ["Outras", "Desconhecida"]

interface Cell {
  language: string
  agent: string
  merged: number
  closed: number
  open: number
  resolved: number
  rate: number
  small: boolean
}

export default function LanguagesChart({ data }: { data: LanguageRow[] }) {
  const { filters, toggleLanguage } = useFilters()

  const { agents, language } = filters

  // ======================================================
  // 1. AGREGAÇÃO DOS DADOS
  // ======================================================

  const { cells, langOrder } = useMemo(() => {
    const map = new Map<string, Cell>()

    data.forEach((r) => {
      const key = `${r.language}|${r.agent}`

      let cell = map.get(key)

      if (!cell) {
        cell = {
          language: r.language,
          agent: r.agent,
          merged: 0,
          closed: 0,
          open: 0,
          resolved: 0,
          rate: 0,
          small: false,
        }

        map.set(key, cell)
      }

      const count = Number(r.count) || 0

      if (r.outcome === "merged") {
        cell.merged += count
      } else if (r.outcome === "closed") {
        cell.closed += count
      } else if (r.outcome === "open") {
        cell.open += count
      }
    })

    const totals = new Map<string, number>()

    const cells: Cell[] = []

    map.forEach((cell) => {
      cell.resolved = cell.merged + cell.closed

      totals.set(
        cell.language,
        (totals.get(cell.language) ?? 0) + cell.merged + cell.closed + cell.open,
      )

      // Sem PR resolvido, não existe taxa de merge calculável.
      if (cell.resolved === 0) return

      cell.rate = cell.merged / cell.resolved

      cell.small = cell.resolved < MIN_RESOLVED

      cells.push(cell)
    })

    // Ordena as linguagens pelo volume total.
    const real = [...totals.keys()].filter((item) => !LAST.includes(item))

    real.sort((a, b) => (totals.get(b) ?? 0) - (totals.get(a) ?? 0))

    return {
      cells,
      langOrder: [...real, ...LAST.filter((item) => totals.has(item))],
    }
  }, [data])

  // ======================================================
  // 2. APLICAÇÃO DOS FILTROS
  // ======================================================

  const rows = useMemo(
    () =>
      cells.map((cell) => {
        let opacity = cell.small ? 0.55 : 1

        if (agents.length > 0 && !agents.includes(cell.agent)) {
          opacity *= 0.25
        }

        if (language && cell.language !== language) {
          opacity *= 0.4
        }

        const percentage = Math.round(cell.rate * 100)

        return {
          ...cell,

          op: opacity,

          selw: language === cell.language ? 2.5 : 0,

          label: cell.small ? `${percentage}*` : `${percentage}`,
        }
      }),
    [cells, agents, language],
  )

  // ======================================================
  // 3. ESPECIFICAÇÃO VEGA-LITE
  // ======================================================

  const spec = useMemo(
    () => ({
      width: "container",

      height: {
        step: 26,
      },

      data: {
        values: rows,
      },

      encoding: {
        x: {
          field: "agent",
          type: "nominal",
          sort: [...AGENTS],
          title: null,
          axis: {
            orient: "top",
            labelAngle: 0,
            labelFontSize: 12,
          },
        },

        y: {
          field: "language",
          type: "nominal",
          sort: langOrder,
          title: null,
        },
      },

      layer: [
        // ================================================
        // CAMADA 1: CÉLULAS DO HEATMAP
        // ================================================

        {
          mark: {
            type: "rect",
            cursor: "pointer",
            stroke: "#111827",
          },

          encoding: {
            color: {
              field: "rate",
              type: "quantitative",
              title: "Taxa de merge",

              scale: {
                domain: [0, 1],
                range: [...SEQUENTIAL_RANGE],
              },

              legend: {
                format: "%",
                gradientLength: 140,
              },
            },

            // Escala explícita, evitando scale: null.
            opacity: {
              field: "op",
              type: "quantitative",
              scale: {
                domain: [0, 1],
                range: [0, 1],
              },
              legend: null,
            },

            // Realça a linguagem selecionada.
            strokeWidth: {
              condition: {
                test: "datum.selw > 0",
                value: 2.5,
              },
              value: 0.5,
            },

            tooltip: [
              {
                field: "language",
                title: "Linguagem",
              },
              {
                field: "agent",
                title: "Agente",
              },
              {
                field: "rate",
                title: "Taxa de merge (entre resolvidos)",
                format: ".1%",
              },
              {
                field: "merged",
                title: "Integrados",
                format: ",",
              },
              {
                field: "closed",
                title: "Fechados sem merge",
                format: ",",
              },
              {
                field: "open",
                title: "Abertos",
                format: ",",
              },
            ],
          },
        },

        // ================================================
        // CAMADA 2: RÓTULOS DAS CÉLULAS
        // ================================================

        {
          mark: {
            type: "text",
            fontSize: 11,
            baseline: "middle",
          },

          encoding: {
            text: {
              field: "label",
              type: "nominal",
            },

            // Cor definida por condição, sem criar
            // uma segunda escala de cores.
            color: {
              condition: {
                test: "datum.rate > 0.62",
                value: "#ffffff",
              },
              value: "#1f2933",
            },

            opacity: {
              field: "op",
              type: "quantitative",
              scale: {
                domain: [0, 1],
                range: [0, 1],
              },
              legend: null,
            },
          },
        },
      ],
    }),
    [rows, langOrder],
  )

  // ======================================================
  // 4. RENDERIZAÇÃO E INTERAÇÃO
  // ======================================================

  return (
    <div>
      <VegaChart
        spec={spec}
        onClick={(datum) => {
          if (datum?.language) {
            toggleLanguage(datum.language)
          }
        }}
      />

      <p className="note">
        Cada célula é a taxa de merge (%) entre PRs resolvidos. * = menos de {MIN_RESOLVED} PRs
        resolvidos: leia com cautela. Clique numa célula para filtrar por linguagem.
      </p>
    </div>
  )
}
