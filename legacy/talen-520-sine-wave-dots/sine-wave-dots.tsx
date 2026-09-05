'use client'
import React, { useRef, useEffect, useMemo, useState } from "react";
import { cn } from "../_utils/cn";

interface SineWaveDotsProps {
  className?: string;
  dotColor?: string;
  dotRadius?: number;
  gap?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

export function SineWaveDots({
  className,
  dotColor = "fill-neutral-400/80",
  dotRadius = 1,
  gap = 20,
  amplitude = 25,
  frequency = 0.01,
  speed = 0.002,
}: SineWaveDotsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeRef = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!svgRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  const dots = useMemo(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return [];

    const dotList: { x: number; y: number }[] = [];
    const numCols = Math.floor(width / gap);
    const numRows = Math.floor(height / gap);
    
    const padding = gap * 4;

    for (let i = -padding / gap; i < numCols + padding / gap; i++) {
      for (let j = -padding / gap; j < numRows + padding / gap; j++) {
        dotList.push({ x: i * gap, y: j * gap });
      }
    }
    return dotList;
  }, [dimensions, gap]);

  useEffect(() => {
    let animationFrameId: number;
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const circles = Array.from(svgElement.getElementsByTagName("circle"));
    if (circles.length === 0) return;

    const animate = () => {
      timeRef.current += speed;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if(!circles[i]) continue;

        const sinValue = Math.sin(dot.x * frequency + timeRef.current);
        const newY = dot.y + sinValue * amplitude;

        circles[i].setAttribute("cy", newY.toString());
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dots, amplitude, frequency, speed]); 

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    >
      <g className={cn("transform-gpu", dotColor)}>
        {dots.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={dotRadius}
          />
        ))}
      </g>
    </svg>
  );
}
