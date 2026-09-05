"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, useAnimation, AnimatePresence, useMotionValue, useMotionTemplate, MotionValue } from "framer-motion";
const IconUser = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const IconReact = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height={size} width={size} className={className} xmlns="http://www.w3.org/2000/svg"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"></path></svg>
);
const IconNext = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height={size} width={size} className={className} xmlns="http://www.w3.org/2000/svg"><path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z"></path></svg>
);
const IconThree = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height={size} width={size} className={className} xmlns="http://www.w3.org/2000/svg"><path d="M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.456.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.877-1.4zm6.28 1.538l4.878 1.404-3.662 3.53zm-.52.13l1.208 4.9-4.853-1.392zm6.3 1.534l4.947 1.424-3.715 3.574zm-.524.12l1.215 4.926-4.876-1.398zm-15.432.696l4.964 1.424-3.726 3.586zM8.047 8.15l4.877 1.4-3.66 3.527zm-.518.137l1.236 5.017-4.963-1.432zm6.274 1.535l4.965 1.425-3.73 3.586zm-.52.127l1.235 5.012-4.958-1.43zm-9.63 2.438l4.873 1.406-3.656 3.523zm5.854 1.687l4.863 1.403-3.648 3.51zm-.54.04l1.214 4.927-4.875-1.4zm-3.896 4.02l5.037 1.442-3.782 3.638z"></path></svg>
);
const IconFramer = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height={size} width={size} className={className} xmlns="http://www.w3.org/2000/svg"><path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"></path></svg>
);
const IconCss = ({ className, size }: { className?: string, size?: number | string }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height={size} width={size} className={className} xmlns="http://www.w3.org/2000/svg"><path d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3.1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2.1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"></path></svg>
);

const GRID_CONSTANTS = {
  STUD_WIDTH: 65,
  ROW_HEIGHT: 80,
  MAX_ROWS: 20,
  COLS: 6,
  APEX_HEIGHT: 150
};

const STUD_THEMES = {
  green: {
    wall: "linear-gradient(90deg, #087028 0%, #10923b 20%, #1ab84d 38%, #20cc55 50%, #1ab84d 62%, #10923b 80%, #087028 100%)",
    cap: "linear-gradient(135deg, #42f585 0%, #25dd62 40%, #18c04e 70%, #10a040 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,40,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  dark: {
    wall: "linear-gradient(90deg, #09090b 0%, #18181b 20%, #27272a 38%, #3f3f46 50%, #27272a 62%, #18181b 80%, #09090b 100%)",
    cap: "linear-gradient(135deg, #52525b 0%, #3f3f46 40%, #27272a 70%, #18181b 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.2)",
  },
  yellow: {
    wall: "linear-gradient(90deg, #a16207 0%, #ca8a04 20%, #eab308 38%, #facc15 50%, #eab308 62%, #ca8a04 80%, #a16207 100%)",
    cap: "linear-gradient(135deg, #fef08a 0%, #fde047 40%, #eab308 70%, #ca8a04 100%)",
    shadow: "radial-gradient(ellipse, rgba(80,50,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  blue: {
    wall: "linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 20%, #2563eb 38%, #3b82f6 50%, #2563eb 62%, #1d4ed8 80%, #1e3a8a 100%)",
    cap: "linear-gradient(135deg, #93c5fd 0%, #60a5fa 40%, #3b82f6 70%, #2563eb 100%)",
    shadow: "radial-gradient(ellipse, rgba(0,0,80,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  },
  red: {
    wall: "linear-gradient(90deg, #7f1d1d 0%, #b91c1c 20%, #dc2626 38%, #ef4444 50%, #dc2626 62%, #b91c1c 80%, #7f1d1d 100%)",
    cap: "linear-gradient(135deg, #fca5a5 0%, #f87171 40%, #ef4444 70%, #dc2626 100%)",
    shadow: "radial-gradient(ellipse, rgba(80,0,0,0.6) 0%, transparent 70%)",
    rim: "rgba(255,255,255,0.7)",
  }
};

type StudColor = keyof typeof STUD_THEMES;

const LegoStud = ({ color = "green", yOffset = 0 }: { color?: StudColor, yOffset?: number }) => {
  const t = STUD_THEMES[color];
  const studHeight = 16;
  const studWidth = 72; 
  const studCapHeight = 16;
  
  return (
    <div className="flex-1 flex items-end justify-center relative" style={{ transform: `translateY(${yOffset}px)` }}>
      <div
        className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-[75%] rounded-[50%] z-0"
        style={{ height: "10px", background: t.shadow }}
      />
      
      <div className="relative z-10" style={{ width: `${studWidth}%`, maxWidth: "42px", marginBottom: "-1px" }}>
        <div
          className="w-full relative overflow-hidden"
          style={{ height: `${studHeight}px`, borderRadius: "50% / 20%", background: t.wall }}
        >
          <div
            className="absolute top-0 h-full w-[25%] left-[20%]"
            style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)" }}
          />
        </div>
        
        <div
          className="absolute left-0 w-full rounded-[50%] flex items-center justify-center overflow-hidden"
          style={{
            top: `-${studCapHeight / 2}px`, 
            height: `${studCapHeight}px`, 
            background: t.cap,
            boxShadow: `inset 0px 2px 4px rgba(255,255,255,0.6), inset 0px -2px 4px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.4)`,
            borderTop: `1px solid ${t.rim}`,
          }}
        >
          <span className="text-[10px] font-black tracking-widest select-none pointer-events-none opacity-80" style={{
            color: "rgba(0,0,0,0.15)",
            textShadow: "0px 1px 0px rgba(255,255,255,0.6)",
            transform: "scaleY(0.55) translateY(-1px)", 
          }}>
            UI
          </span>
        </div>
      </div>
    </div>
  );
};

