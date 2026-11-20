import { useCallback, useMemo, useRef } from "react";
import { VegaEmbed } from "react-vega";

interface Props {
  spec: any;
  renderer?: "svg" | "canvas";
  /** Clique em qualquer marca ou item de legenda. `datum` é null se clicou no fundo. */
  onClick?: (datum: any | null, item: any | null) => void;
  /** Ouvintes de sinais do Vega (ex.: { brush: (valor) => ... }). */
  signals?: Record<string, (value: any) => void>;
}

const BASE_CONFIG = {
  font: "Inter, system-ui, -apple-system, sans-serif",
  background: null,
  view: { stroke: null },
  axis: {
    labelFontSize: 11,
    titleFontSize: 12,
    titleFontWeight: 500,
    gridColor: "#e6eaee",
    domainColor: "#9aa5b1",
    tickColor: "#9aa5b1",
  },
  legend: { labelFontSize: 11, titleFontSize: 12, symbolType: "circle" },
};

export default function VegaChart({ spec, renderer = "svg", onClick, signals }: Props) {
  // Refs evitam recriar a view (e perder brush/hover) quando só os callbacks mudam.
  const clickRef = useRef(onClick);
  clickRef.current = onClick;
  const signalsRef = useRef(signals);
  signalsRef.current = signals;

  const fullSpec = useMemo(
    () => ({
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      autosize: { type: "fit", contains: "padding" },
      ...spec,
      config: { ...BASE_CONFIG, ...(spec.config ?? {}) },
    }),
    [spec]
  );

  const options = useMemo(
    () => ({ actions: false, renderer, mode: "vega-lite" as const }),
    [renderer]
  );

  const handleNewView = useCallback((view: any) => {
    view.addEventListener("click", (_e: any, item: any) => {
      clickRef.current?.(item?.datum ?? null, item ?? null);
    });
    Object.keys(signalsRef.current ?? {}).forEach((name) => {
      try {
        view.addSignalListener(name, (_n: string, value: any) => signalsRef.current?.[name]?.(value));
      } catch {
        /* sinal inexistente neste spec */
      }
    });
  }, []);

  return (
    <VegaEmbed
      spec={fullSpec}
      options={options}
      onNewView={handleNewView}
      style={{ width: "100%" }}
    />
  );
}
