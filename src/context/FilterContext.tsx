
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { Repo } from "../lib/types";

// ======================================================
// 1. CONFIGURAÇÕES
// ======================================================

/**
 * Repositórios com mais PRs que esse valor
 * são considerados dominantes.
 *
 * Exemplos: mochi, AGI-Alpha-Agent e gh-aw.
 */
export const DOMINANT_MIN_PRS = 1000;

// ======================================================
// 2. FILTROS GLOBAIS
// ======================================================

export interface Filters {
  agents: string[];
  range: [string, string] | null;
  language: string | null;
  repo: string | null;
  starsRange: [number, number] | null;
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

// ======================================================
// 3. HOVER GLOBAL
// ======================================================

export type HoverTarget =
  | {
      kind: "agent" | "language" | "repo";
      value: string;
    }
  | null;

// ======================================================
// 4. COMPARAÇÃO ENTRE AGENTES
// ======================================================

export type CompareAgents = [
  string | null,
  string | null
];

// ======================================================
// 5. INTERFACE DO CONTEXTO
// ======================================================

interface FilterApi {
  // Filtros globais
  filters: Filters;
  resetToken: number;
  isFiltered: boolean;

  // Ações dos filtros
  toggleAgent: (agent: string) => void;
  clearAgents: () => void;
  setRange: (range: [string, string] | null) => void;
  toggleLanguage: (language: string) => void;
  toggleRepo: (repo: string) => void;
  setStarsRange: (range: [number, number] | null) => void;
  clearStarsRange: () => void;
  setHideDominant: (value: boolean) => void;
  reset: () => void;

  // Hover global
  hovered: HoverTarget;
  setHovered: (target: HoverTarget) => void;

