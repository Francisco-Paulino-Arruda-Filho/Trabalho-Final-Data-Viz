import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { DayData } from "../lib/types";
import { AGENT_COLORS } from "../lib/colors";
import { fmtDate, fmtInt } from "../lib/vegaHelpers";
import { useFilters } from "../context/FilterContext";

const CELL = 14;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 34;
const TOP = 20;
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const LEGEND_STOPS = [1, 10, 100, 500, 1000];

interface Cell extends DayData {
  value: number;
}

export default function CalendarChart({ data }: { data: DayData[] }) {
  const { filters, setRange } = useFilters();
  const { agents, range } = filters;

  const brushRef = useRef<SVGGElement>(null);
  const setRangeRef = useRef(setRange);
  setRangeRef.current = setRange;
  const [hover, setHover] = useState<{ x: number; y: number; cell: Cell } | null>(null);

  const weeks = useMemo(() => [...new Set(data.map((d) => d.week))].sort(), [data]);
  const weekIndex = useMemo(() => new Map(weeks.map((w, i) => [w, i])), [weeks]);
  const [minDate, maxDate] = useMemo(() => {
    const ds = data.map((d) => d.date).sort();
    return [ds[0], ds[ds.length - 1]] as const;
  }, [data]);

  // Filtro de agentes: o calendário soma só os agentes selecionados.
  const cells: Cell[] = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        value: agents.length
          ? agents.reduce((s, a) => s + (d.agents?.[a] ?? 0), 0)
          : d.count,
      })),
    [data, agents]
  );

  const maxVal = d3.max(cells, (d) => d.value) || 1;
  const single = agents.length === 1 ? agents[0] : null;

  // Escala simlog: um dia de 1.000 PRs do Codex não apaga os dias de 5 PRs dos outros agentes.
  const color = useMemo(() => {
    const interp = single
      ? d3.interpolateRgb("#e4eaf0", AGENT_COLORS[single] ?? "#2563eb")
      : (t: number) => d3.interpolateBlues(0.12 + 0.88 * t);
    return d3.scaleSequentialSymlog(interp).domain([0, maxVal]);
  }, [single, maxVal]);

  const cellAt = useMemo(
    () => new Map(cells.map((c) => [`${weekIndex.get(c.week)}-${c.dow}`, c])),
    [cells, weekIndex]
  );
  const cellAtRef = useRef(cellAt);
  cellAtRef.current = cellAt;

  const inRange = (date: string) => !range || (date >= range[0] && date <= range[1]);
  const total = cells.reduce((s, c) => (inRange(c.date) ? s + c.value : s), 0);

  const monthLabels = useMemo(() => {
    const out: { x: number; text: string }[] = [];
    let last = "";
    weeks.forEach((w, i) => {
      const m = w.slice(0, 7);
      if (m === last) return;
      last = m;
      const mi = Number(w.slice(5, 7)) - 1;
      const x = LEFT + i * STEP;
      if (out.length && x - out[out.length - 1].x < 40) out.pop(); // evita rótulos sobrepostos
      out.push({ x, text: out.length === 0 || mi === 0 ? `${MESES[mi]} ${w.slice(2, 4)}` : MESES[mi] });
    });
    return out;
  }, [weeks]);

  // Brush horizontal: arrastar seleciona um período e filtra os demais gráficos.
  useEffect(() => {
    if (!brushRef.current || !weeks.length) return;
    const g = d3.select(brushRef.current);
    const w = weeks.length * STEP - GAP;
    const h = 7 * STEP - GAP;

    const brush = d3
      .brushX()
      .extent([
        [LEFT, TOP],
        [LEFT + w, TOP + h],
      ])
      .on("end", (event) => {
        if (!event.sourceEvent) return; // ignora o brush.move programático
        const sel = event.selection as [number, number] | null;
        if (!sel) {
          setRangeRef.current(null); // clique sem arrastar limpa o período
          return;
        }
        const i0 = Math.max(0, Math.floor((sel[0] - LEFT) / STEP));
        const i1 = Math.min(weeks.length - 1, Math.floor((sel[1] - LEFT) / STEP));
        const endD = new Date(`${weeks[i1]}T00:00:00Z`);
        endD.setUTCDate(endD.getUTCDate() + 6);
        const start = weeks[i0] < minDate ? minDate : weeks[i0];
        const end = endD.toISOString().slice(0, 10);
        setRangeRef.current([start, end > maxDate ? maxDate : end]);
        g.call(brush.move as any, null); // a seleção passa a ser mostrada pelo esmaecimento
      });

    g.call(brush);

    const svg = brushRef.current.ownerSVGElement!;
    g.on("mousemove.tip", (event) => {
      const [px, py] = d3.pointer(event, svg);
      const wi = Math.floor((px - LEFT) / STEP);
      const di = Math.floor((py - TOP) / STEP);
      const cell = cellAtRef.current.get(`${wi}-${di}`);
      setHover(cell ? { x: px, y: py, cell } : null);
    }).on("mouseleave.tip", () => setHover(null));

    return () => {
      g.on(".brush", null).on(".tip", null);
      g.selectAll("*").remove();
    };
  }, [weeks, minDate, maxDate]);

  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP + 4;

  return (
    <div>
      <div className="chart-toolbar">
        <span>
          <strong>{fmtInt(total)}</strong> PRs{" "}
          {range ? `entre ${fmtDate(range[0])} e ${fmtDate(range[1])}` : "em todo o período"}
          {agents.length ? ` · ${agents.join(", ")}` : ""}
        </span>
        {range && (
          <button className="link-btn" onClick={() => setRange(null)}>
            Limpar período
          </button>
        )}
      </div>

      <div style={{ overflowX: "auto", position: "relative" }}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Calendário de PRs por dia. Arraste horizontalmente para selecionar um período."
        >
          {monthLabels.map((m) => (
            <text key={m.x} x={m.x} y={12} fontSize={10} fill="currentColor">
              {m.text}
            </text>
          ))}
          {WEEKDAYS.map((d, i) => (
            <text key={d} x={0} y={TOP + i * STEP + 11} fontSize={10} fill="currentColor">
              {d}
            </text>
          ))}

          {cells.map((c) => (
            <rect
              key={c.date}
              x={LEFT + (weekIndex.get(c.week) ?? 0) * STEP}
              y={TOP + c.dow * STEP}
              width={CELL}
              height={CELL}
              rx={3}
              fill={c.value === 0 ? "#e5e7eb" : color(c.value)}
              opacity={inRange(c.date) ? 1 : 0.22}
            />
          ))}

          <g ref={brushRef} />
        </svg>

        {hover && (
          <div className="tip" style={{ left: hover.x + 12, top: hover.y + 12 }}>
            <strong>{fmtDate(hover.cell.date)}</strong>: {fmtInt(hover.cell.value)} PRs
            {agents.length === 0 && hover.cell.agents && (
              <div className="tip-sub">
                {Object.entries(hover.cell.agents)
                  .filter(([, v]) => v > 0)
                  .sort((a, b) => b[1] - a[1])
                  .map(([a, v]) => `${a}: ${fmtInt(v)}`)
                  .join(" · ")}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="legend-row" aria-hidden="true">
        <span>menos</span>
        <span className="swatch" style={{ background: "#e5e7eb" }} title="0 PRs" />
        {LEGEND_STOPS.filter((v) => v <= maxVal).map((v) => (
          <span key={v} className="swatch" style={{ background: color(v) }} title={`${v} PRs`} />
        ))}
        <span>mais (escala raiz/log, máx. {fmtInt(maxVal)}/dia)</span>
      </div>
    </div>
  );
}
