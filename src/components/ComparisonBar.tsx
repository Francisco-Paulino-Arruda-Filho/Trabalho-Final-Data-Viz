import { AGENTS, AGENT_COLORS } from "@/lib/colors"
import { useFilters } from "@/context/FilterContext"
import type { CompareAgents } from "@/context/FilterContext"

const SLOTS = [
  { slot: 0 as const, label: "Agente A" },
  { slot: 1 as const, label: "Agente B" },
]

export default function ComparisonBar() {
  const { compareAgents, setCompareAgents, clearComparison, hasComparison, filters } = useFilters()

  function update(slot: 0 | 1, value: string) {
    const next: CompareAgents = [...compareAgents]

    next[slot] = value || null

    setCompareAgents(next)
  }

  // O filtro de agentes continua guardado, mas fica em
  // segundo plano enquanto houver comparação.
  const overridesFilter = hasComparison && filters.agents.length > 0

  return (
    <div className="comparison-bar">
      <strong>Comparar agentes</strong>

      {SLOTS.map(({ slot, label }) => {
        const current = compareAgents[slot]
        const other = compareAgents[slot === 0 ? 1 : 0]

        return (
          <label key={slot}>
            {current && (
              <span
                className="dot"
                aria-hidden="true"
                style={{ background: AGENT_COLORS[current] }}
              />
            )}

            {label}

            <select value={current ?? ""} onChange={(e) => update(slot, e.target.value)}>
              <option value="">Selecionar agente</option>

              {AGENTS.map((agent) => (
                <option
                  key={agent}
                  value={agent}
                  // Não deixa comparar um agente com ele mesmo.
                  disabled={agent === other}
                >
                  {agent}
                </option>
              ))}
            </select>
          </label>
        )
      })}

      {hasComparison && (
        <button className="link-btn" onClick={clearComparison}>
          Limpar comparação
        </button>
      )}

      {hasComparison && compareAgents.some((a) => !a) && (
        <span className="hint">Escolha o segundo agente para comparar.</span>
      )}

      {overridesFilter && (
        <span className="hint">A comparação tem prioridade sobre o filtro de agentes.</span>
      )}
    </div>
  )
}
