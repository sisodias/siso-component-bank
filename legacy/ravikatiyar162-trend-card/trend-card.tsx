import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from "../_utils/cn";

export interface TrendDataPoint {
  month: string;
  value: number;
}

export interface InteractiveTrendCardProps {
  title: string;
  subtitle: string;
  totalValue: number;
  newValue: number;
  totalValueLabel?: string;
  newValueLabel?: string;
  chartData: TrendDataPoint[];
  className?: string;
  icon?: React.ReactNode;
  // New props for customizing bar colors
  defaultBarColor?: string;
  barColor?: string;
  adjacentBarColor?: string;
}

export const InteractiveTrendCard: React.FC<InteractiveTrendCardProps> = ({
  title,
  subtitle,
  totalValue,
  newValue,
  totalValueLabel = 'Total Followers',
  newValueLabel = 'New Followers',
  chartData,
  className,
  icon = <ArrowUpRight className="h-4 w-4" />,
  // Set default theme-based colors
  defaultBarColor = 'hsl(var(--muted))',
  barColor = 'hsl(var(--primary))',
  adjacentBarColor = 'hsl(var(--primary) / 0.5)',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = useMemo(() => Math.max(...chartData.map((d) => d.value)), [chartData]);

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-2xl border bg-card p-6 text-card-foreground shadow-sm',
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-2xl font-bold tracking-tight text-muted-foreground">{subtitle}</p>
        </div>
        <button className="rounded-full border bg-background p-2 transition-colors hover:bg-muted">
          {icon}
        </button>
      </div>

      {/* Interactive Chart */}
      <div
        className="relative mt-16 h-40"
        onMouseLeave={() => setHoveredIndex(null)}
        role="figure"
        aria-label={`Followers trend chart showing data for ${chartData.length} months.`}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-none absolute -top-8 left-centre w-10"
              style={{
                transform: `translateX(${(hoveredIndex / (chartData.length - 1)) * 100}%) translateX(-50%)`,
              }}
            >
              <div className="rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background shadow-lg">
                {chartData[hoveredIndex].value}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bars and Labels */}
        <div className="flex h-full w-full items-end justify-between gap-1">
          {chartData.map((data, index) => {
            const barHeight = `${(data.value / maxValue) * 100}%`;
            const isHovered = hoveredIndex === index;
            const isAdjacent = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;

            return (
              <div key={index} className="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  className="group relative h-full w-full flex items-end"
                  onMouseEnter={() => setHoveredIndex(index)}
                  aria-label={`${data.month}: ${data.value} followers`}
                  role="img"
                >
                  <motion.div
                    className="w-full rounded-t-sm"
                    style={{ height: barHeight }}
                    initial={{ backgroundColor: defaultBarColor }}
                    animate={{
                      backgroundColor: isHovered
                        ? barColor
                        : isAdjacent
                        ? adjacentBarColor
                        : defaultBarColor,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                </div>
                <span className="mt-2 text-xs text-muted-foreground">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Footer Stats */}
      <div className="mt-8 flex justify-between border-t pt-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">{totalValueLabel}</p>
          <p className="text-3xl font-bold">{totalValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">{newValueLabel}</p>
          <p className="text-3xl font-bold">{newValue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};