import { useMemo, useState } from "react";
import VegaChart from "./VegaChart";
import type { ReviewTypeRow } from "../lib/types";
import { AGENTS } from "../lib/colors";
import { agentFromClick, agentOpacity } from "../lib/vegaHelpers";
import { useFilters } from "../context/FilterContext";

type Mode = "percent" | "count";

const REVIEW_TYPES = ["none", "bot_only", "human", "human_changes", "unknown"];
const REVIEW_COLORS = ["#d9e2ec", "#64748b", "#168b78", "#d97706", "#9ca3af"];
const REVIEW_LABEL_EXPR =
  "{'none':'Sem revisão','bot_only':'Somente bot','human':'Revisão humana','human_changes':'Revisão com alterações','unknown':'Não classificado'}[datum.label]";

export default function ReviewTypesChart({ data }: { data: ReviewTypeRow[] }) {
  const { filters, toggleAgent } = useFilters();
  const { agents } = filters;
  const [mode, setMode] = useState<Mode>("percent");

  const rows = useMemo(
    () => data.map((row) => ({ ...row, reviewOrder: REVIEW_TYPES.indexOf(row.review_type) })),
    [data]
  );

  const spec = useMemo(() => {
    const percentage = mode === "percent";
    return {
      width: "container",
      height: { step: 36 },
      data: { values: rows },
      encoding: {
        y: {
          field: "agent",
          type: "nominal",
          sort: [...AGENTS],
          title: null,
        },
        x: {
          field: "count",
          type: "quantitative",
          stack: percentage ? "normalize" : "zero",
          title: percentage ? "Proporção dos PRs do agente" : "Quantidade de PRs",
          axis: { format: percentage ? "%" : "~s" },
        },
        color: {
          field: "review_type",
          type: "nominal",
          title: "Tipo de revisão",
          scale: { domain: REVIEW_TYPES, range: REVIEW_COLORS },
          legend: { labelExpr: REVIEW_LABEL_EXPR },
        },
        order: { field: "reviewOrder", type: "quantitative" },
        opacity: agentOpacity(agents),
      },
      layer: [
        {
          mark: { type: "bar", cursor: "pointer", stroke: "#fff", strokeWidth: 1 },
          encoding: {
            tooltip: [
              { field: "agent", title: "Agente" },
              { field: "review_type", title: "Tipo de revisão" },
              { field: "count", title: "PRs", format: "," },
              { field: "percentage", title: "% do agente", format: ".1f" },
            ],
          },
        },
      ],
    };
  }, [rows, mode, agents]);

  return (
    <div>
      <div className="seg" role="group" aria-label="Escala dos tipos de revisão">
        <button className={mode === "percent" ? "on" : ""} onClick={() => setMode("percent")}>
          Proporção
        </button>
        <button className={mode === "count" ? "on" : ""} onClick={() => setMode("count")}>
          Quantidade
        </button>
      </div>
      <VegaChart
        spec={spec}
        onClick={(datum, item) => {
          const agent = agentFromClick(datum, item);
          if (agent) toggleAgent(agent);
        }}
      />
      <p className="note">
        As categorias representam a classificação de revisão fornecida no dataset. Clique em uma barra
        para filtrar o agente nas demais perspectivas.
      </p>
    </div>
  );
}
