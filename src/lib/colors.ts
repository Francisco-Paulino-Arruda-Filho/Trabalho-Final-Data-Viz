// Paleta única, usada em TODOS os gráficos: o mesmo agente tem sempre a mesma cor.
// Cores baseadas na paleta Okabe-Ito (seguras para daltonismo).
export const AGENTS = ["Claude Code", "Codex", "Copilot", "Cursor", "Devin", "Jules"] as const;

export const AGENT_COLORS: Record<string, string> = {
  "Claude Code": "#E69F00",
  Codex: "#0072B2",
  Copilot: "#D55E00",
  Cursor: "#CC79A7",
  Devin: "#009E73",
  Jules: "#56B4E9",
};

export const agentColorScale = {
  domain: [...AGENTS],
  range: AGENTS.map((a) => AGENT_COLORS[a]),
};

// Desfechos: teal / tijolo / cinza (evita o par verde-vermelho).
export const OUTCOMES = ["merged", "closed", "open"] as const;
export const OUTCOME_COLORS = ["#1d6f78", "#c4573a", "#c3c8cf"];
export const OUTCOME_LABEL_EXPR =
  "{'merged':'Integrado (merge)','closed':'Fechado sem merge','open':'Aberto'}[datum.label]";