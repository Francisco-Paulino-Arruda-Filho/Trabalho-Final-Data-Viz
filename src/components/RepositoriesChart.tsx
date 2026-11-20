
import VegaChart from "./VegaChart";

interface Props {
  data: any[];
}

export default function RepositoriesChart({ data }: Props) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 400,
    data: { values: data },
    transform: [
      {
        window: [
          { op: "rank", as: "position" }
        ],
        sort: [
          { field: "n_pr", order: "descending" }
        ]
      },
      {
        filter: "datum.position <= 15"
      }
    ],
    mark: "bar",
    encoding: {
      y: {
        field: "repo",
        type: "nominal",
        sort: "-x",
        title: "Repositório"
      },
      x: {
        field: "n_pr",
        type: "quantitative",
        title: "Quantidade de PRs"
      },
      color: {
        field: "main_agent",
        type: "nominal",
        title: "Agente principal"
      },
      tooltip: [
        { field: "repo", title: "Repositório" },
        { field: "n_pr", title: "Pull Requests" },
        { field: "main_agent", title: "Agente principal" },
        { field: "stars", title: "Estrelas" }
      ]
    }
  };

  return <VegaChart spec={spec} />;
}
