import React from 'react';
import { motion } from 'framer-motion';
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind classes efficiently
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Beam = () => {
  return (
    <svg
      width="156"
      height="63"
      viewBox="0 0 156 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-0 opacity-70 pointer-events-none"
    >
      <path
        d="M31 .5h32M0 .5h32m30 31h32m-1 0h32m-1 31h32M62.5 32V0m62 63V31"
        stroke="url(#grad1)"
        strokeWidth={1.5}
      />
      <defs>
        <motion.linearGradient
          variants={{
            initial: {
              x1: '40%',
              x2: '50%',
              y1: '160%',
              y2: '180%'
            },
            animate: {
              x1: '0%',
              x2: '10%',
              y1: '-40%',
              y2: '-20%'
            }
          }}
          animate="animate"
          initial="initial"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            repeatDelay: Math.random() * 2 // Randomized delay for more natural distribution
          }}
          id="grad1"
        >
          <stop stopColor="#4ADE80" stopOpacity="0" />
          <stop stopColor="#4ADE80" />
          <stop offset="0.325" stopColor="#10B981" />
          <stop offset="1" stopColor="#A3E635" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};

const GridBeam: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <div className={cn('relative w-full h-full overflow-x-hidden', className)}>
      {/* Background layer for beams - Highly populated for cinematic effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top Region */}
        <div className="absolute top-10 left-[5%] rotate-12 opacity-30"><Beam /></div>
        <div className="absolute top-5 left-[25%] rotate-90 opacity-20"><Beam /></div>
        <div className="absolute top-20 right-[15%] -rotate-45 opacity-40"><Beam /></div>
        <div className="absolute top-[-5%] right-[40%] scale-150 opacity-10"><Beam /></div>

        {/* Mid-Top Region */}
        <div className="absolute top-[20%] left-[15%] scale-125 rotate-[15deg] opacity-35"><Beam /></div>
        <div className="absolute top-[25%] right-[5%] scale-110 -rotate-[30deg] opacity-25"><Beam /></div>
        <div className="absolute top-[35%] left-[45%] rotate-[-90deg] opacity-15"><Beam /></div>
        
        {/* Center Region (Faint large beams) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2.5] opacity-[0.05]"><Beam /></div>
        <div className="absolute top-1/2 left-[10%] scale-[2] rotate-180 opacity-[0.03]"><Beam /></div>
        <div className="absolute top-1/2 right-[10%] scale-[2] rotate-90 opacity-[0.03]"><Beam /></div>

        {/* Mid-Bottom Region */}
        <div className="absolute bottom-[30%] left-[20%] rotate-[160deg] opacity-20"><Beam /></div>
        <div className="absolute bottom-[25%] right-[20%] rotate-[-15deg] scale-125 opacity-30"><Beam /></div>
        <div className="absolute bottom-[35%] left-[5%] scale-90 rotate-45 opacity-40"><Beam /></div>
        <div className="absolute bottom-[40%] right-[35%] scale-150 -rotate-[120deg] opacity-10"><Beam /></div>

        {/* Bottom Region */}
        <div className="absolute bottom-10 left-[10%] scale-110 rotate-[-10deg] opacity-25"><Beam /></div>
        <div className="absolute bottom-20 right-[5%] scale-150 rotate-[200deg] opacity-15"><Beam /></div>
        <div className="absolute bottom-5 left-[40%] rotate-90 opacity-30"><Beam /></div>
        <div className="absolute bottom-[-10px] right-[25%] scale-125 opacity-40"><Beam /></div>

        {/* Edges & Corners */}
        <div className="absolute top-[10%] left-[-5%] scale-[3] rotate-45 opacity-[0.05]"><Beam /></div>
        <div className="absolute bottom-[10%] right-[-5%] scale-[3] rotate-[-45deg] opacity-[0.05]"><Beam /></div>
        <div className="absolute top-[60%] left-[-10%] scale-[2] rotate-[-90deg] opacity-[0.07]"><Beam /></div>
        <div className="absolute top-[40%] right-[-10%] scale-[2] rotate-[90deg] opacity-[0.07]"><Beam /></div>
      </div>

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="w-screen min-h-screen bg-slate-950 bg-grid-white-03 selection:bg-emerald-500 selection:text-white overflow-hidden font-sans">
      <GridBeam className="w-full h-full min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <section className="w-full max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-8xl font-light text-white tracking-tight leading-tight mb-6">
                Cinematic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 font-normal">
                  Grid Beams.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                An ultra-dense animated background component. Perfect for high-energy landing pages and premium hero sections.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6">
                <button className="px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white hover:text-slate-950 transition-all active:scale-95 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                  Get Started
                </button>
                <button className="px-10 py-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 text-slate-300 font-medium hover:bg-white/5 hover:text-white transition-all active:scale-95">
                  View Documentation
                </button>
              </div>
            </motion.div>
          </section>
        </div>
      </GridBeam>
    </div>
  );
};

export default App;