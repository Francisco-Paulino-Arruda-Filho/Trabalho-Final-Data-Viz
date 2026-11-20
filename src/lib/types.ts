export interface DayData {
  date: string;
  count: number;
  dow: number; // 0 = segunda
  week: string; // segunda-feira da semana (ISO)
  agents?: Record<string, number>;
}

export interface MonthlyRow {
  month: string; // "2025-05"
  agent: string;
  prs: number;
}

export type Outcome = "merged" | "closed" | "open";

export interface OutcomeRow {
  agent: string;
  outcome: Outcome;
  count: number;
  total_agent: number;
  percentage: number;
}

export interface LanguageRow {
  language: string;
  agent: string;
  outcome: Outcome;
  count: number;
  total: number;
  percentage: number;
}

export interface MergeSummary {
  agent: string;
  n: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  p90: number;
  p95: number;
  max: number;
}

export interface EcdfPoint {
  agent: string;
  ttm_hours: number;
  probability: number;
}

export interface MergeTimesData {
  summary: MergeSummary[];
  ecdf: EcdfPoint[];
}

export interface Repo {
  repo_id: number;
  repo: string;
  language: string;
  stars: number;
  forks: number;
  n_pr: number;
  n_merged: number;
  n_closed: number;
  median_ttm_h: number;
  pct_human_review: number; // 0..1
  main_agent: string;
}

export interface NetworkNodeRaw {
  id: string;
  label: string;
  type: "agent" | "repository";
  repo_id?: number;
}

export interface NetworkEdgeRaw {
  source: string;
  target: string;
  prs: number;
}

export interface NetworkData {
  nodes: NetworkNodeRaw[];
  edges: NetworkEdgeRaw[];
}

export interface Meta {
  total_prs: number;
  total_repositories: number;
  date_min: string;
  date_max: string;
}