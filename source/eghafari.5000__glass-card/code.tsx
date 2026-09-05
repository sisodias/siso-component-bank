import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassmorphismCardVariants = cva(
  [
    // Base styles - always applied
    "relative overflow-hidden",
    "border border-white/20 dark:border-white/10",
    "transition-all duration-300 ease-out",
    
    // Accessibility
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        // Subtle - minimal glass effect, best for text-heavy content
        subtle: [
          "bg-white/5 dark:bg-white/3",
          "backdrop-blur-sm",
          "shadow-sm",
        ],
        // Default - balanced glass effect
        default: [
          "bg-white/10 dark:bg-white/5",
          "backdrop-blur-md",
          "shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]",
        ],
        // Pronounced - stronger glass effect for emphasis
        pronounced: [
          "bg-white/15 dark:bg-white/8",
          "backdrop-blur-lg",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.15)]",
        ],
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6 md:p-8",
        lg: "p-8 md:p-10",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        xl: "rounded-3xl",
        full: "rounded-full",
      },
      hoverable: {
        true: [
          "hover:bg-white/15 dark:hover:bg-white/10",
          "hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
          "hover:border-white/30 dark:hover:border-white/20",
        ],
        false: "",
      },
      clickable: {
        true: "cursor-pointer active:scale-[0.98]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      padding: "md",
      rounded: "xl",
      hoverable: false,
      clickable: false,
    },
  }
);

export interface GlassmorphismCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassmorphismCardVariants> {
  /**
   * Content className for the inner container
   * Allows styling the content independently from the glass effect
   */
  contentClassName?: string;
  
  /**
   * Whether to show the subtle texture overlay
   * Adds visual interest without compromising readability
   * @default false
   */
  showTexture?: boolean;
  
  /**
   * Custom blur strength - overrides variant blur
   * Options: 'none' | 'light' | 'medium' | 'heavy'
   */
  blurStrength?: "none" | "light" | "medium" | "heavy";
  
  /**
   * Whether the card has interactive states
   * Combines hoverable and clickable for convenience
   */
  interactive?: boolean;
}

const GlassmorphismCard = React.forwardRef<
  HTMLDivElement,
  GlassmorphismCardProps
>(
  (
    {
      className,
      contentClassName,
      variant,
      size,
      padding,
      rounded,
      hoverable: hoverableProp,
      clickable: clickableProp,
      showTexture = false,
      blurStrength,
      interactive = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Interactive mode sets both hoverable and clickable
    const hoverable = interactive || hoverableProp;
    const clickable = interactive || clickableProp || !!onClick;

    // Custom blur strength mapping
    const blurClass = blurStrength
      ? {
          none: "backdrop-blur-none",
          light: "backdrop-blur-sm",
          medium: "backdrop-blur-md",
          heavy: "backdrop-blur-xl",
        }[blurStrength]
      : undefined;

    return (
      <div
        ref={ref}
        className={cn(
          glassmorphismCardVariants({
            variant,
            size,
            padding,
            rounded,
            hoverable,
            clickable,
          }),
          blurClass,
          className
        )}
        onClick={onClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick?.(e as any);
                }
              }
            : undefined
        }
        {...props}
      >
        {/* Multi-layer glass effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
        
        {/* Optional texture overlay for added depth */}
        {showTexture && (
          <>
            <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay">
              <svg className="h-full w-full">
                <filter id="noise">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.8"
                    numOctaves="3"
                    stitchTiles="stitch"
                  />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
              </svg>
            </div>
          </>
        )}

        {/* Content container with proper z-index */}
        <div className={cn("relative z-10", contentClassName)}>
          {children}
        </div>
      </div>
    );
  }
);

GlassmorphismCard.displayName = "GlassmorphismCard";

export { GlassmorphismCard, glassmorphismCardVariants };
