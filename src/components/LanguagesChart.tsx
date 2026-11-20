import { useMemo } from "react";
import VegaChart from "./VegaChart";
import type { LanguageRow } from "../lib/types";
import { AGENTS } from "../lib/colors";
import { useFilters } from "../context/FilterContext";

const MIN_RESOLVED = 30; // abaixo disso a célula é marcada com * e esmaecida
const LAST = ["Outras", "Desconhecida"]; // categorias residuais ficam no fim

interface Cell {
  language: string;
  agent: string;
  merged: number;
  closed: number;
  open: number;
  resolved: number;
  rate: number;
  small: boolean;
}

export default function LanguagesChart({ data }: { data: LanguageRow[] }) {
  const { filters, toggleLanguage } = useFilters();
  const { agents, language } = filters;

  const { cells, langOrder } = useMemo(() => {
    const map = new Map<string, Cell>();
    data.forEach((r) => {
      const k = `${r.language}|${r.agent}`;
      const c =
        map.get(k) ??
        ({ language: r.language, agent: r.agent, merged: 0, closed: 0, open: 0 } as Cell);
      c[r.outcome] += r.count;
      map.set(k, c);
    });
    const totals = new Map<string, number>();
    const cells: Cell[] = [];
    map.forEach((c) => {
      c.resolved = c.merged + c.closed;
      totals.set(c.language, (totals.get(c.language) ?? 0) + c.merged + c.closed + c.open);
      if (c.resolved === 0) return;
      c.rate = c.merged / c.resolved;
      c.small = c.resolved < MIN_RESOLVED;
      cells.push(c);
    });
    const real = [...totals.keys()].filter((l) => !LAST.includes(l));
    real.sort((a, b) => (totals.get(b) ?? 0) - (totals.get(a) ?? 0));
    return { cells, langOrder: [...real, ...LAST.filter((l) => totals.has(l))] };
  }, [data]);

  // Campos derivados dos filtros: opacidade, contorno da linguagem selecionada, rótulo.
  const rows = useMemo(
    () =>
      cells.map((c) => {
        let op = c.small ? 0.55 : 1;
        if (agents.length && !agents.includes(c.agent)) op *= 0.25;
        if (language && c.language !== language) op *= 0.4;
        const pct = Math.round(c.rate * 100);
        return {
          ...c,
          op,
          selw: language && c.language === language ? 2.5 : 0,
          label: c.small ? `${pct}*` : `${pct}`,
          tc: c.rate > 0.62 ? "#ffffff" : "#1f2933",
        };
      }),
    [cells, agents, language]
  );

  const spec = useMemo(
    () => ({
      width: "container",
      height: { step: 26 },
      data: { values: rows },
      encoding: {
        x: {
          field: "agent",
          type: "nominal",
          sort: [...AGENTS],
          title: null,
          axis: { orient: "top", labelAngle: 0, labelFontSize: 12 },
        },
        y: { field: "language", type: "nominal", sort: langOrder, title: null },
      },
      layer: [
        {
          mark: { type: "rect", cursor: "pointer", stroke: "#111827" },
          encoding: {
            color: {
              field: "rate",
              type: "quantitative",
              title: "Taxa de merge",
              scale: { domain: [0, 1], range: ["#eef2f4", "#1d6f78"] },
              legend: { format: "%", gradientLength: 140 },
            },
            opacity: { field: "op", type: "quantitative", scale: null },
            strokeWidth: { field: "selw", type: "quantitative", scale: null },
            tooltip: [
              { field: "language", title: "Linguagem" },
              { field: "agent", title: "Agente" },
              { field: "rate", title: "Taxa de merge (entre resolvidos)", format: ".1%" },
              { field: "merged", title: "Integrados", format: "," },
              { field: "closed", title: "Fechados sem merge", format: "," },
              { field: "open", title: "Abertos", format: "," },
            ],
          },
        },
        {
          mark: { type: "text", fontSize: 11 },
          encoding: {
            text: { field: "label", type: "nominal" },
            color: { field: "tc", type: "nominal", scale: null },
            opacity: { field: "op", type: "quantitative", scale: null },
          },
        },
      ],
    }),
    [rows, langOrder]
  );

  return (
    <div>
      <VegaChart
        spec={spec}
        onClick={(d) => {
          if (d?.language) toggleLanguage(d.language);
        }}
      />
      <p className="note">
        Cada célula é a taxa de merge (%) entre PRs resolvidos. * = menos de {MIN_RESOLVED} PRs
        resolvidos: leia com cautela. Clique numa linha para filtrar por linguagem.
      </p>
    </div>
  );
}