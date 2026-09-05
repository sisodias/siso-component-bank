"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Hexagon,
  ScanFace,
  Activity,
  Radio,
  Cpu,
} from "lucide-react";
import Image from "next/image";

// --- Types ---

interface TechFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  image: string;
  color: string;
}

// --- Data ---

const TECH_FEATURES: TechFeature[] = [
  {
    id: "SYS-01",
    title: "Hyper-V Optics",
    subtitle: "Visual Array",
    description:
      "Multi-spectral imaging array capable of analyzing structural integrity through dense atmospheric interference.",
    icon: ScanFace,
    image:
      "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format&fit=crop",
    color: "#06b6d4", // Cyan
  },
  {
    id: "SYS-02",
    title: "Reactant Shield",
    subtitle: "Defense Mesh",
    description:
      "Adaptive energy barrier that intelligently modulates frequency based on incoming kinetic or thermal threats.",
    icon: Radio,
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
    color: "#8b5cf6", // Purple
  },
  {
    id: "SYS-03",
    title: "Neural Lattice",
    subtitle: "AI Core",
    description:
      "Central processing hub utilizing synthetic synapses for predictive modeling and autonomous decision making.",
    icon: Cpu,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
    color: "#f43f5e", // Rose
  },
  {
    id: "SYS-04",
    title: "Bio-Synth Link",
    subtitle: "Operator UI",
    description:
      "Direct neural pathway connection allowing for latency-free symbiotic control of complex machinery.",
    icon: Activity,
    image:
      "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1000&auto=format&fit=crop",
    color: "#10b981", // Emerald
  },
];

// --- Main Component ---

