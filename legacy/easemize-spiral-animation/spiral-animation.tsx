import React, { useEffect, useRef } from 'react';

interface SpiralAnimationProps {
  totalDots?: number;
  size?: number;
  dotRadius?: number;
  margin?: number;
  duration?: number;
  dotColor?: string;
  backgroundColor?: string;
}

const SpiralAnimation: React.FC<SpiralAnimationProps> = ({
  totalDots = 600,
  size = 400,
  dotRadius = 2,
  margin = 2,
  duration = 3,
  dotColor = '#fff',
  backgroundColor = '#000'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // 2π/φ²
    const CENTER = size / 2;
    const MAX_RADIUS = CENTER - margin - dotRadius;
    const svgNS = "http://www.w3.org/2000/svg";

    // Clear any existing content
    svg.innerHTML = '';

    // Generate & animate dots
    for (let i = 0; i < totalDots; i++) {
      const idx = i + 0.5;
      const frac = idx / totalDots;
      const r = Math.sqrt(frac) * MAX_RADIUS;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);

      // Perfect SVG circle
      const c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", x.toString());
      c.setAttribute("cy", y.toString());
      c.setAttribute("r", dotRadius.toString());
      c.setAttribute("fill", dotColor);
      c.setAttribute("opacity", "0.6");
      svg.appendChild(c);

      // Radius pulse
      const animR = document.createElementNS(svgNS, "animate");
      animR.setAttribute("attributeName", "r");
      animR.setAttribute(
        "values",
        `${dotRadius * 0.5};${dotRadius * 1.5};${dotRadius * 0.5}`
      );
      animR.setAttribute("dur", `${duration}s`);
      animR.setAttribute("begin", `${frac * duration}s`);
      animR.setAttribute("repeatCount", "indefinite");
      animR.setAttribute("calcMode", "spline");
      animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      c.appendChild(animR);

      // Opacity pulse
      const animO = document.createElementNS(svgNS, "animate");
      animO.setAttribute("attributeName", "opacity");
      animO.setAttribute("values", "0.3;1;0.3");
      animO.setAttribute("dur", `${duration}s`);
      animO.setAttribute("begin", `${frac * duration}s`);
      animO.setAttribute("repeatCount", "indefinite");
      animO.setAttribute("calcMode", "spline");
      animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      c.appendChild(animO);
    }
  }, [totalDots, size, dotRadius, margin, duration, dotColor]);

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
    >
      <div style={{ width: size, height: size }}>
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        />
      </div>
    </div>
  );
};

export {SpiralAnimation}
