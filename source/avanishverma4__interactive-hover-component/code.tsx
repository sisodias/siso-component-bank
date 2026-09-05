
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Moon, 
  Sun,
  ArrowRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines tailwind classes using clsx and twMerge for conflict resolution.
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-32 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold transition-all duration-300",
        className,
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary"></div>
    </button>
  );
});
InteractiveHoverButton.displayName = "InteractiveHoverButton";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="relative min-h-screen font-sans selection:bg-primary selection:text-primary-foreground flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300 overflow-hidden">
      {/* Orthogonal Grid Background - Updated for subtle visibility */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute inset-0 h-full w-full 
          bg-[linear-gradient(to_right,#80808022_1px,transparent_1px),linear-gradient(to_bottom,#80808022_1px,transparent_1px)] 
          dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] 
          bg-[size:40px_40px] 
          [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_30%,transparent_100%)]">
        </div>
      </div>

      {/* Floating Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      <main className="container relative z-10 mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <section className="text-center space-y-8 flex flex-col items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-secondary/80 backdrop-blur-sm text-secondary-foreground border border-border/50">
              <Package className="w-4 h-4 mr-2" />
              <span>Interactive Component Demo</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
              Interactive <span className="text-primary">Hover</span> Button
            </h1>
            <p className="text-muted-foreground text-xl max-w-[700px] mx-auto leading-relaxed">
              A premium, high-performance button component with smooth scaling effects and polished transitions.
            </p>
          </div>

          {/* Integrated Demo Area */}
          <div className="w-full max-w-2xl flex flex-wrap items-center justify-center gap-6 p-12 bg-muted/20 backdrop-blur-[2px] rounded-3xl border border-dashed border-border/60 animate-in fade-in zoom-in duration-700">
            <InteractiveHoverButton text="Explore" className="w-44 h-14 text-lg" />
            <button className="h-14 px-8 rounded-full border bg-background/50 backdrop-blur-sm font-semibold hover:bg-muted transition-all text-lg border-border/50">
              Documentation
            </button>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
             <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm text-left backdrop-blur-sm bg-card/50">
                <h3 className="font-bold mb-2">High Performance</h3>
                <p className="text-sm text-muted-foreground">Optimized CSS transitions for 60fps animations on all modern devices.</p>
             </div>
             <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm text-left backdrop-blur-sm bg-card/50">
                <h3 className="font-bold mb-2">Fully Accessible</h3>
                <p className="text-sm text-muted-foreground">Semantic HTML with full keyboard navigation support and focus states.</p>
             </div>
             <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm text-left backdrop-blur-sm bg-card/50">
                <h3 className="font-bold mb-2">Modern Stack</h3>
                <p className="text-sm text-muted-foreground">Built with React 19, Tailwind CSS, and Lucide React icons.</p>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
