
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { VegaEmbed } from "react-vega";

// ======================================================
// 1. PROPRIEDADES
// ======================================================

interface Props {
  spec: any;

  renderer?: "svg" | "canvas";

  // Clique em elementos do gráfico
  onClick?: (
    datum: any | null,
    item: any | null
  ) => void;

  // Hover em elementos do gráfico
  onHover?: (
    datum: any | null,
    item: any | null
  ) => void;

  // Comunicação de sinais do Vega
  signals?: Record<
    string,
    (value: any) => void
  >;
}

// ======================================================
// 2. CONFIGURAÇÃO VISUAL PADRÃO
// ======================================================

const BASE_CONFIG = {
  font: "Inter, system-ui, -apple-system, sans-serif",

  background: null,

  view: {
    stroke: null,
  },

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

// ======================================================
// 3. COMPONENTE
// ======================================================

export default function VegaChart({
  spec,
  renderer = "svg",
  onClick,
  onHover,
  signals,
}: Props) {

  // ====================================================
  // 3.1. REFERÊNCIAS DOS CALLBACKS
  // ====================================================

  const clickRef = useRef(onClick);
  const hoverRef = useRef(onHover);
  const signalsRef = useRef(signals);

  const [embedError, setEmbedError] =
    useState<string | null>(null);

  // Mantém os callbacks atualizados
  // sem precisar recriar os listeners.

  clickRef.current = onClick;
  hoverRef.current = onHover;
  signalsRef.current = signals;

  // ====================================================
  // 3.2. ESPECIFICAÇÃO VEGA-LITE
  // ====================================================

  const fullSpec = useMemo(
    () => ({
      $schema:
        "https://vega.github.io/schema/vega-lite/v6.json",

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

  // ====================================================
  // 3.3. OPÇÕES DE INCORPORAÇÃO
  // ====================================================

  const options = useMemo(
    () => ({
      actions: false,
      renderer,
      mode: "vega-lite" as const,
    }),
    [renderer]
  );

  // ====================================================
  // 3.4. REGISTRO DOS EVENTOS
  // ====================================================

  const handleNewView = useCallback(
    (result: any) => {

      const view = result?.view;

      if (!view) {
        setEmbedError(
          "O Vega não retornou uma visualização válida."
        );
        return;
      }

      setEmbedError(null);

      // ----------------------------------------------
      // CLIQUE
      // ----------------------------------------------

      view.addEventListener(
        "click",
        (_event: any, item: any) => {
          clickRef.current?.(
            item?.datum ?? null,
            item ?? null
          );
        }
      );

      // ----------------------------------------------
      // HOVER
      // ----------------------------------------------

      view.addEventListener(
        "mouseover",
        (_event: any, item: any) => {
          hoverRef.current?.(
            item?.datum ?? null,
            item ?? null
          );
        }
      );

      // ----------------------------------------------
      // SINAIS DO VEGA
      // ----------------------------------------------

      Object.keys(signalsRef.current ?? {}).forEach(
        (name) => {
          try {
            view.addSignalListener(
              name,
              (_name: string, value: any) => {
                signalsRef.current?.[name]?.(value);
              }
            );
          } catch {
            console.warn(
              `Não foi possível registrar o sinal: ${name}`
            );
          }
        }
      );
    },
    []
  );

  // ====================================================
  // 3.5. SAÍDA DO MOUSE DO GRÁFICO
  // ====================================================

  const handleMouseLeave = useCallback(() => {
    hoverRef.current?.(null, null);
  }, []);

  // ====================================================
  // 3.6. TRATAMENTO DE ERROS
  // ====================================================

  const handleError = useCallback(
    (error: unknown) => {
      console.error(
        "Erro ao renderizar gráfico Vega-Lite:",
        error
      );

      setEmbedError(
        error instanceof Error
          ? error.message
          : String(error)
      );
    },
    []
  );

  // ====================================================
  // 4. RENDERIZAÇÃO
  // ====================================================

  return (
    <div
      className="vega-chart-container"
      onMouseLeave={handleMouseLeave}
    >

      {/* Mensagem de erro */}

      {embedError && (
        <div className="chart-error">
          <strong>
            Não foi possível renderizar o gráfico.
          </strong>

          <p>{embedError}</p>

          <small>
            Consulte o console do navegador para mais detalhes.
          </small>
        </div>
      )}

      {/* Visualização Vega-Lite */}

      <VegaEmbed
        spec={fullSpec}
        options={options}
        onEmbed={handleNewView}
        onError={handleError}
      />

    </div>
  );
}