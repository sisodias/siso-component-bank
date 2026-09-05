"use client";

import * as React from "react";

export const description = "A step area chart";

const chartData = [
  { month: "January", desktop: 99 },
  { month: "February", desktop: 204 },
  { month: "March", desktop: 180 },
  { month: "April", desktop: 120 },
  { month: "May", desktop: 180 },
  { month: "June", desktop: 42 },
];

const WIDTH = 720;
const HEIGHT = 360;
const PADDING = { top: 28, right: 28, bottom: 48, left: 46 };
const maxValue = 240;

function point(index: number, value: number) {
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
  return {
    x: PADDING.left + (innerWidth / (chartData.length - 1)) * index,
    y: PADDING.top + innerHeight - (value / maxValue) * innerHeight,
  };
}

function stepPath() {
  const points = chartData.map((item, index) => point(index, item.desktop));
  return points
    .map((p, index) => {
      if (index === 0) return `M ${p.x} ${p.y}`;
      const prev = points[index - 1];
      return `H ${p.x} V ${p.y}`;
    })
    .join(" ");
}

function areaPath() {
  const points = chartData.map((item, index) => point(index, item.desktop));
  const baseY = HEIGHT - PADDING.bottom;
  return `${stepPath()} L ${points[points.length - 1].x} ${baseY} H ${points[0].x} Z`;
}

export default function ChartAreaStep() {
  const [activeIndex, setActiveIndex] = React.useState(1);
  const active = chartData[activeIndex];
  const activePoint = point(activeIndex, active.desktop);
  const xTicks = chartData.map((item, index) => ({ ...point(index, 0), label: item.month.slice(0, 3) }));
  const yTicks = [0, 60, 120, 180, 240];

  return (
    <div className="retro w-full rounded-none border-[6px] border-foreground bg-background p-4 text-foreground shadow-[8px_8px_0_0_var(--foreground)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Desktop</p>
          <h3 className="mt-2 text-sm">Step Area Chart</h3>
        </div>
        <div className="border-[4px] border-foreground bg-card px-3 py-2 text-right text-[10px] leading-relaxed">
          <span className="block text-muted-foreground">{active.month}</span>
          <span className="text-foreground">{active.desktop}</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full overflow-visible" role="img" aria-label="Step area chart for desktop traffic">
        <defs>
          <pattern id="pixel-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
          </pattern>
        </defs>

        <rect x={PADDING.left} y={PADDING.top} width={WIDTH - PADDING.left - PADDING.right} height={HEIGHT - PADDING.top - PADDING.bottom} fill="url(#pixel-grid)" />

        {yTicks.map((tick) => {
          const y = point(0, tick).y;
          return (
            <g key={tick} className="text-muted-foreground">
              <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.32" strokeDasharray="8 8" />
              <text x={PADDING.left - 14} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor">{tick}</text>
            </g>
          );
        })}

        <path d={areaPath()} fill="var(--chart-1)" opacity="0.38" />
        <path d={stepPath()} fill="none" stroke="var(--chart-1)" strokeWidth="6" strokeLinejoin="miter" strokeLinecap="square" />

        {chartData.map((item, index) => {
          const p = point(index, item.desktop);
          const isActive = index === activeIndex;
          return (
            <g key={item.month} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} tabIndex={0} className="cursor-pointer outline-none">
              <line x1={p.x} x2={p.x} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} stroke="transparent" strokeWidth="46" />
              <rect x={p.x - 7} y={p.y - 7} width="14" height="14" fill={isActive ? "var(--foreground)" : "var(--chart-1)"} stroke="var(--background)" strokeWidth="3" />
            </g>
          );
        })}

        {xTicks.map((tick) => (
          <text key={tick.label} x={tick.x} y={HEIGHT - 18} textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground">{tick.label}</text>
        ))}

        <g transform={`translate(${Math.min(activePoint.x + 14, WIDTH - 170)} ${Math.max(activePoint.y - 62, 18)})`}>
          <rect width="152" height="46" fill="var(--background)" stroke="var(--foreground)" strokeWidth="4" />
          <text x="12" y="18" fontSize="10" fill="currentColor">{active.month}</text>
          <text x="12" y="34" fontSize="10" fill="currentColor">Desktop: {active.desktop}</text>
        </g>
      </svg>
    </div>
  );
}
