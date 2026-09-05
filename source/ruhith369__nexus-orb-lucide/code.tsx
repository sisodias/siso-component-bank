"use client";

import React, { useState } from "react";
import {
  Cpu,
  Cloud,
  Database,
  Globe2,
  Layers,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";

const IconWrapper = ({
  children,
  className = "",
  isHighlighted = false,
  isHovered = false,
  animationDelay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  isHighlighted?: boolean;
  isHovered?: boolean;
  animationDelay?: number;
}) => (
  <div
    className={`
      backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all duration-300
      ${
        isHighlighted
          ? "bg-gradient-to-br from-blue-400/30 to-blue-600/20 dark:from-blue-500/40 dark:to-blue-800/20 border border-blue-400/40 shadow-lg shadow-blue-500/30 animate-breathing-glow"
          : "bg-white/60 dark:bg-white/10 border border-gray-200/50 dark:border-white/10"
      }
      ${
        isHovered
          ? "scale-110 border-blue-400/50 shadow-lg shadow-blue-400/40"
          : "hover:scale-105 hover:border-blue-300/40"
      }
      ${className}
    `}
    style={{ animationDelay: `${animationDelay}s` }}
  >
    {children}
  </div>
);

const IconGrid = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const outerIcons = [
    { id: 1, component: <Cpu size={36} /> },
    { id: 2, component: <Cloud size={36} /> },
    { id: 3, component: <Database size={36} /> },
    { id: 4, component: <Globe2 size={36} /> },
    { id: 5, component: <Layers size={36} /> },
    { id: 6, component: <Rocket size={36} /> },
    { id: 7, component: <Shield size={36} /> },
    { id: 8, component: <Zap size={36} /> },
  ];

  const radius = 160;
  const svgSize = 420;
  const center = svgSize / 2;

  return (
    <div className="relative w-[420px] h-[420px] scale-75 md:scale-100">
      {/* connecting lines */}
      <svg width={svgSize} height={svgSize} className="absolute top-0 left-0">
        {outerIcons.map((icon, i) => {
          const angle = (-90 + i * (360 / outerIcons.length)) * (Math.PI / 180);
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          const lineEndX = center + radius * x;
          const lineEndY = center + radius * y;
          return (
            <line
              key={icon.id}
              x1={center}
              y1={center}
              x2={lineEndX}
              y2={lineEndY}
              stroke={hoveredId === icon.id ? "#3B82F6" : "#9CA3AF"}
              strokeWidth="1.5"
              style={{
                opacity: hoveredId === icon.id ? 0.9 : 0.3,
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </svg>

      {/* Core Icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <IconWrapper className="w-24 h-24" isHighlighted={true}>
          <Cpu size={40} />
        </IconWrapper>
      </div>

      {/* Outer Icons */}
      {outerIcons.map((icon, i) => {
        const angle = (-90 + i * (360 / outerIcons.length)) * (Math.PI / 180);
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <div
            key={icon.id}
            className="absolute z-10"
            style={{
              top: `calc(50% + ${y}px)`,
              left: `calc(50% + ${x}px)`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredId(icon.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <IconWrapper
              className="w-20 h-20"
              isHovered={hoveredId === icon.id}
              animationDelay={i * 0.1}
            >
              {icon.component}
            </IconWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default function NexusOrbLucide() {
  return (
    <div className="relative w-full flex items-center justify-center font-sans py-16 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 z-0" />

      {/* glowing core background */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-blue-400/10 dark:bg-blue-600/10 blur-3xl rounded-full z-0" />

      <div className="relative z-10">
        <IconGrid />
      </div>

      {/* breathing glow animation */}
      <style jsx>{`
        @keyframes breathing-glow {
          0% {
            box-shadow: 0 0 20px 0px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 35px 10px rgba(59, 130, 246, 0.15);
          }
          100% {
            box-shadow: 0 0 20px 0px rgba(59, 130, 246, 0.3);
          }
        }
        .animate-breathing-glow {
          animation: breathing-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
