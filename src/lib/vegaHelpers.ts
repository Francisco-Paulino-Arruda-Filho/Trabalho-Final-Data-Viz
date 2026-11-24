import { AGENTS } from "./colors";
import type { Repo } from "./types";
import type {
  HoverTarget,
  CompareAgents,
} from "../context/FilterContext";

const AGENT_LIST = AGENTS as readonly string[];

/** Taxa de merge entre PRs já resolvidos (merged / (merged + closed)). */
export function mergeRate(r: Repo): number | null {
  const resolved = r.n_merged + r.n_closed;
  return resolved > 0 ? r.n_merged / resolved : null;
}

export function agentOpacity(
  selected: string[],
  field = "agent",
  comparison: CompareAgents = [null, null],
  hovered: HoverTarget = null
) {
  const compared = comparison.filter(
    (agent): agent is string => Boolean(agent)
  );

  // A comparação com dois agentes tem prioridade
  // sobre o filtro convencional de agentes.
  const focus =
    compared.length === 2
      ? compared
      : selected;

  const hoveredAgent =
    hovered?.kind === "agent"
      ? hovered.value
      : null;

  return {
    field,
    type: "nominal",
    legend: null,

    scale: {
      domain: [...AGENTS],

      range: AGENTS.map((agent) => {
        const matchesSelection =
          focus.length === 0 ||
          focus.includes(agent);

        const matchesHover =
          hoveredAgent === null ||
          hoveredAgent === agent;

        if (!matchesSelection) return 0.12;
        if (!matchesHover) return 0.25;

        return 1;
      }),
    },
  };
}

/** Valor de um item de legenda clicado (ex.: "Codex"), ou null se o clique não foi na legenda. */
export function legendValue(datum: any, item: any): string | null {
  const role: string = item?.mark?.role ?? "";
  return role.startsWith("legend") && typeof datum?.value === "string" ? datum.value : null;
}

/** Agente associado a um clique: legenda, barra, linha ou ponto. */
export function agentFromClick(datum: any, item: any): string | null {
  const lv = legendValue(datum, item);
  if (lv && AGENT_LIST.includes(lv)) return lv;
  const a = datum?.agent ?? datum?.main_agent;
  return typeof a === "string" && AGENT_LIST.includes(a) ? a : null;
}

export function fmtHours(h: number): string {
  const s = h * 3600;
  if (s < 60) return `${Math.round(s)} s`;
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 48) return `${h.toFixed(1).replace(".", ",")} h`;
  return `${(h / 24).toFixed(1).replace(".", ",")} dias`;
}

export const fmtDate = (iso: string) => iso.split("-").reverse().join("/");
export const fmtInt = (n: number) => n.toLocaleString("pt-BR");

export function hoverOpacity(
  hovered: {
    kind: string;
    value: string;
  } | null,
  kind: string,
  field: string
) {
  if (!hovered || hovered.kind !== kind) {
    return { value: 1 };
  }

  return {
    condition: {
      test: `datum.${field} === ${JSON.stringify(hovered.value)}`,
      value: 1,
    },
    value: 0.15,
  };
}