interface LegoBlockProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  topColor: string;
  faceGradient: string;
  bottomColor: string;
  topHeight?: number;
  bottomHeight?: number;
  roundedTop?: boolean;
  roundedBottom?: boolean;
  className?: string;
  children: React.ReactNode;
  studs?: number;
  studColor?: StudColor;
  hideStuds?: boolean | number[];
  studYOffset?: number;
}

const LegoBlock = ({
  mouseX, mouseY,
  topColor, faceGradient, bottomColor,
  topHeight = 19, bottomHeight = 15,
  roundedTop = false, roundedBottom = false,
  className = "",
  children, studs = 0, studColor = "green", hideStuds = false,
  studYOffset = 12,
}: LegoBlockProps) => {
  const topDarkenEnd = 100;
  const topShadow = "inset 0px 0px 4px rgba(0,0,0,0.28)";
  const faceShadow = "inset 0px 2px 6px rgba(255,255,255,0.47)";

  const highlightBg = useMotionTemplate`radial-gradient(circle 120px at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.25), transparent)`;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className="relative w-full"
        style={{
          height: `${topHeight}px`,
          background: `linear-gradient(to bottom, ${topColor}, color-mix(in srgb, ${topColor} ${topDarkenEnd}%, black))`,
          boxShadow: topShadow,
          borderRadius: roundedTop ? "4px 4px 0 0" : "0",
        }}
      >
        {studs > 0 && (
          <div className="absolute bottom-full left-0 w-full flex">
            {[...Array(studs)].map((_, i) => {
              const isHidden = Array.isArray(hideStuds) ? hideStuds.includes(i) : hideStuds;
              return isHidden ? (
                <div key={i} className="flex-1" />
              ) : (
                <LegoStud key={i} color={studColor} yOffset={studYOffset} />
              );
            })}
          </div>
        )}
      </div>
      <div
        className="relative w-full border-x border-black/5 overflow-hidden"
        style={{
          background: faceGradient,
          boxShadow: faceShadow,
        }}
      >
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none opacity-60"
          style={{
            background: highlightBg
          }}
        />
        <div className="relative z-30">{children}</div>
      </div>
      <div
        className="relative w-full"
        style={{
          height: `${bottomHeight}px`,
          background: bottomColor,
          boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.15)",
          borderRadius: roundedBottom ? "0 0 4px 4px" : "0",
        }}
      />
    </div>
  );
};

