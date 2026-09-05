import React, { useRef, useEffect, useCallback, CSSProperties } from "react";

interface ClickSparkProps {
  sparkColor?: string; // Can be a color string or "currentColor"
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children?: React.ReactNode;
  className?: string; // Added for potential wrapper styling
  style?: CSSProperties; // Added for potential wrapper styling
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = "currentColor", // Default to currentColor for theme awareness
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
  children,
  className = "",
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const startTimeRef = useRef<number | null>(null); // Not strictly needed if using performance.now() for each spark
  const actualSparkColorRef = useRef<string>(sparkColor);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout : NodeJS.Timeout;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      // If sparkColor is 'currentColor', resolve it now
      if (sparkColor === "currentColor") {
        actualSparkColorRef.current = getComputedStyle(parent).color;
      } else {
        actualSparkColorRef.current = sparkColor;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);
    resizeCanvas(); // Initial call

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [sparkColor]);


  const easeFunc = useCallback(
      (t: number) => {
        switch (easing) {
          case "linear": return t;
          case "ease-in": return t * t;
          case "ease-in-out": return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          default: return t * (2 - t); // ease-out
        }
      },
      [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const currentSparkSize = sparkSize * (1 - eased); // Spark size decreases over time

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        // To make the line extend outwards from the center point (spark.x, spark.y)
        const x2 = spark.x + (distance + currentSparkSize) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + currentSparkSize) * Math.sin(spark.angle);
        
        ctx.strokeStyle = actualSparkColorRef.current; // Use resolved color
        ctx.lineWidth = 2; // Or make this a prop: sparkLineWidth
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [duration, easeFunc, extraScale, sparkRadius, sparkSize]); // Removed actualSparkColorRef from deps, it's handled by resize

    const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now(); // Use performance.now() for higher precision
    const newSparks: Spark[] = Array.from({length: sparkCount}, (_, i) => ({
      x,
      y,
      angle: (Math.PI * 2 * i) / sparkCount, // Corrected angle calculation
      startTime: now,
    }));

    sparksRef.current.push(...newSparks);
  };

    return (
        <div
          className={`relative w-full h-full cursor-pointer ${className}`}
          onClick={handleClick}
          style={style}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none w-full h-full"
            />
            {/* Ensure children are above the canvas or canvas is truly background */}
            <div className="relative z-10 w-full h-full flex justify-center items-center">
                {children}
            </div>
        </div>
    );
};