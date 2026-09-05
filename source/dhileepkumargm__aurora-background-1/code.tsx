"use client";

import React from "react";
import { motion } from "framer-motion";

const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={`relative flex flex-col h-screen items-center justify-center bg-zinc-900 text-slate-950 transition-bg dark:bg-zinc-900 ${className}`}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{
              backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"],
            }}
            transition={{
              duration: 16,
              ease: "linear",
              repeat: Infinity,
              repeatType: "mirror",
            }}
            className="absolute inset-0 z-0 h-full w-full scale-[2] transform-gpu bg-transparent [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [background-image:var(--aurora)] [background-size:200%_200%] after:absolute after:inset-0 after:z-10 after:h-full after:w-full after:bg-[radial-gradient(ellipse_at_100%_0%,transparent_60%,var(--zinc-900))] after:opacity-100 dark:[--aurora:repeating-linear-gradient(100deg,var(--blue-700)_10%,var(--indigo-500)_15%,var(--blue-500)_20%,var(--violet-400)_25%,var(--blue-600)_30%)] dark:after:bg-[radial-gradient(ellipse_at_100%_0%,transparent_60%,var(--zinc-900))]"
            style={{
              "--blue-500": "#3b82f6",
              "--indigo-300": "#a5b4fc",
              "--blue-300": "#93c5fd",
              "--violet-200": "#ddd6fe",
              "--blue-400": "#60a5fa",
              "--blue-700": "#1d4ed8",
              "--indigo-500": "#6366f1",
              "--violet-400": "#a78bfa",
              "--blue-600": "#2563eb",
              "--zinc-900": "#18181b",
            }}
          />
        </div>
        {showRadialGradient && (
          <div className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full bg-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:block" />
        )}
        {children}
      </div>
    </main>
  );
};

export default AuroraBackground;
