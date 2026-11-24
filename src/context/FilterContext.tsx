import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { Repo } from "../lib/types";
import { setHoveredAgent } from "./hoverStore";

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
// 3. COMPARAÇÃO ENTRE AGENTES
// ======================================================
//
// O hover global NÃO fica aqui. Veja hoverStore.ts.

export type CompareAgents = [
  string | null,
  string | null
];

// ======================================================
// 4. INTERFACE DO CONTEXTO
// ======================================================

interface FilterApi {
  // Filtros globais
  filters: Filters;
  resetToken: number;
  isFiltered: boolean;

  /**
   * Agentes que realmente guiam o destaque e a filtragem:
   * os agentes da comparação, quando há comparação;
   * senão, os agentes do filtro convencional.
   */
  focusAgents: string[];

  /**
   * Cópia de `filters` em que `agents` é `focusAgents`.
   * Use esta versão nos gráficos e em matchRepo para que
   * todas as visões respondam à comparação.
   */
  focusFilters: Filters;

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

  // Comparação entre agentes
  compareAgents: CompareAgents;
  setCompareAgents: (agents: CompareAgents) => void;
  clearComparison: () => void;

  /** Verdadeiro se pelo menos um agente foi escolhido na comparação. */
  hasComparison: boolean;
}

// ======================================================
// 5. CRIAÇÃO DO CONTEXTO
// ======================================================

const Ctx = createContext<FilterApi | null>(null);

// ======================================================
// 6. FUNÇÕES AUXILIARES
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
// 7. PROVIDER
// ======================================================

export function FilterProvider({
  children,
}: {
  children: ReactNode;
}) {

  // ====================================================
  // 7.1. ESTADOS DOS FILTROS
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
  // 7.2. ESTADO DE COMPARAÇÃO
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

  const clearComparison = useCallback(() => {
    setCompareAgentsState([null, null]);
  }, []);

  /** Agentes realmente escolhidos na comparação (0, 1 ou 2). */
  const compared = useMemo(
    () =>
      compareAgents.filter(
        (agent): agent is string => Boolean(agent)
      ),
    [compareAgents]
  );

  /**
   * Existe comparação assim que um agente é escolhido.
   * Com um só agente, a visão destaca apenas ele.
   */
  const hasComparison = compared.length > 0;

  /**
   * A comparação tem prioridade sobre o filtro de agentes.
   * Todas as visões usam esta única fonte para decidir
   * quais agentes estão em foco.
   */
  const focusAgents = useMemo(
    () => (hasComparison ? compared : filters.agents),
    [hasComparison, compared, filters.agents]
  );

  const focusFilters = useMemo<Filters>(
    () =>
      focusAgents === filters.agents
        ? filters
        : { ...filters, agents: focusAgents },
    [filters, focusAgents]
  );

  // ====================================================
  // 8. FILTRO DE AGENTES
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
  // 9. FILTRO DE PERÍODO
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
  // 10. FILTRO DE LINGUAGEM
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
  // 11. FILTRO DE REPOSITÓRIO
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
  // 12. FILTRO DE ESTRELAS
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
  // 13. OCULTAR REPOSITÓRIOS DOMINANTES
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
  // 14. VERIFICAÇÃO DE FILTROS ATIVOS
  // ====================================================

  const isFiltered =
    filters.agents.length > 0 ||
    filters.range !== null ||
    filters.language !== null ||
    filters.repo !== null ||
    filters.starsRange !== null ||
    filters.hideDominant ||
    hasComparison;

  // ====================================================
  // 15. LIMPAR TUDO
  // ====================================================

  const reset = useCallback(() => {

    // Limpa os filtros globais.
    setFilters({
      ...EMPTY_FILTERS,
      agents: [],
    });

    // Remove o destaque temporário.
    setHoveredAgent(null);

    // Remove os agentes da comparação.
    setCompareAgentsState([null, null]);

    // Reinicia os brushes internos.
    setResetToken((t) => t + 1);

  }, []);

  // ====================================================
  // 16. DISPONIBILIZAÇÃO DA API
  // ====================================================

  const api = useMemo<FilterApi>(
    () => ({
      // Filtros
      filters,
      resetToken,
      isFiltered,
      focusAgents,
      focusFilters,

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

      // Comparação
      compareAgents,
      setCompareAgents,
      clearComparison,
      hasComparison,
    }),
    [
      filters,
      resetToken,
      isFiltered,
      focusAgents,
      focusFilters,

      toggleAgent,
      clearAgents,
      setRange,
      toggleLanguage,
      toggleRepo,
      setStarsRange,
      clearStarsRange,
      setHideDominant,
      reset,

      compareAgents,
      setCompareAgents,
      clearComparison,
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
// 17. HOOK DE ACESSO AO CONTEXTO
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
// 18. FILTRO DE REPOSITÓRIOS
// ======================================================

/**
 * Verifica se um repositório passa pelos filtros globais.
 *
 * Passe `focusFilters` (e não `filters`) para que a comparação
 * entre agentes também filtre os repositórios.
 *
 * Utilizado por:
 * - RepositoriesChart
 * - ScatterChart
 * - ParetoChart
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