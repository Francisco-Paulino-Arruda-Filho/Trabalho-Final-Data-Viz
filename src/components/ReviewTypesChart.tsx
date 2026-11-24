
import { useMemo, useState } from "react";

import VegaChart from "./VegaChart";

import type { ReviewTypeRow } from "../lib/types";

import {
  AGENTS,
  REVIEW_TYPES,
  reviewTypeColorScale,
  REVIEW_TYPE_LABEL_EXPR,
} from "../lib/colors";

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

type Mode = "percent" | "count";

// ======================================================
// 2. COMPONENTE
// ======================================================

export default function ReviewTypesChart({
  data,
}: {
  data: ReviewTypeRow[];
}) {
  const {
    focusAgents,
    toggleAgent,
  } = useFilters();

  const [mode, setMode] = useState<Mode>("percent");

  // ====================================================
  // 3. PREPARAÇÃO DOS DADOS
  // ====================================================

  const rows = useMemo(
    () =>
      data.map((row) => ({
        ...row,
        reviewOrder: REVIEW_TYPES.indexOf(
          row.review_type as (typeof REVIEW_TYPES)[number]
        ),
      })),
    [data]
  );

  // ====================================================
  // 5. ESPECIFICAÇÃO VEGA-LITE
  // ====================================================

  const spec = useMemo(() => {
    const percentage = mode === "percent";

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
          sort: [...AGENTS],
          title: null,
        },

        x: {
          field: "count",
          type: "quantitative",

          stack: percentage
            ? "normalize"
            : "zero",

          title: percentage
            ? "Proporção dos PRs do agente"
            : "Quantidade de PRs",

          axis: {
            format: percentage ? "%" : "~s",
          },
        },

        color: {
          field: "review_type",
          type: "nominal",
          title: "Tipo de revisão",

          scale: reviewTypeColorScale,

          legend: {
            labelExpr: REVIEW_TYPE_LABEL_EXPR,
          },
        },

        order: {
          field: "reviewOrder",
          type: "quantitative",
        },

        // Dirigida pelos params focusAgents / hoverAgent.
        opacity: agentOpacity(),
      },

      layer: [
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
                field: "review_type",
                title: "Tipo de revisão",
                type: "nominal",
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
                title: "Total de PRs do agente",
                format: ",",
              },
            ],
          },
        },
      ],
    };
  }, [rows, mode]);

  // ====================================================
  // 6. EVENTOS
  // ====================================================

  function handleAgentHover(datum: unknown, item: unknown) {
    setHoveredAgent(agentFromClick(datum, item));
  }

  // ====================================================
  // 7. RENDERIZAÇÃO
  // ====================================================

  return (
    <div>
      <div
        className="seg"
        role="group"
        aria-label="Escala dos tipos de revisão"
      >
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
          const agent = agentFromClick(datum, item);

          if (agent) {
            toggleAgent(agent);
          }
        }}
        onHover={handleAgentHover}
      />

      <p className="note">
        As categorias representam a classificação de revisão
        fornecida no dataset. Passe o mouse sobre um agente
        para destacá-lo nas demais perspectivas ou clique
        para filtrar o agente.
      </p>
    </div>
  );
}
