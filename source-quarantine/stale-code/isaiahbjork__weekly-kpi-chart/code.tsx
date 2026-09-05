"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export type DayPoint = {
  day: "S" | "M" | "T" | "W" | "T" | "F" | "S";
  value: number;
};

interface WeeklyKPIChartProps {
  data: DayPoint[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  dotColor?: string;
  lineColor?: string;
}

const WeeklyKPIChart: React.FC<WeeklyKPIChartProps> = ({
  data,
  width = 400,
  height = 280,
  className = "",
  color = "#253043",
  gradientColor = "#CED7DD",
  dotColor = "#7AA6D1",
  lineColor = "#9f9fa980",
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(2); // Default to Tuesday

  // Chart dimensions with more padding
  const padding = 40;
  const bottomPadding = 40; // More bottom padding
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding - bottomPadding;
  const barSpacing = chartWidth / data.length;
  const baseline = height - bottomPadding;
  const baselineOffset = 8; // Reduced from 12 to bring lines closer to text

  // Calculate scaling
  const maxValue = Math.max(...data.map((d) => d.value));
  const availableHeight = chartHeight - 40;
  const getBarHeight = (value: number) => (value / maxValue) * availableHeight;

  // Animation variants
  const barVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    hover: { scale: 1.05 },
  };

  return (
    <div className={`relative p-4 ${className}`}>
      {/* Selected bar gradient background using motion.div */}
      {data.map((point, index) => {
        const x = padding + index * barSpacing + barSpacing / 2;
        const isSelected = index === selectedIndex;

        if (!isSelected) return null;

        // Calculate dynamic gradient dimensions based on bar height
        const barHeight = getBarHeight(point.value);
        const lineStartY = baseline - baselineOffset;
        const lineEndY = lineStartY - barHeight;

        // Dynamic gradient height - extends from top of chart to bottom of dates
        const gradientTop = Math.max(padding, lineEndY - 40); // Start above the bar with some margin
        const gradientBottom = baseline + 60; // End below the dates
        const gradientHeight = gradientBottom - gradientTop;

        return (
          <motion.div
            key={`gradient-${index}`}
            className="absolute"
            style={{
              left: `${x - 20 + 16}px`, // x position + parent padding (16px from p-4)
              top: `${gradientTop}px`, // Dynamic top based on bar height
              width: "40px",
              height: `${gradientHeight}px`, // Dynamic height
              background: `linear-gradient(to top, ${gradientColor}50, ${gradientColor}30 15%, rgba(255, 255, 255, 0.0))`,
              borderRadius: "20px 20px 20px 20px", // Fully rounded like a pill
              pointerEvents: "none",
              zIndex: 1,
              transformOrigin: "bottom",
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "relative", zIndex: 2 }}
      >
        {data.map((point, index) => {
          const x = padding + index * barSpacing + barSpacing / 2;
          const barHeight = getBarHeight(point.value);
          const lineStartY = baseline - baselineOffset;
          const lineEndY = lineStartY - barHeight;
          const isSelected = index === selectedIndex;

          return (
            <g key={`${point.day}-${index}`}>
              {/* Invisible larger clickable area */}
              <rect
                x={x - 25}
                y={0}
                width={50}
                height={height}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedIndex(index)}
              />

              {/* Bar line - fixed size and always on top */}
              <motion.line
                x1={x}
                y1={lineStartY}
                x2={x}
                y2={lineEndY}
                stroke={lineColor}
                strokeWidth={2}
                strokeLinecap="round"
                variants={barVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1, duration: 0.6 }}
                style={{ pointerEvents: "none" }}
              />

              {isSelected ? (
                <>
                  {/* Pill background for text */}
                  <motion.rect
                    x={x - 25}
                    y={lineEndY - 29}
                    width={50}
                    height={20}
                    rx={10}
                    ry={10}
                    fill={color}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    style={{ pointerEvents: "none" }}
                  />
                  <motion.text
                    x={x}
                    y={lineEndY - 15}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    style={{ pointerEvents: "none" }}
                  >
                    ${point.value.toLocaleString()}
                  </motion.text>
                </>
              ) : (
                <motion.circle
                  cx={x}
                  cy={lineEndY - 12}
                  r={3}
                  fill={dotColor}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: "none" }}
                />
              )}

              {/* Small circle for selected day */}
              {isSelected && (
                <motion.circle
                  cx={x}
                  cy={baseline + 20}
                  r={12}
                  fill={color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: "none" }}
                />
              )}

              {/* Day letter - all at the same position */}
              <motion.text
                x={x}
                y={baseline + 21}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight={isSelected ? "600" : "400"}
                fill={isSelected ? "white" : "#64748b"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedIndex(index)}
              >
                {point.day}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export { WeeklyKPIChart };