export default function OrbitalScanner() {
  const [activeId, setActiveId] = useState<string>(TECH_FEATURES[0].id);
  const activeFeature =
    TECH_FEATURES.find((f) => f.id === activeId) || TECH_FEATURES[0];

  return (
    <div className="relative min-h-screen w-full bg-[#020204] text-neutral-200 overflow-hidden flex items-center justify-center py-8 px-4 md:px-8 md:py-12">
      
      {/* --- Background Elements --- */}
      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* Noise Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />

      {/* Dynamic Ambient Glow */}
      <motion.div
        animate={{ backgroundColor: activeFeature.color }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] md:blur-[200px] opacity-15 transition-colors duration-1000"
      />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        
        {/* --- RIGHT PANEL (LIST): Order-1 (Top) on Mobile, Order-1 (Left) on Desktop --- */}
        <div className="lg:col-span-5 order-1 flex flex-col gap-6 md:gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-xs font-mono text-neutral-500 uppercase tracking-widest mb-4"
            >
              <Hexagon
                size={16}
                className="text-neutral-400 fill-neutral-900"
              />
              <span>System Diagnostics // v.2.4.0</span>
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-light uppercase tracking-wide text-white leading-tight">
              Active{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                Modules
              </span>
            </h1>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            {TECH_FEATURES.map((feature) => (
              <DataFeedItem
                key={feature.id}
                feature={feature}
                isActive={activeId === feature.id}
                onClick={() => setActiveId(feature.id)}
              />
            ))}
          </div>
        </div>

        {/* --- LEFT PANEL (SCANNER): Order-2 (Bottom) on Mobile, Order-Last (Right) on Desktop --- */}
        <div className="lg:col-span-7 order-2 lg:order-last flex flex-col items-center justify-center perspective-1000 mt-8 lg:mt-0">
          <ScannerPortal feature={activeFeature} />
        </div>

      </div>
    </div>
  );
}

// --- Sub-Component: Data Feed Item ---

function DataFeedItem({
  feature,
  isActive,
  onClick,
}: {
  feature: TechFeature;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = feature.icon;
  const ref = useRef<HTMLButtonElement>(null);

  // Magnetic Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    x.set(clientX - left);
    y.set(clientY - top);
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      initial={false}
      animate={{
        backgroundColor: isActive
          ? "rgba(20, 20, 20, 0.8)"
          : "rgba(20, 20, 20, 0.4)",
        borderColor: isActive
          ? "rgba(82, 82, 82, 0.5)"
          : "rgba(38, 38, 38, 0.4)",
        y: isActive ? -4 : 0,
        scale: isActive ? 1.02 : 1,
      }}
      whileHover={{ scale: isActive ? 1.02 : 1.01 }}
      className="group relative w-full text-left rounded-xl p-4 md:p-5 border backdrop-blur-sm transition-all duration-500 overflow-hidden"
    >
      {/* 1. Spotlight Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${isActive ? feature.color + "10" : "rgba(255,255,255,0.05)"},
              transparent 80%
            )
          `,
        }}
      />

      {/* 2. Active Decorators */}
      {isActive && (
        <>
          <motion.div
            layoutId="activeGlow"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-50"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
              repeatDelay: 1,
            }}
          />
          <motion.div
            layoutId="activeBorder"
            className="absolute left-0 top-0 bottom-0 w-1.5"
            style={{ backgroundColor: feature.color }}
          />
        </>
      )}

      <div className="relative z-10 flex items-start gap-4 md:gap-5">
        {/* Icon Box */}
        <div
          className="relative h-10 w-10 md:h-12 md:w-12 flex-shrink-0 flex items-center justify-center rounded-lg transition-colors duration-500 border border-transparent"
          style={{
            backgroundColor: isActive
              ? `${feature.color}15`
              : "rgba(255,255,255,0.03)",
            borderColor: isActive ? `${feature.color}30` : "transparent",
            color: isActive ? feature.color : "#525252",
          }}
        >
          {isActive && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-lg border border-dashed opacity-50"
              style={{ borderColor: feature.color }}
            />
          )}
          <Icon size={20} className="md:w-6 md:h-6" strokeWidth={isActive ? 2 : 1.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex justify-between items-center mb-1">
            <h3
              className={`text-base md:text-lg font-medium tracking-tight transition-colors duration-300 ${
                isActive
                  ? "text-white"
                  : "text-neutral-400 group-hover:text-neutral-300"
              }`}
            >
              {feature.title}
            </h3>

            {/* Animated Audio Waveform for "Online" Status */}
            {isActive && (
              <div className="flex items-center gap-1 h-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["20%", "100%", "20%"] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                    className="w-0.5 bg-current rounded-full"
                    style={{ color: feature.color, height: "100%" }}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="text-[10px] md:text-xs font-mono uppercase text-neutral-600 tracking-widest group-hover:text-neutral-500 transition-colors">
            {feature.subtitle}
          </p>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pt-3 md:pt-4 mt-2 md:mt-3 border-t border-dashed border-neutral-800 text-xs md:text-sm text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  );
}

// --- Sub-Component: Scanner Portal ---

function ScannerPortal({ feature }: { feature: TechFeature }) {
  return (
    // Adjusted dimensions for responsive scaling:
    // Mobile: 280px -> SM: 340px -> MD: 500px
    <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[500px] md:h-[500px] flex items-center justify-center">
      
      {/* 1. HUD Corner Brackets */}
      <CornerBracket className="absolute top-0 left-0" color={feature.color} />
      <CornerBracket
        className="absolute top-0 right-0 rotate-90"
        color={feature.color}
      />
      <CornerBracket
        className="absolute bottom-0 right-0 rotate-180"
        color={feature.color}
      />
      <CornerBracket
        className="absolute bottom-0 left-0 -rotate-90"
        color={feature.color}
      />

      {/* 2. Rotating Outer Rings */}
      <div className="absolute inset-8 rounded-full border border-neutral-800/80 animate-[spin_30s_linear_infinite]" />
      <div className="absolute inset-16 rounded-full border border-dashed border-neutral-800 animate-[spin_20s_linear_infinite_reverse]" />

      {/* 3. The Active Colored Ring & Glow */}
      <motion.div
        animate={{
          borderColor: feature.color,
          boxShadow: `0 0 30px -5px ${feature.color}40, inset 0 0 30px -5px ${feature.color}40`,
        }}
        className="absolute inset-[10px] md:inset-[20px] rounded-full border-[3px] transition-all duration-500"
      >
        {/* Scanning Beam effect */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full overflow-hidden"
        >
          <div
            className="h-1/2 w-full bg-gradient-to-b from-transparent to-white/20"
            style={{ borderBottom: `2px solid ${feature.color}` }}
          />
        </motion.div>
      </motion.div>

      {/* 4. Central Image Container with "Scanner Transition" */}
      {/* Adjusted inner dimensions for responsive scaling */}
      <div className="relative h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] md:h-[320px] md:w-[320px] rounded-full overflow-hidden border-2 border-neutral-900 bg-[#0a0a0a] z-20 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={feature.id}
            className="relative h-full w-full"
            // 1. Start invisible and "closed" (clipPath height 0)
            initial={{
              opacity: 0,
              scale: 1.1,
              clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            }}
            // 2. Animate to visible and "open" (clipPath full height)
            animate={{
              opacity: 1,
              scale: 1,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              transition: { duration: 0.5, ease: "circOut" },
            }}
            // 3. Exit by wiping down
            exit={{
              opacity: 0,
              scale: 0.9,
              clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          >
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              className="object-cover"
            />

            {/* Hologram Scanlines Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAYAAABS3WWfeAAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAMSURBVHjaYmBgYAAAAAABAAIzgDpkAAAAAElFTkSuQmCC')] opacity-30 mix-blend-overlay pointer-events-none" />

            <motion.div
              animate={{ backgroundColor: feature.color }}
              className="absolute inset-0 mix-blend-color opacity-30 transition-colors duration-500"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5. Status Label below scanner */}
      <div className="absolute -bottom-12 md:-bottom-16 text-center">
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900/50 border border-neutral-800 px-3 py-1 md:px-4 md:py-1.5"
        >
          <motion.div
            animate={{ backgroundColor: feature.color }}
            className="w-1.5 h-1.5 rounded-full animate-pulse"
          />
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            Scan Active: {feature.id}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// --- Helper: Corner Bracket SVG ---

function CornerBracket({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <motion.svg
      animate={{ stroke: color }}
      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 opacity-50 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
    >
      <path d="M1 9V3C1 1.89543 1.89543 1 3 1H9" strokeLinecap="round" />
    </motion.svg>
  );
}