
import { useMemo, useState, useRef } from "react";

import VegaChart from "./VegaChart";

import type { MonthlyRow } from "../lib/types";

import { agentColorScale } from "../lib/colors";

import {
  agentFromClick,
  agentOpacity,
} from "../lib/vegaHelpers";

import { useFilters } from "../context/FilterContext";

// ======================================================
// 1. MODOS DE VISUALIZAÇÃO
// ======================================================

type Mode = "volume" | "log" | "share";

const MODES: { id: Mode; label: string }[] = [
  { id: "volume", label: "Volume" },
  { id: "log", label: "Volume (log)" },
  { id: "share", label: "Participação (%)" },
];

// ======================================================
// 2. FORMATAÇÃO DOS MESES
// ======================================================

const MONTH_EXPR =
  "['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][utcmonth(datum.value)] + ' ' + utcFormat(datum.value,'%y')";

// ======================================================
// 3. COMPONENTE
// ======================================================

export default function MonthlyChart({
  data,
}: {
  data: MonthlyRow[];
}) {
  const {
    filters,
    toggleAgent,
    setRange,
  } = useFilters();

  const { agents, range } = filters;

  const [mode, setMode] = useState<Mode>("volume");

  // ====================================================
  // 4. PREPARAÇÃO DOS DADOS
  // ====================================================

  const { rows, ticks } = useMemo(() => {
    const months = [
      ...new Set(data.map((d) => d.month)),
    ].sort();

    const first = months[0];
    const last = months[months.length - 1];

    const totals = new Map<string, number>();

    data.forEach((d) => {
      totals.set(
        d.month,
        (totals.get(d.month) ?? 0) + d.prs
      );
    });

    return {
      rows: data.map((d) => ({
        ...d,

        // Primeiro dia de cada mês
        date: `${d.month}-01`,

        // Participação do agente no volume mensal
        share:
          d.prs / (totals.get(d.month) || 1),

        // Identifica os meses incompletos
        partial:
          d.month === first ||
          d.month === last,
      })),

      ticks: months.map((m) =>
        Date.UTC(
          Number(m.slice(0, 4)),
          Number(m.slice(5, 7)) - 1,
          1
        )
      ),
    };
  }, [data]);

  // ====================================================
  // 5. SELEÇÃO TEMPORAL (BRUSH)
  // ====================================================

  const brushTimer = useRef<number | undefined>(
    undefined
  );

  function handleMonthBrush(value: any) {
    const extent =
      value?.date ??
      value?.x ??
      Object.values(value ?? {}).find(
        Array.isArray
      );

    // Seleção removida
    if (
      !Array.isArray(extent) ||
      extent.length !== 2
    ) {
      setRange(null);
      return;
    }

    const startDate = new Date(extent[0]);
    const endDate = new Date(extent[1]);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return;
    }

    // Primeiro dia do mês inicial
    const start = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        1
      )
    );

    // Último dia do mês final
    const end = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth() + 1,
        0
      )
    );

    const startISO = start
      .toISOString()
      .slice(0, 10);

    const endISO = end
      .toISOString()
      .slice(0, 10);

    // Evita atualizações excessivas durante o brush
    window.clearTimeout(brushTimer.current);

    brushTimer.current = window.setTimeout(() => {
      setRange([startISO, endISO]);
    }, 180);
  }

  // ====================================================
  // 6. ESPECIFICAÇÃO VEGA-LITE
  // ====================================================

  const spec = useMemo(() => {
    const yField =
      mode === "share" ? "share" : "prs";

    const common = {
      x: {
        field: "date",
        type: "temporal",

        scale: {
          type: "utc",
        },

        title: "Mês",

        axis: {
          values: ticks,
          labelExpr: MONTH_EXPR,
          labelAngle: 0,
        },
      },

      y: {
        field: yField,
        type: "quantitative",

        title:
          mode === "share"
            ? "Participação no mês"
            : "PRs abertos no mês",

        scale:
          mode === "log"
            ? { type: "log" }
            : mode === "share"
              ? { domain: [0, 1] }
              : {},

        axis: {
          format:
            mode === "share"
              ? "%"
              : "~s",
        },
      },

      color: {
        field: "agent",
        type: "nominal",
        title: "Agente",
        scale: agentColorScale,
      },

      opacity: agentOpacity(agents),

      tooltip: [
        {
          field: "agent",
          title: "Agente",
        },
        {
          field: "month",
          title: "Mês",
        },
        {
          field: "prs",
          title: "PRs",
          format: ",",
        },
        {
          field: "share",
          title: "Participação",
          format: ".1%",
        },
      ],
    };

    return {
      width: "container",
      height: 300,

      data: {
        values: rows,
      },

      layer: [
        // ==============================================
        // 1. PERÍODO SELECIONADO NO CALENDÁRIO
        // ==============================================

        ...(range
          ? [
              {
                data: {
                  values: [
                    {
                      a: range[0],
                      b: range[1],
                    },
                  ],
                },

                mark: {
                  type: "rect",
                  color: "#94a3b8",
                  opacity: 0.2,
                },

                encoding: {
                  x: {
                    field: "a",
                    type: "temporal",
                    scale: {
                      type: "utc",
                    },
                  },

                  x2: {
                    field: "b",
                  },
                },
              },
            ]
          : []),

        // ==============================================
        // 2. LINHA PRINCIPAL + BRUSH TEMPORAL
        // ==============================================

        {
          // Importante: seleção declarada somente
          // nesta camada para evitar sinais duplicados.
          params: [
            {
              name: "monthlyPeriodBrush",

              select: {
                type: "interval",
                encodings: ["x"],
                clear: "dblclick",
              },
            },
          ],

          mark: {
            type: "line",
            strokeWidth: 2,
            interpolate: "monotone",
          },

          encoding: common,
        },

        // ==============================================
        // 3. MESES COMPLETOS
        // ==============================================

        {
          transform: [
            {
              filter: "!datum.partial",
            },
          ],

          mark: {
            type: "point",
            filled: true,
            size: 55,
            cursor: "pointer",
          },

          encoding: common,
        },

        // ==============================================
        // 4. MESES INCOMPLETOS
        // ==============================================

        {
          transform: [
            {
              filter: "datum.partial",
            },
          ],

          mark: {
            type: "point",
            filled: false,
            size: 55,
            strokeWidth: 2,
            cursor: "pointer",
          },

          encoding: common,
        },
      ],
    };
  }, [
    rows,
    ticks,
    mode,
    agents,
    range,
  ]);

  // ====================================================
  // 7. RENDERIZAÇÃO
  // ====================================================

  return (
    <div>

      {/* Alternância dos modos */}

      <div
        className="seg"
        role="group"
        aria-label="Modo do eixo vertical"
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            className={mode === m.id ? "on" : ""}
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Gráfico Vega-Lite */}

      <VegaChart
        spec={spec}

        // Seleção temporal coordenada
        signals={{
          monthlyPeriodBrush: handleMonthBrush,
        }}

        // Cross-filtering por agente
        onClick={(d, item) => {
          const agent = agentFromClick(d, item);

          if (agent) {
            toggleAgent(agent);
          }
        }}
      />

    </div>
  );
}