"use client";

import { motion, useAnimation, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function WaveCard() {
  const wavePath = "M0 50 Q100 0 100 50 T200 50 T400 50 T600 40";
  const waveControls = useAnimation();
  const [hovered, setHovered] = useState(false);

  // Track animation instances persistently
  const bgX = useMotionValue(0);
  const bgY = useMotionValue(0);
  const backgroundPosition = useTransform([bgX, bgY], ([x, y]) => `${x}px ${y}px`);
  const bgAnimationX = useRef<any>(null);
  const bgAnimationY = useRef<any>(null);

  // Animate wave forward (appearing)
  const animateWaveIn = () => {
    waveControls.start({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    });
  };

  // Animate wave backward (disappearing)
  const animateWaveOut = () => {
    waveControls.start({
      pathLength: 0,
      opacity: 0.5,
      transition: { duration: 1.5, ease: "easeInOut" },
    });
  };

  // Start grid animation (persistent references)
  const startGridAnimation = () => {
    bgAnimationX.current = animate(bgX, 480, {
      duration: 60,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
    bgAnimationY.current = animate(bgY, 320, {
      duration: 60,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });
  };

  // Stop grid animation
  const stopGridAnimation = () => {
    bgAnimationX.current?.stop();
    bgAnimationY.current?.stop();
  };

  // Start wave & grid animations on mount
  useEffect(() => {
    animateWaveIn();
    startGridAnimation();

    // cleanup on unmount
    return () => {
      stopGridAnimation();
    };
  }, []);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => {
        setHovered(true);
        animateWaveOut(); // reverse wave
        stopGridAnimation(); // stop box animation
      }}
      onMouseLeave={() => {
        setHovered(false);
        animateWaveIn(); // reappear wave
        startGridAnimation(); // resume where left off
      }}
    >
      {/* Floating wave overlay */}
      <motion.svg
        viewBox="0 0 700 100"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute z-10 -top-12 -left-16 w-[600px] h-[120px] pointer-events-none opacity-70"
      >
        <motion.path
          d={wavePath}
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={waveControls}
        />
      </motion.svg>

      {/* Card */}
      <motion.div
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={cn(
          "relative w-[460px] h-[280px] rounded-2xl border border-gray-200 dark:border-gray-800",
          "bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950",
          "overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-black/30 backdrop-blur-md"
        )}
      >
        {/* Smooth continuous grid animation */}
        <motion.div
          style={{ backgroundPosition }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:48px_32px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

        {/* Card content */}
        <div className="relative p-8 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mt-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                Project Summary
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Overview of performance and initiatives
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-5xl font-bold text-gray-900 dark:text-gray-50 leading-none">
                12
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                active modules
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Stay up to date with your team’s key initiatives, project
              milestones, and real-time performance trends — everything you need
              at a glance.
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      </motion.div>
    </div>
  );
}
