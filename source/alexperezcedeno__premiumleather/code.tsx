"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiEye, PiEyeClosed, PiSnowflake } from "react-icons/pi";
import { cn } from "./premiumleather-utils/utils";

interface ToggleGlassProps extends Omit<import("framer-motion").HTMLMotionProps<"button">, "onChange"> {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const ToggleGlass = ({ defaultChecked = false, onChange, className, ...props }: ToggleGlassProps) => {
  const [isOn, setIsOn] = useState(defaultChecked);
  const [isHovered, setIsHovered] = useState(false);
  const toggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onChange?.(newState);
  };
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isOn}
      {...props}
      onClick={(e) => {
        toggle();
        props.onClick?.(e);
      }}
      onHoverStart={(e, info) => {
        setIsHovered(true);
        props.onHoverStart?.(e, info);
      }}
      onHoverEnd={(e, info) => {
        setIsHovered(false);
        props.onHoverEnd?.(e, info);
      }}
      whileTap={props.whileTap || { scale: 0.95 }}
      className={cn(
        "relative flex items-center p-1 w-24 h-[52px] rounded-full transition-colors duration-500 outline-hidden shrink-0 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] cursor-pointer overflow-hidden",
        isOn ? "bg-black border border-white/30 justify-end" : "bg-zinc-900 backdrop-blur-2xl border border-white/10 justify-start",
        className
      )}
    >
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modern:opacity-100 absolute right-0 top-0 bottom-0 w-16 bg-white/20 blur-[15px] rounded-full pointer-events-none z-0"
          />
        )}
      </AnimatePresence>
      <motion.div
        layout
        className={cn(
          "h-[42px] rounded-full flex items-center justify-center relative z-10 shrink-0",
          isOn 
            ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" 
            : "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        )}
        animate={{
          width: isHovered ? 52 : 42,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        <AnimatePresence mode="wait">
          {isOn ? (
            <motion.div
              key="on"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-1.5 h-4 bg-black rounded-full"
            />
          ) : (
            <motion.div
              key="off"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-3 h-3 border-0.5 border-white/50 rounded-full"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

const noiseUrl = 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")';

const ScoreboardText = ({ text, isRevealed, delayOffset = 0 }: { text: string, isRevealed: boolean, delayOffset?: number }) => {
  return (
    <span className="flex" style={{ perspective: 800 }}>
      {text.split("").map((char, i) => (
        <span key={i} className="relative inline-flex justify-center" style={{ width: char === ' ' ? '0.25em' : 'auto' }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={char + (isRevealed ? "r" : "h") + i}
              initial={{ rotateX: -90, y: 8, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              exit={{ rotateX: 90, y: -8, opacity: 0 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0, delay: i * 0.03 + delayOffset }}
              style={{ transformOrigin: "50% 50%", display: "inline-block" }}
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
};

const LeatherFlapSVG = ({ isBack = false }: { isBack?: boolean }) => {
  const clipId = isBack ? "backFlapClip" : "flapClip";
  const mainColor = isBack ? "#181514" : "#262220";
  return (
    <svg 
      viewBox="0 0 360 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`absolute top-0 left-0 w-full h-full ${!isBack ? 'drop-shadow-[0_-10px_20px_rgba(0,0,0,0.8)]' : ''}`}
      style={isBack ? { transform: "scaleY(-1)" } : undefined}
    >
      <defs>
        <filter id="leatherNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <pattern id="noisePattern" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" filter="url(#leatherNoise)" opacity="0.25" />
        </pattern>
        <clipPath id={clipId}>
          <path d="M0 30 C 120 60, 240 0, 360 15 L 360 168 A 32 32 0 0 1 328 200 L 32 200 A 32 32 0 0 1 0 168 Z" />
        </clipPath>
      </defs>
      
      <path d="M0 30 C 120 60, 240 0, 360 15 L 360 168 A 32 32 0 0 1 328 200 L 32 200 A 32 32 0 0 1 0 168 Z" fill={mainColor} />
      <path d="M0 30 C 120 60, 240 0, 360 15 L 360 168 A 32 32 0 0 1 328 200 L 32 200 A 32 32 0 0 1 0 168 Z" fill="url(#noisePattern)" style={{ mixBlendMode: 'soft-light' }} />
      
      {!isBack && (
        <path d="M0 30 C 120 60, 240 0, 360 15" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      )}
      
      <g clipPath={`url(#${clipId})`}>
        <path d="M360 15 L 360 168 A 32 32 0 0 1 328 200 L 32 200 A 32 32 0 0 1 0 168 L 0 30" 
              stroke={isBack ? "rgba(0,0,0,0.8)" : "#000000"} 
              strokeWidth={isBack ? "8" : "10"} 
              style={isBack ? { filter: "blur(4px)" } : { filter: "blur(6px)", opacity: 0.7 }} 
              fill="none" />
      </g>
      
      <path d="M356 22 L 356 168 A 28 28 0 0 1 328 196 L 32 196 A 28 28 0 0 1 4 168 L 4 37" stroke="rgba(0,0,0,0.39)" strokeWidth="2.3" strokeDasharray="4 5" strokeLinecap="round" transform="translate(-0.5, -1)" fill="none" />
      <path d="M356 22 L 356 168 A 28 28 0 0 1 328 196 L 32 196 A 28 28 0 0 1 4 168 L 4 37" stroke="rgba(255,255,255,0.07)" strokeWidth="1.7" strokeDasharray="4 5" strokeLinecap="round" fill="none" />
      <path d="M356 22 L 356 168 A 28 28 0 0 1 328 196 L 32 196 A 28 28 0 0 1 4 168 L 4 37" stroke="rgba(255,255,255,0.02)" strokeWidth="1.3" strokeDasharray="4 5" strokeLinecap="round" transform="translate(0.5, 1)" fill="none" />
    </svg>
  );
};


export interface PremiumLeatherProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCard?: "personal" | "business";
  personalNumber?: string;
  businessNumber?: string;
  personalExpiry?: string;
  businessExpiry?: string;
  personalCvv?: string;
  businessCvv?: string;
  personalName?: string;
  businessName?: string;
  personalLabel?: string;
  businessLabel?: string;
}

export const PremiumLeather = ({
  defaultCard = "personal",
  personalNumber = "4532 8821 0023 1102",
  businessNumber = "4000 1234 5678 9010",
  personalExpiry = "12/28",
  businessExpiry = "05/30",
  personalCvv = "392",
  businessCvv = "888",
  personalName = "John Doe",
  businessName = "UI FACTORY INC.",
  personalLabel = "Revolut",
  businessLabel = "Corporate",
  className,
  ...props
}: PremiumLeatherProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [activeCard, setActiveCard] = useState<"personal" | "business">(defaultCard);
  const [isFrozen, setIsFrozen] = useState(false);

  const isBusiness = activeCard === "business";

  const cardGradient = isBusiness 
    ? "from-[#2a2a2a] via-[#151515] to-[#0a0a0a]"
    : "from-[#fbe6e5] via-[#edcbc9] to-[#cf9d9a]";

  return (
    <div
      {...props}
      className={cn("relative w-[360px] h-[250px] cursor-pointer drop-shadow-[0_40px_40px_rgba(0,0,0,1)] outline-hidden focus-visible:ring-2 focus-visible:ring-white/50 rounded-[32px] text-left block", className)}
        onClick={(e) => {
          setIsOpen(!isOpen);
          props.onClick?.(e);
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          if (!isOpen) {
            setIsFlipped(false);
            setIsRevealed(false);
          }
          props.onMouseLeave?.(e);
        }}
      >

        <div className="absolute inset-0 rounded-[32px] bg-[#262220] border border-[rgba(0,0,0,0.8)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),inset_0_-2px_6px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.25] mix-blend-soft-light pointer-events-none" style={{ backgroundImage: noiseUrl }} />
          <div className="absolute inset-0 bg-linear-to-b from-[#000000] via-transparent to-transparent opacity-40 pointer-events-none" />
          <div className="absolute inset-[4px] rounded-[1.75rem] border border-solid border-[rgba(0,0,0,0.9)] pointer-events-none translate-x-[-0.5px] -translate-y-px" style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }} />
          <div className="absolute inset-[4px] rounded-[1.75rem] border border-solid border-[#050505] pointer-events-none" style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }} />
          <div className="absolute inset-[4px] rounded-[1.75rem] border border-solid border-[rgba(255,255,255,0.14)] pointer-events-none translate-x-[0.5px] translate-y-px" style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }} />
        </div>

        <motion.div
          animate={{
            y: isOpen ? 0 : (isHovered ? -160 : 0), 
            scale: isOpen ? 1 : (isHovered ? 1.02 : 1),
          }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
          className="absolute left-1/2 -translate-x-1/2 top-4 w-[336px] h-[200px] z-10 flex items-start justify-center"
          style={{ perspective: 1500 }}
          onClick={(e) => {
            if (isHovered || isOpen) {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }
          }}
        >

          <div className="relative w-[420px] h-[250px] shrink-0" style={{ transform: "scale(0.8)", transformOrigin: "center top" }}>
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: "preserve-3d" }}
              animate={{
                rotateX: isFlipped ? 180 : (isHovered ? 5 : 0),
                rotateY: isFlipped ? 0 : (isHovered ? -5 : 0),
              }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            >

              <section 
                className={`absolute inset-0 rounded-[1.4rem] overflow-hidden bg-linear-to-br ${cardGradient} transition-colors duration-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(150,100,100,0.2),0_30px_60px_-12px_rgba(0,0,0,0.8)]`}
                style={{ backfaceVisibility: "hidden", transform: "translateZ(1px)" }}
              >
                <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('/titanium.png')" }} />

                <AnimatePresence>
                  {isFrozen && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-40 bg-blue-500/10 backdrop-blur-xs flex items-center justify-center pointer-events-none"
                    >
                      <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: noiseUrl }} />
                      <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-2">
                        <PiSnowflake className="text-white animate-spin-slow" />
                        <span className="text-white text-xs font-semibold">Frozen</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative w-full h-full p-6 flex flex-col justify-between z-30 pointer-events-none">
                  <header className="flex justify-end pt-1 pr-1">
                    <h1 className="font-sans font-bold text-2xl bg-linear-to-b from-[#ffffff] via-[#8a8a8a] to-[#e8e8e8] text-transparent bg-clip-text drop-shadow-[0_2px_1px_rgba(0,0,0,0.3)] tracking-tighter">
                      {isBusiness ? businessLabel : personalLabel}
                    </h1>
                  </header>
                  <div className="flex items-center mt-6">
                    <svg viewBox="0 0 50 38" className="w-[50px] h-[38px] rounded-[6px] bg-linear-to-br from-[#e0e0e0] to-[#b0b0b0] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.3)] border border-[#909090]">
                      <path d="M0 12h50 M0 26h50 M16 0v38 M34 0v38" stroke="#909090" strokeWidth="1" opacity="0.5" />
                      <rect x="15" y="7" width="20" height="24" rx="3" fill="url(#chipGradient)" stroke="#909090" strokeWidth="1" opacity="0.7" />
                      <defs>
                        <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e8e8e8" />
                          <stop offset="100%" stopColor="#c8c8c8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex items-end justify-between mt-auto pb-1"></div>
                </div>
              </section>

              <section 
                className={`absolute inset-0 rounded-[1.4rem] overflow-hidden bg-linear-to-br ${cardGradient} transition-colors duration-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(150,100,100,0.2),0_30px_60px_-12px_rgba(0,0,0,0.8)]`}
                style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg) translateZ(1px)" }}
              >
                <div className="absolute inset-0 opacity-50 mix-blend-multiply pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('/titanium.png')" }} />

                <AnimatePresence>
                  {isFrozen && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-40 bg-blue-500/10 backdrop-blur-xs flex items-center justify-center pointer-events-none"
                    >
                      <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: noiseUrl }} />
                      <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 shadow-xl mt-4 flex items-center gap-2">
                        <PiSnowflake className="text-white" />
                        <span className="text-white text-xs font-semibold">Frozen</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative w-full h-full flex flex-col z-30">
                  <div className="relative w-full h-[45px] bg-linear-to-b from-[#707070] to-[#505050] mt-4 shadow-xs border-b border-white/10 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center" style={{ backgroundImage: "url('/titanium.png')" }} />
                  </div>

                  <div className="w-full flex justify-end px-6 mt-3">
                    <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 14c1.5-1.5 1.5-4.5 0-6" />
                      <path d="M11.5 16.5c3-3 3-8 0-11" />
                      <path d="M14.5 19.5c4.5-4.5 4.5-11.5 0-16" />
                      <path d="M5.5 11.5c.5-.5.5-1.5 0-2" />
                    </svg>
                  </div>

                  <footer className="px-6 mt-auto mb-6 flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[16px] font-semibold ${isBusiness ? 'text-white' : 'text-white/90'}`}>
                            {isBusiness ? businessName : personalName}
                          </span>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if(!isFrozen) setIsRevealed(!isRevealed); 
                            }}
                            className={`p-1 z-50 transition-colors ${isFrozen ? 'text-white/10 cursor-not-allowed' : 'text-white/40 hover:text-white cursor-pointer'}`}
                            aria-label="Toggle card info"
                            disabled={isFrozen}
                          >
                            {isRevealed ? <PiEye size={14} /> : <PiEyeClosed size={14} />}
                          </button>
                        </div>
                        <span className="text-[14px] font-medium tracking-[0.25em] text-white/90">
                          <ScoreboardText 
                            text={isRevealed ? (isBusiness ? businessNumber : personalNumber) : "•••• •••• •••• " + (isBusiness ? businessNumber.slice(-4) : personalNumber.slice(-4))} 
                            isRevealed={isRevealed} 
                            delayOffset={0} 
                          />
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[12px] font-bold tracking-[0.3em] text-white/90 mb-1 ml-[0.3em]">EXP</span>
                        <span className="text-[14px] font-medium tracking-[0.3em] text-white/90 ml-[0.3em]">
                          <ScoreboardText text={isRevealed ? (isBusiness ? businessExpiry : personalExpiry) : "••/••"} isRevealed={isRevealed} delayOffset={0.2} />
                        </span>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[12px] font-bold tracking-[0.4em] text-white/90 mb-1 ml-[0.4em]">CVV</span>
                        <span className="text-[14px] font-medium tracking-[0.4em] text-white/90 ml-[0.4em]">
                          <ScoreboardText text={isRevealed ? (isBusiness ? businessCvv : personalCvv) : "•••"} isRevealed={isRevealed} delayOffset={0.4} />
                        </span>
                      </div>
                    </div>

                    <p className="text-[8px] text-white/80 leading-tight w-3/4 opacity-80">
                      This card is issued by ui factory bank pursuant to a license.
                    </p>
                  </footer>
                </div>
              </section>

            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[200px] z-20 cursor-pointer"
          style={{ perspective: 1500, transformStyle: "preserve-3d", transformOrigin: "bottom center" }}
          animate={{ rotateX: isOpen ? -180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          onClick={(e) => {
             e.stopPropagation();
             setIsOpen(!isOpen);
          }}
        >

          <section className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: "hidden", transform: "translateZ(1px)" }}>
            <LeatherFlapSVG isBack={false} />

            <div className="absolute top-8 left-1/2 -translate-x-1/2">
              <div className="w-4 h-4 rounded-full bg-linear-to-br from-[#d0d0d0] via-[#909090] to-[#505050] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.8)] border border-[#404040] relative after:absolute after:inset-0 after:m-auto after:w-1.5 after:h-1.5 after:rounded-full after:bg-[#303030] after:shadow-[inset_0_1px_1px_rgba(0,0,0,0.9)]" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-30 opacity-80 pointer-events-none">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <div className="bg-zinc-200 text-zinc-900 rounded-[2px] px-1 py-px text-[8px] font-black tracking-tighter shadow-xs">WALLET</div>
                <span className="text-[12px] font-normal tracking-tight text-[#e5e5e5] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">Premium Leather</span>
              </div>
            </div>
          </section>

          <section className="absolute inset-0 w-full h-full" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg) translateZ(1px)" }}>

            <LeatherFlapSVG isBack={true} />

            <div 
              className="absolute inset-0 pt-6 pb-4 px-6 flex flex-col items-center justify-center gap-4 antialiased"
              style={{ WebkitFontSmoothing: "antialiased" }}
              onClick={(e) => e.stopPropagation()}
            >

              <button 
                 onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                 className="absolute top-4 right-4 p-2 text-[#504a46] hover:text-white transition-colors cursor-pointer"
                 aria-label="Close wallet"
              >
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                   <path d="M18 6L6 18M6 6l12 12" />
                 </svg>
              </button>

              <span className="text-xs font-semibold text-[#9a908a]">Settings</span>

              <div className="flex bg-[#0f0e0d] p-1 rounded-full border border-black/80 shadow-[inset_0_2px_8px_rgba(0,0,0,1)] relative z-50">
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveCard("personal"); setIsRevealed(false); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${!isBusiness ? "bg-[#302b28] text-white shadow-md border border-white/5" : "text-[#8a807a] hover:text-white/90"}`}
                >
                  Personal
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveCard("business"); setIsRevealed(false); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${isBusiness ? "bg-[#302b28] text-white shadow-md border border-white/5" : "text-[#8a807a] hover:text-white/90"}`}
                >
                  Business
                </button>
              </div>

              <div className="flex items-center gap-2 relative z-50">
                <ToggleGlass 
                  defaultChecked={isFrozen} 
                  onChange={(checked) => setIsFrozen(checked)} 
                  className="scale-[0.6] origin-left -mr-6" 
                />
                <span className={`text-xs font-semibold transition-colors ${isFrozen ? "text-blue-400" : "text-[#8a807a]"}`}>
                  {isFrozen ? "Frozen" : "Freeze"}
                </span>
              </div>

            </div>
          </section>
        </motion.div>

      </div>
  );
}

export default PremiumLeather;
