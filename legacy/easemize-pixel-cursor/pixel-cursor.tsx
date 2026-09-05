import React, { useRef, useEffect, useCallback } from 'react';

interface MouseState {
  target: { x: number; y: number };
  current: { x: number; y: number };
}

interface PixelatedCanvasProps {
  className?: string;
}

const PixelatedCanvas: React.FC<PixelatedCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<MouseState>({
    target: { x: -100, y: -100 },
    current: { x: -100, y: -100 }
  });
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);
  const WRef = useRef<number>(32);
  const HRef = useRef<number>(32);

  // Utility functions
  const lerp = (start: number, end: number, t: number): number => {
    return start * (1 - t) + end * t;
  };

  const map = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ): number => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    WRef.current = 32;
    HRef.current = 32;
    canvas.width = WRef.current;
    canvas.height = HRef.current;
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = WRef.current;
    const H = HRef.current;

    // Theme-aware colors
    const isDark = document.documentElement.classList.contains('dark');
    
    // Trail overlay effect - this creates the fade effect by covering previous frames
    const overlayColor = isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)";
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, W, H);

    // Update mouse position with lerp
    const mouse = mouseRef.current;
    mouse.current.x = lerp(mouse.current.x, mouse.target.x, 0.12);
    mouse.current.y = lerp(mouse.current.y, mouse.target.y, 0.12);

    // Draw circle - black on light theme, white on dark theme
    ctx.beginPath();
    ctx.arc(mouse.current.x, mouse.current.y, 100 / W, Math.PI * 2, false);
    ctx.fillStyle = isDark ? "#ffffff" : "#000000";
    ctx.fill();

    timeRef.current += 0.01;
    animationFrameRef.current = requestAnimationFrame(render);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mouse = mouseRef.current;
    const W = WRef.current;
    const H = HRef.current;
    
    mouse.target.x = map(event.clientX, 0, window.innerWidth, 0, W);
    mouse.target.y = map(event.clientY, 0, window.innerHeight, 0, H);
  }, []);

  const handleResize = useCallback(() => {
    resize();
  }, [resize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set CSS custom property for background color based on theme
    const updateCanvasBackground = () => {
      const isDark = document.documentElement.classList.contains('dark');
      canvas.style.setProperty('--canvas-bg', isDark ? 'black' : 'white');
    };

    // Initial setup - match the original setup() function
    updateCanvasBackground();
    resize();
    animationFrameRef.current = requestAnimationFrame(render);

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Listen for theme changes
    const observer = new MutationObserver(updateCanvasBackground);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [handleResize, handleMouseMove, render, resize]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
    />
  );
};

export {PixelatedCanvas};