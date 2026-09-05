"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// --- MAIN SECTION ---
export default function CreditCardSection() {
  return (
    <section className="relative w-full min-h-screen bg-[#020202] flex flex-col items-center justify-center overflow-hidden py-20 px-6 font-sans antialiased selection:bg-indigo-500/30">
      
      {/* BACKGROUND: Deep Space Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Gradient Mesh */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#000] animate-[spin_60s_linear_infinite]" />
        
        {/* Cyber Grid */}
        <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{ 
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)", 
                backgroundSize: "40px 40px" 
            }}
        />
        
        {/* Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* CONTENT LAYOUT */}
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* LEFT: Typography */}
        <div className="flex flex-col gap-8 order-2 lg:order-1 relative">
           {/* Decorative Line */}
           <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

          <div className="space-y-8">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] text-neutral-300 uppercase">Quantum Secure</span>
             </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white">
              Absolute <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-[length:200%_auto] animate-gradient">Control.</span>
            </h1>
            
            <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed max-w-lg border-l-2 border-white/10 pl-6">
              The interface between your wealth and the digital void. Forged from digital obsidian and secured by post-quantum encryption standards.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8">
             <Stat label="LIMIT" value="INFINITE" />
             <Stat label="MATERIAL" value="OBSIDIAN" />
             <Stat label="latency" value="0.00ms" />
          </div>
        </div>

        {/* RIGHT: The Masterpiece Card */}
        <div className="order-1 lg:order-2 flex items-center justify-center perspective-[2000px] py-10 lg:py-0">
           <PremiumHoloCard />
        </div>

      </div>
    </section>
  );
}

const Stat = ({ label, value }: { label: string, value: string }) => (
    <div className="group cursor-default">
        <div className="text-[10px] font-mono tracking-widest text-neutral-500 mb-1 uppercase group-hover:text-indigo-400 transition-colors">{label}</div>
        <div className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">{value}</div>
    </div>
);


