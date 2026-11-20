
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "agent" | "repository";
}

interface NetworkEdge {
  source: string | NetworkNode;
  target: string | NetworkNode;
  prs: number;
}

interface Props {
  data: {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  };
}

export default function NetworkChart({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = 900;
    const height = 550;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes = data.nodes.map(node => ({ ...node }));
    const links = data.edges.map(edge => ({ ...edge }));

    const simulation = d3.forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(25));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", (d: any) =>
        Math.max(1, Math.sqrt(d.prs))
      );

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.type === "agent" ? 12 : 7)
      .attr("fill", (d: any) =>
        d.type === "agent" ? "#2563eb" : "#14b8a6"
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .call(
        d3.drag<SVGCircleElement, NetworkNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node.append("title")
      .text((d: any) => d.label);

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodes.filter(d => d.type === "agent"))
      .join("text")
      .text(d => d.label)
      .attr("font-size", 12)
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", "currentColor");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", d => d.x ?? 0)
        .attr("cy", d => d.y ?? 0);

      labels
        .attr("x", d => d.x ?? 0)
        .attr("y", d => d.y ?? 0);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 900 550"
        style={{ width: "100%", minWidth: 600 }}
      />
      <div style={{ display: "flex", gap: 20 }}>
        <span>🔵 Agentes</span>
        <span>🟢 Repositórios</span>
      </div>
    </div>
  );
}
