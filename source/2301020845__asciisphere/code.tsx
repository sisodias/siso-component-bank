"use client";

import { useEffect, useRef } from "react";

export interface AsciiSphereProps {
  /**
   * The characters used to render the sphere, ordered from dark to light.
   * @default "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯"
   */
  chars?: string;
  /**
   * Rotation speed around the X axis.
   * @default 0.2
   */
  speedX?: number;
  /**
   * Rotation speed around the Y axis.
   * @default 0.3
   */
  speedY?: number;
  /**
   * Speed of animation time increment.
   * @default 0.02
   */
  animationSpeed?: number;
  /**
   * Color of the characters. Supports CSS color values (hex, rgb, etc.) 
   * or "currentColor" to inherit the text color from parent container.
   * @default "currentColor"
   */
  color?: string;
  /**
   * Font size in pixels.
   * @default 12
   */
  fontSize?: number;
  /**
   * Font family.
   * @default "monospace"
   */
  fontFamily?: string;
  /**
   * Radius scale of the sphere relative to the container.
   * @default 0.525
   */
  radiusScale?: number;
  /**
   * Step increment for generating sphere points. Lower values increase density.
   * @default 0.15
   */
  density?: number;
  /**
   * Optional custom CSS class.
   */
  className?: string;
}

export default function AsciiSphere({
  chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯",
  speedX = 0.2,
  speedY = 0.3,
  animationSpeed = 0.02,
  color = "currentColor",
  fontSize = 12,
  fontFamily = "monospace",
  radiusScale = 0.525,
  density = 0.15,
  className,
}: AsciiSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const helperGetRGB = (element: HTMLElement, colorValue: string): string => {
      if (colorValue === "currentColor") {
        const style = window.getComputedStyle(element);
        const resolvedColor = style.color || "rgb(0,0,0)";
        const match = resolvedColor.match(/\d+/g);
        if (match && match.length >= 3) {
          return `${match[0]}, ${match[1]}, ${match[2]}`;
        }
        return "0, 0, 0";
      }

      // Check if it's hex, rgb, or other color
      const tempElement = document.createElement("div");
      tempElement.style.color = colorValue;
      document.body.appendChild(tempElement);
      const computed = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);

      const match = computed.match(/\d+/g);
      if (match && match.length >= 3) {
        return `${match[0]}, ${match[1]}, ${match[2]}`;
      }
      return "0, 0, 0";
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * radiusScale;

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];
      const rgbBase = helperGetRGB(canvas, color);

      // Generate sphere points
      for (let phi = 0; phi < Math.PI * 2; phi += density) {
        for (let theta = 0; theta < Math.PI; theta += density) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.5);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.5);
          const z = Math.cos(theta);

          // Rotate around Y axis
          const rotY = time * speedY;
          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          // Rotate around X axis
          const rotX = time * speedX;
          const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
          const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

          const depth = (finalZ + 1) / 2;
          const charIndex = Math.floor(depth * (chars.length - 1));

          points.push({
            x: centerX + newX * radius,
            y: centerY + newY * radius,
            z: finalZ,
            char: chars[Math.max(0, Math.min(charIndex, chars.length - 1))],
          });
        }
      }

      // Sort by depth (z-index) so the elements render correctly in 3D projection
      points.sort((a, b) => a.z - b.z);

      // Draw points
      points.forEach((point) => {
        const alpha = 0.15 + (point.z + 1) * 0.425;
        ctx.fillStyle = `rgba(${rgbBase}, ${alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      });

      time += animationSpeed;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [chars, speedX, speedY, animationSpeed, color, fontSize, fontFamily, radiusScale, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className || ""}`}
      style={{ display: "block" }}
    />
  );
}
