"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard utility for 21st.dev/shadcn components
function cn(...inputs: ClassValue) {
  return twMerge(clsx(inputs));
}

export function HolographicCard() {
  const radius = 200; // Radius of the spotlight effect
  const [visible, setVisible] = useState(false);
  
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 p-4">
      <div
        className="group relative w-full max-w-md rounded-xl border border-white/10 bg-zinc-900/30 px-8 py-10 shadow-2xl backdrop-blur-md"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {/* Hover Glow Effect */}
        <motion.div
          style={{
            background: useMotionTemplate`
              radial-gradient(
                ${visible? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
                rgba(120, 119, 198, 0.15),
                transparent 80%
              )
            `,
          }}
          className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        />

        {/* Content */}
        <div className="relative flex flex-col gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-white">
            Design
          </h3>
          
          <p className="text-zinc-400">
            Generate production-ready UI components instantly using our advanced model context protocol. 
            Beautiful defaults, infinite customization.
          </p>

          <button className="mt-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 hover:pr-5 group-hover:border-purple-500/50">
            <span>Explore Components</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { HolographicCard as Component };