  // Comparação entre agentes
  compareAgents: CompareAgents;
  setCompareAgents: (agents: CompareAgents) => void;
  hasComparison: boolean;
}

// ======================================================
// 6. CRIAÇÃO DO CONTEXTO
// ======================================================

const Ctx = createContext<FilterApi | null>(null);

// ======================================================
// 7. FUNÇÕES AUXILIARES
// ======================================================

/**
 * Verifica se duas tuplas possuem os mesmos valores.
 */
function sameTuple<T>(
  a: [T, T] | null,
  b: [T, T] | null
): boolean {
  return (
    a === b ||
    (
      !!a &&
      !!b &&
      a[0] === b[0] &&
      a[1] === b[1]
    )
  );
}

// ======================================================
// 8. PROVIDER
// ======================================================

export function FilterProvider({
  children,
}: {
  children: ReactNode;
}) {

  // ====================================================
  // 8.1. ESTADOS DOS FILTROS
  // ====================================================

  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
  });

  /**
   * Muda quando os filtros são zerados.
   * Utilizado para remontar gráficos com brushes internos.
   */
  const [resetToken, setResetToken] = useState(0);

  // ====================================================
  // 8.2. ESTADO DE HOVER
  // ====================================================

  const [hovered, setHovered] = useState<HoverTarget>(null);

  // ====================================================
  // 8.3. ESTADO DE COMPARAÇÃO
  // ====================================================

  const [compareAgents, setCompareAgentsState] =
    useState<CompareAgents>([null, null]);

  /**
   * Atualiza os dois agentes da comparação.
   *
   * Impede comparar o mesmo agente consigo próprio.
   */
  const setCompareAgents = useCallback(
    (agents: CompareAgents) => {
      const [first, second] = agents;

      setCompareAgentsState([
        first ?? null,
        second && second !== first
          ? second
          : null,
      ]);
    },
    []
  );

  /**
   * Indica se existe alguma seleção no modo de comparação.
   * A comparação efetiva acontece quando os dois agentes
   * estão selecionados.
   */
  const hasComparison = Boolean(
    compareAgents[0] || compareAgents[1]
  );

  // ====================================================
  // 9. FILTRO DE AGENTES
  // ====================================================

  const toggleAgent = useCallback((agent: string) => {
    setFilters((f) => ({
      ...f,
      agents: f.agents.includes(agent)
        ? f.agents.filter((x) => x !== agent)
        : [...f.agents, agent],
    }));
  }, []);

  const clearAgents = useCallback(() => {
    setFilters((f) => ({
      ...f,
      agents: [],
    }));
  }, []);

  // ====================================================
  // 10. FILTRO DE PERÍODO
  // ====================================================

  const setRange = useCallback(
    (range: [string, string] | null) => {
      setFilters((f) =>
        sameTuple(f.range, range)
          ? f
          : {
              ...f,
              range,
            }
      );
    },
    []
  );

  // ====================================================
  // 11. FILTRO DE LINGUAGEM
  // ====================================================

  const toggleLanguage = useCallback(
    (language: string) => {
      setFilters((f) => ({
        ...f,
        language:
          f.language === language
            ? null
            : language,
      }));
    },
    []
  );

  // ====================================================
  // 12. FILTRO DE REPOSITÓRIO
  // ====================================================

  const toggleRepo = useCallback((repo: string) => {
    setFilters((f) => ({
      ...f,
      repo: f.repo === repo
        ? null
        : repo,
    }));
  }, []);

  // ====================================================
  // 13. FILTRO DE ESTRELAS
  // ====================================================

  const setStarsRange = useCallback(
    (range: [number, number] | null) => {
      setFilters((f) =>
        sameTuple(f.starsRange, range)
          ? f
          : {
              ...f,
              starsRange: range,
            }
      );
    },
    []
  );

  const clearStarsRange = useCallback(() => {
    setFilters((f) => ({
      ...f,
      starsRange: null,
    }));

    // Reinicia brushes internos.
    setResetToken((t) => t + 1);
  }, []);

  // ====================================================
  // 14. OCULTAR REPOSITÓRIOS DOMINANTES
  // ====================================================

  const setHideDominant = useCallback(
    (value: boolean) => {
      setFilters((f) => ({
        ...f,
        hideDominant: value,
      }));
    },
    []
  );

  // ====================================================
  // 15. VERIFICAÇÃO DE FILTROS ATIVOS
  // ====================================================

  const isFiltered =
    filters.agents.length > 0 ||
    filters.range !== null ||
    filters.language !== null ||
    filters.repo !== null ||
    filters.starsRange !== null ||
    filters.hideDominant;

  // ====================================================
  // 16. LIMPAR TUDO
  // ====================================================

  const reset = useCallback(() => {

    // Limpa os filtros globais.
    setFilters({
      ...EMPTY_FILTERS,
      agents: [],
    });

    // Remove o destaque temporário.
    setHovered(null);

    // Remove os agentes da comparação.
    setCompareAgentsState([null, null]);

    // Reinicia os brushes internos.
    setResetToken((t) => t + 1);

  }, []);

  // ====================================================
  // 17. DISPONIBILIZAÇÃO DA API
  // ====================================================

  const api = useMemo<FilterApi>(
    () => ({
      // Filtros
      filters,
      resetToken,
      isFiltered,

      // Ações dos filtros
      toggleAgent,
      clearAgents,
      setRange,
      toggleLanguage,
      toggleRepo,
      setStarsRange,
      clearStarsRange,
      setHideDominant,
      reset,

      // Hover
      hovered,
      setHovered,

      // Comparação
      compareAgents,
      setCompareAgents,
      hasComparison,
    }),
    [
      filters,
      resetToken,
      isFiltered,

      toggleAgent,
      clearAgents,
      setRange,
      toggleLanguage,
      toggleRepo,
      setStarsRange,
      clearStarsRange,
      setHideDominant,
      reset,

      hovered,
      compareAgents,
      setCompareAgents,
      hasComparison,
    ]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
    </Ctx.Provider>
  );
}

// ======================================================
// 18. HOOK DE ACESSO AO CONTEXTO
// ======================================================

export function useFilters(): FilterApi {
  const value = useContext(Ctx);

  if (!value) {
    throw new Error(
      "useFilters deve ser usado dentro de FilterProvider"
    );
  }

  return value;
}

// ======================================================
// 19. FILTRO DE REPOSITÓRIOS
// ======================================================

/**
 * Verifica se um repositório passa pelos filtros globais.
 *
 * Utilizado por:
 * - RepositoriesChart
 * - ScatterChart
 * - NetworkChart
 */
export function matchRepo(
  r: Repo,
  f: Filters,
  opts: {
    ignoreStars?: boolean;
    ignoreAgents?: boolean;
  } = {}
): boolean {

  // Filtro por agente principal.
  if (
    !opts.ignoreAgents &&
    f.agents.length > 0 &&
    !f.agents.includes(r.main_agent)
  ) {
    return false;
  }

  // Filtro por linguagem.
  if (
    f.language &&
    r.language !== f.language
  ) {
    return false;
  }

  // Filtro de repositórios dominantes.
  if (
    f.hideDominant &&
    r.n_pr >= DOMINANT_MIN_PRS
  ) {
    return false;
  }

  // Filtro por faixa de estrelas.
  if (
    !opts.ignoreStars &&
    f.starsRange &&
    (
      r.stars < f.starsRange[0] ||
      r.stars > f.starsRange[1]
    )
  ) {
    return false;
  }

  return true;
}