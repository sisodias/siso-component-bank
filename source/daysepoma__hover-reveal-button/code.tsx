import React, { useRef, useState, useCallback } from "react";

interface HoverRevealButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function HoverRevealButton({
  children,
  onClick,
  className = "",
}: HoverRevealButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"idle" | "entering" | "leaving">("idle");
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });
  const [circleSize, setCircleSize] = useState(0);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setCirclePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setCircleSize(40);
      setPhase("entering");
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCirclePos({ x, y });
      const maxDist = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y)
      );
      setCircleSize(maxDist * 2 + 60);
    },
    []
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setCirclePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setCircleSize(0);
      setPhase("leaving");
      setTimeout(() => setPhase("idle"), 500);
    },
    []
  );

  const isActive = phase === "entering";
  const isFilled = isActive && circleSize > 120;

  const getCircleTransition = () => {
    if (phase === "entering") {
      return "width 650ms cubic-bezier(0.22, 1, 0.36, 1), height 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease, left 80ms ease, top 80ms ease";
    }
    if (phase === "leaving") {
      return "width 500ms cubic-bezier(0.4, 0, 1, 1), height 500ms cubic-bezier(0.4, 0, 1, 1), opacity 400ms ease-out 100ms, left 0ms, top 0ms";
    }
    return "none";
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-pointer border bg-black text-white px-6 py-3 rounded-full font-medium text-sm ${className}`}
      style={{
        color: isFilled ? "#000" : "#fff",
        borderColor: isFilled ? "#000" : "transparent",
        transition: "color 400ms cubic-bezier(0.4, 0, 0.2, 1), border-color 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: circlePos.x,
          top: circlePos.y,
          width: phase !== "idle" ? circleSize : 0,
          height: phase !== "idle" ? circleSize : 0,
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          opacity: phase === "leaving" ? 0 : phase === "entering" ? 1 : 0,
          transition: getCircleTransition(),
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}