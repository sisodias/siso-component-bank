import * as React from "react";
import { cn } from "@/lib/utils";

// Define the available color options for type safety and autocompletion.
type ElectricColor = "orange" | "blue" | "green" | "purple" | "pink";

// A map containing the hex and RGB values for each color variant.
const colorMap: Record<ElectricColor, { hex: string; rgb: string }> = {
  orange: { hex: "#dd8448", rgb: "221, 132, 72" },
  blue: { hex: "#00ffff", rgb: "0, 255, 255" },
  green: { hex: "#39ff14", rgb: "57, 255, 20" },
  purple: { hex: "#9d00ff", rgb: "157, 0, 255" },
  pink: { hex: "#ff00ff", rgb: "255, 0, 255" },
};

// This component encapsulates the SVG filter and the dynamic CSS.
const ElectricBorderStyles = () => (
  <>
    <svg className="absolute w-0 h-0">
      <defs>
        <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" result="noise">
             <animate
              attributeName="seed"
              values="1;2;3;4;5;6;7;8;9;10;1"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
        </filter>
      </defs>
    </svg>
    <style>
      {`
        .electric-border-effect {
          width: 100%;
          height: 100%;
          border-radius: inherit;
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none; /* Crucial: allows clicks to pass through to the content */
        }
        .electric-border-effect.main {
          border: 2px solid var(--electric-border-color, #dd8448);
          filter: url(#turbulent-displace);
        }
        .electric-border-effect.glow-one {
          border: 2px solid rgba(var(--electric-border-rgb, 221, 132, 72), 0.6);
          filter: blur(2px);
        }
        .electric-border-effect.glow-two {
          border: 2px solid var(--electric-border-color, #dd8448);
          filter: blur(5px);
          opacity: 0.7;
        }
      `}
    </style>
  </>
);

// Extend the Card's props to include our electricColor prop.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  electricColor?: ElectricColor;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, electricColor = "orange", ...props }, ref) => {
    const color = colorMap[electricColor];

    return (
      // 1. Main container: Sets up positioning, background color, and CSS variables.
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg bg-card text-card-foreground shadow-sm h-fit p-6", // bg-card and padding are here.
          className
        )}
        style={{
          '--electric-border-color': color.hex,
          '--electric-border-rgb': color.rgb,
        } as React.CSSProperties}
        {...props}
      >
        <ElectricBorderStyles />
        {/* 2. Effect layers: Sit on top of the parent's background. */}
        <div className="electric-border-effect main" />
        <div className="electric-border-effect glow-one" />
        <div className="electric-border-effect glow-two" />

        {/* 3. Content container: Stacks content above the effects. No background needed. */}
        <div className="relative z-10 flex flex-col h-full w-full">
          {children}
        </div>
      </div>
    );
  }
);
Card.displayName = "Card";

// Sub-components have no padding, as the parent Card now handles it.
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-4 flex-grow", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };