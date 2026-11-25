/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/refs */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { VegaEmbed } from "react-vega"
import type { View } from "vega"

import { getHoveredAgent, subscribeHoveredAgent } from "@/context/hoverStore"

// ======================================================
// 1. PROPRIEDADES
// ======================================================

interface Props {
  spec: any

  renderer?: "svg" | "canvas"

  // Clique em elementos do gráfico
  onClick?: (datum: any | null, item: any | null) => void

  // Hover em elementos do gráfico
  onHover?: (datum: any | null, item: any | null) => void

  // Sinais do Vega que o gráfico emite (ex.: brush)
  signals?: Record<string, (value: any) => void>

  /**
   * Valores empurrados PARA dentro do Vega (ex.: focusAgents).
   * Aplicados com view.signal(...), sem recriar o gráfico.
   * O spec precisa declarar um param com o mesmo nome.
   */
  signalValues?: Record<string, unknown>

  /**
   * Nome do param do spec que recebe o agente sob o mouse
   * (store global de hover). Ex.: "hoverAgent".
   */
  hoverSignal?: string
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
}

// ======================================================
// 3. APLICAÇÃO DE SINAIS
// ======================================================

/**
 * Atualiza sinais de uma view já criada.
 * Ignora (com aviso) sinais que o spec não declara.
 */
function applySignals(view: View, values: Record<string, unknown>) {
  let changed = false

  Object.entries(values).forEach(([name, value]) => {
    try {
      view.signal(name, value)
      changed = true
    } catch {
      console.warn(`O spec não declara o sinal: ${name}`)
    }
  })

  if (!changed) return

  try {
    view.run()
  } catch {
    // A view pode ter sido finalizada durante a troca de spec.
  }
}

// ======================================================
// 4. COMPONENTE
// ======================================================

export default function VegaChart({
  spec,
  renderer = "svg",
  onClick,
  onHover,
  signals,
  signalValues,
  hoverSignal,
}: Props) {
  // ====================================================
  // 4.1. REFERÊNCIAS
  // ====================================================

  const clickRef = useRef(onClick)
  const hoverRef = useRef(onHover)
  const signalsRef = useRef(signals)
  const signalValuesRef = useRef(signalValues)
  const hoverSignalRef = useRef(hoverSignal)

  // View atual do Vega (null enquanto não foi criada).
  const viewRef = useRef<View | null>(null)

  const [embedError, setEmbedError] = useState<string | null>(null)

  // Mantém os callbacks atualizados
  // sem precisar recriar os listeners.

  clickRef.current = onClick
  hoverRef.current = onHover
  signalsRef.current = signals
  signalValuesRef.current = signalValues
  hoverSignalRef.current = hoverSignal

  // ====================================================
  // 4.2. ESPECIFICAÇÃO VEGA-LITE
  // ====================================================

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
    [spec],
  )

  // ====================================================
  // 4.3. OPÇÕES DE INCORPORAÇÃO
  // ====================================================

  const options = useMemo(
    () => ({
      actions: false,
      renderer,
      mode: "vega-lite" as const,
    }),
    [renderer],
  )

  // ====================================================
  // 4.4. SINAIS DE ENTRADA (React -> Vega)
  // ====================================================

  /** Valores de entrada atuais, incluindo o hover global. */
  const currentInputs = useCallback(() => {
    const inputs: Record<string, unknown> = {
      ...(signalValuesRef.current ?? {}),
    }

    if (hoverSignalRef.current) {
      inputs[hoverSignalRef.current] = getHoveredAgent()
    }

    return inputs
  }, [])

  // Mudou foco/comparação: atualiza a view existente.
  const signalValuesKey = JSON.stringify(signalValues ?? {})

  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    applySignals(view, currentInputs())
  }, [signalValuesKey, currentInputs])

  // Mudou o agente sob o mouse (em qualquer gráfico).
  useEffect(() => {
    if (!hoverSignal) return

    return subscribeHoveredAgent((agent) => {
      const view = viewRef.current
      if (!view) return

      applySignals(view, { [hoverSignal]: agent })
    })
  }, [hoverSignal])

  // Libera a referência ao desmontar.
  useEffect(
    () => () => {
      viewRef.current = null
    },
    [],
  )

  // ====================================================
  // 4.5. REGISTRO DOS EVENTOS
  // ====================================================

  const handleNewView = useCallback(
    (result: any) => {
      const view = result?.view as View | undefined

      if (!view) {
        viewRef.current = null

        setEmbedError("O Vega não retornou uma visualização válida.")
        return
      }

      viewRef.current = view

      setEmbedError(null)

      // Uma view nova nasce com os valores do spec.
      // Reaplica o estado atual (foco, comparação, hover).
      applySignals(view, currentInputs())

      // ----------------------------------------------
      // CLIQUE
      // ----------------------------------------------

      view.addEventListener("click", (_event: any, item: any) => {
        clickRef.current?.(item?.datum ?? null, item ?? null)
      })

      // ----------------------------------------------
      // HOVER
      // ----------------------------------------------

      view.addEventListener("mouseover", (_event: any, item: any) => {
        hoverRef.current?.(item?.datum ?? null, item ?? null)
      })

      // ----------------------------------------------
      // SINAIS DE SAÍDA (Vega -> React)
      // ----------------------------------------------

      Object.keys(signalsRef.current ?? {}).forEach((name) => {
        try {
          view.addSignalListener(name, (_name: string, value: any) => {
            signalsRef.current?.[name]?.(value)
          })
        } catch {
          console.warn(`Não foi possível registrar o sinal: ${name}`)
        }
      })
    },
    [currentInputs],
  )

  // ====================================================
  // 4.6. SAÍDA DO MOUSE DO GRÁFICO
  // ====================================================

  const handleMouseLeave = useCallback(() => {
    hoverRef.current?.(null, null)
  }, [])

  // ====================================================
  // 4.7. TRATAMENTO DE ERROS
  // ====================================================

  const handleError = useCallback((error: unknown) => {
    console.error("Erro ao renderizar gráfico Vega-Lite:", error)

    setEmbedError(error instanceof Error ? error.message : String(error))
  }, [])

  // ====================================================
  // 5. RENDERIZAÇÃO
  // ====================================================

  return (
    <div className="vega-chart-container" onMouseLeave={handleMouseLeave}>
      {/* Mensagem de erro */}

      {embedError && (
        <div className="chart-error">
          <strong>Não foi possível renderizar o gráfico.</strong>

          <p>{embedError}</p>

          <small>Consulte o console do navegador para mais detalhes.</small>
        </div>
      )}

      {/* Visualização Vega-Lite */}

      <VegaEmbed spec={fullSpec} options={options} onEmbed={handleNewView} onError={handleError} />
    </div>
  )
}