// --- THE ULTIMATE CARD COMPONENT ---
function PremiumHoloCard() {
  const ref = useRef<HTMLDivElement>(null);

  // 1. Physics Engine
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring physics for "heavy" feel
  const mouseX = useSpring(x, { stiffness: 200, damping: 25, mass: 0.5 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 25, mass: 0.5 });

  // 2. Transformations
  const rotateX = useTransform(mouseY, [-300, 300], [20, -20]); // Max tilt X
  const rotateY = useTransform(mouseX, [-300, 300], [-20, 20]); // Max tilt Y
  
  // Lighting & Effects
  const glareX = useTransform(mouseX, [-300, 300], [0, 100]);
  const glareY = useTransform(mouseY, [-300, 300], [0, 100]);
  
  // Holographic Shift (moves the spectrum gradient)
  const holoPos = useTransform(mouseX, [-300, 300], ["0%", "100%"]);
  
  // Shadow moves opposite to light
  const shadowX = useTransform(mouseX, [-300, 300], [20, -20]);
  const shadowY = useTransform(mouseY, [-300, 300], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate center-based coordinates
    const offsetX = e.clientX - rect.left - width / 2;
    const offsetY = e.clientY - rect.top - height / 2;
    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-[520px] h-[330px] rounded-[30px] cursor-pointer group"
    >
      {/* 0. DROP SHADOW (Dynamic) */}
      <motion.div 
        style={{ x: shadowX, y: shadowY, opacity: 0.6 }}
        className="absolute inset-4 bg-indigo-500/30 blur-[60px] rounded-[40px] -z-10"
      />

      {/* 1. CARD CHASSIS (The Physical Object) */}
      <div 
        className="absolute inset-0 rounded-[30px] bg-[#080808] overflow-hidden border border-white/5"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Base Texture: Carbon/Hex */}
        <div className="absolute inset-0 opacity-40 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Gradient: Deep Midnight */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-[#000000]" />
        
        {/* Subtle Circuit Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10 10h80v80h-80z" fill="none" stroke="white" strokeWidth="0.5"/>
                <circle cx="10" cy="10" r="1.5" fill="white"/>
                <circle cx="90" cy="90" r="1.5" fill="white"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
        </svg>
      </div>

      {/* 2. HOLOGRAPHIC FOIL (The "Premium" Layer) */}
      <motion.div 
        className="absolute inset-0 rounded-[30px] opacity-20 mix-blend-color-dodge pointer-events-none"
        style={{
             background: useTransform(holoPos, (val) => 
                `linear-gradient(105deg, transparent 20%, rgba(255, 0, 150, 0.3) 40%, rgba(0, 255, 255, 0.3) 60%, transparent 80%)`
             )
        }}
      />

      {/* 3. DYNAMIC LIGHTING (Glare) */}
      <motion.div
        className="absolute inset-0 rounded-[30px] pointer-events-none mix-blend-overlay"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
          ),
          opacity: 0.7
        }}
      />
      
      {/* 4. RIM LIGHTING (Edge Highlight) */}
      <div className="absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/10 pointer-events-none" />
      <div className="absolute inset-[1px] rounded-[29px] ring-1 ring-inset ring-white/5 pointer-events-none" />

      {/* 5. 3D FLOATING CONTENT */}
      <div className="relative z-10 h-full p-10 flex flex-col justify-between select-none">
        
        {/* TOP ROW */}
        <div className="flex justify-between items-start">
            {/* REALISTIC CHIP */}
            <motion.div 
                style={{ translateZ: 60 }} 
                className="relative w-16 h-12 rounded-[6px] overflow-hidden shadow-2xl border border-yellow-500/40 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-700"
            >
                {/* Chip circuit pattern */}
                <div className="absolute inset-0 opacity-60">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-yellow-900/50" />
                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-yellow-900/50" />
                    <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] border border-yellow-900/40 rounded-[2px]" />
                </div>
                {/* Metallic shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent" />
            </motion.div>
            
            {/* NFC ICON */}
            <motion.div style={{ translateZ: 40 }} className="opacity-80 mix-blend-screen text-white/80">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-90">
                 <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                 <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                 <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
               </svg>
            </motion.div>
        </div>

        {/* CENTER: NUMBER */}
        <motion.div style={{ translateZ: 80 }} className="mt-6">
             <div className="flex justify-between text-[26px] font-mono font-bold tracking-[0.2em] text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">4290</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">9901</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">8021</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">3099</span>
             </div>
             {/* Emboss effect layer */}
             <div className="absolute inset-0 flex justify-between text-[26px] font-mono font-bold tracking-[0.2em] text-black/40 blur-[1px] -z-10 translate-y-[1px]">
                <span>4290</span><span>9901</span><span>8021</span><span>3099</span>
             </div>
        </motion.div>

        {/* BOTTOM ROW */}
        <div className="flex justify-between items-end relative">
            <motion.div style={{ translateZ: 50 }}>
                <div className="text-[10px] text-indigo-200/60 font-bold tracking-[0.2em] mb-1">CARDHOLDER</div>
                <div className="text-lg font-medium text-white tracking-widest uppercase font-mono drop-shadow-md">
                   Daiwiik Harihar
                </div>
            </motion.div>
            
            <motion.div style={{ translateZ: 50 }} className="flex flex-col items-end mr-12">
                <div className="text-[10px] text-indigo-200/60 font-bold tracking-[0.2em] mb-1">VALID</div>
                <div className="text-lg font-mono text-white tracking-widest drop-shadow-md">12/29</div>
            </motion.div>

            {/* BRAND LOGO */}
            <motion.div 
                style={{ translateZ: 60 }}
                className="absolute right-0 bottom-0 mix-blend-lighten"
            >
               {/* Abstract Metallic Logo */}
               <div className="relative w-12 h-12 opacity-90">
                  <div className="absolute top-0 left-0 w-8 h-8 rounded-full bg-gradient-to-br from-white/60 to-transparent backdrop-blur-sm z-10" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-tl from-white/60 to-transparent backdrop-blur-sm" />
               </div>
            </motion.div>
        </div>
      </div>
      
    </motion.div>
  );
}