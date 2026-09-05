"use client";

import { cn } from "../_utils/cn";
import { useState } from "react";
import { AreaChart, Area, YAxis, ResponsiveContainer } from "recharts";

interface HudAreaChartProps {
  showYAxis: boolean;
  data: { time: string; value: number }[];
  gradientColor?: string;
  borderColor?: string;
  dotColor?: string;
  dotSize?: number;
  dotOpacity?: number;
  scale?: number;
}

export function HudAreaChart({
  showYAxis = false,
  data = [],
  gradientColor = "#ffffff",
  borderColor = "#ffffff",
  dotColor = "#ffffff",
  dotSize = 0.8,
  dotOpacity = 0.1,
  scale = 1,
}: HudAreaChartProps) {
  const [hoveredData, setHoveredData] = useState<{
    time: string;
    value: number;
  } | null>(null);

  const handleMouseMove = (state: { activePayload?: Array<{ payload: { time: string; value: number } }> }) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      setHoveredData({
        time: state.activePayload[0].payload.time,
        value: state.activePayload[0].payload.value,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
  };

  return (
    <div 
      className="relative w-96 h-80"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* SVG Frame Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 152 149" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Dotted grid pattern */}
            <pattern id="dotGrid" x="0" y="0" width="16.89" height="14.9" patternUnits="userSpaceOnUse">
              <circle cx="8.445" cy="7.45" r={dotSize} fill={dotColor} opacity={dotOpacity} />
            </pattern>
            
            {/* Clipping path for the chart area */}
            <clipPath id="chartClip">
              <path d="M1 1h149.894v131.772L135.145 147.521H1V1z" />
            </clipPath>
          </defs>
          
          {/* Grid background */}
          <rect x="1" y="1" width="150.894" height="146.521" fill="url(#dotGrid)" />
          
          {/* Frame border */}
          <path 
            d="M136.145 148.521H0V0H151.894V132.772L136.145 148.521ZM1 147.521H135.73L150.894 132.358V1H1V147.521Z" 
            fill={borderColor}
          />
        </svg>
      </div>

      {/* Graph Container with clipping */}
      <div 
        className="absolute inset-y-4 -left-3 right-7 bottom-0 z-0"
        style={{
          clipPath: "polygon(0.6% 0.7%, 99.3% 0.7%, 99.3% 89.2%, 89.5% 99%, 0.6% 99%)"
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 1, left: -18, bottom: 0 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              {/* Radial gradient to eliminate baseline visibility */}
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColor} stopOpacity={0.4} />
                <stop offset="20%" stopColor={gradientColor} stopOpacity={0.25} />
                <stop offset="40%" stopColor={gradientColor} stopOpacity={0.15} />
                <stop offset="70%" stopColor={gradientColor} stopOpacity={0.05} />
                <stop offset="90%" stopColor={gradientColor} stopOpacity={0.01} />
                <stop offset="100%" stopColor="transparent" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Y Axis */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: gradientColor, fontSize: 10 }}
              className={cn(showYAxis ? "opacity-100" : "opacity-0")}
            />

            {/* Area with baseline-friendly gradient */}
            <Area
              type="monotone"
              dataKey="value"
              stroke={borderColor}
              strokeWidth={1.5}
              fill="url(#gradient)"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Left Data Display */}
      {hoveredData && (
        <div className="absolute bottom-4 left-10 text-primary font-mono text-xs z-20">
          {hoveredData.time} : {hoveredData.value}
        </div>
      )}
    </div>
  );
}
