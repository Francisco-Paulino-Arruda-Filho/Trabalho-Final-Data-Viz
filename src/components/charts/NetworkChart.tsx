import { useEffect, useMemo, useRef } from "react"
import * as d3 from "d3"
import type { NetworkData, Repo } from "@/lib/types"
import { AGENTS, AGENT_COLORS } from "@/lib/colors"
import { fmtInt } from "@/lib/vegaHelpers"
import { DOMINANT_MIN_PRS, matchRepo, useFilters } from "@/context/FilterContext"

interface SimNode extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: "agent" | "repository"
  repo_id?: number
  total: number
  agent?: string // agente principal (só repositórios)
  r: number
}
interface SimLink {
  source: string | SimNode
  target: string | SimNode
  prs: number
  agentId: string
  repoId: string
}
interface StyleState {
  active: Set<string>
  hidden: Set<string>
  repo: string | null
}

const W = 900
const H = 560

export default function NetworkChart({ data, repos }: { data: NetworkData; repos: Repo[] }) {
  const { filters, toggleAgent, toggleRepo } = useFilters()
  const svgRef = useRef<SVGSVGElement>(null)

  const toggleAgentRef = useRef(toggleAgent)
  toggleAgentRef.current = toggleAgent
  const toggleRepoRef = useRef(toggleRepo)
  toggleRepoRef.current = toggleRepo

  const repoById = useMemo(() => new Map(repos.map((r) => [r.repo_id, r])), [repos])

  // Quais nós estão ativos / ocultos segundo os filtros globais.
  const style = useMemo<StyleState>(() => {
    const active = new Set<string>()
    const hidden = new Set<string>()
    const selectedAgents = new Set(filters.agents)
    const connected = new Set<string>()
    data.edges.forEach((e) => {
      if (!selectedAgents.size || selectedAgents.has(e.source.replace("agent:", "")))
        connected.add(e.target)
    })
    const hasRepoFilter = !!filters.language || !!filters.starsRange || filters.hideDominant

    data.nodes.forEach((n) => {
      if (n.type === "agent") {
        if (!selectedAgents.size || selectedAgents.has(n.label)) active.add(n.id)
        return
      }
      const info = n.repo_id !== undefined ? repoById.get(n.repo_id) : undefined
      if (info && filters.hideDominant && info.n_pr >= DOMINANT_MIN_PRS) {
        hidden.add(n.id)
        return
      }
      const passes = info ? matchRepo(info, filters, { ignoreAgents: true }) : !hasRepoFilter
      if (passes && connected.has(n.id)) active.add(n.id)
    })
    return { active, hidden, repo: filters.repo }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    repoById,
    filters.agents,
    filters.language,
    filters.starsRange,
    filters.hideDominant,
    filters.repo,
  ])

  const styleRef = useRef(style)
  styleRef.current = style
  const applyRef = useRef<((hoverId: string | null) => void) | null>(null)

  // 1) Layout: só depende dos dados, para a simulação não reiniciar a cada clique.
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const nodes: SimNode[] = data.nodes.map((n) => ({ ...n, total: 0, r: 6 }))
    const byId = new Map(nodes.map((n) => [n.id, n]))
    const links: SimLink[] = data.edges.map((e) => ({
      source: e.source,
      target: e.target,
      prs: e.prs,
      agentId: e.source,
      repoId: e.target,
    }))

    // total de PRs por nó e agente principal de cada repositório
    const best = new Map<string, { agent: string; prs: number }>()
    const neighbors = new Map<string, Set<string>>()
    links.forEach((l) => {
      const a = byId.get(l.agentId)
      const r = byId.get(l.repoId)
      if (!a || !r) return
      a.total += l.prs
      r.total += l.prs
      const b = best.get(r.id)
      if (!b || l.prs > b.prs) best.set(r.id, { agent: a.label, prs: l.prs })
      if (!neighbors.has(a.id)) neighbors.set(a.id, new Set())
      if (!neighbors.has(r.id)) neighbors.set(r.id, new Set())
      neighbors.get(a.id)!.add(r.id)
      neighbors.get(r.id)!.add(a.id)
    })
    nodes.forEach((n) => {
      if (n.type === "repository") n.agent = best.get(n.id)?.agent
    })

    // Tamanho por PRs (raiz quadrada: área proporcional) e espessura por peso da aresta.
    const agentNodes = nodes.filter((n) => n.type === "agent")
    const repoNodes = nodes.filter((n) => n.type === "repository")
    const rAgent = d3
      .scaleSqrt()
      .domain([0, d3.max(agentNodes, (n) => n.total) || 1])
      .range([9, 30])
    const rRepo = d3
      .scaleSqrt()
      .domain([0, d3.max(repoNodes, (n) => n.total) || 1])
      .range([3, 16])
    nodes.forEach((n) => (n.r = n.type === "agent" ? rAgent(n.total) : rRepo(n.total)))
    const wScale = d3
      .scaleSqrt()
      .domain([0, d3.max(links, (l) => l.prs) || 1])
      .range([0.4, 8])
    const colorOf = (n: SimNode) =>
      AGENT_COLORS[n.type === "agent" ? n.label : (n.agent ?? "")] ?? "#94a3b8"

    const sim = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(60)
          .strength(0.4),
      )
      .force(
        "charge",
        d3.forceManyBody<SimNode>().strength((d) => (d.type === "agent" ? -420 : -30)),
      )
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force(
        "collide",
        d3.forceCollide<SimNode>().radius((d) => d.r + 3),
      )
      .force("x", d3.forceX(W / 2).strength(0.04))
      .force("y", d3.forceY(H / 2).strength(0.06))

    const linkSel = svg
      .append("g")
      .attr("stroke-linecap", "round")
      .selectAll<SVGLineElement, SimLink>("line")
      .data(links)
      .join("line")
      .attr("stroke", (l) => AGENT_COLORS[byId.get(l.agentId)?.label ?? ""] ?? "#94a3b8")
      .attr("stroke-width", (l) => wScale(l.prs))

    const drag = d3
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) sim.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on("drag", (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on("end", (event, d) => {
        if (!event.active) sim.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    const nodeSel = svg
      .append("g")
      .selectAll<SVGCircleElement, SimNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.r)
      .attr("fill", colorOf)
      .style("cursor", "pointer")
      .on("click", (_e, d) => {
        if (d.type === "agent") toggleAgentRef.current(d.label)
        else toggleRepoRef.current(d.label)
      })
      .on("mouseenter", (_e, d) => applyRef.current?.(d.id))
      .on("mouseleave", () => applyRef.current?.(null))
      .call(drag)

    nodeSel.append("title").text((d) => {
      if (d.type === "agent") return `${d.label}: ${fmtInt(d.total)} PRs (nesta rede)`
      const info = d.repo_id !== undefined ? repoById.get(d.repo_id) : undefined
      return [
        d.label,
        `${fmtInt(d.total)} PRs (nesta rede)`,
        info ? `${fmtInt(info.stars)} estrelas · ${info.language}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    })

    // rótulos: todos os agentes e os 8 repositórios com mais PRs
    const topRepos = new Set(
      [...repoNodes]
        .sort((a, b) => b.total - a.total)
        .slice(0, 8)
        .map((n) => n.id),
    )
    const labelSel = svg
      .append("g")
      .style("pointer-events", "none")
      .attr("font-size", 11)
      .selectAll<SVGTextElement, SimNode>("text")
      .data(nodes.filter((n) => n.type === "agent" || topRepos.has(n.id)))
      .join("text")
      .text((d) => d.label)
      .attr("dx", (d) => d.r + 4)
      .attr("dy", 4)
      .attr("font-weight", (d) => (d.type === "agent" ? 600 : 400))
      .attr("fill", "currentColor")
      .attr("paint-order", "stroke")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)

    // 2) Estilo: aplicado agora, a cada mudança de filtro e no hover.
    applyRef.current = (hoverId) => {
      const st = styleRef.current
      const hoverSet = hoverId ? new Set([hoverId, ...(neighbors.get(hoverId) ?? [])]) : null
      const nodeOpacity = (d: SimNode) =>
        st.hidden.has(d.id)
          ? 0
          : hoverSet
            ? hoverSet.has(d.id)
              ? 1
              : 0.08
            : st.active.has(d.id)
              ? 1
              : 0.12

      nodeSel
        .attr("opacity", nodeOpacity)
        .attr("pointer-events", (d) => (st.hidden.has(d.id) ? "none" : "all"))
        .attr("stroke", (d) => (d.label === st.repo ? "#111827" : "#fff"))
        .attr("stroke-width", (d) => (d.label === st.repo ? 3 : 1.5))

      linkSel.attr("stroke-opacity", (l) => {
        if (st.hidden.has(l.repoId)) return 0
        if (hoverId) return l.repoId === hoverId || l.agentId === hoverId ? 0.8 : 0.03
        return st.active.has(l.repoId) && st.active.has(l.agentId) ? 0.45 : 0.04
      })

      labelSel.attr("opacity", (d) =>
        st.hidden.has(d.id)
          ? 0
          : hoverSet
            ? hoverSet.has(d.id)
              ? 1
              : 0.1
            : st.active.has(d.id)
              ? 1
              : 0.25,
      )
    }

    sim.on("tick", () => {
      nodes.forEach((n) => {
        n.x = Math.max(n.r + 4, Math.min(W - n.r - 4, n.x ?? W / 2))
        n.y = Math.max(n.r + 4, Math.min(H - n.r - 4, n.y ?? H / 2))
      })
      linkSel
        .attr("x1", (l) => (l.source as SimNode).x ?? 0)
        .attr("y1", (l) => (l.source as SimNode).y ?? 0)
        .attr("x2", (l) => (l.target as SimNode).x ?? 0)
        .attr("y2", (l) => (l.target as SimNode).y ?? 0)
      nodeSel.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0)
      labelSel.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0)
    })

    applyRef.current(null)
    return () => {
      sim.stop()
      applyRef.current = null
    }
  }, [data, repoById])

  // Filtros mudaram: só atualiza o estilo, sem mexer no layout.
  useEffect(() => {
    applyRef.current?.(null)
  }, [style])

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: 600 }}
        role="img"
        aria-label="Rede entre agentes e repositórios. Clique num nó para filtrar."
      />
      <div className="legend-row">
        {AGENTS.map((a) => (
          <span key={a} className="legend-item">
            <span className="dot" style={{ background: AGENT_COLORS[a] }} />
            {a}
          </span>
        ))}
      </div>
      <p className="note">
        Círculos grandes = agentes; pequenos = repositórios (cor do agente que mais contribui).
        Tamanho = PRs; espessura da aresta = PRs do agente no repositório. A rede cobre só os 100
        repositórios mais ativos. Passe o mouse para ver vizinhos; clique para filtrar.
      </p>
    </div>
  )
}
