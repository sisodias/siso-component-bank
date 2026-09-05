// components/ui/stats-card.tsx

import * as React from "react";
import { animate } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

// Define the props for the component
interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The icon to display. Accepts any React node, recommended: lucide-react icon. */
  icon: React.ReactNode;
  /** The main title of the card. */
  title: string;
  /** The primary numerical value to display. The animation will count up to this number. */
  metric: number;
  /** A unit or suffix for the metric (e.g., "K", "M", "%"). */
  metricUnit?: string;
  /** A short description or secondary stat displayed below the metric. */
  subtext: string;
  /** Optional custom class for the icon's background container. */
  iconContainerClassName?: string;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      className,
      icon,
      title,
      metric,
      metricUnit,
      subtext,
      iconContainerClassName,
      ...props
    },
    ref
  ) => {
    const metricRef = React.useRef<HTMLHeadingElement>(null);

    // Effect to animate the number when the `metric` prop changes
    React.useEffect(() => {
      const node = metricRef.current;
      if (!node) return;

      const controls = animate(0, metric, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(value) {
          // Format to have a maximum of 2 decimal places
          node.textContent = value.toFixed(2);
        },
      });

      // Cleanup function to stop animation on unmount
      return () => controls.stop();
    }, [metric]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full max-w-xs flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
          className
        )}
        {...props}
      >
        {/* Header section with Icon and Title */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground",
              iconContainerClassName
            )}
          >
            {icon}
          </div>
          <p className="text-lg font-medium text-foreground">{title}</p>
        </div>

        {/* Main metric section */}
        <div className="flex items-baseline gap-1">
          <h2
            ref={metricRef}
            className="text-5xl font-bold tracking-tighter md:text-6xl"
            // Adding ARIA attributes for accessibility
            aria-live="polite"
            aria-atomic="true"
          >
            0.00
          </h2>
          {metricUnit && (
            <span className="text-4xl font-bold text-muted-foreground md:text-5xl">
              {metricUnit}
            </span>
          )}
        </div>

        {/* Subtext section */}
        <p className="text-base text-muted-foreground">{subtext}</p>
      </div>
    );
  }
);
StatsCard.displayName = "StatsCard";

export { StatsCard };