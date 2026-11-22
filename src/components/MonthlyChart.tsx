import { useMemo, useState } from "react";
import VegaChart from "./VegaChart";
import type { MonthlyRow } from "../lib/types";
import { agentColorScale } from "../lib/colors";
import { agentFromClick, agentOpacity } from "../lib/vegaHelpers";
import { useFilters } from "../context/FilterContext";

type Mode = "volume" | "log" | "share";
const MODES: { id: Mode; label: string }[] = [
  { id: "volume", label: "Volume" },
  { id: "log", label: "Volume (log)" },
  { id: "share", label: "Participação (%)" },
];
const MONTH_EXPR =
  "['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][utcmonth(datum.value)] + ' ' + utcFormat(datum.value,'%y')";

export default function MonthlyChart({ data }: { data: MonthlyRow[] }) {
  const { filters, toggleAgent } = useFilters();
  const { agents, range } = filters;
  const [mode, setMode] = useState<Mode>("volume");

  const { rows, ticks } = useMemo(() => {
    const months = [...new Set(data.map((d) => d.month))].sort();
    const first = months[0];
    const last = months[months.length - 1];
    const totals = new Map<string, number>();
    data.forEach((d) => totals.set(d.month, (totals.get(d.month) ?? 0) + d.prs));
    return {
      rows: data.map((d) => ({
        ...d,
        date: `${d.month}-01`,
        share: d.prs / (totals.get(d.month) || 1),
        partial: d.month === first || d.month === last, // meses de borda incompletos
      })),
      ticks: months.map((m) => Date.UTC(Number(m.slice(0, 4)), Number(m.slice(5, 7)) - 1, 1)),
    };
  }, [data]);

  const spec = useMemo(() => {
    const yField = mode === "share" ? "share" : "prs";
    const common = {
      x: {
        field: "date",
        type: "temporal",
        scale: { type: "utc" },
        title: "Mês",
        axis: { values: ticks, labelExpr: MONTH_EXPR, labelAngle: 0 },
      },
      y: {
        field: yField,
        type: "quantitative",
        title: mode === "share" ? "Participação no mês" : "PRs abertos no mês",
        scale: mode === "log" ? { type: "log" } : mode === "share" ? { domain: [0, 1] } : {},
        axis: { format: mode === "share" ? "%" : "~s" },
      },
      color: { field: "agent", type: "nominal", title: "Agente", scale: agentColorScale },
      opacity: agentOpacity(agents),
      tooltip: [
        { field: "agent", title: "Agente" },
        { field: "month", title: "Mês" },
        { field: "prs", title: "PRs", format: "," },
        { field: "share", title: "Participação", format: ".1%" },
      ],
    };

    return {
      width: "container",
      height: 300,
      data: { values: rows },
      layer: [
        // faixa cinza = período selecionado no calendário
        ...(range
          ? [
              {
                data: { values: [{ a: range[0], b: range[1] }] },
                mark: { type: "rect", color: "#94a3b8", opacity: 0.2 },
                encoding: {
                  x: { field: "a", type: "temporal", scale: { type: "utc" } },
                  x2: { field: "b" },
                },
              },
            ]
          : []),
        { mark: { type: "line", strokeWidth: 2, interpolate: "monotone" }, encoding: common },
        {
          // meses completos: círculo cheio
          transform: [{ filter: "!datum.partial" }],
          mark: { type: "point", filled: true, size: 55, cursor: "pointer" },
          encoding: common,
        },
        {
          // meses de borda (dez/24 e out/25): círculo vazado = incompleto
          transform: [{ filter: "datum.partial" }],
          mark: { type: "point", filled: false, size: 55, strokeWidth: 2, cursor: "pointer" },
          encoding: common,
        },
      ],
    };
  }, [rows, ticks, mode, agents, range]);

  return (
    <div>
      <div className="seg" role="group" aria-label="Modo do eixo vertical">
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
        spec={spec}
        onClick={(d, item) => {
          const a = agentFromClick(d, item);
          if (a) toggleAgent(a);
        }}
      />
    </div>
  );
}
