import { cn } from "../_utils/cn";
import { useEffect, useRef } from "react";

export const Component = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripples = useRef<
    { x: number; y: number; radius: number; alpha: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addRipple = (x: number, y: number) => {
      ripples.current.push({ x, y, radius: 0, alpha: 0.8 });
    };

    const handleMove = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMove);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      ripples.current.forEach((r) => {
        r.radius += 1.5;
        r.alpha -= 0.01;

        if (r.alpha > 0) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = isDark
            ? `rgba(0, 255, 255, ${r.alpha})` // night mode aqua
            : `rgba(0, 128, 255, ${r.alpha})`; // day mode blue
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      ripples.current = ripples.current.filter((r) => r.alpha > 0);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className={cn("relative w-full h-screen overflow-hidden")}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="relative flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-4 dark:text-cyan-300 text-blue-600">
          Tidal Wave Cursor
        </h1>
        <p className="dark:text-gray-300 text-gray-700">
          Move your mouse to make ripples 🌊
        </p>
      </div>
    </div>
  );
};
