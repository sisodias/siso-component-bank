import { cn } from "@/lib/utils";
import React, { useRef, useState, useCallback, useEffect } from "react";

interface MagnifyingLensProps {
  children: React.ReactNode;
  lensSize?: number;
  zoomFactor?: number;
  className?: string;
}

const MagnifyingLens = ({
  children,
  lensSize = 160,
  zoomFactor = 1.8,
  className,
}: MagnifyingLensProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  useEffect(() => {
    if (!isHovering) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      smoothPos.current.x = lerp(smoothPos.current.x, mousePos.x, 0.1);
      smoothPos.current.y = lerp(smoothPos.current.y, mousePos.y, 0.1);

      setRenderPos({
        x: smoothPos.current.x,
        y: smoothPos.current.y,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isHovering, mousePos]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-visible", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <div>{children}</div>

      <div
        className="pointer-events-none absolute rounded-full overflow-hidden"
        style={{
          width: lensSize,
          height: lensSize,
          left: renderPos.x - lensSize / 2,
          top: renderPos.y - lensSize / 2,
          opacity: isHovering ? 1 : 0,
          transform: `scale(${isHovering ? 1 : 0.92})`,
          transition: "opacity 180ms ease, transform 220ms ease",
          border: "1px solid rgba(255,255,255,0.55)",
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.16), inset 0 1px 10px rgba(255,255,255,0.22)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.02) 70%, transparent 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoomFactor})`,
            transformOrigin: "top left",
            position: "absolute",
            left: -renderPos.x * (zoomFactor - 1),
            top: -renderPos.y * (zoomFactor - 1),
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export { MagnifyingLens as Component };
export default MagnifyingLens;