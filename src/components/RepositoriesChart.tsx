import { useMemo } from "react";
import VegaChart from "./VegaChart";
import type { Repo } from "../lib/types";
import { agentColorScale } from "../lib/colors";
import { agentFromClick, legendValue, mergeRate } from "../lib/vegaHelpers";
import { matchRepo, useFilters } from "../context/FilterContext";

const TOP_N = 15;

export default function RepositoriesChart({ data }: { data: Repo[] }) {
  const { filters, toggleRepo, toggleAgent } = useFilters();
  const { agents, language, starsRange, hideDominant, repo } = filters;

  const { top, matches } = useMemo(() => {
    const ok = data.filter((r) => matchRepo(r, filters));
    const top = [...ok]
      .sort((a, b) => b.n_pr - a.n_pr)
      .slice(0, TOP_N)
      .map((r) => ({ ...r, rate: mergeRate(r) }));
    return { top, matches: ok.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, agents, language, starsRange, hideDominant]);

  const spec = useMemo(() => {
    const opacity = repo
      ? { condition: { test: `datum.repo === ${JSON.stringify(repo)}`, value: 1 }, value: 0.35 }
      : { value: 1 };
    return {
      width: "container",
      height: { step: 22 },
      data: { values: top },
      encoding: {
        y: {
          field: "repo",
          type: "nominal",
          sort: top.map((r) => r.repo),
          title: null,
          axis: { labelLimit: 260 },
        },
        x: { field: "n_pr", type: "quantitative", title: "Pull requests", axis: { format: "~s" } },
        color: { field: "main_agent", type: "nominal", title: "Agente principal", scale: agentColorScale },
        opacity,
      },
      layer: [
        {
          mark: { type: "bar", cursor: "pointer" },
          encoding: {
            tooltip: [
              { field: "repo", title: "Repositório" },
              { field: "n_pr", title: "PRs", format: "," },
              { field: "main_agent", title: "Agente principal" },
              { field: "rate", title: "Taxa de merge (entre resolvidos)", format: ".1%" },
              { field: "stars", title: "Estrelas", format: "," },
              { field: "language", title: "Linguagem" },
              { field: "pct_human_review", title: "Com review humano", format: ".0%" },
            ],
          },
        },
        {
          mark: { type: "text", align: "left", dx: 4, fontSize: 11 },
          encoding: { text: { field: "n_pr", type: "quantitative", format: "," }, color: { value: "#334155" } },
        },
      ],
    };
  }, [top, repo]);

  return (
    <div>
      {top.length === 0 ? (
        <p className="empty">Nenhum repositório atende aos filtros atuais.</p>
      ) : (
        <VegaChart
          spec={spec}
          onClick={(d, item) => {
            if (legendValue(d, item)) {
              const a = agentFromClick(d, item);
              if (a) toggleAgent(a);
            } else if (d?.repo) toggleRepo(d.repo);
          }}
        />
      )}
      <p className="note">
        Top {Math.min(TOP_N, top.length)} de {matches.toLocaleString("pt-BR")} repositórios que
        atendem aos filtros. Clique numa barra para destacar o repositório nas outras visões.
      </p>
    </div>
  );
}
