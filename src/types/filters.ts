export type Filters = {
  agents: string[];                    // vazio = todos
  range: [string, string] | null;      // vem do brush do calendário
  language: string | null;
  repo: string | null;
};
// FilterContext com { filters, setFilters } no topo do App