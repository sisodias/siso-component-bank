import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface MagneticCursorProps {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  glow?: boolean;
  className?: string;
}

const MagneticCursor = ({
  children,
  strength = 0.22,
  radius = 220,
  glow = true,
  className,
}: MagneticCursorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.14;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.14;

      pointerCurrentRef.current.x +=
        (pointerTargetRef.current.x - pointerCurrentRef.current.x) * 0.18;
      pointerCurrentRef.current.y +=
        (pointerTargetRef.current.y - pointerCurrentRef.current.y) * 0.18;

      setOffset({
        x: currentRef.current.x,
        y: currentRef.current.y,
      });

      setPointerOffset({
        x: pointerCurrentRef.current.x,
        y: pointerCurrentRef.current.y,
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    const distance = Math.sqrt(distX * distX + distY * distY);
    const clampedRatio = Math.max(0, 1 - distance / radius);

    const pullX = distX * strength * clampedRatio;
    const pullY = distY * strength * clampedRatio;

    targetRef.current = {
      x: pullX,
      y: pullY,
    };

    // This is the "cursor attraction" illusion.
    // A glow / magnetic field shifts toward the center from the user's pointer position.
    pointerTargetRef.current = {
      x: -distX * 0.12 * clampedRatio,
      y: -distY * 0.12 * clampedRatio,
    };

    setIntensity(clampedRatio);
    setIsActive(clampedRatio > 0.02);
  };

  const reset = () => {
    targetRef.current = { x: 0, y: 0 };
    pointerTargetRef.current = { x: 0, y: 0 };
    setIntensity(0);
    setIsActive(false);
  };

  return (
    <div
      ref={ref}
      className={cn("relative inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      {glow && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/10 blur-3xl transition-opacity duration-300 dark:bg-white/10"
          style={{
            transform: `translate(calc(-50% + ${pointerOffset.x}px), calc(-50% + ${pointerOffset.y}px)) scale(${1 + intensity * 0.18})`,
            opacity: intensity * 0.9,
          }}
        />
      )}

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-black/[0.03] blur-2xl dark:border-white/10 dark:bg-white/[0.04]"
        style={{
          transform: `translate(calc(-50% + ${pointerOffset.x * 0.7}px), calc(-50% + ${pointerOffset.y * 0.7}px)) scale(${1 + intensity * 0.14})`,
          opacity: 0.25 + intensity * 0.5,
        }}
      />

      <div
        className={cn(
          "relative z-10 will-change-transform rounded-[28px]",
          isActive
            ? "shadow-[0_20px_60px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            : "shadow-[0_10px_30px_rgba(0,0,0,0.10)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
        )}
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${1 + intensity * 0.035})`,
          transition: "box-shadow 220ms ease, transform 120ms linear",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export { MagneticCursor as Component };
export default MagneticCursor;