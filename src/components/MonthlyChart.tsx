
import { useEffect, useMemo, useState, useRef } from "react";

import VegaChart from "./VegaChart";

import type { MonthlyRow } from "../lib/types";

import { agentColorScale } from "../lib/colors";

import {
  AGENT_FOCUS_PARAMS,
  agentFromClick,
  agentOpacity,
} from "../lib/vegaHelpers";

import { useFilters } from "../context/FilterContext";
import { setHoveredAgent } from "../context/hoverStore";

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
    focusAgents,
    toggleAgent,
    setRange,
    resetToken,
  } = useFilters();

  const { range } = filters;

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
        date: `${d.month}-01`,
        share: d.prs / (totals.get(d.month) || 1),
        partial: d.month === first || d.month === last,
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
  // 5. SELEÇÃO TEMPORAL
  // ====================================================

  const brushTimer = useRef<number | undefined>(
    undefined
  );

  // Cancela um debounce pendente ao desmontar.
  useEffect(
    () => () => window.clearTimeout(brushTimer.current),
    []
  );

  function handleMonthBrush(value: unknown) {
    const brush = value as
      | Record<string, unknown>
      | null
      | undefined;

    const extent =
      brush?.date ??
      brush?.x ??
      Object.values(brush ?? {}).find(Array.isArray);

    // Brush limpo: descarta qualquer seleção que ainda
    // estivesse esperando o debounce, senão ela ressurgiria.
    if (!Array.isArray(extent) || extent.length !== 2) {
      window.clearTimeout(brushTimer.current);
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

    const start = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        1
      )
    );

    const end = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth() + 1,
        0
      )
    );

    const startISO = start.toISOString().slice(0, 10);
    const endISO = end.toISOString().slice(0, 10);

    window.clearTimeout(brushTimer.current);

    brushTimer.current = window.setTimeout(() => {
      setRange([startISO, endISO]);
    }, 180);
  }

  // ====================================================
  // 6. ESPECIFICAÇÃO VEGA-LITE
  // ====================================================

  const spec = useMemo(() => {
    const yField = mode === "share" ? "share" : "prs";

    const common = {
      x: {
        field: "date",
        type: "temporal",
        scale: { type: "utc" },
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
          format: mode === "share" ? "%" : "~s",
        },
      },

      color: {
        field: "agent",
        type: "nominal",
        title: "Agente",
        scale: agentColorScale,
      },

      // Dirigida pelos params focusAgents / hoverAgent:
      // muda sem recriar o gráfico.
      opacity: agentOpacity(),

      tooltip: [
        { field: "agent", title: "Agente" },
        { field: "month", title: "Mês" },
        { field: "prs", title: "PRs", format: "," },
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

      params: [...AGENT_FOCUS_PARAMS],

      layer: [
        // Período selecionado no calendário
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
                    scale: { type: "utc" },
                  },

                  x2: {
                    field: "b",
                  },
                },
              },
            ]
          : []),

        // Linha principal com brush
        {
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

        // Meses completos
        {
          transform: [
            { filter: "!datum.partial" },
          ],

          mark: {
            type: "point",
            filled: true,
            size: 55,
            cursor: "pointer",
          },

          encoding: common,
        },

        // Meses incompletos
        {
          transform: [
            { filter: "datum.partial" },
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
    range,
  ]);

  // ====================================================
  // 7. EVENTOS
  // ====================================================

  function handleAgentHover(datum: unknown, item: unknown) {
    setHoveredAgent(agentFromClick(datum, item));
  }

  // ====================================================
  // 8. RENDERIZAÇÃO
  // ====================================================

  return (
    <div>
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

      <VegaChart
        // Remonta ao "Limpar tudo": zera o brush interno.
        key={resetToken}
        spec={spec}
        signalValues={{ focusAgents }}
        hoverSignal="hoverAgent"
        signals={{
          monthlyPeriodBrush: handleMonthBrush,
        }}
        onClick={(datum, item) => {
          const agent = agentFromClick(datum, item);
          if (agent) toggleAgent(agent);
        }}
        onHover={handleAgentHover}
      />
    </div>
  );
}
