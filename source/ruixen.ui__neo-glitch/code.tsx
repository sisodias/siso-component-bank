"use client";
import React, { useRef, useEffect, useMemo } from "react";

interface NeoGlitchProps {
  text: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  baseColor?: string;
  hoverIntensity?: number;
  glowColor?: string;
  animationSpeed?: number; // higher = faster
}

export const NeoGlitch: React.FC<NeoGlitchProps> = ({
  text,
  fontFamily = "'Major Mono Display', monospace",
  fontSize = "10rem",
  fontWeight = 700,
  baseColor = "#00bfff", // bright blue
  hoverIntensity = 20,
  glowColor = "#ffffff", // white glow
  animationSpeed = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const intensityRef = useRef<number>(0);

  const font = useMemo(() => `${fontWeight} ${fontSize} ${fontFamily}`, [
    fontWeight,
    fontSize,
    fontFamily,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isCancelled = false;
    intensityRef.current = 0;

    const render = () => {
      if (isCancelled) return;

      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = font;

      // Base glow text
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 15;
      ctx.fillStyle = baseColor;
      ctx.fillText(text, width / 2, height / 2);

      // Glitch layers with subtle RGB offsets
      const layers = [
        { r: 0, g: 200, b: 255 }, // blue
        { r: 255, g: 255, b: 255 }, // white
        { r: 150, g: 150, b: 150 }, // gray
      ];

      layers.forEach(layer => {
        const offsetX = (Math.random() - 0.5) * intensityRef.current;
        const offsetY = (Math.random() - 0.5) * intensityRef.current * 0.3;
        ctx.fillStyle = `rgb(${layer.r},${layer.g},${layer.b})`;
        ctx.fillText(text, width / 2 + offsetX, height / 2 + offsetY);
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    const handleMouseEnter = () => (intensityRef.current = hoverIntensity);
    const handleMouseLeave = () => (intensityRef.current = 0);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleMouseEnter, { passive: true });
    canvas.addEventListener("touchend", handleMouseLeave, { passive: true });

    return () => {
      isCancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleMouseEnter);
      canvas.removeEventListener("touchend", handleMouseLeave);
    };
  }, [text, font, baseColor, glowColor, hoverIntensity]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "20vh" }} />;
};
