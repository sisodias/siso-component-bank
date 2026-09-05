import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, useSpring } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "../_utils/cn";
import { Card, CardContent, CardHeader } from "./card";

// **NEW**: Create a motion-enabled version of the shadcn Card component
const MotionCard = motion.create(Card);

// Type definition for each bar in the chart
type ChartDataItem = {
  name: string;
  value: number; // Represents percentage height (0-100)
  color?: string; // Optional Tailwind CSS color class for individual bars
};

// Props interface for the StatsCard component
export interface StatsCardProps {
  title: string;
  currentValue: number;
  valuePrefix?: string;
  valuePostfix?: string;
  description: React.ReactNode;
  chartData: ChartDataItem[];
  onActionClick?: () => void;
  className?: string;
  defaultBarColor?: string;
  highlightedBarColor?: string;
}

// Sub-component for animating the numerical value (Unchanged)
const AnimatedValue = ({ value, prefix = "", postfix = "" }: { value: number; prefix?: string; postfix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 30, stiffness: 100, mass: 1 });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [spring, isInView, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Intl.NumberFormat('en-US').format(latest.toFixed(0))}${postfix}`;
      }
    });
    return () => unsubscribe();
  }, [prefix, postfix, spring]);

  return <span ref={ref} />;
};


// Main StatsCard component
export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ 
    title, 
    currentValue, 
    valuePrefix, 
    valuePostfix, 
    description, 
    chartData, 
    onActionClick, 
    className,
    defaultBarColor = "bg-primary/20", 
    highlightedBarColor = "bg-destructive" 
  }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.4 });
    const controls = useAnimation();
    const barVariants = {
      hidden: { height: "0%" },
      visible: {
        height: "var(--bar-height, 0%)",
        transition: { type: "spring", damping: 15, stiffness: 100 },
      },
    };

    useEffect(() => {
      if (isInView) {
        controls.start("visible");
      }
    }, [isInView, controls]);

    const HeaderElement = onActionClick ? "button" : "div";

    return (
      <MotionCard
        ref={ref}
        className={cn("w-full max-w-sm overflow-hidden", className)}
        // **NEW**: Added hover animation properties
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <HeaderElement
            onClick={onActionClick}
            className={cn(
              "flex w-full items-center justify-between text-left",
              onActionClick && "group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
            aria-label={onActionClick ? `${title}, click to view more` : undefined}
          >
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {onActionClick && (
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            )}
          </HeaderElement>
        </CardHeader>
        <CardContent>
          <div ref={cardRef} className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-card-foreground">
                <AnimatedValue value={currentValue} prefix={valuePrefix} postfix={valuePostfix} />
              </h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            
            <motion.div
              className="flex h-20 w-full items-end gap-3"
              initial="hidden"
              animate={controls}
              transition={{ staggerChildren: 0.1 }}
              aria-label="Monthly revenue chart"
            >
              {chartData.map((item, index) => (
                <div key={item.name} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <motion.div
                    className={cn(
                      "w-full rounded-t-lg",
                      item.color
                        ? item.color
                        : index === chartData.length - 1
                        ? highlightedBarColor
                        : defaultBarColor
                    )}
                    variants={barVariants}
                    style={{ '--bar-height': `${item.value}%` } as React.CSSProperties}
                  />
                  <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </CardContent>
      </MotionCard>
    );
  }
);

StatsCard.displayName = "StatsCard";