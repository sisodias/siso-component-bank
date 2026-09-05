import React, { useRef } from "react";
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  TrendingUp,
  Shield,
  Zap,
  Users,
  ShieldCheck
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// --- ASSETS & CONFIG ---
// Gradients for the "Titanium" phone bezel look
const PHONE_BORDER_GRADIENT = "linear-gradient(145deg, #3f3f46, #18181b, #3f3f46)";
const GLASS_REFLECTION = "linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 30%, transparent 30%, transparent 100%)";

// --- SUB-COMPONENT: HIGH-FIDELITY PHONE ---
const TitaniumPhone = ({ 
  children, 
  className, 
  style 
}: { 
  children: React.ReactNode; 
  className?: string;
  style?: any;
}) => {
  return (
    <motion.div
      className={cn(
        "relative rounded-[3rem] bg-zinc-950 shadow-2xl",
        className
      )}
      style={{
        boxShadow: "0 0 0 1px #27272a, 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 2px #52525b",
        ...style
      }}
    >
      {/* Outer Bezel (Titanium Look) */}
      <div className="absolute -inset-[3px] rounded-[3.2rem] -z-10 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900" />
      
      {/* Screen Container */}
      <div className="relative h-full w-full overflow-hidden rounded-[2.8rem] bg-zinc-950 border-[6px] border-zinc-950">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30 flex justify-center items-center">
            <div className="w-16 h-3 bg-zinc-900/50 rounded-full" />
        </div>

        {/* Glass Reflection Overlay */}
        <div 
            className="absolute inset-0 z-20 pointer-events-none opacity-40" 
            style={{ background: GLASS_REFLECTION }} 
        />

        {/* Content */}
        <div className="h-full w-full bg-zinc-900 relative pt-10">
            {children}
        </div>
      </div>

      {/* Side Buttons */}
      <div className="absolute top-24 -left-[5px] w-[2px] h-8 bg-zinc-700 rounded-l-md" />
      <div className="absolute top-36 -left-[5px] w-[2px] h-14 bg-zinc-700 rounded-l-md" />
      <div className="absolute top-32 -right-[5px] w-[2px] h-20 bg-zinc-700 rounded-r-md" />
    </motion.div>
  );
};

// --- SUB-COMPONENT: APP SCREEN MOCKUPS ---
const AnalyticsScreen = () => (
  <div className="p-5 flex flex-col h-full font-sans">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Zap size={16} className="text-indigo-400" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Revenue</span>
                <span className="text-sm font-bold text-white">Live</span>
            </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
    </div>

    {/* Main Chart */}
    <div className="mb-6">
        <div className="text-3xl font-bold text-white mb-1">$48,200</div>
        <div className="text-xs text-emerald-400 flex items-center gap-1 mb-4">
            <TrendingUp size={12} />
            <span>+14.5% vs last week</span>
        </div>
        <div className="h-32 w-full flex items-end gap-1.5">
            {[30, 45, 35, 60, 50, 75, 55, 80, 70, 90, 65, 85].map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="flex-1 bg-indigo-500/80 rounded-t-sm hover:bg-indigo-400 transition-colors"
                />
            ))}
        </div>
    </div>

    {/* List Items */}
    <div className="flex-1 space-y-3">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 1 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {i === 1 ? <TrendingUp size={14} className="rotate-180" /> : <TrendingUp size={14} />}
                </div>
                <div className="flex-1">
                    <div className="h-2 w-16 bg-white/20 rounded-full mb-1.5" />
                    <div className="h-1.5 w-8 bg-white/10 rounded-full" />
                </div>
                <div className="text-xs font-mono text-zinc-400">$1,20{i}</div>
            </div>
        ))}
    </div>
  </div>
);

const SecurityScreen = () => (
  <div className="p-5 flex flex-col h-full bg-zinc-900/50">
    <div className="flex flex-col items-center justify-center h-[60%] relative">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500/30 flex items-center justify-center relative z-10"
        >
            <Shield size={40} className="text-emerald-400" />
        </motion.div>
        <h3 className="text-white font-bold mt-6 text-lg">System Secure</h3>
        <p className="text-emerald-400 text-xs mt-1">No threats detected</p>
    </div>
    
    <div className="flex-1 space-y-3">
        <div className="p-3 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-xs text-zinc-300">Firewall Active</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center gap-3">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-xs text-zinc-300">Data Encrypted</span>
        </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function RefinedHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  // Smooth parallax values
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#050505] overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* 1. ATMOSPHERE LAYERS */}
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Glow (The "Aura") */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute top-[-10%] left-1/3 w-[600px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-40">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* --- LEFT COLUMN: COPY (Span 7) --- */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Announcement Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-300 tracking-wide">
                New: AI Predictive Analytics
              </span>
              <ArrowRight size={12} className="text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]"
            >
              Intelligence that <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300 animate-gradient-x bg-[length:200%_auto]">
                scales with you.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-xl"
            >
              Unlock the power of real-time data processing. 
              Build, deploy, and scale your financial infrastructure with 
              our battle-tested API.
            </motion.p>

            {/* CTA Group */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start w-full sm:w-auto"
            >
              <button className="group relative px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]">
                <span className="relative z-10 flex items-center gap-2">
                  Start Building <ArrowRight size={16} />
                </span>
              </button>
              
              <button className="px-8 py-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-white font-medium text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 group">
                <Play size={16} className="fill-white group-hover:scale-110 transition-transform" />
                See How It Works
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-white/5 w-full flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 overflow-hidden ring-1 ring-white/10">
                    <img src={`https://i.pravatar.cc/100?img=${i + 12}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-white font-bold">
                    4.9/5 <span className="text-zinc-500 font-normal">Rating</span>
                </div>
                <div className="text-xs text-zinc-500">Trusted by 10k+ developers</div>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: 3D COMPOSITION (Span 5) --- */}
          <div className="lg:col-span-5 relative hidden lg:block h-[800px] perspective-1000">
            
            {/* The "Main" Phone - Analytics */}
            <motion.div 
                style={{ y: yLeft }}
                className="absolute right-12 top-10 z-20"
                initial={{ opacity: 0, rotateX: 20, rotateY: -20, rotateZ: 10, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, rotateY: -15, rotateZ: -5, y: 0 }}
                transition={{ duration: 1, type: "spring", stiffness: 40 }}
            >
                <TitaniumPhone className="w-[300px] h-[600px]">
                    <AnalyticsScreen />
                </TitaniumPhone>
            </motion.div>

            {/* The "Secondary" Phone - Security (Behind) */}
            <motion.div 
                style={{ y: yRight }}
                className="absolute right-[-40px] top-32 z-10"
                initial={{ opacity: 0, rotateX: 20, rotateY: -10, rotateZ: 5, y: 150 }}
                animate={{ opacity: 1, rotateX: 0, rotateY: -25, rotateZ: 5, y: 0 }}
                transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 30 }}
            >
                <TitaniumPhone className="w-[280px] h-[550px] brightness-75 blur-[1px]">
                    <SecurityScreen />
                </TitaniumPhone>
            </motion.div>

            {/* Floating Glass Card Element */}
            <motion.div 
                initial={{ opacity: 0, y: 50, x: -50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-40 left-0 z-30 p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-4 w-64"
                style={{
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)"
                }}
            >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="text-emerald-400 w-6 h-6" />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Encryption</div>
                    <div className="text-xs text-zinc-400">End-to-End active</div>
                </div>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}