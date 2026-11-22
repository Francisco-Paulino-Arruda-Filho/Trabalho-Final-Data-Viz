
import { useCallback, useMemo, useRef, useState } from "react";
import { VegaEmbed } from "react-vega";

interface Props {
  spec: any;
  renderer?: "svg" | "canvas";
  onClick?: (datum: any | null, item: any | null) => void;
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
  legend: {
    labelFontSize: 11,
    titleFontSize: 12,
    symbolType: "circle",
  },
};

export default function VegaChart({
  spec,
  renderer = "svg",
  onClick,
  signals,
}: Props) {
  const clickRef = useRef(onClick);
  const signalsRef = useRef(signals);

  const [embedError, setEmbedError] = useState<string | null>(null);

  clickRef.current = onClick;
  signalsRef.current = signals;

  const fullSpec = useMemo(
    () => ({
      $schema: "https://vega.github.io/schema/vega-lite/v6.json",
      autosize: {
        type: "fit",
        contains: "padding",
      },
      ...spec,
      config: {
        ...BASE_CONFIG,
        ...(spec.config ?? {}),
      },
    }),
    [spec]
  );

  const options = useMemo(
    () => ({
      actions: false,
      renderer,
      mode: "vega-lite" as const,
    }),
    [renderer]
  );

  const handleNewView = useCallback((result: any) => {
    const view = result?.view;

    if (!view) {
      setEmbedError("O Vega não retornou uma visualização válida.");
      return;
    }

    setEmbedError(null);

    view.addEventListener("click", (_event: any, item: any) => {
      clickRef.current?.(item?.datum ?? null, item ?? null);
    });

    Object.keys(signalsRef.current ?? {}).forEach((name) => {
      try {
        view.addSignalListener(name, (_name: string, value: any) => {
          signalsRef.current?.[name]?.(value);
        });
      } catch {
        console.warn(`Não foi possível registrar o sinal: ${name}`);
      }
    });
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error("Erro ao renderizar gráfico Vega-Lite:", error);

    setEmbedError(
      error instanceof Error
        ? error.message
        : String(error)
    );
  }, []);

  return (
    <div className="vega-chart-container">
      {embedError && (
        <div className="chart-error">
          <strong>Não foi possível renderizar o gráfico.</strong>
          <p>{embedError}</p>
          <small>Consulte o console do navegador para mais detalhes.</small>
        </div>
      )}

      <VegaEmbed
        spec={fullSpec}
        options={options}
        onEmbed={handleNewView}
        onError={handleError}
      />
    </div>
  );
}
