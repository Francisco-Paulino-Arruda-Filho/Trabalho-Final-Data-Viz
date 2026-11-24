
import { AGENT_COLORS } from "../lib/colors";
import { fmtDate, fmtInt } from "../lib/vegaHelpers";
import {
  DOMINANT_MIN_PRS,
  useFilters,
} from "../context/FilterContext";
import type { CompareAgents } from "../context/FilterContext";

interface Chip {
  key: string;
  label: string;
  color?: string;
  onClear: () => void;
  /** Filtro guardado, mas sem efeito no momento. */
  muted?: boolean;
  title?: string;
}

const SLOT_LABEL = ["A", "B"] as const;

export default function FilterBar() {
  const f = useFilters();
  const { filters } = f;

  const chips: Chip[] = [];

  // Agentes da comparação (têm prioridade sobre o filtro de agentes)
  f.compareAgents.forEach((agent, slot) => {
    if (!agent) return;

    chips.push({
      key: `compare-${slot}`,
      label: `Comparação ${SLOT_LABEL[slot]}: ${agent}`,
      color: AGENT_COLORS[agent],
      onClear: () => {
        const next: CompareAgents = [...f.compareAgents];
        next[slot] = null;
        f.setCompareAgents(next);
      },
    });
  });

  // Agentes selecionados
  filters.agents.forEach((agent) =>
    chips.push({
      key: `agent-${agent}`,
      label: agent,
      color: AGENT_COLORS[agent],
      onClear: () => f.toggleAgent(agent),
      muted: f.hasComparison,
      title: f.hasComparison
        ? "Em segundo plano: a comparação tem prioridade. Clique para remover."
        : undefined,
    })
  );

  // Período selecionado
  if (filters.range) {
    chips.push({
      key: "range",
      label: `${fmtDate(filters.range[0])} a ${fmtDate(filters.range[1])}`,
      onClear: () => f.setRange(null),
    });
  }

  // Linguagem selecionada
  if (filters.language) {
    chips.push({
      key: "language",
      label: filters.language,
      onClear: () => f.toggleLanguage(filters.language!),
    });
  }

  // Faixa de estrelas
  if (filters.starsRange) {
    chips.push({
      key: "stars",
      label: `${fmtInt(filters.starsRange[0])} a ${fmtInt(filters.starsRange[1])} estrelas`,
      onClear: f.clearStarsRange,
    });
  }

  // Repositório selecionado
  if (filters.repo) {
    chips.push({
      key: "repo",
      label: filters.repo,
      onClear: () => f.toggleRepo(filters.repo!),
    });
  }

  // Quantidade total de filtros ativos
  const activeCount =
    chips.length + (filters.hideDominant ? 1 : 0);

  const hasActiveFilters = activeCount > 0;

  return (
    <div
      className="filterbar"
      role="region"
      aria-label="Filtros ativos"
    >
      <div className="filterbar-top">

        <div className="chips">
          {!hasActiveFilters && (
            <span className="hint">
              Clique em barras, legendas e nós da rede,
              ou arraste no calendário e nos gráficos,
              para explorar as visões coordenadas.
            </span>
          )}

          {chips.map((chip) => (
            <button
              key={chip.key}
              className="chip"
              style={chip.muted ? { opacity: 0.5 } : undefined}
              onClick={chip.onClear}
              title={chip.title ?? `Remover filtro: ${chip.label}`}
              aria-label={`Remover filtro ${chip.label}`}
            >
              {chip.color && (
                <span
                  className="dot"
                  style={{ background: chip.color }}
                />
              )}

              {chip.label}

              <span aria-hidden="true"> ×</span>
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <span
            className="filter-count"
            aria-live="polite"
          >
            {activeCount}{" "}
            {activeCount === 1
              ? "filtro ativo"
              : "filtros ativos"}
          </span>
        )}
      </div>

      <div className="filterbar-controls">

        <label className="check">
          <input
            type="checkbox"
            checked={filters.hideDominant}
            onChange={(e) =>
              f.setHideDominant(e.target.checked)
            }
          />

          Ocultar repositórios dominantes
          (≥ {fmtInt(DOMINANT_MIN_PRS)} PRs)
        </label>

        {f.isFiltered && (
          <button
            className="link-btn"
            onClick={f.reset}
            title="Remover todos os filtros"
          >
            Limpar tudo
          </button>
        )}

      </div>
    </div>
  );
}
