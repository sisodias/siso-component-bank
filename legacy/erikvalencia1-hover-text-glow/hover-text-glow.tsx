"use client";

import * as React from "react";
import { motion } from "framer-motion";

export const Component = ({
  text = "Hover Me",
  duration = 0.25,
}: {
  text?: string;
  duration?: number;
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [hover, setHover] = React.useState(false);
  const [mask, setMask] = React.useState({ cx: "50%", cy: "50%" });

  // Track cursor position relative to SVG
  React.useEffect(() => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = ((coords.x - rect.left) / rect.width) * 100;
    const cy = ((coords.y - rect.top) / rect.height) * 100;
    setMask({ cx: `${cx}%`, cy: `${cy}%` });
  }, [coords]);

  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden p-6">
      <svg
        ref={svgRef}
        className="select-none"
        width="100%"
        height="100%"
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}
      >
        <defs>
          {/* gradient for stroke reveal */}
          <linearGradient id="textGradient" gradientUnits="userSpaceOnUse">
            {hover ? (
              <>
                <stop offset="0%" stopColor="hsl(250, 90%, 65%)" />
                <stop offset="25%" stopColor="hsl(260, 85%, 70%)" />
                <stop offset="50%" stopColor="hsl(280, 85%, 70%)" />
                <stop offset="75%" stopColor="hsl(310, 80%, 70%)" />
                <stop offset="100%" stopColor="hsl(340, 85%, 70%)" />
              </>
            ) : (
              <stop offset="0%" stopColor="hsl(var(--foreground))" />
            )}
          </linearGradient>

          {/* mask gradient that moves with cursor */}
          <motion.radialGradient
            id="revealMask"
            gradientUnits="userSpaceOnUse"
            r="20%"
            animate={mask}
            transition={{ duration, ease: "easeOut" }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>

          <mask id="textMask">
            <rect width="100%" height="100%" fill="url(#revealMask)" />
          </mask>
        </defs>

        {/* base text outline */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.4"
          className="font-bold font-[helvetica] fill-transparent text-[4rem] stroke-neutral-800 dark:stroke-neutral-300"
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          {text}
        </motion.text>

        {/* hover reveal gradient text */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#textGradient)"
          strokeWidth="0.4"
          mask="url(#textMask)"
          className="font-bold font-[helvetica] fill-transparent text-[4rem]"
          style={{ opacity: hover ? 1 : 0.5, transition: "opacity 0.3s ease" }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
