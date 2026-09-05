import React, { useEffect, useState, useRef, MouseEvent } from 'react';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Cpu, Globe, ScanEye, Moon, Sun, Cloud, Zap, Fingerprint } from "lucide-react";

// --- Utility Helper ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- SpotlightCard Component Start ---

type SpotlightVariant = 
  | "default" 
  | "subtle" 
  | "vibrant" 
  | "neon" 
  | "warm" 
  | "azure" 
  | "amber" 
  | "emerald";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  variant?: SpotlightVariant;
}

// Maps variant names to CSS variables defined in App.tsx styles
const variantColors: Record<SpotlightVariant, string> = {
  default: "var(--spotlight-default)",
  subtle: "var(--spotlight-default)",
  vibrant: "var(--spotlight-vibrant)",
  neon: "var(--spotlight-neon)",
  warm: "var(--spotlight-warm)",
  azure: "var(--spotlight-azure)", 
  amber: "var(--spotlight-amber)",   
  emerald: "var(--spotlight-emerald)" 
};

const variantBorderColors: Record<SpotlightVariant, string> = {
  default: "var(--border-default)",
  subtle: "var(--border-default)",
  vibrant: "var(--border-vibrant)",
  neon: "var(--border-neon)",
  warm: "var(--border-warm)",
  azure: "var(--border-azure)",
  amber: "var(--border-amber)",
  emerald: "var(--border-emerald)"
};

