
import { useMemo } from "react";

import VegaChart from "./VegaChart";

import type { MergeTimesData } from "../lib/types";

import { agentColorScale } from "../lib/colors";

import {
  agentFromClick,
  agentOpacity,
} from "../lib/vegaHelpers";

import { useFilters } from "../context/FilterContext";

interface Props {
  data: MergeTimesData;
}

export default function MergeTimesChart({ data }: Props) {
  const { filters, toggleAgent } = useFilters();

  const spec = useMemo(
    () => ({
      width: "container",
      height: 300,

      data: {
        values: data.ecdf,
      },

      mark: {
        type: "line",
        strokeWidth: 2,
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

        opacity: agentOpacity(filters.agents),

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
    }),
    [data, filters.agents]
  );

  return (
    <VegaChart
      spec={spec}
      onClick={(datum, item) => {
        const agent = agentFromClick(datum, item);

        if (agent) {
          toggleAgent(agent);
        }
      }}
    />
  );
}