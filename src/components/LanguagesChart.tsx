
import VegaChart from "./VegaChart";

interface Props {
  data: any[];
}

export default function LanguagesChart({ data }: Props) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 350,
    data: { values: data },
    transform: [
      {
        filter: "datum.outcome === 'merged'"
      }
    ],
    mark: "bar",
    encoding: {
      y: {
        field: "language",
        type: "nominal",
        title: "Linguagem",
        sort: "-x"
      },
      x: {
        field: "count",
        type: "quantitative",
        title: "PRs integrados"
      },
      color: {
        field: "agent",
        type: "nominal",
        title: "Agente"
      },
      tooltip: [
        { field: "language", title: "Linguagem" },
        { field: "agent", title: "Agente" },
        { field: "count", title: "PRs integrados" }
      ]
    }
  };

  return <VegaChart spec={spec} />;
}
