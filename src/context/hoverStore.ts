// ======================================================
// HOVER GLOBAL DE AGENTE
// ======================================================
//
// O agente sob o mouse fica fora do React (e fora do FilterContext)
// de propósito. Se ele fosse estado do React, cada movimento do mouse
// re-renderizaria todos os gráficos e, pior, mudaria o spec do Vega,
// o que destrói e recria a visualização (perdendo brushes e tooltips).
//
// Em vez disso, o VegaChart assina este store e empurra o valor
// para dentro da view com view.signal(...), sem recriar nada.

type Listener = (agent: string | null) => void;

let current: string | null = null;
const listeners = new Set<Listener>();

export function getHoveredAgent(): string | null {
  return current;
}

export function setHoveredAgent(agent: string | null): void {
  if (agent === current) return;

  current = agent;
  listeners.forEach((listener) => listener(agent));
}

export function subscribeHoveredAgent(
  listener: Listener
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
