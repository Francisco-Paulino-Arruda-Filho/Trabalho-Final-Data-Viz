
import { AGENTS } from "../lib/colors";
import { useFilters } from "../context/FilterContext";

export default function ComparisonBar() {
  const {
    compareAgents,
    setCompareAgents,
  } = useFilters();

  function update(slot: 0 | 1, value: string) {
    const next: [string | null, string | null] = [
      ...compareAgents,
    ];

    next[slot] = value || null;

    // Impede comparar um agente com ele mesmo.
    if (
      next[0] &&
      next[0] === next[1]
    ) {
      next[slot] = null;
    }

    setCompareAgents(next);
  }

  const active = compareAgents.every(Boolean);

  return (
    <div className="comparison-bar">
      <strong>Comparar agentes</strong>

      <label>
        Agente A

        <select
          value={compareAgents[0] ?? ""}
          onChange={(e) => update(0, e.target.value)}
        >
          <option value="">Selecionar agente</option>

          {AGENTS.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </label>

      <label>
        Agente B

        <select
          value={compareAgents[1] ?? ""}
          onChange={(e) => update(1, e.target.value)}
        >
          <option value="">Selecionar agente</option>

          {AGENTS.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </label>

      {active && (
        <button
          className="link-btn"
          onClick={() => setCompareAgents([null, null])}
        >
          Limpar comparação
        </button>
      )}
    </div>
  );
}
