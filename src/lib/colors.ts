
/*
 * PALETA CENTRAL DO PROJETO
 *
 * Todas as visualizações devem importar as cores deste arquivo.
 * Não definir cores individuais de agentes dentro dos componentes.
 */

// ======================================================
// 1. AGENTES
// ======================================================

export const AGENTS = [
  "Claude Code",
  "Codex",
  "Copilot",
  "Cursor",
  "Devin",
  "Jules",
] as const;

export const AGENT_COLORS: Record<string, string> = {
  "Claude Code": "#E69F00",
  Codex: "#0072B2",
  Copilot: "#D55E00",
  Cursor: "#CC79A7",
  Devin: "#009E73",
  Jules: "#56B4E9",
};

// Escala oficial utilizada pelo Vega-Lite
export const agentColorScale = {
  domain: [...AGENTS],
  range: AGENTS.map((agent) => AGENT_COLORS[agent]),
};

// ======================================================
// 2. DESFECHOS DOS PULL REQUESTS
// ======================================================

export const OUTCOMES = [
  "merged",
  "closed",
  "open",
] as const;

export const OUTCOME_COLORS = [
  "#1D6F78", // Merged
  "#C4573A", // Closed
  "#C3C8CF", // Open
];

export const OUTCOME_LABEL_EXPR =
  "{'merged':'Integrado (merge)'," +
  "'closed':'Fechado sem merge'," +
  "'open':'Aberto'}[datum.label]";

// ======================================================
// 3. TIPOS DE REVISÃO
// ======================================================

export const REVIEW_TYPES = [
  "none",
  "bot_only",
  "human",
  "human_changes",
  "unknown",
] as const;

export const REVIEW_TYPE_COLORS: Record<string, string> = {
  none: "#D9E2EC",
  bot_only: "#64748B",
  human: "#168B78",
  human_changes: "#D97706",
  unknown: "#9CA3AF",
};

export const reviewTypeColorScale = {
  domain: [...REVIEW_TYPES],
  range: REVIEW_TYPES.map(
    (type) => REVIEW_TYPE_COLORS[type]
  ),
};

export const REVIEW_TYPE_LABEL_EXPR =
  "{'none':'Sem revisão'," +
  "'bot_only':'Somente bot'," +
  "'human':'Revisão humana'," +
  "'human_changes':'Revisão com alterações'," +
  "'unknown':'Não classificado'}[datum.label]";

// ======================================================
// 4. ESCALAS QUANTITATIVAS
// ======================================================

// Escala contínua compartilhada pelos mapas de calor.
export const SEQUENTIAL_RANGE = [
  "#EEF2F4",
  "#1D6F78",
] as const;

// Cores para marcações neutras.
export const NEUTRAL_COLORS = {
  background: "#F1F5F9",
  grid: "#CBD5E1",
  text: "#334155",
  muted: "#94A3B8",
  selection: "#F59E0B",
};
