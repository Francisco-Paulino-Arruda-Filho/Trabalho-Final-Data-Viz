import { AGENTS } from "@/lib/colors"
import type { Repo } from "@/lib/types"
const AGENT_LIST = AGENTS as readonly string[]

/** Taxa de merge entre PRs já resolvidos (merged / (merged + closed)). */
export function mergeRate(r: Repo): number | null {
  const resolved = r.n_merged + r.n_closed
  return resolved > 0 ? r.n_merged / resolved : null
}

/**
 * Parâmetros do Vega-Lite que controlam o destaque de agentes.
 *
 * Coloque em `params` no nível raiz do spec. Os valores NÃO fazem parte
 * do spec: o VegaChart os atualiza com view.signal(...), então mudar
 * hover, filtro ou comparação não recria o gráfico (e preserva brushes).
 *
 * - focusAgents: agentes em foco (comparação ou filtro). Vazio = todos.
 * - hoverAgent: agente sob o mouse em qualquer gráfico. null = nenhum.
 */
export const AGENT_FOCUS_PARAMS = [
  { name: "focusAgents", value: [] as string[] },
  { name: "hoverAgent", value: null as string | null },
]

/**
 * Codificação de opacidade por agente, dirigida pelos parâmetros acima.
 * O spec resultante é sempre o mesmo, independente do estado.
 */
export function agentOpacity(field = "agent") {
  const agent = `datum["${field}"]`

  return {
    condition: [
      {
        test: `length(focusAgents) > 0 && indexof(focusAgents, ${agent}) < 0`,
        value: 0.12,
      },
      {
        test: `hoverAgent != null && ${agent} != hoverAgent`,
        value: 0.25,
      },
    ],
    value: 1,
  }
}

/** Valor de um item de legenda clicado (ex.: "Codex"), ou null se o clique não foi na legenda. */
export function legendValue(datum: any, item: any): string | null {
  const role: string = item?.mark?.role ?? ""
  return role.startsWith("legend") && typeof datum?.value === "string" ? datum.value : null
}

/** Agente associado a um clique: legenda, barra, linha ou ponto. */
export function agentFromClick(datum: any, item: any): string | null {
  const lv = legendValue(datum, item)
  if (lv && AGENT_LIST.includes(lv)) return lv
  const a = datum?.agent ?? datum?.main_agent
  return typeof a === "string" && AGENT_LIST.includes(a) ? a : null
}

export function fmtHours(h: number): string {
  const s = h * 3600
  if (s < 60) return `${Math.round(s)} s`
  if (h < 1) return `${Math.round(h * 60)} min`
  if (h < 48) return `${h.toFixed(1).replace(".", ",")} h`
  return `${(h / 24).toFixed(1).replace(".", ",")} dias`
}

export const fmtDate = (iso: string) => iso.split("-").reverse().join("/")
export const fmtInt = (n: number) => n.toLocaleString("pt-BR")
