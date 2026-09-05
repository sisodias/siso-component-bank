import * as React from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { Utensils, Sandwich, Hamburger, Share, Copy, BarChartHorizontal } from "lucide-react";
import { cn } from "../_utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// Type definitions for the component props
interface Competitor {
  name: string;
  value: number;
  icon: React.ReactNode;
}

interface PerformanceLevel {
  label: string;
  value: number;
  color: string;
}

interface PerformanceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  headerIcon: React.ReactNode;
  mainValue: number;
  percentageChange: number;
  benchmarkAverage: number;
  competitors: Competitor[];
  performanceLevels: PerformanceLevel[];
}

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  React.useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [spring, value, isInView]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

// Main PerformanceCard component
export const PerformanceCard = React.forwardRef<
  HTMLDivElement,
  PerformanceCardProps
>(
  (
    {
      className,
      title,
      headerIcon,
      mainValue,
      percentageChange,
      benchmarkAverage,
      competitors,
      performanceLevels,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-100px" });
    const maxValue = Math.max(
      mainValue,
      benchmarkAverage,
      ...competitors.map((c) => c.value)
    );
    const totalLevelValue = performanceLevels[performanceLevels.length - 1].value;

    return (
      <Card
        ref={cardRef}
        className={cn("w-full max-w-lg mx-auto", className)}
        {...props}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {headerIcon}
              <span>{title}</span>
            </div>
            <Select defaultValue="delivery">
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="dine-in">Dine-in</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Main Metric Section */}
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-4xl font-bold tracking-tight">
                <AnimatedNumber value={mainValue} />
              </p>
              <p
                className={cn(
                  "text-xs font-medium",
                  percentageChange > 0
                    ? "text-emerald-500"
                    : "text-red-500"
                )}
              >
                ▲ {percentageChange}% to last period
              </p>
            </div>
            <div className="w-1/2">
              <div className="relative h-2 rounded-full bg-muted">
                <motion.div
                  className="absolute h-2 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: isInView ? `${(mainValue / maxValue) * 100}%` : 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute h-2 -translate-y-1/2 top-1/2"
                  style={{
                    left: `${(benchmarkAverage / maxValue) * 100}%`,
                    width: '1px',
                    height: '16px',
                    backgroundColor: 'hsl(var(--foreground))',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: isInView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Benchmark average</span>
                <span>{benchmarkAverage.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Competitors Section */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium">Main competitors</h3>
            {competitors.map((competitor, i) => (
              <div key={competitor.name} className="flex items-center gap-3">
                <div className="text-muted-foreground">{competitor.icon}</div>
                <span className="flex-1 text-sm">{competitor.name}</span>
                <span className="text-sm font-medium">
                  {competitor.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Performance Levels Section */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <BarChartHorizontal className="w-4 h-4 text-muted-foreground" />
              <span>Performance benchmark levels</span>
            </h3>
            <div className="relative flex w-full h-2 rounded-full overflow-hidden">
              {performanceLevels.map((level, i) => {
                  const prevValue = i > 0 ? performanceLevels[i-1].value : 0;
                  const width = ((level.value - prevValue) / totalLevelValue) * 100;
                  return (
                    <div
                      key={level.label}
                      className={level.color}
                      style={{ width: `${width}%`}}
                    />
                  );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {performanceLevels.map((level) => (
                <span key={level.label}>{level.label}</span>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <Share className="w-3 h-3 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Copy className="w-3 h-3 mr-2" />
              Copy link
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PerformanceCard.displayName = "PerformanceCard";