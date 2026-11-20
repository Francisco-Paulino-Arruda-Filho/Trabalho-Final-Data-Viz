import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { Repo } from "../lib/types";

/** Repositórios com mais PRs que isso são "dominantes" (mochi, AGI-Alpha-Agent, gh-aw). */
export const DOMINANT_MIN_PRS = 1000;

export interface Filters {
  agents: string[]; // vazio = todos
  range: [string, string] | null; // datas ISO (brush do calendário)
  language: string | null;
  repo: string | null; // nome "dono/repo"
  starsRange: [number, number] | null; // brush do scatterplot
  hideDominant: boolean;
}

export const EMPTY_FILTERS: Filters = {
  agents: [],
  range: null,
  language: null,
  repo: null,
  starsRange: null,
  hideDominant: false,
};

interface FilterApi {
  filters: Filters;
  /** Muda quando os filtros são zerados; usado para remontar gráficos com brush interno. */
  resetToken: number;
  isFiltered: boolean;
  toggleAgent: (a: string) => void;
  clearAgents: () => void;
  setRange: (r: [string, string] | null) => void;
  toggleLanguage: (l: string) => void;
  toggleRepo: (r: string) => void;
  setStarsRange: (r: [number, number] | null) => void;
  clearStarsRange: () => void;
  setHideDominant: (v: boolean) => void;
  reset: () => void;
}

const Ctx = createContext<FilterApi | null>(null);

function sameTuple<T>(a: [T, T] | null, b: [T, T] | null) {
  return a === b || (!!a && !!b && a[0] === b[0] && a[1] === b[1]);
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [resetToken, setResetToken] = useState(0);

  const toggleAgent = useCallback(
    (a: string) =>
      setFilters((f) => ({
        ...f,
        agents: f.agents.includes(a) ? f.agents.filter((x) => x !== a) : [...f.agents, a],
      })),
    []
  );

  const api = useMemo<FilterApi>(
    () => ({
      filters,
      resetToken,
      isFiltered: JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS),
      toggleAgent,
      clearAgents: () => setFilters((f) => ({ ...f, agents: [] })),
      setRange: (r) => setFilters((f) => (sameTuple(f.range, r) ? f : { ...f, range: r })),
      toggleLanguage: (l) => setFilters((f) => ({ ...f, language: f.language === l ? null : l })),
      toggleRepo: (r) => setFilters((f) => ({ ...f, repo: f.repo === r ? null : r })),
      setStarsRange: (r) =>
        setFilters((f) => (sameTuple(f.starsRange, r) ? f : { ...f, starsRange: r })),
      clearStarsRange: () => {
        setFilters((f) => ({ ...f, starsRange: null }));
        setResetToken((t) => t + 1);
      },
      setHideDominant: (v) => setFilters((f) => ({ ...f, hideDominant: v })),
      reset: () => {
        setFilters(EMPTY_FILTERS);
        setResetToken((t) => t + 1);
      },
    }),
    [filters, resetToken, toggleAgent]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useFilters(): FilterApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFilters deve ser usado dentro de <FilterProvider>");
  return v;
}

/** Um repositório passa pelos filtros globais? (usado por barras, scatterplot e rede) */
export function matchRepo(
  r: Repo,
  f: Filters,
  opts: { ignoreStars?: boolean; ignoreAgents?: boolean } = {}
) {
  if (!opts.ignoreAgents && f.agents.length && !f.agents.includes(r.main_agent)) return false;
  if (f.language && r.language !== f.language) return false;
  if (f.hideDominant && r.n_pr >= DOMINANT_MIN_PRS) return false;
  if (!opts.ignoreStars && f.starsRange && (r.stars < f.starsRange[0] || r.stars > f.starsRange[1]))
    return false;
  return true;
}
