import { AGENTS } from "./colors";
import type { Repo } from "./types";

const AGENT_LIST = AGENTS as readonly string[];

/** Taxa de merge entre PRs já resolvidos (merged / (merged + closed)). */
export function mergeRate(r: Repo): number | null {
  const resolved = r.n_merged + r.n_closed;
  return resolved > 0 ? r.n_merged / resolved : null;
}

/**
 * Canal de opacidade por agente: agentes fora da seleção ficam esmaecidos.
 * Não altera os dados, só a escala — por isso é barato recalcular o spec.
 */
export function agentOpacity(selected: string[], field = "agent") {
  const dim = selected.length > 0;
  return {
    field,
    type: "nominal",
    legend: null,
    scale: {
      domain: [...AGENTS],
      range: AGENTS.map((a) => (!dim || selected.includes(a) ? 1 : 0.15)),
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