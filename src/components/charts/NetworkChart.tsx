import { useMemo, useSyncExternalStore } from "react"
import * as d3 from "d3"
import type { NetworkData, Repo } from "@/lib/types"
import { AGENTS, AGENT_COLORS, SEQUENTIAL_RANGE } from "@/lib/colors"
import { fmtInt } from "@/lib/vegaHelpers"
import { DOMINANT_MIN_PRS, matchRepo, useFilters } from "@/context/FilterContext"
import { getHoveredAgent, setHoveredAgent, subscribeHoveredAgent } from "@/context/hoverStore"
import {
  buildNetworkMatrix,
  filterNetworkMatrix,
  networkAgentOpacity,
  networkRowCells,
} from "@/lib/networkMatrix"

const CELL = 24
const LABEL_WIDTH = 190
const TOP = 165
const ROW_HEIGHT = 40

export default function NetworkChart({ data, repos }: { data: NetworkData; repos: Repo[] }) {
  const { filters, focusAgents, toggleAgent, toggleRepo } = useFilters()
  const matrix = useMemo(() => buildNetworkMatrix(data, repos, AGENTS), [data, repos])
  const repoById = useMemo(() => new Map(repos.map((repo) => [repo.repo_id, repo])), [repos])
  const hoveredAgent = useSyncExternalStore(subscribeHoveredAgent, getHoveredAgent, () => null)
  const focusedAgents = new Set(focusAgents)
  const connected = new Set<string>()
  data.edges.forEach((edge) => {
    const agent = edge.source.replace(/^agent:/, "")
    if (!focusedAgents.size || focusedAgents.has(agent)) connected.add(edge.target)
  })

  const visibleRepoIds = new Set(
    matrix.repositories.flatMap(({ repoId }) => {
      const info = repoById.get(repoId)
      if (!info || (filters.hideDominant && info.n_pr >= DOMINANT_MIN_PRS)) return []
      return matchRepo(info, filters, { ignoreAgents: true }) ? [repoId] : []
    }),
  )
  const visibleMatrix = filterNetworkMatrix(matrix, visibleRepoIds)

  const maxPrs =
    d3.max(visibleMatrix.rows.flatMap((row) => row.values.filter((value) => value !== null))) ?? 1
  const color = d3
    .scaleSqrt<string>()
    .domain([0, maxPrs])
    .range([...SEQUENTIAL_RANGE])
  const sharedEnd = visibleMatrix.repositories.findIndex((repo) => !repo.shared)
  const width = Math.max(900, LABEL_WIDTH + visibleMatrix.repositories.length * CELL + 12)
  const height = TOP + AGENTS.length * ROW_HEIGHT + 12
  const sharedCount = sharedEnd < 0 ? visibleMatrix.repositories.length : sharedEnd
  const exclusiveCount = visibleMatrix.repositories.length - sharedCount

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width, maxWidth: "none", height }}
          role="img"
          aria-label="Matriz agente–repositório. As linhas são agentes e as colunas são repositórios."
        >
          {sharedCount > 0 && (
            <text
              x={LABEL_WIDTH + (sharedCount * CELL) / 2}
              y={18}
              textAnchor="middle"
              fontWeight={600}
            >
              Compartilhados ({sharedCount})
            </text>
          )}
          {exclusiveCount > 0 && (
            <text
              x={LABEL_WIDTH + sharedCount * CELL + (exclusiveCount * CELL) / 2}
              y={18}
              textAnchor="middle"
              fontWeight={600}
            >
              Exclusivos ({exclusiveCount})
            </text>
          )}
          {sharedCount > 0 && exclusiveCount > 0 && (
            <line
              x1={LABEL_WIDTH + sharedCount * CELL}
              x2={LABEL_WIDTH + sharedCount * CELL}
              y1={28}
              y2={height - 4}
              stroke="#64748b"
              strokeDasharray="3 3"
            />
          )}

          {visibleMatrix.repositories.map((repo, index) => {
            const x = LABEL_WIDTH + index * CELL
            const isActive = !focusAgents.length || connected.has(`repo:${repo.repoId}`)
            const groupMarker = repo.shared ? "C" : "E"
            return (
              <g key={repo.repoId} opacity={isActive ? 1 : 0.12}>
                <text
                  x={x + CELL / 2}
                  y={TOP - 36}
                  textAnchor="start"
                  transform={`rotate(-60 ${x + CELL / 2} ${TOP - 36})`}
                  fontSize={9}
                  fill="#475569"
                  style={{ cursor: "pointer" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${repo.shared ? "Compartilhado" : "Exclusivo"}, ${repo.degree} agentes: ${repo.repo}. Selecionar repositório`}
                  onClick={() => toggleRepo(repo.repo)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") toggleRepo(repo.repo)
                  }}
                >
                  {repo.repo}
                  <title>{`${repo.repo} · ${repo.shared ? "compartilhado" : "exclusivo"} · ${repo.degree} agente(s) · ${fmtInt(repo.totalPrs)} PRs`}</title>
                </text>
                <text x={x + CELL / 2} y={TOP - 8} textAnchor="middle" fontSize={9} fill="#334155">
                  {groupMarker}·{repo.degree}
                </text>
              </g>
            )
          })}

          {visibleMatrix.rows.map((row, rowIndex) => {
            const y = TOP + rowIndex * ROW_HEIGHT
            const opacity = networkAgentOpacity(row.agent, focusAgents, hoveredAgent)
            return (
              <g
                key={row.agent}
                opacity={opacity}
                onMouseEnter={() => setHoveredAgent(row.agent)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                <text
                  x={LABEL_WIDTH - 10}
                  y={y + 15}
                  textAnchor="end"
                  fill={AGENT_COLORS[row.agent]}
                  fontWeight={600}
                  style={{ cursor: "pointer" }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Selecionar agente ${row.agent}`}
                  onClick={() => toggleAgent(row.agent)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") toggleAgent(row.agent)
                  }}
                  onFocus={() => setHoveredAgent(row.agent)}
                  onBlur={() => setHoveredAgent(null)}
                >
                  {row.agent}
                </text>
                {networkRowCells(visibleMatrix, row).map(
                  ({ repository: repo, value, columnIndex }) => {
                    const x = LABEL_WIDTH + columnIndex * CELL + 4
                    const cellY = y
                    return (
                      <rect
                        key={repo.repoId}
                        x={x}
                        y={cellY}
                        width={CELL - 8}
                        height={CELL - 8}
                        rx={2}
                        fill={color(value)}
                        stroke={filters.repo === repo.repo ? "#111827" : "#52616b"}
                        strokeWidth={filters.repo === repo.repo ? 2 : 1.2}
                      >
                        <title>{`${row.agent} · ${repo.repo} · ${fmtInt(value)} PRs`}</title>
                      </rect>
                    )
                  },
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="legend-row">
        {AGENTS.map((agent) => (
          <span key={agent} className="legend-item">
            <span className="dot" style={{ background: AGENT_COLORS[agent] }} />
            {agent}
          </span>
        ))}
        <span className="legend-item">
          C = compartilhado · E = exclusivo · número = agentes conectados
        </span>
      </div>
      <div className="legend-row" aria-label="Escala de PRs por célula">
        <span className="legend-item">PRs por célula:</span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 120,
            height: 10,
            borderRadius: 2,
            background: `linear-gradient(to right, ${SEQUENTIAL_RANGE[0]}, ${SEQUENTIAL_RANGE[1]})`,
          }}
        />
        <span className="legend-item">0–{fmtInt(maxPrs)} (escala raiz quadrada)</span>
      </div>
      <p className="note">
        Cada célula indica PRs daquele agente no repositório; célula vazia indica que não há
        relação. A cor usa uma escala comum de contagens. Repositórios são ordenados por
        compartilhados, número de agentes, total de PRs e nome. A matriz cobre os 100 repositórios
        mais ativos. Role horizontalmente para acessar as demais colunas. Clique no nome do agente
        ou repositório para filtrar; passe o mouse sobre uma célula para ver a contagem.
      </p>
    </div>
  )
}
