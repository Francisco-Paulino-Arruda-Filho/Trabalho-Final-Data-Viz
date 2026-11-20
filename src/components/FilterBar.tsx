import { AGENT_COLORS } from "../lib/colors";
import { fmtDate, fmtInt } from "../lib/vegaHelpers";
import { DOMINANT_MIN_PRS, useFilters } from "../context/FilterContext";

interface Chip {
  key: string;
  label: string;
  color?: string;
  onClear: () => void;
}

export default function FilterBar() {
  const f = useFilters();
  const { filters } = f;

  const chips: Chip[] = [];
  filters.agents.forEach((a) =>
    chips.push({ key: `a-${a}`, label: a, color: AGENT_COLORS[a], onClear: () => f.toggleAgent(a) })
  );
  if (filters.range)
    chips.push({
      key: "range",
      label: `${fmtDate(filters.range[0])} a ${fmtDate(filters.range[1])}`,
      onClear: () => f.setRange(null),
    });
  if (filters.language)
    chips.push({ key: "lang", label: filters.language, onClear: () => f.toggleLanguage(filters.language!) });
  if (filters.starsRange)
    chips.push({
      key: "stars",
      label: `${fmtInt(filters.starsRange[0])} a ${fmtInt(filters.starsRange[1])} estrelas`,
      onClear: f.clearStarsRange,
    });
  if (filters.repo)
    chips.push({ key: "repo", label: filters.repo, onClear: () => f.toggleRepo(filters.repo!) });

  return (
    <div className="filterbar" role="region" aria-label="Filtros ativos">
      <div className="chips">
        {chips.length === 0 && (
          <span className="hint">
            Clique em barras, legendas e nós da rede, ou arraste no calendário e no scatterplot,
            para filtrar todas as visões.
          </span>
        )}
        {chips.map((c) => (
          <button key={c.key} className="chip" onClick={c.onClear} title="Remover filtro">
            {c.color && <span className="dot" style={{ background: c.color }} />}
            {c.label}
            <span aria-hidden="true"> ×</span>
          </button>
        ))}
      </div>
      <label className="check">
        <input
          type="checkbox"
          checked={filters.hideDominant}
          onChange={(e) => f.setHideDominant(e.target.checked)}
        />
        Ocultar repositórios dominantes (≥ {fmtInt(DOMINANT_MIN_PRS)} PRs)
      </label>
      {f.isFiltered && (
        <button className="link-btn" onClick={f.reset}>
          Limpar tudo
        </button>
      )}
    </div>
  );
}
