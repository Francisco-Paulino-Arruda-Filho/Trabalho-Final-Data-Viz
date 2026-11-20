
import { useMemo } from "react";
import * as d3 from "d3";

interface DayData {
  date: string;
  count: number;
  dow: number;
  week: string;
}

interface Props {
  data: DayData[];
}

export default function CalendarChart({ data }: Props) {
  const cellSize = 14;
  const gap = 3;
  const step = cellSize + gap;

  const weeks = useMemo(
    () => [...new Set(data.map(d => d.week))].sort(),
    [data]
  );

  const width = Math.max(weeks.length * step + 50, 600);
  const height = 7 * step + 35;

  const weekIndex = new Map(
    weeks.map((week, index) => [week, index])
  );

  const color = d3.scaleSequential()
    .domain([0, d3.max(data, d => d.count) || 1])
    .interpolator(d3.interpolateBlues);

  const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={width} height={height}>
        {weekdays.map((day, index) => (
          <text
            key={day}
            x={0}
            y={index * step + 12}
            fontSize={10}
            fill="currentColor"
          >
            {day}
          </text>
        ))}

        {data.map(day => {
          const x = (weekIndex.get(day.week) ?? 0) * step + 35;
          const y = day.dow * step;

          return (
            <rect
              key={day.date}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={3}
              fill={day.count === 0 ? "#e5e7eb" : color(day.count)}
            >
              <title>
                {day.date}: {day.count} PRs
              </title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}
