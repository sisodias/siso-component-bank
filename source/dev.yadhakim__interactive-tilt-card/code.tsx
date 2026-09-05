"use client";

import { cn } from "@/lib/utils";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  glareColor?: string;
  borderGlow?: boolean;
  borderGlowColor?: string;
  scale?: number;
  perspective?: number;
  speed?: number;
  autoAnimate?: boolean;
  autoPhase?: number;
}

export function Component({
  children,
  className,
  maxTilt = 15,
  glareOpacity = 0.15,
  glareColor = "rgba(255, 255, 255, ALPHA)",
  borderGlow = true,
  borderGlowColor = "rgba(120, 180, 255, 0.4)",
  scale = 1.02,
  perspective = 1000,
  speed = 400,
  autoAnimate = true,
  autoPhase = 0,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
    glareX: 50,
    glareY: 50,
    glareAlpha: 0,
    borderX: 50,
    borderY: 50,
    borderAlpha: 0,
  });
  const isHoveredRef = useRef(false);
  const animRef = useRef<number>(0);
  const autoTimeRef = useRef(0);

  const updateFromPosition = useCallback(
    (xPercent: number, yPercent: number, active: boolean) => {
      const tiltX = (yPercent - 50) / 50 * -maxTilt;
      const tiltY = (xPercent - 50) / 50 * maxTilt;

      setStyle({
        transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${active ? scale : 1},${active ? scale : 1},${active ? scale : 1})`,
        glareX: xPercent,
        glareY: yPercent,
        glareAlpha: active ? glareOpacity : 0,
        borderX: xPercent,
        borderY: yPercent,
        borderAlpha: active ? 1 : 0,
      });
    },
    [maxTilt, perspective, scale, glareOpacity]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      isHoveredRef.current = true;
      updateFromPosition(x, y, true);
    },
    [updateFromPosition]
  );

  const onMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`,
      glareX: 50,
      glareY: 50,
      glareAlpha: 0,
      borderX: 50,
      borderY: 50,
      borderAlpha: 0,
    });
  }, [perspective]);

  // Auto-animation when idle
  useEffect(() => {
    if (!autoAnimate) return;

    const tick = () => {
      if (!isHoveredRef.current) {
        autoTimeRef.current += 0.015;
        const t = autoTimeRef.current + autoPhase;

        // Figure-8 path
        const x = 50 + Math.sin(t * 0.8) * 35;
        const y = 50 + Math.sin(t * 1.6) * 25;

        updateFromPosition(x, y, true);
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [autoAnimate, autoPhase, updateFromPosition]);

  const glareGradient = `radial-gradient(circle at ${style.glareX}% ${style.glareY}%, ${glareColor.replace("ALPHA", String(style.glareAlpha))}, transparent 60%)`;

  const borderGradient = borderGlow
    ? `radial-gradient(circle at ${style.borderX}% ${style.borderY}%, ${borderGlowColor}, transparent 60%)`
    : undefined;

  return (
    <div
      className="relative"
      style={{ perspective: `${perspective}px` }}
    >
      {/* Border glow layer */}
      {borderGlow && (
        <div
          className="absolute -inset-px rounded-[inherit] pointer-events-none transition-opacity duration-300"
          style={{
            background: borderGradient,
            opacity: style.borderAlpha,
            borderRadius: "inherit",
          }}
        />
      )}

      <div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-card",
          className
        )}
        style={{
          transform: style.transform,
          transition: isHoveredRef.current
            ? `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
            : `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Glare overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: glareGradient,
            mixBlendMode: "overlay",
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}