const MODULES = [
  {
    id: "react",
    name: "React",
    desc: "UI Library",
    icon: IconReact,
    studs: 4,
    colors: {
      topColor: "#38bdf8",
      faceGradient: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
      bottomColor: "#075985",
      studColor: "blue" as StudColor,
      text: "text-white drop-shadow-md",
      subtext: "text-sky-100",
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white drop-shadow-sm",
    }
  },
  {
    id: "next",
    name: "Next.js",
    desc: "App Router",
    icon: IconNext,
    studs: 4,
    colors: {
      topColor: "#27272a",
      faceGradient: "linear-gradient(180deg, #3f3f46 0%, #27272a 50%, #18181b 100%)",
      bottomColor: "#09090b",
      studColor: "dark" as StudColor,
      text: "text-white drop-shadow-md",
      subtext: "text-zinc-300",
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    }
  },
  {
    id: "css",
    name: "CSS",
    desc: "Styling v4",
    icon: IconCss,
    studs: 2,
    colors: {
      topColor: "#2dd4bf",
      faceGradient: "linear-gradient(180deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
      bottomColor: "#115e59",
      studColor: "green" as StudColor,
      text: "text-white drop-shadow-md",
      subtext: "text-teal-100",
      iconBg: "bg-black/20 shadow-inner",
      iconColor: "text-white scale-125 drop-shadow-sm",
    }
  },
  {
    id: "three",
    name: "Three.js",
    desc: "WebGL 3D",
    icon: IconThree,
    studs: 4,
    colors: {
      topColor: "#9ca3af",
      faceGradient: "linear-gradient(180deg, #6b7280 0%, #4b5563 50%, #374151 100%)",
      bottomColor: "#1f2937",
      studColor: "dark" as StudColor,
      text: "text-white drop-shadow-md",
      subtext: "text-gray-200",
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    }
  },
  {
    id: "framer",
    name: "Framer",
    desc: "Animations",
    icon: IconFramer,
    studs: 2,
    colors: {
      topColor: "#d946ef",
      faceGradient: "linear-gradient(180deg, #c026d3 0%, #a21caf 50%, #86198f 100%)",
      bottomColor: "#701a75",
      studColor: "red" as StudColor,
      text: "text-white drop-shadow-md",
      subtext: "text-fuchsia-100",
      iconBg: "bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
      iconColor: "text-white drop-shadow-sm",
    }
  }
];

const ModuleBlock = ({ 
  module, 
  hiddenStuds = [], 
  onClick, 
  isAnimating,
  startRect,
  mouseX,
  mouseY,
  onAnimationComplete
}: { 
  module: typeof MODULES[0], 
  hiddenStuds?: number[], 
  onClick: (e: React.MouseEvent) => void,
  isAnimating?: boolean,
  startRect?: DOMRect | null,
  mouseX: MotionValue<number>,
  mouseY: MotionValue<number>,
  onAnimationComplete?: () => void
}) => {
  const widthPx = module.studs * GRID_CONSTANTS.STUD_WIDTH;
  const isCompact = module.studs <= 2;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnimating && startRect && wrapperRef.current) {
      const endRect = wrapperRef.current.getBoundingClientRect();
      const dx = startRect.left - endRect.left;
      const dy = startRect.top - endRect.top;

      // Arc apex: guarantees the block jumps higher than both its start and end point
      const apexY = Math.min(dy, 0) - GRID_CONSTANTS.APEX_HEIGHT;

      const animation = wrapperRef.current.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(1, 1)`, filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))', offset: 0 },
        { transform: `translate(${dx}px, ${dy}px) scale(1.1, 0.85)`, filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.3))', offset: 0.15 },
        { transform: `translate(${dx * 0.75}px, ${dy + (apexY - dy) * 0.5}px) scale(0.9, 1.15)`, filter: 'drop-shadow(0px 30px 20px rgba(0,0,0,0.05))', offset: 0.35 },
        { transform: `translate(${dx * 0.5}px, ${apexY}px) scale(1, 1)`, filter: 'drop-shadow(0px 40px 20px rgba(0,0,0,0))', offset: 0.55 },
        { transform: `translate(${dx * 0.25}px, ${apexY * 0.5}px) scale(0.9, 1.15)`, filter: 'drop-shadow(0px 30px 20px rgba(0,0,0,0.05))', offset: 0.75 },
        { transform: `translate(0px, 0px) scale(1.15, 0.85)`, filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.3))', offset: 0.9 },
        { transform: `translate(0px, 0px) scale(1, 1)`, filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))', offset: 1 }
      ], {
        duration: 1200,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)", 
        fill: "both"
      });

      animation.onfinish = () => onAnimationComplete?.();
      
      return () => animation.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating, startRect]);

  return (
    <div ref={wrapperRef} className="z-50 relative lego-block-wrapper" style={{ width: widthPx }}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Equip ${module.name}`}
        className="cursor-pointer w-full shrink-0 touch-none group relative focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ccff00] rounded-lg hover:-translate-y-1.5 active:scale-95 transition-all duration-200 text-left"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors z-30 rounded-lg pointer-events-none" />
        <LegoBlock
          mouseX={mouseX}
          mouseY={mouseY}
          topColor={module.colors.topColor}
          faceGradient={module.colors.faceGradient}
          bottomColor={module.colors.bottomColor}
          roundedTop roundedBottom
          studs={module.studs}
          studColor={module.colors.studColor}
          hideStuds={hiddenStuds}
        >
          <div className={`flex items-center w-full h-[60px] ${isCompact ? 'px-3 gap-2.5' : 'px-4 gap-3'}`}>
            {isCompact ? (
              <>
                <div className={`w-7 h-7 rounded-md ${module.colors.iconBg} flex items-center justify-center shrink-0`}>
                  <module.icon className={module.colors.iconColor} size={18} />
                </div>
                <h4 className="font-sans font-bold text-white text-[15px] tracking-wide truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {module.name}
                </h4>
              </>
            ) : (
              <>
                <div className={`w-9 h-9 rounded-lg ${module.colors.iconBg} flex items-center justify-center shrink-0`}>
                  <module.icon className={module.colors.iconColor} size={24} />
                </div>
                <h4 className="font-sans font-bold text-white text-[17px] tracking-wide truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                  {module.name}
                </h4>
              </>
            )}
          </div>
        </LegoBlock>
      </button>
    </div>
  );
};