const SpotlightCard = ({
  children,
  className,
  spotlightColor,
  variant = "default",
  ...props
}: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const color = spotlightColor || variantColors[variant];
  const borderColor = variantBorderColors[variant];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        "--spotlight-color": color,
        "--spotlight-border": borderColor,
      } as React.CSSProperties}
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transform-gpu transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:-translate-y-1 hover:border-[var(--spotlight-border)]",
        "hover:shadow-[0_20px_40px_-10px_var(--spotlight-color)]",
        "shadow-sm dark:shadow-none",
        className
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${color}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// --- SpotlightCard Component End ---

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-10 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 dark:selection:text-white transition-colors duration-300"
      style={{
        backgroundImage: `linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center top'
      }}
    >
      
      {/* CSS Variables for Spotlight Colors */}
      <style>{`
        :root {
          /* Grid Pattern Color */
          --grid-color: rgba(0, 0, 0, 0.03);

          /* Light Mode Colors (Subtle/Darker for visibility on white) */
          --spotlight-default: rgba(0, 0, 0, 0.05);
          --border-default: rgba(0, 0, 0, 0.1);
          
          --spotlight-vibrant: rgba(13, 148, 136, 0.15); /* Teal-600 low opacity */
          --border-vibrant: rgba(13, 148, 136, 0.3);
          
          --spotlight-neon: rgba(124, 58, 237, 0.15); /* Violet-600 low opacity */
          --border-neon: rgba(124, 58, 237, 0.3);
          
          --spotlight-warm: rgba(225, 29, 72, 0.15); /* Rose-600 low opacity */
          --border-warm: rgba(225, 29, 72, 0.3);
          
          --spotlight-azure: rgba(2, 132, 199, 0.15); /* Sky-600 */
          --border-azure: rgba(2, 132, 199, 0.3);
          
          --spotlight-amber: rgba(217, 119, 6, 0.15); /* Amber-600 */
          --border-amber: rgba(217, 119, 6, 0.3);
          
          --spotlight-emerald: rgba(5, 150, 105, 0.15); /* Emerald-600 */
          --border-emerald: rgba(5, 150, 105, 0.3);
        }
        
        .dark {
          /* Grid Pattern Color */
          --grid-color: rgba(255, 255, 255, 0.03);

          /* Dark Mode Colors (Bright/Lighter for visibility on dark) */
          --spotlight-default: rgba(255, 255, 255, 0.15);
          --border-default: rgba(255, 255, 255, 0.5);
          
          --spotlight-vibrant: rgba(45, 212, 191, 0.25);
          --border-vibrant: rgba(45, 212, 191, 0.5);
          
          --spotlight-neon: rgba(139, 92, 246, 0.25);
          --border-neon: rgba(139, 92, 246, 0.5);
          
          --spotlight-warm: rgba(244, 63, 94, 0.25);
          --border-warm: rgba(244, 63, 94, 0.5);
          
          --spotlight-azure: rgba(56, 189, 248, 0.25);
          --border-azure: rgba(56, 189, 248, 0.5);
          
          --spotlight-amber: rgba(251, 191, 36, 0.25);
          --border-amber: rgba(251, 191, 36, 0.5);
          
          --spotlight-emerald: rgba(52, 211, 153, 0.25);
          --border-emerald: rgba(52, 211, 153, 0.5);
        }
      `}</style>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm hover:scale-110 transition-transform z-50"
        aria-label="Toggle Theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Header Section */}
      <div className="max-w-5xl w-full mb-12 space-y-4 text-center md:text-left relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-900 dark:text-white transition-colors">
          Intelligence, <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 to-zinc-900 dark:from-zinc-400 dark:to-zinc-700">Embedded.</span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-colors">
          Deploy state-of-the-art multimodal models directly to your edge devices. 
          Zero latency. Zero compromise.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl w-full pb-10 relative z-10">
        
        {/* Card 1: Neural Processing - Teal Spotlight */}
        <SpotlightCard 
          className="p-8 h-full flex flex-col gap-6" 
          variant="vibrant"
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 shadow-inner transition-colors">
            <Cpu className="text-teal-600 dark:text-teal-400 h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">Neural Processing</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm transition-colors">
              On-device inference powered by the latest NPU architecture. Optimized for low-power consumption without sacrificing accuracy.
            </p>
          </div>
        </SpotlightCard>

        {/* Card 2: Spatial Computing - Violet Spotlight */}
        <SpotlightCard 
          className="p-8 h-full flex flex-col gap-6" 
          variant="neon"
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/50 shadow-inner transition-colors">
            <ScanEye className="text-violet-600 dark:text-violet-400 h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">Spatial Vision</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm transition-colors">
              Understand physical environments with lidar-enhanced depth perception and real-time object classification streams.
            </p>
          </div>
        </SpotlightCard>

        {/* Card 3: Global Sync - Rose Spotlight */}
        <SpotlightCard 
          className="p-8 h-full flex flex-col gap-6" 
          variant="warm"
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 shadow-inner transition-colors">
            <Globe className="text-rose-600 dark:text-rose-400 h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">Global Mesh</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm transition-colors">
              Instant state synchronization across our distributed mesh network. Data coherency guaranteed across all regions.
            </p>
          </div>
        </SpotlightCard>

        {/* Card 4: Cloud Architecture - Azure Spotlight */}
        <SpotlightCard 
          className="p-8 h-full flex flex-col gap-6" 
          variant="azure"
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 shadow-inner transition-colors">
            <Cloud className="text-sky-600 dark:text-sky-400 h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">Cloud Native</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm transition-colors">
              Seamlessly integrates with existing cloud infrastructure. Hybrid deployment ready out of the box with zero configuration.
            </p>
          </div>
        </SpotlightCard>

        {/* Card 5: Energy Efficiency - Amber Spotlight */}
        <SpotlightCard 
          className="p-8 h-full flex flex-col gap-6" 
          variant="amber"
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 shadow-inner transition-colors">
            <Zap className="text-amber-600 dark:text-amber-400 h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">Ultra Low Power</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm transition-colors">
              Industry-leading performance per watt. Run complex multimodal models on battery-powered edge devices for days.
            </p>
          </div>
        </SpotlightCard>

        {/* Card 6: Security - Emerald Spotlight */}
        <SpotlightCard 
          className="p-8 h-full flex flex-col gap-6" 
          variant="emerald"
        >
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 shadow-inner transition-colors">
            <Fingerprint className="text-emerald-600 dark:text-emerald-400 h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">Secure Enclave</h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm transition-colors">
              End-to-end encryption with hardware-backed key storage. Your data never leaves the device unencrypted.
            </p>
          </div>
        </SpotlightCard>

      </div>
      
      {/* Footer / Caption */}
      <div className="mb-10 text-center relative z-10">
        <p className="text-zinc-400 dark:text-zinc-600 text-xs uppercase tracking-widest font-semibold transition-colors">
          Powered by Spotlight UI
        </p>
      </div>
    </div>
  );
}