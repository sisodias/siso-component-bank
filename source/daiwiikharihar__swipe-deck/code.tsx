"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  PanInfo,
  useAnimation,
} from "framer-motion";
import {
  X,
  Check,
  RotateCcw,
  Zap,
  Layers,
  Sparkles,
  Command,
  ShieldAlert,
  UserPlus,
  TrendingUp,
  CreditCard,
  Scale,
  Bug,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * =============================================================================
 * HOOKS
 * =============================================================================
 */

// Simple hook to detect dark mode for JS-driven animations
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    // Initial check
    checkDark();

    // Observer to watch for class changes on HTML element
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

/**
 * =============================================================================
 * TYPES & DATA
 * =============================================================================
 */

type SwipeDirection = "left" | "right";

interface CardData {
  id: string;
  title: string;
  category: string;
  description: string;
  color: string;      // Tailwind classes for Light/Dark accents
  bgHexLight: string; // Viewport BG in Light Mode
  bgHexDark: string;  // Viewport BG in Dark Mode
  icon: React.ReactNode;
}

const INITIAL_CARDS: CardData[] = [
  {
    id: "SYS-01",
    title: "Kernel Patch",
    category: "Critical",
    description: "Production server requires immediate patching for CVE-2024-92. Zero-day vulnerability.",
    color: "text-amber-600 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-800",
    bgHexLight: "#FFFBEB", // Amber 50
    bgHexDark: "#271c19",  // Deep Amber tint
    icon: <Zap size={32} />,
  },
  {
    id: "HR-104",
    title: "Lead Designer",
    category: "Hiring",
    description: "Review portfolio for the Senior Product Designer role. 3 candidates pending.",
    color: "text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-800",
    bgHexLight: "#EFF6FF", // Blue 50
    bgHexDark: "#172033",  // Deep Blue tint
    icon: <UserPlus size={32} />,
  },
  {
    id: "FIN-33",
    title: "Q4 Budget",
    category: "Finance",
    description: "Approve the new SaaS allocation budget for the engineering department.",
    color: "text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800",
    bgHexLight: "#ECFDF5", // Emerald 50
    bgHexDark: "#062c1b",  // Deep Emerald tint
    icon: <CreditCard size={32} />,
  },
  {
    id: "BUG-812",
    title: "API Rate Limit",
    category: "Bug Fix",
    description: "Users reporting 429 errors despite being within tier limits. Investigate Redis cache.",
    color: "text-rose-600 bg-rose-100 border-rose-200 dark:text-rose-300 dark:bg-rose-900/30 dark:border-rose-800",
    bgHexLight: "#FFF1F2", // Rose 50
    bgHexDark: "#2e1015",  // Deep Rose tint
    icon: <Bug size={32} />,
  },
  {
    id: "MKT-09",
    title: "Launch Camp",
    category: "Marketing",
    description: "Finalize ad copy for the 'Summer Release' campaign across social channels.",
    color: "text-pink-600 bg-pink-100 border-pink-200 dark:text-pink-300 dark:bg-pink-900/30 dark:border-pink-800",
    bgHexLight: "#FDF2F8", // Pink 50
    bgHexDark: "#331826",  // Deep Pink tint
    icon: <TrendingUp size={32} />,
  },
  {
    id: "LEG-02",
    title: "TOS Update",
    category: "Legal",
    description: "Review the new privacy policy changes regarding AI data processing.",
    color: "text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-800/50 dark:border-slate-700",
    bgHexLight: "#F8FAFC", // Slate 50
    bgHexDark: "#0f172a",  // Slate 950
    icon: <Scale size={32} />,
  },
  {
    id: "DES-12",
    title: "Dark Mode",
    category: "Feature",
    description: "Approve the new color tokens for the system-wide dark mode rollout.",
    color: "text-purple-600 bg-purple-100 border-purple-200 dark:text-purple-300 dark:bg-purple-900/30 dark:border-purple-800",
    bgHexLight: "#FAF5FF", // Purple 50
    bgHexDark: "#241530",  // Deep Purple tint
    icon: <Layers size={32} />,
  },
  {
    id: "SEC-99",
    title: "Audit Log",
    category: "Security",
    description: "Suspicious login attempts detected from IP range 192.168.x.x. Verify firewall rules.",
    color: "text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-800",
    bgHexLight: "#FFF7ED", // Orange 50
    bgHexDark: "#2b1810",  // Deep Orange tint
    icon: <ShieldAlert size={32} />,
  },
];

/**
 * =============================================================================
 * ANIMATION CONFIG
 * =============================================================================
 */

const SWIPE_THRESHOLD = 100;

const PHYSICS = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * =============================================================================
 * COMPONENTS
 * =============================================================================
 */

/* --- Noise Overlay for texture --- */
const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay">
    <svg className="h-full w-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

/* --- Individual Card Component --- */
interface DraggableCardProps {
  data: CardData;
  index: number;
  active: boolean;
  total: number;
  onRemove: (dir: SwipeDirection) => void;
  forcedDirection?: SwipeDirection | null;
}

const DraggableCard = ({
  data,
  index,
  active,
  total,
  onRemove,
  forcedDirection,
}: DraggableCardProps) => {
  const x = useMotionValue(0);
  
  // Dynamic rotation based on drag distance (Tilt effect)
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  
  // Opacity for the "Keep" and "Drop" stamps
  const opacityKeep = useTransform(x, [50, 150], [0, 1]);
  const opacityDrop = useTransform(x, [-150, -50], [1, 0]);

  // Smoother motion values for rendering
  const xSpring = useSpring(x, PHYSICS);
  const rotateSpring = useSpring(rotate, PHYSICS);

  // Handle Drag End
  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      onRemove("right");
    } else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      onRemove("left");
    } else {
      x.set(0); // Snap back
    }
  };

  // Handle External Triggers (Buttons/Keys)
  useEffect(() => {
    if (forcedDirection && active) {
      const target = forcedDirection === "right" ? 600 : -600;
      x.set(target);
      const timer = setTimeout(() => onRemove(forcedDirection), 150);
      return () => clearTimeout(timer);
    }
  }, [forcedDirection, active, onRemove, x]);

  // Stack Logic
  const isFront = index === 0;
  const scale = 1 - index * 0.04;
  const yOffset = index * 14;
  const opacity = Math.max(0, 1 - index * 0.2);
  const zIndex = total - index;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, y: 50, opacity: 0 }}
      animate={{ scale, y: yOffset, opacity }}
      exit={{
        x: x.get() < 0 ? -1000 : 1000,
        opacity: 0,
        rotate: x.get() < 0 ? -45 : 45,
        transition: { duration: 0.4, ease: "easeInOut" }
      }}
      style={{
        x: isFront ? xSpring : 0,
        rotate: isFront ? rotateSpring : 0,
        zIndex,
        cursor: isFront ? "grab" : "default",
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className={cn(
        "absolute top-0",
        "w-[90vw] max-w-[380px] h-[60vh] min-h-[420px] max-h-[580px]",
        // Light Mode Styles
        "bg-white border-[3px] border-black",
        "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
        // Dark Mode Styles
        "dark:bg-neutral-900 dark:border-white",
        "dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]", // White shadow in dark mode
        
        "rounded-3xl flex flex-col overflow-hidden will-change-transform transition-colors duration-300",
        active ? "touch-none" : "pointer-events-none"
      )}
    >
      {/* --- STAMPS (Visual Feedback) --- */}
      <motion.div style={{ opacity: opacityKeep }} className="absolute top-8 left-8 z-30 pointer-events-none">
        <div className="border-[4px] border-emerald-500 text-emerald-500 dark:border-emerald-400 dark:text-emerald-400 font-black text-3xl px-4 py-2 rounded-xl -rotate-12 uppercase tracking-widest bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm">
          Keep
        </div>
      </motion.div>
      <motion.div style={{ opacity: opacityDrop }} className="absolute top-8 right-8 z-30 pointer-events-none">
        <div className="border-[4px] border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 font-black text-3xl px-4 py-2 rounded-xl rotate-12 uppercase tracking-widest bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm">
          Drop
        </div>
      </motion.div>

      {/* --- CARD HEADER --- */}
      <div className={cn("relative h-40 flex items-center justify-center border-b-[3px] border-black dark:border-white bg-neutral-50 dark:bg-neutral-800 transition-colors duration-300")}>
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10 dark:opacity-20" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }}>
         </div>

         {/* Icon Container */}
         <div className={cn(
           "relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]", 
           data.color
         )}>
           {data.icon}
         </div>

         {/* ID Badge */}
         <div className="absolute top-4 left-4 font-mono text-xs font-bold text-neutral-400 dark:text-neutral-500">
            {data.id}
         </div>
         
         {/* Category Pill */}
         <div className={cn("absolute top-4 right-4 px-3 py-1 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-neutral-900", data.color.split(' ')[0])}>
           {data.category}
         </div>
      </div>

      {/* --- CARD BODY --- */}
      <div className="flex-1 p-8 flex flex-col justify-between bg-white dark:bg-neutral-900 transition-colors duration-300 relative">
        <div>
          <h2 className="text-4xl font-black leading-[0.9] uppercase tracking-tighter mb-4 text-neutral-900 dark:text-white">
            {data.title}
          </h2>
          <p className="font-medium text-neutral-500 dark:text-neutral-400 text-base leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Decorative footer lines */}
        <div className="w-full flex items-center justify-between opacity-30 mt-6">
           <div className="h-2 w-24 bg-black dark:bg-white rounded-full" />
           <div className="flex gap-1">
             <div className="h-2 w-2 bg-black dark:bg-white rounded-full" />
             <div className="h-2 w-2 bg-black dark:bg-white rounded-full" />
           </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * =============================================================================
 * MAIN LAYOUT
 * =============================================================================
 */

export default function SwipeDeck() {
  const [cards, setCards] = useState<CardData[]>(INITIAL_CARDS);
  const [history, setHistory] = useState<{ id: string; action: string }[]>([]);
  const [trigger, setTrigger] = useState<SwipeDirection | null>(null);
  
  // Dark mode detection for dynamic background animation
  const isDarkMode = useDarkMode();

  // Background Color Transition Logic
  const activeBg = isDarkMode 
    ? (cards[0]?.bgHexDark || "#0a0a0a") 
    : (cards[0]?.bgHexLight || "#F3F4F6");

  const handleRemove = useCallback((dir: SwipeDirection) => {
    if (cards.length === 0) return;
    const current = cards[0];
    
    // 1. Add to history
    setHistory(prev => [{ id: current.id, action: dir === "right" ? "KEEP" : "DROP" }, ...prev].slice(0, 3));
    
    // 2. Remove card
    setCards(prev => prev.slice(1));
    setTrigger(null);
  }, [cards]);

  const onSwipeTrigger = (dir: SwipeDirection) => {
    if (cards.length > 0 && !trigger) setTrigger(dir);
  };

  const reset = () => {
    setCards([]);
    setTimeout(() => {
      setCards(INITIAL_CARDS);
      setHistory([]);
    }, 500);
  };

  // Keyboard Listeners
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onSwipeTrigger("right");
      if (e.key === "ArrowLeft") onSwipeTrigger("left");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cards, trigger]);

  // Calculate Progress for Ring
  const progress = cards.length === 0 ? 100 : ((INITIAL_CARDS.length - cards.length) / INITIAL_CARDS.length) * 100;
  const progressColor = cards.length === 0 ? "#10B981" : (isDarkMode ? "#FFFFFF" : "#000000");

  return (
    <motion.div 
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center font-sans transition-colors duration-700 ease-in-out text-neutral-900 dark:text-neutral-100"
      animate={{ backgroundColor: activeBg }}
    >
      <NoiseOverlay />

      {/* --- BACKGROUND GRID --- */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-start z-40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-black dark:bg-white text-white dark:text-black p-1 rounded">
              <Command size={20} />
            </div>
            <span className="font-black text-xl tracking-tight uppercase">Triage.OS</span>
          </div>
          <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1">
            Build v2.4
          </p>
        </div>

        {/* Circular Progress */}
        <div className="relative w-12 h-12 flex items-center justify-center">
           <svg className="w-full h-full -rotate-90">
             <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="opacity-10" />
             <motion.circle 
               cx="24" cy="24" r="20" 
               stroke={progressColor} 
               strokeWidth="4" 
               fill="transparent"
               strokeLinecap="round"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: progress / 100 }}
               transition={{ duration: 0.5 }}
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
             {cards.length}
           </div>
        </div>
      </header>

      {/* --- HISTORY LOG (Desktop Only) --- */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-30 pointer-events-none">
         <AnimatePresence mode="popLayout">
           {history.map((h, i) => (
             <motion.div
               key={`${h.id}-${i}`}
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, scale: 0.8 }}
               className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] p-3 rounded-lg flex items-center gap-3 w-48"
             >
               <div className={cn("w-2 h-2 rounded-full shrink-0", h.action === "KEEP" ? "bg-emerald-500" : "bg-red-500")} />
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{h.id}</span>
                 <span className="text-xs font-black uppercase">{h.action}</span>
               </div>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>

      {/* --- MAIN DECK --- */}
      <main className="relative z-20 w-full flex flex-col items-center justify-center">
        <div className="relative w-full h-[60vh] min-h-[420px] max-h-[580px] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => {
              if (index > 2) return null; // Render optimization
              return (
                <DraggableCard 
                  key={card.id}
                  data={card}
                  index={index}
                  active={index === 0}
                  total={cards.length}
                  onRemove={handleRemove}
                  forcedDirection={index === 0 ? trigger : null}
                />
              );
            })}
          </AnimatePresence>

          {/* Empty State */}
          {cards.length === 0 && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center p-8"
            >
              <div className="mb-6 inline-block p-6 bg-white dark:bg-neutral-900 border-[3px] border-black dark:border-white rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                <Sparkles size={40} className="text-amber-500" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
                All Clear
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-8">No pending items in queue.</p>
              
              <button 
                onClick={reset}
                className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest rounded-full overflow-hidden shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2 relative z-10">
                   <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-700 ease-in-out" />
                   <span>Reload Deck</span>
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* --- BOTTOM CONTROLS --- */}
      <footer className="absolute bottom-0 w-full p-8 flex justify-center items-end z-40 pointer-events-none">
        <div className="flex gap-8 pointer-events-auto">
          <button
            onClick={() => onSwipeTrigger("left")}
            disabled={cards.length === 0}
            className="group w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-neutral-900 border-[3px] border-neutral-200 dark:border-neutral-700 rounded-full flex items-center justify-center shadow-sm hover:border-red-500 hover:text-red-500 dark:hover:border-red-400 dark:hover:text-red-400 hover:scale-110 active:scale-90 transition-all duration-200 disabled:opacity-30 disabled:hover:scale-100"
          >
            <X size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          </button>
          
          <button
            onClick={() => onSwipeTrigger("right")}
            disabled={cards.length === 0}
            className="group w-16 h-16 md:w-20 md:h-20 bg-black dark:bg-white border-[3px] border-black dark:border-white text-white dark:text-black rounded-full flex items-center justify-center shadow-[0px_10px_20px_rgba(0,0,0,0.2)] dark:shadow-[0px_10px_20px_rgba(255,255,255,0.1)] hover:bg-emerald-500 hover:border-emerald-500 dark:hover:bg-emerald-400 dark:hover:border-emerald-400 dark:hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 disabled:opacity-30 disabled:hover:scale-100"
          >
            <Check size={32} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
          </button>
        </div>
      </footer>
    </motion.div>
  );
}