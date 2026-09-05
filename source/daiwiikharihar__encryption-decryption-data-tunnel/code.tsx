"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Send, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  Activity,
  Lock,
  Globe
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility: Simulated Hash ---
const generateHash = (len = 8) => {
  const chars = "0123456789ABCDEF";
  let result = "0x";
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// --- Component: Glitch/Matrix Text Decoder ---
const ScrambleText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [display, setDisplay] = useState("");
  const [isDecoded, setIsDecoded] = useState(false);
  const chars = "XY01_#@!&%";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    // Start with empty/scrambled
    setDisplay(generateHash(4));

    timeout = setTimeout(() => {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplay(() =>
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) return text[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          setIsDecoded(true);
        }
        iteration += 1 / 2;
      }, 30);
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text, delay]);

  return (
    <span className={cn("font-mono transition-colors duration-300", isDecoded ? "text-cyan-50" : "text-cyan-500")}>
      {display}
    </span>
  );
};

// --- Types ---
interface Packet {
  id: string;
  payload: string;
  sender: "NODE_A" | "NODE_B";
  timestamp: number;
}

// --- Main Component ---
export default function Encryption () {
  const [log, setLog] = useState<Packet[]>([]);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  
  const [activeTransfer, setActiveTransfer] = useState<{
    from: "NODE_A" | "NODE_B";
    payload: string;
    hash: string;
  } | null>(null);

  const handleTransmit = (from: "NODE_A" | "NODE_B") => {
    const text = from === "NODE_A" ? inputA : inputB;
    if (!text.trim()) return;

    if (from === "NODE_A") setInputA("");
    else setInputB("");

    const hash = generateHash(12);

    // 1. Start Animation Sequence
    setActiveTransfer({ from, payload: text, hash });

    // 2. Resolve Message after animation
    setTimeout(() => {
      setLog((prev) => [
        ...prev,
        { id: hash, payload: text, sender: from, timestamp: Date.now() },
      ]);
      setActiveTransfer(null);
    }, 2000); // 2 seconds transfer time
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] p-4 font-mono text-xs text-white/80 selection:bg-cyan-500/30">
      
      {/* Background Grid - Aesthetic Only */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Main Container */}
      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* --- NODE A --- */}
        <div className="lg:col-span-3">
          <TerminalNode 
            id="NODE_A"
            label="ALPHA_PRIME" 
            color="cyan"
            value={inputA}
            setValue={setInputA}
            onTransmit={() => handleTransmit("NODE_A")}
            isTransmitting={activeTransfer?.from === "NODE_A"}
          />
        </div>

        {/* --- THE QUANTUM TUNNEL (Center Visualization) --- */}
        <div className="relative flex flex-col items-center justify-between rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm lg:col-span-6 min-h-125">
            
            {/* Header / Status Bar */}
            <div className="flex w-full items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-emerald-500 animate-pulse" />
                <span className="text-[10px] tracking-widest text-emerald-500/80">SECURE_CHANNEL_ACTIVE</span>
              </div>
              <div className="text-[10px] text-white/30">LATENCY: 12ms</div>
            </div>

            {/* Visualizer Area (The Void) */}
            <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden">
               
               {/* Ambient Particles */}
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <div className="h-75 w-75 rounded-full border border-cyan-500/20 animate-[spin_10s_linear_infinite]" />
                 <div className="absolute h-50 w-50 rounded-full border border-violet-500/20 animate-[spin_15s_linear_infinite_reverse]" />
               </div>

               {/* Central Core */}
               <div className="z-10 rounded-full bg-black/50 p-4 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                  <ShieldCheck className="h-8 w-8 text-white/20" />
               </div>

               {/* --- THE ANIMATION: TRANSFER PACKET --- */}
               <AnimatePresence>
                 {activeTransfer && (
                   <motion.div
                     initial={{ 
                       x: activeTransfer.from === "NODE_A" ? -250 : 250, 
                       scale: 0.5, 
                       opacity: 0,
                       filter: "blur(10px)" 
                     }}
                     animate={{ 
                       x: 0, 
                       scale: 1, 
                       opacity: 1,
                       filter: "blur(0px)" 
                     }}
                     exit={{ 
                       x: activeTransfer.from === "NODE_A" ? 250 : -250, 
                       scale: 0.5, 
                       opacity: 0,
                       filter: "blur(10px)"
                     }}
                     transition={{ duration: 1, ease: "easeInOut" }}
                     className="absolute z-20"
                   >
                      <div className="relative flex items-center justify-center">
                        {/* Glowing Orb */}
                        <div className={cn(
                          "h-16 w-16 rounded-full blur-xl opacity-50 absolute",
                          activeTransfer.from === "NODE_A" ? "bg-cyan-500" : "bg-violet-500"
                        )} />
                        
                        {/* Data Payload Visualization */}
                        <div className="relative flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-black/80 px-4 py-2 backdrop-blur-md">
                          <Activity className={cn("h-4 w-4", activeTransfer.from === "NODE_A" ? "text-cyan-400" : "text-violet-400")} />
                          <div className="font-mono text-[10px] text-white">
                            {activeTransfer.hash}
                          </div>
                          <div className="text-[8px] text-white/50 uppercase">Encrypting Payload</div>
                        </div>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Central Log (Shared History) */}
            <div className="w-full h-50 border-t border-white/5 bg-black/20 p-4 overflow-hidden relative">
               <div className="absolute top-2 right-2 text-[9px] text-white/20">SYSTEM_LOG</div>
               <div className="flex flex-col-reverse h-full overflow-y-auto gap-2 mask-linear-fade" style={{ scrollbarWidth: 'none' }}>
                  <AnimatePresence>
                    {log.map((entry) => (
                      <motion.div 
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 text-xs"
                      >
                         <span className={cn(
                           "mt-0.5 h-1.5 w-1.5 rounded-full shrink-0",
                           entry.sender === "NODE_A" ? "bg-cyan-500" : "bg-violet-500"
                         )} />
                         <div className="flex flex-col">
                           <span className="text-[10px] text-white/30 font-mono mb-0.5 flex gap-2">
                             {entry.sender} :: {entry.id}
                           </span>
                           <ScrambleText text={entry.payload} delay={200} />
                         </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>
        </div>

        {/* --- NODE B --- */}
        <div className="lg:col-span-3">
          <TerminalNode 
            id="NODE_B"
            label="BETA_CORE" 
            color="violet"
            value={inputB}
            setValue={setInputB}
            onTransmit={() => handleTransmit("NODE_B")}
            isTransmitting={activeTransfer?.from === "NODE_B"}
          />
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Terminal Node ---
const TerminalNode = ({
  id,
  label,
  color,
  value,
  setValue,
  onTransmit,
  isTransmitting
}: {
  id: string;
  label: string;
  color: "cyan" | "violet";
  value: string;
  setValue: (v: string) => void;
  onTransmit: () => void;
  isTransmitting: boolean;
}) => {
  const isCyan = color === "cyan";
  const glowClass = isCyan ? "shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]" : "shadow-[0_0_30px_-5px_rgba(139,92,246,0.2)]";
  const borderClass = isCyan ? "border-cyan-500/20 hover:border-cyan-500/50" : "border-violet-500/20 hover:border-violet-500/50";
  const textAccent = isCyan ? "text-cyan-500" : "text-violet-500";

  return (
    <div className={cn("flex h-full flex-col justify-between rounded-xl border bg-black/40 p-5 backdrop-blur-md transition-all duration-500", borderClass, glowClass)}>
      
      {/* Node Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded bg-white/5", textAccent)}>
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">{label}</div>
              <div className="text-[10px] text-white/40">{id}</div>
            </div>
          </div>
          <div className={cn("h-2 w-2 rounded-full animate-pulse", isCyan ? "bg-cyan-500" : "bg-violet-500")} />
        </div>

        <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Decorative Stats */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-white/30 font-mono">
            <div>UPTIME: 99.9%</div>
            <div>ENC: AES-256</div>
            <div>PKTS: 14.2k</div>
            <div>LAT: 4ms</div>
        </div>
      </div>

      {/* Input Section */}
      <div className="mt-8 space-y-3">
        <label className="text-[10px] uppercase tracking-wider text-white/50">Command Input</label>
        <div className={cn("group relative flex items-center rounded-lg border bg-black/50 transition-colors focus-within:bg-black/80", borderClass)}>
          <div className="pl-3 text-white/20">
             <Terminal className="h-3 w-3" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onTransmit()}
            className="w-full bg-transparent px-3 py-3 text-xs text-white placeholder-white/20 outline-none font-mono"
            placeholder="Initialize sequence..."
            disabled={isTransmitting}
          />
        </div>
        
        <button
          onClick={onTransmit}
          disabled={!value.trim() || isTransmitting}
          className={cn(
            "group relative w-full overflow-hidden rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all",
            !value.trim() ? "bg-white/5 text-white/20 cursor-not-allowed" : 
            isCyan ? "bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-200 border border-cyan-500/20" : "bg-violet-900/20 hover:bg-violet-900/40 text-violet-200 border border-violet-500/20"
          )}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isTransmitting ? (
               <>
                 <Zap className="h-3 w-3 animate-pulse" /> Transmitting
               </>
            ) : (
               <>
                 <Send className="h-3 w-3 transition-transform group-hover:translate-x-1" /> Execute
               </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
