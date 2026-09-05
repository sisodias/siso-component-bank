
import React, { useEffect, useRef, useState } from 'react';
import { MousePointer2, Info, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple Tailwind CSS classes using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Neon Flow Component Logic ---

const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 300,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {};
        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
          if (tubesRef.current?.destroy) {
            tubesRef.current.destroy();
          }
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    if (tubesRef.current.tubes?.setColors) tubesRef.current.tubes.setColors(colors);
    if (tubesRef.current.tubes?.setLightsColors) tubesRef.current.tubes.setLightsColors(lightsColors);
  };

  return (
    <div 
      className={cn("relative w-full min-h-screen overflow-hidden bg-background", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className={cn("absolute inset-0 w-full h-full block transition-opacity duration-1000", isLoaded ? "opacity-100" : "opacity-0")}
        style={{ touchAction: 'none' }}
      />
      <div className="relative z-10 w-full min-h-screen pointer-events-none">
        {children}
      </div>
    </div>
  );
}

// --- Main App Component ---

export default function App() {
  return (
    <div className="w-full h-screen font-sans bg-black">
      <TubesBackground>
        <div className="flex flex-col items-center w-full min-h-screen px-4 pb-12 pt-12 md:pt-0">
          
          {/* Main Content Area - Centered in available space */}
          <div className="flex-1 flex flex-col items-center justify-center gap-10 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 pointer-events-auto cursor-default text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <span className="text-orange-400 font-mono tracking-[0.3em] text-[10px] md:text-xs uppercase font-bold drop-shadow-[0_0_8px_rgba(251,146,60,0.4)]">
                  Immersive Visuals
                </span>
              </div>
              
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] select-none leading-none">
                NEON <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">FLOW</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-zinc-400 text-sm md:text-lg font-light leading-relaxed">
                Step into a digital realm of fluid light and interactive 3D structures. 
                Powered by <span className="text-white border-b border-white/20 pb-0.5">Three.js</span> and <span className="text-white border-b border-white/20 pb-0.5">Framer Motion</span>.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pointer-events-auto"
            >
              <button className={cn(
                "group relative px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-white transition-all duration-300 overflow-hidden",
                "bg-gradient-to-br from-red-500/10 via-white/5 to-orange-500/10 backdrop-blur-2xl border border-white/20",
                "hover:from-red-500/20 hover:to-orange-500/20 hover:border-white/40 hover:scale-105 active:scale-95",
                "flex items-center gap-2",
                "shadow-[0_0_20px_rgba(255,255,255,0.05),inset_0_0_10px_rgba(255,255,255,0.1)]",
                "after:absolute after:inset-0 after:bg-gradient-to-tr after:from-orange-500/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity"
              )}>
                <MousePointer2 size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Start Interaction</span>
              </button>
              
              <button className={cn(
                "group relative px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-zinc-300 transition-all duration-300",
                "bg-zinc-900/40 backdrop-blur-xl border border-white/5",
                "hover:bg-zinc-800/60 hover:text-white hover:border-white/15 hover:scale-105 active:scale-95",
                "flex items-center gap-2",
                "shadow-lg shadow-black/20"
              )}>
                <Github size={18} />
                <span className="relative z-10">View Source</span>
              </button>
            </motion.div>
          </div>

          {/* Interaction Guide - Fixed spacing at bottom */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="flex flex-col items-center gap-4 text-zinc-500 pointer-events-none mt-auto"
          >
            <div className={cn(
              "flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/5",
              "bg-white/[0.03] backdrop-blur-md shadow-2xl"
            )}>
              <Info size={14} className="text-orange-500/70 shrink-0" />
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium text-zinc-400 whitespace-nowrap">
                Move cursor to glow • Click to shift colors
              </span>
            </div>
            <div className="w-px h-12 md:h-16 bg-gradient-to-b from-orange-500/30 via-orange-500/10 to-transparent" />
          </motion.div>
        </div>
      </TubesBackground>

      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] z-[1]" />
    </div>
  );
}
