"use client";

import { cn } from "@/lib/utils";
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';
import { useEffect, useRef, useState, useMemo } from 'react';

const FONT = '16px Inter, system-ui, sans-serif';
const LINE_HEIGHT = 24;
const CIRCLE_RADIUS = 30;
const PADDING = 20;

export default function TextFlowCanvas({ text = "" }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Physics State
  const mousePos = useRef({ x: 150, y: 150 });
  const circlePos = useRef({ x: 150, y: 150 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });

  // 1. Prepare segments
  const prepared = useMemo(() => {
    return prepareWithSegments(text || '', FONT);
  }, [text]);

  // 2. Handle Responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height: Math.max(height, 600) });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Main Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrame: number;

    const render = () => {
      // --- Physics Update (Spring Lerp) ---
      // This creates the "smooth follow" effect
      const lerpFactor = 0.15; 
      circlePos.current.x += (mousePos.current.x - circlePos.current.x) * lerpFactor;
      circlePos.current.y += (mousePos.current.y - circlePos.current.y) * lerpFactor;

      // --- Drawing ---
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw Obstacle
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(circlePos.current.x, circlePos.current.y, CIRCLE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Text Setup
      ctx.font = FONT;
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#18181b';

      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      let y = PADDING;
      const { x: cx, y: cy } = circlePos.current;

      while (true) {
        // Precise Collision Detection
        // Determine if this specific line height intersects the circle's Y range
        const distY = Math.abs(y + LINE_HEIGHT / 2 - cy);
        const isIntersectingY = distY < CIRCLE_RADIUS + 5;

        let xOffset = PADDING;
        let availableWidth = dimensions.width - (PADDING * 2);

        if (isIntersectingY) {
          // Calculate how much horizontal space the circle takes at this specific Y
          // Using Pythagorean theorem: x = sqrt(r^2 - y^2)
          const overlapWidth = Math.sqrt(Math.pow(CIRCLE_RADIUS + 15, 2) - Math.pow(distY, 2));
          
          if (cx < dimensions.width / 2) {
            // Circle is on the left
            xOffset = cx + overlapWidth;
            availableWidth = dimensions.width - xOffset - PADDING;
          } else {
            // Circle is on the right
            availableWidth = (cx - overlapWidth) - PADDING;
          }
        }

        const line = layoutNextLine(prepared, cursor, Math.max(availableWidth, 50));
        
        if (!line || y > dimensions.height - PADDING) break;

        ctx.fillText(line.text, xOffset, y);
        cursor = line.end;
        y += LINE_HEIGHT;
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [dimensions, prepared]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto p-4 h-[700px] flex flex-col gap-4">
      <div className="relative flex-1 overflow-hidden group">
        <canvas 
          ref={canvasRef} 
          onMouseMove={handleMouseMove}
          className={cn(
            "border border-zinc-200 rounded-2xl bg-white shadow-xl transition-all",
            "cursor-none touch-none"
          )}
        />
        <div className="absolute top-4 right-4 px-2 py-1 bg-zinc-100/80 backdrop-blur rounded text-[10px] text-zinc-500 font-mono pointer-events-none border border-zinc-200">
          PRETEXT ENGINE v2
        </div>
      </div>
      <p className="text-center text-sm text-zinc-400">
        The text intelligently flows around the cursor using spring physics.
      </p>
    </div>
  );
}