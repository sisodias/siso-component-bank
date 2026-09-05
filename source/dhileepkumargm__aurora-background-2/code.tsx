"use client";

import React from "react";
import { motion } from "framer-motion";

// Extend JSX to recognize <lottie-player>
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lottie-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src: string;
          background: string;
          speed: string;
          loop?: boolean;
          autoplay?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * AuroraBackground
 *
 * Creates a mesmerizing aurora-like animated background
 * using blurred, colored radial gradients and Framer Motion.
 */
const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <main>
      <div
        className={`relative flex flex-col h-screen items-center justify-center bg-zinc-900 text-slate-900 transition-bg dark:bg-zinc-900 dark:text-slate-200 ${className}`}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Base blurred gradient */}
          <div className="absolute h-full w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-400 via-rose-400 to-lime-400 opacity-20 [filter:blur(120px)]"></div>

          {/* Animated blobs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
            className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
            className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"
          />
        </div>

        {children}
      </div>
    </main>
  );
};

export default AuroraBackground;
