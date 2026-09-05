
import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Terminal, Code2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility: Merges Tailwind CSS classes with clsx and tailwind-merge.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

/**
 * GridBackground: Renders an orthogonal grid with a radial fade and subtle drift animation.
 * @param density - Controls the frequency of grid lines. Higher = Finer, Lower = Coarser.
 */
function GridBackground({ density = 2.5 }: { density?: number }) {
  // Calculate spacing based on density. 
  // Base constant 160 / 2.5 = 64px (approx 4rem)
  const spacing = useMemo(() => 160 / Math.max(0.1, density), [density]);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <motion.div 
        className="absolute inset-[-100%] bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]"
        style={{
          backgroundSize: `${spacing}px ${spacing}px`,
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)'
        }}
        animate={{
          backgroundPosition: [`0px 0px`, `${spacing}px ${spacing}px`],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          backgroundPosition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          },
          opacity: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
    </div>
  );
}

/**
 * ThemeToggle: Handles dark mode switching.
 */
function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:scale-110 transition-all border border-zinc-200 dark:border-zinc-700 shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

/**
 * TextShimmer: Animates a gradient shimmer across text.
 */
interface TextShimmerProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as any);
  
  const childrenText = useMemo(() => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return children.toString();
    if (Array.isArray(children)) return children.join('');
    return '';
  }, [children]);

  const dynamicSpread = useMemo(() => {
    return childrenText.length * spread;
  }, [childrenText, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

// --- Main Application ---

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100">
      <ThemeToggle />
      <GridBackground density={3} />

      <main className="max-w-5xl mx-auto px-6 py-20 lg:py-32 flex flex-col gap-24">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Crafting the next generation <br className="hidden md:block" />
            of <TextShimmer className="[--base-gradient-color:theme(colors.blue.500)] dark:[--base-gradient-color:theme(colors.blue.400)]">digital interfaces</TextShimmer>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
            Combine stunning typography with subtle animations using the TextShimmer component. 
            Built for developers who care about the details.
          </p>
        </section>

        {/* Demo Grid */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Card 1: Basic Shimmer */}
          <div className="group relative p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                <Terminal size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">System Status</h3>
                <p className="text-sm text-zinc-500">Default monochrome effect</p>
              </div>
            </div>
            <div className="h-24 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50">
              <TextShimmer className="font-mono text-sm tracking-wide" duration={1.5}>
                Initializing neural networks...
              </TextShimmer>
            </div>
          </div>

          {/* Card 2: Colored Shimmer */}
          <div className="group relative p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Code2 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">Dynamic Coloring</h3>
                <p className="text-sm text-zinc-500">Custom theme variables</p>
              </div>
            </div>
            <div className="h-24 flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50">
              <TextShimmer
                duration={1.8}
                className="text-2xl font-bold [--base-color:theme(colors.indigo.600)] [--base-gradient-color:theme(colors.indigo.200)] dark:[--base-color:theme(colors.indigo.700)] dark:[--base-gradient-color:theme(colors.indigo.400)]"
              >
                Seamless Transitions
              </TextShimmer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
