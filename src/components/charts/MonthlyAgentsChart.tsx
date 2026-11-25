import { VegaEmbed } from "react-vega"

interface Props {
  data: {
    month: string
    agent: string
    prs: number
  }[]
}

export default function MonthlyAgentsChart({ data }: Props) {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 300,
    data: { values: data },
    mark: {
      type: "line",
      point: true,
      strokeWidth: 2,
    },
    encoding: {
      x: {
        field: "month",
        type: "ordinal",
        title: "Mês",
        sort: "ascending",
      },
      y: {
        field: "prs",
        type: "quantitative",
        title: "Quantidade de PRs",
      },
      color: {
        field: "agent",
        type: "nominal",
        title: "Agente",
      },
      tooltip: [
        { field: "month", title: "Mês" },
        { field: "agent", title: "Agente" },
        { field: "prs", title: "Pull Requests" },
      ],
    },
  }

  return (
    <VegaEmbed
      spec={spec as any}
      options={{
        actions: false,
        renderer: "svg",
        mode: "vega-lite",
      }}
    />
  )
}
