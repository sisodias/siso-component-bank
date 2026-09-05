"use client";

/**
 * Dependencies:
 * - react
 * - clsx
 * - tailwind-merge
 */

import * as React from "react";
import { useState, useRef } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility Function ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Icon Component ---
const ArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-2 h-5 w-5 transform transition-transform duration-300 ease-in-out group-hover/button:translate-x-1"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);


// --- Spotlight CTA Components ---

interface SpotlightCTAProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Unique identifier for the title element, used for ARIA attributes.
     */
    titleId: string;
    /**
     * Unique identifier for the description element, used for ARIA attributes.
     */
    descriptionId: string;
}

/**
 * The main container component that provides the interactive spotlight effect.
 * It tracks mouse and touch events and supports both light and dark themes.
 */
const SpotlightCTA = React.forwardRef<HTMLDivElement, SpotlightCTAProps>(
  ({ className, children, titleId, descriptionId, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        if (containerRef.current && event.touches.length > 0) {
            const touch = event.touches[0];
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
        }
    };
    
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: -200, y: -200 })}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        onTouchEnd={() => setMousePosition({ x: -200, y: -200 })}
        className={cn(
          "group/spotlight relative w-full max-w-4xl mx-auto p-8 overflow-hidden rounded-2xl",
          "bg-white dark:bg-slate-900",
          "shadow-lg dark:shadow-2xl transition-shadow duration-300 ease-in-out",
          "hover:shadow-xl dark:hover:shadow-teal-500/20",
          className
        )}
        role="region"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        {...props}
      >
        <div 
            className="absolute inset-0 pointer-events-none"
            style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(13, 148, 136, 0.08), transparent 40%)`
            }}
        />
        <div className="absolute inset-[-1px] border border-slate-200 dark:border-white/10 rounded-2xl pointer-events-none"></div>
        <div className="relative z-10">
            {children}
        </div>
      </div>
    );
  }
);
SpotlightCTA.displayName = "SpotlightCTA";


interface SpotlightCTAContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * A layout component to structure the content within the SpotlightCTA.
 */
const SpotlightCTAContent = React.forwardRef<HTMLDivElement, SpotlightCTAContentProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-col md:flex-row items-center justify-between gap-8", className)}
                {...props}
            />
        );
    }
);
SpotlightCTAContent.displayName = "SpotlightCTAContent";


interface SpotlightCTATextProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The main headline for the CTA.
     */
    title: string;
    /**
     * The supporting text below the headline.
     */
    description: string;
    /**
     * The ID for the title element, required for ARIA.
     */
    titleId: string;
    /**
     * The ID for the description element, required for ARIA.
     */
    descriptionId: string;
}

/**
 * Component for rendering the title and description text with theme-aware colors.
 */
const SpotlightCTAText = React.forwardRef<HTMLDivElement, SpotlightCTATextProps>(
    ({ title, description, titleId, descriptionId, className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("text-center md:text-left", className)} {...props}>
                <h2 id={titleId} className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {title}
                </h2>
                <p id={descriptionId} className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
                    {description}
                </p>
            </div>
        );
    }
);
SpotlightCTAText.displayName = "SpotlightCTAText";


interface SpotlightCTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * The main action button for the CTA, with theme-aware focus rings.
 */
const SpotlightCTAButton = React.forwardRef<HTMLButtonElement, SpotlightCTAButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "group/button flex-shrink-0 inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-teal-600 rounded-full transition-all duration-300 ease-in-out hover:bg-teal-500",
                    "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                    className
                )}
                {...props}
            >
                {children}
                <ArrowIcon />
            </button>
        );
    }
);
SpotlightCTAButton.displayName = "SpotlightCTAButton";


// --- Final Export and Example Usage ---

export { SpotlightCTA, SpotlightCTAContent, SpotlightCTAText, SpotlightCTAButton };
