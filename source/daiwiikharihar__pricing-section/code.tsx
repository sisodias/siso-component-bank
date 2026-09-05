"use client";

import React, { useState } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "framer-motion";
import { 
  Check, 
  Zap, 
  Star, 
  Shield, 
  Cpu, 
  ArrowRight,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay">
    <svg className="h-full w-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

/**
 * =============================================================================
 * DATA
 * =============================================================================
 */

const PLANS = [
  {
    id: "starter",
    name: "Base Layer",
    icon: <Cpu size={24} />,
    price: { monthly: 0, yearly: 0 },
    description: "Essential protocols for individual operatives.",
    features: [
      "Single User Access",
      "5GB Secure Storage",
      "Basic Encryption",
      "Community Support",
      "Limited API Calls"
    ],
    color: "bg-white dark:bg-neutral-900",
    accent: "text-neutral-900 dark:text-white",
    cta: "Initialize Free",
    popular: false
  },
  {
    id: "pro",
    name: "Cyber Core",
    icon: <Zap size={24} />,
    price: { monthly: 29, yearly: 290 },
    description: "Advanced heuristics for power users.",
    features: [
      "Up to 5 Team Members",
      "1TB Neural Storage",
      "Military-Grade Encryption",
      "Priority Uplink (24/7)",
      "Unlimited API Access",
      "Custom Domains"
    ],
    color: "bg-purple-100 dark:bg-purple-900/30",
    accent: "text-purple-600 dark:text-purple-400",
    cta: "Upgrade System",
    popular: true
  },
  {
    id: "enterprise",
    name: "Omni Net",
    icon: <Crown size={24} />,
    price: { monthly: 99, yearly: 990 },
    description: "Total control for organization-wide deployment.",
    features: [
      "Unlimited Seats",
      "Infinite Storage",
      "Dedicated Neural Net",
      "SLA 99.99% Uptime",
      "Audit Logs",
      "White-label Dashboard",
      "On-premise Options"
    ],
    color: "bg-emerald-100 dark:bg-emerald-900/30",
    accent: "text-emerald-600 dark:text-emerald-400",
    cta: "Contact Sales",
    popular: false
  }
];

// --- 1. Brutalist Toggle Switch ---
const BrutalToggle = ({ 
  checked, 
  onChange 
}: { 
  checked: boolean; 
  onChange: (v: boolean) => void; 
}) => {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 border-[3px] border-black dark:border-white p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative z-10">
      <span className={cn(
        "font-black uppercase text-sm px-2 transition-colors duration-300",
        !checked ? "text-black dark:text-white" : "text-neutral-400"
      )}>
        Monthly
      </span>
      
      <button
        onClick={() => onChange(!checked)}
        className="w-16 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full border-[3px] border-black dark:border-white relative flex items-center p-1 transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-700"
      >
        <motion.div
          animate={{ x: checked ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-5 h-5 bg-black dark:bg-white rounded-full shadow-sm"
        />
      </button>

      <span className={cn(
        "font-black uppercase text-sm px-2 transition-colors duration-300 flex items-center gap-2",
        checked ? "text-black dark:text-white" : "text-neutral-400"
      )}>
        Yearly
        {/* Discount Badge */}
        <span className="hidden sm:block text-[10px] bg-yellow-400 text-black px-1 py-0.5 border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-6">
          -15%
        </span>
      </span>
    </div>
  );
};

// --- 2. Plan Card ---
const PlanCard = ({ 
  plan, 
  isYearly
}: { 
  plan: typeof PLANS[0]; 
  isYearly: boolean;
}) => {
  const isPop = plan.popular;
  
  // Smoother Hover Physics settings
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Lower stiffness / higher damping for a "floatier" feel
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (!isPop) return;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);

  return (
    <motion.div
      variants={cardVariants}
      style={{ 
        rotateX: isPop ? rotateX : 0, 
        rotateY: isPop ? rotateY : 0,
        transformStyle: "preserve-3d",
        zIndex: isPop ? 10 : 1
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative h-full flex flex-col border-[3px] border-black dark:border-white rounded-3xl p-8 transition-all duration-300",
        plan.color,
        // Scale popular card slightly, but keep height consistent via grid layout
        isPop 
          ? "scale-105 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]" 
          : "scale-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
      )}
    >
      {/* POPULAR BADGE */}
      {isPop && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs py-2 px-4 rounded-full border-[3px] border-white dark:border-black shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Star size={14} fill="currentColor" />
            Best Value
          </motion.div>
        </div>
      )}

      {/* CARD CONTENT WRAPPER */}
      {/* Using flex-1 to push CTA to bottom */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="mb-8">
          <div className={cn("w-12 h-12 rounded-xl border-[3px] border-black dark:border-white flex items-center justify-center mb-4 bg-white dark:bg-black shadow-sm", plan.accent)}>
            {plan.icon}
          </div>
          <h3 className="text-2xl font-black uppercase mb-2">{plan.name}</h3>
          <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 leading-tight">
            {plan.description}
          </p>
        </div>

        {/* PRICE */}
        <div className="mb-8 p-4 bg-white/50 dark:bg-black/20 rounded-xl border-2 border-black/5 dark:border-white/5 backdrop-blur-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter">
              ${isYearly ? Math.floor(plan.price.yearly / 12) : plan.price.monthly}
            </span>
            <span className="text-xs font-black uppercase text-neutral-400">/mo</span>
          </div>
          {isYearly && plan.price.yearly > 0 && (
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              Billed ${plan.price.yearly} yearly
            </p>
          )}
        </div>

        {/* FEATURES */}
        <ul className="space-y-4 mb-8">
          {plan.features.map((feat, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-bold">
              <div className={cn("mt-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-current", plan.accent)}>
                <Check size={10} strokeWidth={4} />
              </div>
              <span className="opacity-80">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA BUTTON (Pinned to bottom via flex layout) */}
      <button className={cn(
        "w-full py-4 rounded-xl font-black uppercase tracking-widest border-[3px] border-black dark:border-white transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 group relative overflow-hidden",
        isPop 
          ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5" 
          : "bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-[2px_2px_0px_0px_currentColor]"
      )}>
        <span className="relative z-10 flex items-center gap-2">
          {plan.cta} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

    </motion.div>
  );
};

export default function NeoBrutalistPricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f0f0f0] dark:bg-[#050505] text-neutral-900 dark:text-neutral-50 font-sans transition-colors duration-500 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-x-hidden">
      <NoiseOverlay />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-neutral-200 to-transparent dark:from-[#111] dark:to-transparent pointer-events-none" />
      
      {/* --- HEADER --- */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-16 space-y-6">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="inline-flex items-center gap-2 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white px-4 py-1.5 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">System Upgrade Available</span>
        </motion.div>
        
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
        >
          Select Your<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            Power Level
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-bold text-neutral-500 dark:text-neutral-400 max-w-md"
        >
          Upgrade your neural link with advanced protocols. 
          Cancel anytime, no hard feelings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BrutalToggle checked={isYearly} onChange={setIsYearly} />
        </motion.div>
      </div>

      {/* --- CARDS GRID --- */}
      {/* Changes: 
        1. items-stretch ensures all cards are the same height.
        2. gap-8 md:gap-4 lg:gap-8 handles spacing responsibly.
      */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-stretch"
      >
        {PLANS.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            isYearly={isYearly} 
          />
        ))}
      </motion.div>

      {/* --- FOOTER BADGES --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
      >
        {["Stripe", "AWS", "Vercel", "Figma"].map((brand) => (
          <div key={brand} className="flex items-center gap-2 text-sm font-black uppercase">
            <Shield size={16} />
            Secured by {brand}
          </div>
        ))}
      </motion.div>

    </div>
  );
}