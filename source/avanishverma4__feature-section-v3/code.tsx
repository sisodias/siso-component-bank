import React, { useState, useEffect } from 'react';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  Shield, 
  Terminal, 
  MousePointer2, 
  DollarSign, 
  Cloud, 
  Share2, 
  LifeBuoy, 
  ShieldCheck, 
  Heart,
  Moon,
  Sun
} from "lucide-react";

/**
 * Utility for merging tailwind classes.
 * Defined locally to remove dependency on external lib/utils.ts
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Internal Components ---

interface FeatureData {
  title: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Individual Feature Card component with hover effects.
 * Uses rounded-xl for a cleaner, modern geometric look.
 */
const Feature = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature transition-all duration-500",
        "border border-neutral-200/50 dark:border-neutral-800/50 rounded-xl",
        "hover:z-30 hover:scale-[1.04] hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)]",
        "hover:ring-1 hover:ring-blue-500/20 dark:hover:ring-blue-500/10",
        "bg-white/70 dark:bg-neutral-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-900",
        "hover:border-blue-400/30 dark:hover:border-blue-500/30"
      )}
    >
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400 group-hover/feature:text-blue-600 transition-all duration-500 group-hover/feature:scale-110 origin-left">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-10 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-500 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 leading-relaxed group-hover/feature:text-neutral-900 dark:group-hover/feature:text-neutral-100 transition-colors duration-500">
        {description}
      </p>
      
      <div className="mt-4 px-10 relative z-10 opacity-0 group-hover/feature:opacity-100 transition-all duration-700 transform translate-y-2 group-hover/feature:translate-y-0">
        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
          Feature Active <Shield size={12} />
        </span>
      </div>
    </div>
  );
};

/**
 * Main grid component for the features section.
 */
function FeaturesSectionWithHoverEffects() {
  const features: FeatureData[] = [
    {
      title: "Built for developers",
      description: "Built for engineers, developers, dreamers, thinkers and doers.",
      icon: <Terminal size={24} />,
    },
    {
      title: "Ease of use",
      description: "It's as easy as using an Apple, and as expensive as buying one.",
      icon: <MousePointer2 size={24} />,
    },
    {
      title: "Pricing like no other",
      description: "Our prices are best in the market. No cap, no lock, no credit card required.",
      icon: <DollarSign size={24} />,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <Cloud size={24} />,
    },
    {
      title: "Multi-tenant Architecture",
      description: "You can simply share passwords instead of buying new seats.",
      icon: <Share2 size={24} />,
    },
    {
      title: "24/7 Customer Support",
      description: "We are available a 100% of the time. At least our AI Agents are.",
      icon: <LifeBuoy size={24} />,
    },
    {
      title: "Money back guarantee",
      description: "If you do not like EveryAI, we will convince you to like us.",
      icon: <ShieldCheck size={24} />,
    },
    {
      title: "And everything else",
      description: "Comprehensive features designed for scaling your next big idea.",
      icon: <Heart size={24} />,
    },
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 py-10 max-w-7xl mx-auto px-4">
        {features.map((feature, index) => (
          <Feature 
            key={feature.title} 
            {...feature} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Demo wrapper providing enhanced background gradients, grid patterns, and section titles.
 */
function FeaturesSectionWithHoverEffectsDemo() {
  return (
    <div className="w-full relative overflow-hidden bg-white dark:bg-neutral-950 py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-700">
      
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Layer 1: Base Linear Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-white to-indigo-50/20 dark:from-blue-950/20 dark:via-neutral-950 dark:to-indigo-950/20" />

        {/* Layer 2: Orthogonal Grid Pattern (Graph Style) */}
        <div 
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, #808080 1px, transparent 1px),
              linear-gradient(to bottom, #808080 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} 
        />

        {/* Layer 3: Dynamic Mesh-style Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide uppercase bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
          Powerful Infrastructure
        </div>
        <h2 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-6xl mb-6">
          Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Excellence</span>
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Discover why thousands of developers choose EveryAI to build their future with high-performance, developer-first infrastructure.
        </p>
      </div>

      <div className="relative z-10">
        <FeaturesSectionWithHoverEffects />
      </div>
    </div>
  );
}

// --- Main Application Component ---

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Synchronize darkMode state with the document element class for Tailwind dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 ${darkMode ? 'bg-neutral-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Floating Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-gray-200 dark:border-neutral-700 hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={20} className="text-blue-600 group-hover:-rotate-12 transition-transform" />
          )}
        </button>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen">
        <FeaturesSectionWithHoverEffectsDemo />
      </main>
    </div>
  );
};

export default App;