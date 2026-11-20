import { useMemo, useState } from "react";
import VegaChart from "./VegaChart";
import type { OutcomeRow } from "../lib/types";
import { AGENTS, OUTCOMES, OUTCOME_COLORS, OUTCOME_LABEL_EXPR } from "../lib/colors";
import { agentFromClick, agentOpacity } from "../lib/vegaHelpers";
import { useFilters } from "../context/FilterContext";

type Mode = "percent" | "count";

export default function OutcomesChart({ data }: { data: OutcomeRow[] }) {
  const { filters, toggleAgent } = useFilters();
  const { agents } = filters;
  const [mode, setMode] = useState<Mode>("percent");

  // Taxa de merge entre PRs *resolvidos* (merged / (merged + closed)):
  // PRs ainda abertos não deveriam entrar no denominador.
  const { rows, order, rates } = useMemo(() => {
    const merged = new Map<string, number>();
    const closed = new Map<string, number>();
    data.forEach((r) => {
      if (r.outcome === "merged") merged.set(r.agent, r.count);
      if (r.outcome === "closed") closed.set(r.agent, r.count);
    });
    const rates = new Map<string, number>();
    AGENTS.forEach((a) => {
      const m = merged.get(a) ?? 0;
      const c = closed.get(a) ?? 0;
      if (m + c > 0) rates.set(a, m / (m + c));
    });
    const order = [...rates.keys()].sort((a, b) => (rates.get(b) ?? 0) - (rates.get(a) ?? 0));
    return {
      order,
      rates,
      rows: data.map((r) => ({
        ...r,
        ord: OUTCOMES.indexOf(r.outcome),
        resolved: rates.get(r.agent) ?? null,
      })),
    };
  }, [data]);

  const spec = useMemo(() => {
    const pct = mode === "percent";
    return {
      width: "container",
      height: { step: 36 },
      data: { values: rows },
      encoding: {
        y: { field: "agent", type: "nominal", sort: order, title: null, axis: { labelFontSize: 12 } },
        x: {
          field: "count",
          type: "quantitative",
          stack: pct ? "normalize" : "zero",
          title: pct ? "Proporção dos PRs do agente" : "Quantidade de PRs",
          axis: { format: pct ? "%" : "~s" },
        },
        color: {
          field: "outcome",
          type: "nominal",
          title: "Desfecho",
          scale: { domain: [...OUTCOMES], range: OUTCOME_COLORS },
          legend: { labelExpr: OUTCOME_LABEL_EXPR },
        },
        order: { field: "ord", type: "quantitative" },
        opacity: agentOpacity(agents),
      },
      layer: [
        {
          mark: { type: "bar", cursor: "pointer", stroke: "#fff", strokeWidth: 1 },
          encoding: {
            tooltip: [
              { field: "agent", title: "Agente" },
              { field: "outcome", title: "Desfecho" },
              { field: "count", title: "PRs", format: "," },
              { field: "percentage", title: "% do agente", format: ".1f" },
              { field: "resolved", title: "Taxa de merge (entre resolvidos)", format: ".1%" },
            ],
          },
        },
        ...(pct
          ? [
              {
                transform: [
                  { filter: "datum.percentage > 7" },
                  { calculate: "format(datum.percentage, '.0f') + '%'", as: "label" },
                ],
                mark: { type: "text", align: "right", dx: -5, fontSize: 11, fontWeight: 600 },
                encoding: {
                  text: { field: "label", type: "nominal" },
                  color: {
                    condition: { test: "datum.outcome === 'open'", value: "#1f2933" },
                    value: "#ffffff",
                  },
                },
              },
            ]
          : []),
      ],
    };
  }, [rows, order, mode, agents]);

  return (
    <div>
      <div className="seg" role="group" aria-label="Escala das barras">
        <button className={mode === "percent" ? "on" : ""} onClick={() => setMode("percent")}>
          Proporção
        </button>
        <button className={mode === "count" ? "on" : ""} onClick={() => setMode("count")}>
          Quantidade
        </button>
      </div>
      <VegaChart
        spec={spec}
        onClick={(d, item) => {
          const a = agentFromClick(d, item);
          if (a) toggleAgent(a);
        }}
      />
      <p className="note">
        Ordenado pela taxa de merge entre PRs resolvidos:{" "}
        {order.map((a) => `${a} ${((rates.get(a) ?? 0) * 100).toFixed(0)}%`).join(" · ")}.
      </p>
    </div>
  );
}
