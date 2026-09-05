"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// =========================================
// 1. BRUTALIST BAR CHART
// =========================================
const BAR_DATA = [
  { label: "MON", value: 40, color: "bg-red-400" },
  { label: "TUE", value: 60, color: "bg-blue-400" },
  { label: "WED", value: 25, color: "bg-green-400" },
  { label: "THU", value: 80, color: "bg-yellow-400" },
  { label: "FRI", value: 65, color: "bg-purple-400" },
];

const BrutalistBarChart = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative flex flex-col p-6 transition-colors duration-200">
      <h3 className="font-black uppercase text-xl mb-6 border-b-[3px] border-black dark:border-white pb-2 text-black dark:text-white">
        Weekly Traffic
      </h3>
      <div className="flex justify-between items-end flex-1 gap-2 sm:gap-4 min-h-[150px]">
        {BAR_DATA.map((item, i) => (
          <div key={i} className="relative flex-1 h-full flex items-end group">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${item.value}%` }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: i * 0.1,
              }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className={cn(
                "w-full border-[3px] border-black dark:border-white relative z-10 cursor-pointer origin-bottom flex items-center justify-center overflow-hidden",
                item.color
              )}
              whileHover={{ scaleY: 1.1, scaleX: 1.05 }}
              whileTap={{ scaleY: 0.95 }}
            >
              <div
                className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]"
              />
              <span className="relative z-20 font-bold text-xs font-mono text-black/80 dark:text-black/80 group-hover:text-black transition-colors">
                {item.label}
              </span>
            </motion.div>
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-full -mb-2 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-sm font-black whitespace-nowrap border-[3px] border-black dark:border-white z-30 pointer-events-none"
                >
                  {item.value}%
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. BRUTALIST RADAR CHART
// ==========================================
const RADAR_DATA = [
  { label: "SPEED", value: 85, color: "#f87171" },
  { label: "UPTIME", value: 95, color: "#4ade80" },
  { label: "SECURE", value: 75, color: "#60a5fa" },
  { label: "UX", value: 65, color: "#fbbf24" },
  { label: "SEO", value: 80, color: "#a78bfa" },
];

const NUM_AXES = RADAR_DATA.length;
const RADAR_SIZE = 200;
const CENTER = RADAR_SIZE / 2;
const RADIUS = 80;

const angleToRad = (angle: number) => (Math.PI / 180) * angle;
const getCoords = (value: number, index: number) => {
  const angle = angleToRad((360 / NUM_AXES) * index - 90);
  const r = (value / 100) * RADIUS;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
};

const BrutalistRadarChart = () => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const pathData =
    RADAR_DATA.map((d, i) => {
      const coords = getCoords(d.value, i);
      return `${i === 0 ? "M" : "L"} ${coords.x} ${coords.y}`;
    }).join(" ") + " Z";

  const gridLevels = [100, 75, 50, 25];

  return (
    <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 flex flex-col sm:flex-row gap-6 relative overflow-hidden transition-colors duration-200">
      {/* LEFT: CHART AREA */}
      <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10">
          <span className="text-8xl font-black uppercase text-black dark:text-white">
            STATS
          </span>
        </div>

        <svg
          viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
          className="w-full h-full max-w-75 overflow-visible"
        >
          {/* Grid Background */}
          {gridLevels.map((level, lvlIdx) => (
            <path
              key={lvlIdx}
              d={
                RADAR_DATA.map((_, i) => {
                  const c = getCoords(level, i);
                  return `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`;
                }).join(" ") + " Z"
              }
              fill="none"
              // Use Tailwind classes for stroke color in SVG
              className="stroke-black/10 dark:stroke-white/10"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          ))}

          {/* Axes Lines */}
          {RADAR_DATA.map((_, i) => {
            const outer = getCoords(100, i);
            return (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                className="stroke-black/10 dark:stroke-white/10"
                strokeWidth="2"
              />
            );
          })}

          {/* The Data Polygon */}
          <motion.path
            d={pathData}
            fill="rgba(167, 139, 250, 0.5)"
            // Use current text color for stroke or explicit classes
            className="stroke-black dark:stroke-white"
            strokeWidth="4"
            strokeLinejoin="round"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            style={{ originX: "50%", originY: "50%" }}
          />

          {/* Interactive Points */}
          {RADAR_DATA.map((d, i) => {
            const coords = getCoords(d.value, i);
            const isHovered = hoveredMetric === d.label;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredMetric(d.label)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="cursor-pointer"
              >
                {/* 1. Invisible Hit Area */}
                <circle cx={coords.x} cy={coords.y} r="20" fill="transparent" />

                {/* 2. Visible Dot with Animation */}
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r="6"
                  fill={isHovered ? d.color : "currentColor"}
                  className="fill-white dark:fill-zinc-900 stroke-black dark:stroke-white"
                  strokeWidth="3"
                  animate={{
                    scale: isHovered ? 2 : 1,
                    strokeWidth: isHovered ? 4 : 3,
                    fill: isHovered ? d.color : "var(--dot-bg, white)", // Dynamic fallback
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* RIGHT: STATS LIST */}
      <div className="w-full sm:w-40 flex flex-col justify-center gap-2 z-10">
        <h3 className="font-black uppercase text-xl mb-2 border-b-[3px] border-black dark:border-white pb-2 text-black dark:text-white">
          System Health
        </h3>
        {RADAR_DATA.map((item, i) => (
          <motion.div
            key={i}
            onMouseEnter={() => setHoveredMetric(item.label)}
            onMouseLeave={() => setHoveredMetric(null)}
            className="flex items-center justify-between p-2 border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            animate={{
              x: hoveredMetric === item.label ? 10 : 0,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 border-2 border-black dark:border-white"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold font-mono text-black dark:text-zinc-200">
                {item.label}
              </span>
            </div>
            <span className="font-black text-sm text-black dark:text-white">
              {item.value}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// =========================================
// 3. BRUTALIST DONUT CHART
// =========================================
const PIE_DATA = [
  { label: "CPU", value: 35, color: "#f87171" },
  { label: "Memory", value: 25, color: "#4ade80" },
  { label: "I/O", value: 25, color: "#60a5fa" },
  { label: "Latency", value: 15, color: "#fbbf24" },
];

const springConfig = { type: "spring", stiffness: 300, damping: 20 };
const getPieCoords = (percent: number) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};

const BrutalistDonut = () => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  let cumulativePercent = 0;

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-6 flex flex-col items-center justify-between overflow-hidden relative transition-colors duration-200">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none z-0 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:12px_12px]"
      />
      <h3 className="font-black uppercase tracking-tighter text-2xl border-b-[3px] border-black dark:border-white pb-2 mb-8 w-full text-center z-10 text-black dark:text-white">
        System Load
      </h3>
      <div className="z-10 flex flex-col items-center w-full h-full justify-center">
        <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
          <motion.svg
            viewBox="-1.2 -1.2 2.4 2.4"
            className="-rotate-90 overflow-visible w-full h-full"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: -90, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2,
            }}
          >
            {PIE_DATA.map((slice) => {
              const startPercent = cumulativePercent;
              const endPercent = cumulativePercent + slice.value / 100;
              cumulativePercent = endPercent;
              const [startX, startY] = getPieCoords(startPercent);
              const [endX, endY] = getPieCoords(endPercent);
              const largeArcFlag = slice.value / 100 > 0.5 ? 1 : 0;
              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`,
              ].join(" ");
              const isHovered = hoveredSlice === slice.label;
              const isDimmed = hoveredSlice !== null && !isHovered;

              return (
                <motion.path
                  key={slice.label}
                  d={pathData}
                  fill={slice.color}
                  className="stroke-black dark:stroke-white"
                  strokeWidth="0.04"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{
                    translateX: isHovered ? (startX + endX) * 0.1 : 0,
                    translateY: isHovered ? (startY + endY) * 0.1 : 0,
                    scale: isHovered ? 1.05 : 1,
                    opacity: isDimmed ? 0.3 : 1,
                    filter: isDimmed ? "grayscale(80%)" : "grayscale(0%)",
                  }}
                  transition={springConfig}
                  onMouseEnter={() => setHoveredSlice(slice.label)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
            <motion.circle
              cx="0"
              cy="0"
              r="0.55"
              className="fill-white dark:fill-zinc-900 stroke-black dark:stroke-white"
              strokeWidth="0.04"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, ...springConfig }}
            />
          </motion.svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <AnimatePresence mode="popLayout">
              {hoveredSlice ? (
                <motion.div
                  key="hover-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-xl font-black leading-none text-black dark:text-white">
                    {PIE_DATA.find((d) => d.label === hoveredSlice)?.value}%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black px-1 mt-1">
                    {hoveredSlice}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="default-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-3xl font-black leading-none text-black dark:text-white">
                    100%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    TOTAL
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="w-full mt-6 grid grid-cols-2 gap-2">
          {PIE_DATA.map((item) => (
            <motion.div
              key={item.label}
              onMouseEnter={() => setHoveredSlice(item.label)}
              onMouseLeave={() => setHoveredSlice(null)}
              animate={{
                opacity: hoveredSlice && hoveredSlice !== item.label ? 0.3 : 1,
                scale: hoveredSlice === item.label ? 1.05 : 1,
              }}
              className="flex items-center gap-2 p-2 border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <div
                className="w-3 h-3 border-2 border-black dark:border-white"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-3xl font-bold uppercase text-black dark:text-white">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =========================================
// 4. MAIN BENTO LAYOUT (THE PAGE)
// =========================================
export default function BentoDashboard() {
  return (
    <div className="min-h-screen w-full bg-zinc-100 dark:bg-black p-4 md:p-12 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col transition-colors duration-200">
      {/* Texture Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"
      />

      <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col flex-1">
        <header className="mb-6 md:mb-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">
            Analytics
          </h1>
          <p className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest text-xs md:text-sm">
            System Overview Dashboard
          </p>
        </header>

        {/* MAIN GRID TAKES REMAINING HEIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-[minmax(0,1fr)]">
          {/* COLUMN 1 (LEFT): STACKED BAR + RADAR */}
          <div className="flex flex-col gap-6">
            <div className="w-full min-h-[400px]">
              <BrutalistBarChart />
            </div>
            <div className="w-full min-h-[400px]">
              <BrutalistRadarChart />
            </div>
          </div>

          {/* COLUMN 2 (RIGHT): FULL HEIGHT DONUT */}
          <div className="h-full min-h-[500px] lg:h-auto flex">
            <div className="w-full h-full">
              <BrutalistDonut />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}