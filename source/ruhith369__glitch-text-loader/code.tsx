"use client";

import React from "react";

interface GlitchTextLoaderProps {
  text?: string;                // Text to display
  fontSize?: string;            // Tailwind text size, e.g., 'text-5xl'
  color1?: string;              // Main color
  color2?: string;              // Glitch color 1
  color3?: string;              // Glitch color 2
  speed?: number;               // Animation duration multiplier (seconds)
  className?: string;
}

const GlitchTextLoader: React.FC<GlitchTextLoaderProps> = ({
  text = "CYBER",
  fontSize = "text-5xl",
  color1 = "text-cyan-400",
  color2 = "text-pink-500",
  color3 = "text-yellow-400",
  speed = 0.725,
  className,
}) => {
  return (
    <div className={`relative font-extrabold uppercase font-orbitron ${className}`}>
      <div
        className={`relative ${fontSize} ${color1} glitch`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {text}
        <span
          className={`absolute top-0 left-0 ${color2}`}
          style={{
            animationDuration: `${speed / 1.5}s`,
            clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)",
            transform: "translate(-0.04em, -0.03em)",
            opacity: 0.75,
          }}
        >
          {text}
        </span>
        <span
          className={`absolute top-0 left-0 ${color3}`}
          style={{
            animationDuration: `${speed / 2}s`,
            clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
            transform: "translate(0.04em, 0.03em)",
            opacity: 0.75,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default GlitchTextLoader;
