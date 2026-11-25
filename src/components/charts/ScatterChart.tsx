import { useMemo, useRef, useState } from "react"
import VegaChart from "@/components/VegaChart"
import type { Repo } from "@/lib/types"
import { agentColorScale } from "@/lib/colors"
import { agentFromClick, legendValue, mergeRate } from "@/lib/vegaHelpers"
import { matchRepo, useFilters } from "@/context/FilterContext"

export default function ScatterChart({ data }: { data: Repo[] }) {
  const { filters, toggleRepo, toggleAgent, setStarsRange, resetToken } = useFilters()
  const { agents, language, hideDominant, repo } = filters
  const [minResolved, setMinResolved] = useState(10)

  // O brush de estrelas vive dentro da view do Vega. Guardamos o valor atual numa ref para
  // reinicializar o brush quando o spec for recriado, sem recriar o spec a cada arrasto.
  const starsRef = useRef(filters.starsRange)
  starsRef.current = filters.starsRange
  const timer = useRef<number | undefined>(undefined)

  // Estrelas ficam de fora do filtro aqui: o brush *é* o filtro de estrelas.
  const points = useMemo(
    () =>
      data
        .filter((r) => matchRepo(r, filters, { ignoreStars: true }))
        .map((r) => ({
          repo: r.repo,
          stars: r.stars,
          n_pr: r.n_pr,
          language: r.language,
          main_agent: r.main_agent,
          resolved: r.n_merged + r.n_closed,
          rate: mergeRate(r),
          pct_human_review: r.pct_human_review,
        }))
        .filter((p) => p.rate !== null && p.resolved >= minResolved),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, agents, language, hideDominant, minResolved],
  )

  const selected = repo ? points.find((p) => p.repo === repo) : undefined

  const spec = useMemo(() => {
    const x = {
      field: "stars",
      type: "quantitative",
      scale: { type: "log" },
      title: "Estrelas do repositório (escala log)",
      axis: { format: "~s" },
    }
    const y = {
      field: "rate",
      type: "quantitative",
      title: "Taxa de merge (entre PRs resolvidos)",
      scale: { domain: [0, 1] },
      axis: { format: "%" },
    }
    const brush: any = {
      name: "brush",
      select: { type: "interval", encodings: ["x"] },
    }
    if (starsRef.current) brush.value = { x: starsRef.current }

    return {
      width: "container",
      height: 380,
      data: { values: points },
      layer: [
        {
          params: [brush],
          mark: {
            type: "circle",
            cursor: "pointer",
            stroke: "#fff",
            strokeWidth: 0.6,
          },
          encoding: {
            x,
            y,
            size: {
              field: "n_pr",
              type: "quantitative",
              scale: { type: "sqrt", range: [18, 900] },
              title: "PRs no repositório",
            },
            color: {
              field: "main_agent",
              type: "nominal",
              title: "Agente principal",
              scale: agentColorScale,
            },
            opacity: { value: 0.6 },
            tooltip: [
              { field: "repo", title: "Repositório" },
              { field: "main_agent", title: "Agente principal" },
              { field: "stars", title: "Estrelas", format: "," },
              { field: "n_pr", title: "PRs", format: "," },
              { field: "rate", title: "Taxa de merge", format: ".1%" },
              { field: "language", title: "Linguagem" },
              {
                field: "pct_human_review",
                title: "Com review humano",
                format: ".0%",
              },
            ],
          },
        },
        ...(selected
          ? [
              {
                data: { values: [selected] },
                mark: {
                  type: "point",
                  filled: false,
                  size: 420,
                  stroke: "#111827",
                  strokeWidth: 2.5,
                },
                encoding: { x, y },
              },
            ]
          : []),
      ],
    }
    // starsRef é lida de propósito sem entrar nas dependências
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, selected, resetToken])

  // Debounce: arrastar o brush dispara dezenas de eventos por segundo.
  const onBrush = (value: any) => {
    const ext = value && typeof value === "object" ? (value.stars ?? Object.values(value)[0]) : null
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setStarsRange(
        Array.isArray(ext) && ext.length === 2 ? [Math.round(ext[0]), Math.round(ext[1])] : null,
      )
    }, 180)
  }

  return (
    <div>
      <div className="chart-toolbar">
        <label>
          Mínimo de PRs resolvidos por repositório{" "}
          <select value={minResolved} onChange={(e) => setMinResolved(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={30}>30</option>
          </select>
        </label>
        <span>{points.length.toLocaleString("pt-BR")} repositórios</span>
      </div>
      <VegaChart
        key={resetToken}
        spec={spec}
        renderer="canvas"
        signals={{ brush: onBrush }}
        onClick={(d, item) => {
          if (legendValue(d, item)) {
            const a = agentFromClick(d, item)
            if (a) toggleAgent(a)
          } else if (d?.repo) toggleRepo(d.repo)
        }}
      />
      <p className="note">
        Arraste na horizontal para selecionar uma faixa de estrelas: as barras e a rede passam a
        considerar só esses repositórios. Repositórios com poucos PRs resolvidos são omitidos porque
        a taxa fica instável.
      </p>
    </div>
  )
}
