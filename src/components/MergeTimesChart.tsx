
import VegaChart from "./VegaChart";
import { agentColorScale } from "../lib/colors";

interface Props {
  data: {
    summary: any[];
    ecdf: any[];
  };
}

export default function MergeTimesChart({ data }: Props) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 300,
    data: {
      values: data.ecdf
    },
    mark: {
      type: "line",
      strokeWidth: 2
    },
    encoding: {
      x: {
        field: "ttm_hours",
        type: "quantitative",
        title: "Tempo até merge (horas)",
        scale: { type: "log" }
      },
      y: {
        field: "probability",
        type: "quantitative",
        title: "Proporção acumulada",
        scale: { domain: [0, 1] },
        axis: { format: "%" }
      },
      color: {
        field: "agent",
        type: "nominal",
        title: "Agente",
        scale: agentColorScale
      },
      tooltip: [
        { field: "agent", title: "Agente" },
        {
          field: "ttm_hours",
          title: "Tempo (horas)",
          format: ".2f"
        },
        {
          field: "probability",
          title: "Proporção",
          format: ".1%"
        }
      ]
    }
  };

  return <VegaChart spec={spec} />;
}