export interface LegoOnboardingProps {
  modules?: typeof MODULES;
  onComplete?: (stack: typeof MODULES) => void;
  onSkip?: () => void;
  className?: string;
}

export default function LegoOnboarding({ 
  modules = MODULES,
  onComplete,
  onSkip,
  className = ""
}: LegoOnboardingProps = {}) {
  const [equippedIds, setEquippedIds] = useState<string[]>([]);
  const [animatingBlocks, setAnimatingBlocks] = useState<Record<string, DOMRect>>({});
  
  const controls = useAnimation();
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const handlePointerMove = (e: React.PointerEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 100);
    mouseY.set((e.clientY / window.innerHeight) * 100);
  };

  const handleToggleEquip = (id: string, e: React.MouseEvent) => {
    // Prevent interrupting an ongoing animation
    if (animatingBlocks[id]) return;

    const el = (e.currentTarget as HTMLElement).closest('.lego-block-wrapper');
    if (!el) return;
    const startRect = el.getBoundingClientRect();
    
    setAnimatingBlocks(prev => ({ ...prev, [id]: startRect }));
    
    setEquippedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });

    // Simulate heavy impact when the block lands (at 90% of 1200ms = 1080ms)
    setTimeout(() => {
      controls.start({ y: [0, 10, -3, 0], transition: { duration: 0.4, times: [0, 0.4, 0.7, 1], ease: "easeInOut" } });
    }, 1080);
  };

  const equippedModules = equippedIds.map(id => modules.find(m => m.id === id)!);
  const unequippedModules = modules.filter(m => !equippedIds.includes(m.id));

  // Compute 2D Grid inside useMemo for performance
  const { grid, positionedModules } = useMemo(() => {
    const calculatedGrid: (string | null)[][] = [];
    const positioned = equippedModules.map(m => {
      let placedRow = -1;
      let placedCol = -1;
      for (let r = 0; r < GRID_CONSTANTS.MAX_ROWS; r++) {
        if (!calculatedGrid[r]) calculatedGrid[r] = Array(GRID_CONSTANTS.COLS).fill(null);
        let contiguous = 0;
        for (let c = 0; c < GRID_CONSTANTS.COLS; c++) {
          if (!calculatedGrid[r][c]) {
            contiguous++;
            if (contiguous === m.studs) {
              placedRow = r;
              placedCol = c - m.studs + 1;
              break;
            }
          } else {
            contiguous = 0;
          }
        }
        if (placedRow !== -1) break;
      }
      if (placedRow !== -1) {
        for (let i = 0; i < m.studs; i++) {
          calculatedGrid[placedRow][placedCol + i] = m.id;
        }
      } else {
        placedRow = 0;
        placedCol = 0;
      }
      return { module: m, rowIndex: placedRow, colIndex: placedCol };
    });
    return { grid: calculatedGrid, positionedModules: positioned };
  }, [equippedModules]);

  const hiddenServerStuds: number[] = [];
  if (grid[0]) {
    grid[0].forEach((occupantId, idx) => {
      if (occupantId && !animatingBlocks[occupantId]) hiddenServerStuds.push(idx);
    });
  }

  const towerHeight = equippedModules.length > 0 
    ? (Math.max(...positionedModules.map(m => m.rowIndex)) + 1) * GRID_CONSTANTS.ROW_HEIGHT 
    : 0;

  return (
    <div 
      onPointerMove={handlePointerMove}
      className={`w-full min-h-screen relative overflow-hidden select-none font-sans flex flex-col ${className}`}
    >

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 relative z-10 pt-28 lg:pt-10 pb-8 px-8 overflow-y-auto w-full">
        
        <div className="flex-1 w-full max-w-[500px] flex flex-col justify-center">

          
          <div className="flex flex-wrap justify-center lg:justify-start gap-5 relative z-20 min-h-[200px]">

            {unequippedModules.map((module) => {
              const startRect = animatingBlocks[module.id];
              return (
                <ModuleBlock 
                  key={module.id}
                  module={module}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  isAnimating={!!startRect}
                  startRect={startRect || null}
                  onAnimationComplete={() => {
                    setAnimatingBlocks(prev => {
                      const next = { ...prev };
                      delete next[module.id];
                      return next;
                    });
                  }}
                  onClick={(e) => handleToggleEquip(module.id, e)} 
                />
              )
            })}
          </div>
        </div>

        {/* RIGHT: The Profile Structure */}
        <div className="flex flex-col items-center gap-12 w-full lg:w-auto mt-16 lg:mt-0">
          <div className="scale-[0.75] sm:scale-[0.8] lg:scale-100 origin-bottom shrink-0 flex flex-col items-center">
            <motion.div 
              animate={controls}
              className="relative w-[390px] shadow-[0_15px_35px_rgba(0,0,0,0.25)] rounded-xl transition-all duration-700 ease-out"
              style={{ marginTop: `${towerHeight}px` }}
            >
            
            {/* Stacked Equipped Modules */}
            <div className="absolute left-0 w-full h-0 z-20" style={{ bottom: "calc(100% - 14px)" }}>
                {positionedModules.map(({ module, rowIndex, colIndex }) => {
                  const hiddenLocalStuds: number[] = [];
                  if (grid[rowIndex + 1]) {
                    for (let i = 0; i < module.studs; i++) {
                      const occupantId = grid[rowIndex + 1][colIndex + i];
                      if (occupantId && !animatingBlocks[occupantId]) {
                        hiddenLocalStuds.push(i);
                      }
                    }
                  }

                  const startRect = animatingBlocks[module.id];

                  return (
                    <div 
                      key={module.id}
                      className="absolute"
                      style={{ 
                        bottom: rowIndex * GRID_CONSTANTS.ROW_HEIGHT, 
                        left: colIndex * GRID_CONSTANTS.STUD_WIDTH,
                        zIndex: rowIndex * 10
                      }}
                    >
                      <ModuleBlock 
                        module={module} 
                        hiddenStuds={hiddenLocalStuds}
                        mouseX={mouseX}
                        mouseY={mouseY}
                        isAnimating={!!startRect}
                        startRect={startRect || null}
                        onAnimationComplete={() => {
                          setAnimatingBlocks(prev => {
                            const next = { ...prev };
                            delete next[module.id];
                            return next;
                          });
                        }}
                        onClick={(e) => handleToggleEquip(module.id, e)} 
                      />
                    </div>
                  );
                })}
            </div>

            {/* Base Profile Block */}
            <LegoBlock
              mouseX={mouseX}
              mouseY={mouseY}
              topColor="#eab308"
              faceGradient="linear-gradient(180deg, #facc15 0%, #eab308 50%, #ca8a04 100%)"
              bottomColor="#a16207"
              roundedTop roundedBottom
              studs={6} studColor="yellow"
              hideStuds={hiddenServerStuds}
              className="relative z-10"
            >
              <div className="px-5 py-4 pt-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shadow-inner shrink-0">
                    <IconUser className="w-6 h-6 text-white drop-shadow-md" size={24} />
                  </div>
                  <div className="text-white drop-shadow-md">
                    <h3 className="font-sans font-bold text-[17px] tracking-wide truncate drop-shadow-md">My Profile</h3>
                    <p className="font-mono text-[10px] font-bold text-yellow-100/90 tracking-[0.2em] uppercase mt-1.5 drop-shadow-sm">
                      {equippedModules.length === 0 ? "Select technologies" : `Level: ${equippedModules.length * 10}XP`}
                    </p>
                  </div>
                </div>
              </div>
            </LegoBlock>
            </motion.div>
          </div>

          {/* Call To Action Buttons */}
          <div className="h-24 w-full flex flex-col items-center justify-start mt-4 gap-3">
            <AnimatePresence>
              {equippedModules.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-zinc-900 text-white font-medium tracking-wide rounded-xl shadow-lg hover:bg-zinc-800 transition-colors duration-200"
                  onClick={() => onComplete ? onComplete(equippedModules) : alert(`Onboarding complete!\nStack: ${equippedModules.map(m => m.name).join(' + ')}`)}
                >
                  Continue →
                </motion.button>
              )}
            </AnimatePresence>
            
            {onSkip && (
               <button 
                 onClick={onSkip}
                 className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest mt-2"
               >
                 Skip for now
               </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export { LegoOnboarding as Component };
