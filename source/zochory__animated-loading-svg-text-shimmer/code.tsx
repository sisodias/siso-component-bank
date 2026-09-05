import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from "../_utils/cn";

// ---------------------------------------------------------------------------
// Loader Component - Animated SVG Path Loader
// ---------------------------------------------------------------------------

let cachedPathLength = 0;
let stylesInjected = false;

const LOADER_KEYFRAMES = `
  @keyframes drawStroke {
    0% {
      stroke-dashoffset: var(--path-length);
      animation-timing-function: ease-in-out;
    }
    50% {
      stroke-dashoffset: 0;
      animation-timing-function: ease-in-out;
    }
    100% {
      stroke-dashoffset: calc(var(--path-length) * -1);
    }
  }
`;

interface LoaderProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number | string;
}

const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ className, size = 64, strokeWidth = 2, ...props }, ref) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState<number>(cachedPathLength);

    useEffect(() => {
      if (typeof window !== 'undefined' && !stylesInjected) {
        stylesInjected = true;
        const style = document.createElement('style');
        style.innerHTML = LOADER_KEYFRAMES;
        document.head.appendChild(style);
      }

      if (!cachedPathLength && pathRef.current) {
        cachedPathLength = pathRef.current.getTotalLength();
        setPathLength(cachedPathLength);
      }
    }, []);

    const isReady = pathLength > 0;

    return (
      <svg
        ref={ref}
        role="status"
        aria-label="Loading..."
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className={cn("text-current", className)}
        {...props}
      >
        <path
          ref={pathRef}
          d="M4.43431 2.42415C-0.789139 6.90104 1.21472 15.2022 8.434 15.9242C15.5762 16.6384 18.8649 9.23035 15.9332 4.5183C14.1316 1.62255 8.43695 0.0528911 7.51841 3.33733C6.48107 7.04659 15.2699 15.0195 17.4343 16.9241"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={isReady ? {
            strokeDasharray: pathLength,
            '--path-length': pathLength,
          } as React.CSSProperties : undefined}
          className={cn(
            "transition-opacity duration-300",
            isReady ? "opacity-100 animate-[drawStroke_2.5s_infinite]" : "opacity-0"
          )}
        />
      </svg>
    );
  }
);

Loader.displayName = "Loader";

// ---------------------------------------------------------------------------
// Loading Breadcrumb Component - Animated Loading State with Shimmer Text
// ---------------------------------------------------------------------------

interface LoadingBreadcrumbProps {
  text?: string;
  className?: string;
}

export function LoadingBreadcrumb({ 
  text = "Cooking", 
  className 
}: LoadingBreadcrumbProps) {
  return (
    <>
      <style>{`
        @keyframes textShimmer {
          0% { 
            background-position: -100% center;
          }
          100% { 
            background-position: 100% center;
          }
        }
      `}</style>
      
      <div className={cn(
        "flex items-center gap-2 text-[15px] font-medium tracking-wide",
        className
      )}>
        <Loader 
          size={18} 
          strokeWidth={2.5} 
          className="text-zinc-600 dark:text-zinc-200" 
        />
        
        <span 
          className="bg-clip-text text-transparent shimmer-text"
          style={{
            backgroundSize: "200% auto",
            animation: "textShimmer 2s ease-in-out infinite"
          }}
        >
          {text}
        </span>
        
        <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-500" />
      </div>
      
      <style>{`
        .shimmer-text {
          background-image: linear-gradient(
            90deg,
            rgb(113 113 122) 0%,
            rgb(113 113 122) 40%,
            rgb(24 24 27) 50%,
            rgb(113 113 122) 60%,
            rgb(113 113 122) 100%
          );
        }
        .dark .shimmer-text {
          background-image: linear-gradient(
            90deg,
            rgb(161 161 170) 0%,
            rgb(161 161 170) 40%,
            rgb(255 255 255) 50%,
            rgb(161 161 170) 60%,
            rgb(161 161 170) 100%
          );
        }
      `}</style>
    </>
  );
}

// ---------------------------------------------------------------------------
// Example Usage
// ---------------------------------------------------------------------------

export default function LoadingBreadcrumbDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <LoadingBreadcrumb />
    </div>
  );
}