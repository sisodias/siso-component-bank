"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, Settings, User } from "lucide-react";
import clsx from "clsx";

type DockProps = {
  position?: "bottom" | "top" | "left";
};

const icons = [
  { id: "home", icon: Home },
  { id: "search", icon: Search },
  { id: "settings", icon: Settings },
  { id: "profile", icon: User },
];

export default function ConstellationDock({ position = "bottom" }: DockProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [coords, setCoords] = useState<{ x: number; y: number }[]>([]);

  // Measure icon centers after render
  useEffect(() => {
    const newCoords = iconRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    setCoords(newCoords);
  }, []);

  return (
    <div
      className={clsx(
        "fixed flex items-center justify-center z-50",
        position === "bottom" && "bottom-6 left-1/2 -translate-x-1/2 flex-row",
        position === "top" && "top-6 left-1/2 -translate-x-1/2 flex-row",
        position === "left" && "left-6 top-1/2 -translate-y-1/2 flex-col"
      )}
    >
      <div className="relative flex gap-10">
        {/* Draw constellation lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {coords.map((a, i) =>
            coords.map((b, j) =>
              i < j ? (
                <line
                  key={`${i}-${j}`}
                  x1={a.x - coords[0].x + 32} // normalize to svg container
                  y1={a.y - coords[0].y + 32}
                  x2={b.x - coords[0].x + 32}
                  y2={b.y - coords[0].y + 32}
                  stroke={
                    hovered === icons[i].id || hovered === icons[j].id
                      ? "url(#glow)"
                      : "currentColor"
                  }
                  strokeWidth="1"
                  className={clsx(
                    "transition-colors duration-300",
                    hovered ? "opacity-70" : "opacity-30"
                  )}
                />
              ) : null
            )
          )}
          <defs>
            <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>

        {/* Icons */}
        {icons.map(({ id, icon: Icon }, i) => (
          <motion.button
            key={id}
            ref={(el) => (iconRefs.current[i] = el)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.3 }}
            className="relative z-10 flex items-center justify-center w-12 h-12 
                       rounded-full backdrop-blur-md bg-white/10 dark:bg-black/20 
                       border border-white/20 dark:border-white/10 shadow-lg
                       text-gray-800 dark:text-gray-200"
          >
            <Icon
              size={24}
              className={clsx(
                "transition-colors duration-300",
                hovered === id
                  ? "text-blue-400 dark:text-green-300"
                  : "text-inherit"
              )}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
