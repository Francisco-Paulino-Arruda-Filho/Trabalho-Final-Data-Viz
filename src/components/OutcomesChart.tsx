
import VegaChart from "./VegaChart";

interface Props {
  data: any[];
}

export default function OutcomesChart({ data }: Props) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 300,
    data: { values: data },
    mark: "bar",
    encoding: {
      x: {
        field: "agent",
        type: "nominal",
        title: "Agente",
        axis: { labelAngle: -30 }
      },
      y: {
        field: "count",
        type: "quantitative",
        title: "Quantidade de PRs",
        stack: "zero"
      },
      color: {
        field: "outcome",
        type: "nominal",
        title: "Resultado",
        scale: {
          domain: ["merged", "closed", "open"],
          range: ["#22c55e", "#ef4444", "#eab308"]
        }
      },
      tooltip: [
        { field: "agent", title: "Agente" },
        { field: "outcome", title: "Resultado" },
        { field: "count", title: "Quantidade" },
        {
          field: "percentage",
          title: "Percentual",
          format: ".2f"
        }
      ]
    }
  };

  return <VegaChart spec={spec} />;
}
