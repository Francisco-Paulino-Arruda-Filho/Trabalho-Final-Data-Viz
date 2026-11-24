
import { useMemo } from "react";

import VegaChart from "./VegaChart";

import type { MergeTimesData } from "../lib/types";

import { agentColorScale } from "../lib/colors";

import {
  agentFromClick,
  agentOpacity,
} from "../lib/vegaHelpers";

import { useFilters } from "../context/FilterContext";

// ======================================================
// 1. COMPONENTE
// ======================================================

interface Props {
  data: MergeTimesData;
}

export default function MergeTimesChart({
  data,
}: Props) {
  const {
    filters,
    toggleAgent,
    compareAgents,
    hovered,
    setHovered,
  } = useFilters();

  const { agents } = filters;

  // ====================================================
  // 2. ESPECIFICAÇÃO VEGA-LITE
  // ====================================================

  const spec = useMemo(() => {
    return {
      width: "container",
      height: 300,

      data: {
        values: data.ecdf,
      },

      mark: {
        type: "line",
        strokeWidth: 2,
        cursor: "pointer",
      },

      encoding: {
        x: {
          field: "ttm_hours",
          type: "quantitative",

          title: "Tempo até merge (horas)",

          scale: {
            type: "log",
          },
        },

        y: {
          field: "probability",
          type: "quantitative",

          title: "Proporção acumulada",

          scale: {
            domain: [0, 1],
          },

          axis: {
            format: "%",
          },
        },

        color: {
          field: "agent",
          type: "nominal",
          title: "Agente",
          scale: agentColorScale,
        },

        opacity: agentOpacity(
          agents,
          "agent",
          compareAgents,
          hovered
        ),

        tooltip: [
          {
            field: "agent",
            title: "Agente",
          },
          {
            field: "ttm_hours",
            title: "Tempo (horas)",
            format: ".2f",
          },
          {
            field: "probability",
            title: "Proporção",
            format: ".1%",
          },
        ],
      },
    };
  }, [
    data.ecdf,
    agents,
    compareAgents,
    hovered,
  ]);

  // ====================================================
  // 3. EVENTOS
  // ====================================================

  function handleAgentHover(datum: any, item: any) {
    const agent = agentFromClick(datum, item);

    setHovered(
      agent
        ? {
            kind: "agent",
            value: agent,
          }
        : null
    );
  }

  // ====================================================
  // 4. RENDERIZAÇÃO
  // ====================================================

  return (
    <VegaChart
      spec={spec}
      onClick={(datum, item) => {
        const agent = agentFromClick(datum, item);

        if (agent) {
          toggleAgent(agent);
        }
      }}
      onHover={handleAgentHover}
    />
  );
}