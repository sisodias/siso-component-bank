import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const aiLoaderStyles = `
@keyframes shimmer-loader {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes ai-dots-think {
  0%, 100% { transform: translateY(0) scale(0.85); opacity: 0.3; filter: blur(0.5px); }
  50% { transform: translateY(-3px) scale(1.2); opacity: 1; filter: blur(0px); box-shadow: 0 4px 10px color-mix(in oklch, var(--primary) 30%, transparent); }
}
@keyframes ai-loading-line-sweep {
  0% { transform: translateX(0%); }
  100% { transform: translateX(200%); }
}
@keyframes ai-loading-ring {
  0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 200; stroke-dashoffset: -35px; }
  100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124px; }
}

.animate-shimmer-loader { background-size: 200% auto; animation: shimmer-loader 3s linear infinite; }
`;

export type AiLoaderVariant = 'shimmer-text' | 'dots' | 'loading-line' | 'spinner' | 'pulse-ring';

export interface AiLoaderProps {
  variant?: AiLoaderVariant;
  text?: string;
  className?: string;
}

export function AiLoader({ variant = 'shimmer-text', text = 'Processing...', className = '' }: AiLoaderProps) {
  if (variant === 'shimmer-text') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <style dangerouslySetInnerHTML={{ __html: aiLoaderStyles }} />
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <span className="animate-shimmer-loader bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent font-medium tracking-wide">
          {text}
        </span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-xs w-fit ${className}`}>
        <style dangerouslySetInnerHTML={{ __html: aiLoaderStyles }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-[ai-dots-think_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-[ai-dots-think_1.4s_ease-in-out_infinite]" style={{ animationDelay: '160ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-[ai-dots-think_1.4s_ease-in-out_infinite]" style={{ animationDelay: '320ms' }} />
      </div>
    );
  }

  if (variant === 'loading-line') {
    return (
      <div className={`w-full h-[3px] bg-black/5 dark:bg-white/10 rounded-full overflow-hidden relative backdrop-blur-sm shadow-inner ${className}`}>
        <style dangerouslySetInnerHTML={{ __html: aiLoaderStyles }} />
        
        <div className="absolute top-0 bottom-0 -left-full w-full animate-[ai-loading-line-sweep_2s_cubic-bezier(0.4,0,0.2,1)_infinite]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-black/40 dark:bg-white/90 blur-[1px] rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (variant === 'pulse-ring') {
    return (
      <div className={`relative flex items-center justify-center w-8 h-8 ${className}`}>
        <style dangerouslySetInnerHTML={{ __html: aiLoaderStyles }} />
        
        <div className="absolute inset-0 rounded-full border-[3px] border-black/5 dark:border-white/10" />
       
        <svg 
          className="w-full h-full animate-[spin_2s_linear_infinite]" 
          viewBox="0 0 50 50"
        >
          <circle 
            className="stroke-primary fill-none stroke-[4] animate-[ai-loading-ring_1.5s_ease-in-out_infinite] drop-shadow-sm dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]" 
            strokeLinecap="round"
            cx="25" cy="25" r="20" 
          />
        </svg>
      </div>
    );
  }

  return null;
}

export interface RevealAnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}


export function RevealAnimation({ children, delay = 0, className = '' }: RevealAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
    >
      {children}
    </div>
  );
}


export function AiSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-secondary/60 ${className}`} />
  );
}


export default function AiLoaderPreview() {
  return (
    <div className="flex flex-col gap-8 p-8 bg-background text-foreground rounded-xl border border-border max-w-2xl mx-auto mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight mb-2">AI Processing Animations</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-8 items-center">
        <RevealAnimation delay={200} className="flex flex-col items-center p-6 border border-border/50 rounded-xl bg-card/50 h-40">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Shimmer Text</span>
          <div className="flex-1 w-full flex items-center justify-center">
            <AiLoader variant="shimmer-text" text="Generating response..." />
          </div>
        </RevealAnimation>
        
        <RevealAnimation delay={400} className="flex flex-col items-center p-6 border border-border/50 rounded-xl bg-card/50 h-40">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Bouncing Dots</span>
          <div className="flex-1 w-full flex items-center justify-center">
            <AiLoader variant="dots" />
          </div>
        </RevealAnimation>

        <RevealAnimation delay={600} className="flex flex-col items-center p-6 border border-border/50 rounded-xl bg-card/50 h-40">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Loading Line</span>
          <div className="flex-1 w-full flex items-center justify-center max-w-[200px]">
            <AiLoader variant="loading-line" />
          </div>
        </RevealAnimation>

        <RevealAnimation delay={800} className="flex flex-col items-center p-6 border border-border/50 rounded-xl bg-card/50 h-40">
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Pulse Ring</span>
          <div className="flex-1 w-full flex items-center justify-center">
            <AiLoader variant="pulse-ring" />
          </div>
        </RevealAnimation>
      </div>
    </div>
  );
}

