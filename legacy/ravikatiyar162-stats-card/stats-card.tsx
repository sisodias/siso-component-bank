// components/ui/freelancer-stats-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Your shadcn/ui utility for merging classes

// Type definitions for the component props for type-safety and clarity
type SubStat = {
  value: string | number;
  label: string;
  subLabel: string;
};

type AvailabilityBar = {
  level: number; // A value between 0 and 1 representing the fill percentage
};

interface FreelancerStatsCardProps {
  /** The main title of the card */
  title: string;
  /** The text for the time frame display */
  timeFrame: string;
  /** Main earnings statistics */
  earnings: {
    amount: number;
    change: number;
    changePeriod: string;
  };
  /** An array of two sub-statistics */
  subStats: [SubStat, SubStat];
  /** Ranking information */
  ranking: {
    place: string;
    category: string;
    icon?: React.ReactNode;
  };
  /** Availability data */
  availability: {
    title: string;
    bars: AvailabilityBar[];
    label: string;
  };
  /** Optional additional class names */
  className?: string;
}

/**
 * A card component to display freelancer statistics with an animated availability chart.
 * Built with shadcn/ui principles, it's responsive and theme-adaptive.
 */
export const FreelancerStatsCard = React.forwardRef<
  HTMLDivElement,
  FreelancerStatsCardProps
>(({ title, timeFrame, earnings, subStats, ranking, availability, className }, ref) => {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const numberFormatter = new Intl.NumberFormat("en-US");

  // Animation variants for the availability bars container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Stagger animation for each child
      },
    },
  };

  // Animation variants for each individual bar
  const barVariants = {
    hidden: { height: "0%", opacity: 0 },
    visible: { height: "100%", opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  // Custom color stops for the gradient effect on the bars
  const barColors = [
    '#3b82f6', '#4f46e5', '#a855f7', '#d946ef', '#ec4899', '#ef4444'
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-sm rounded-2xl bg-card text-card-foreground p-6 shadow-lg font-sans flex flex-col gap-6 border",
        className
      )}
      aria-labelledby="stats-card-title"
    >
      {/* Card Header */}
      <header className="flex justify-between items-center">
        <h2 id="stats-card-title" className="text-xl font-bold">{title}</h2>
        <div className="text-sm font-medium px-3 py-1 rounded-md bg-muted text-muted-foreground">
          {timeFrame}
        </div>
      </header>

      {/* Main Earnings Section */}
      <section aria-label="Earnings">
        <p className="text-sm text-muted-foreground">Earnings</p>
        <h3 className="text-5xl font-bold tracking-tighter mt-1">
          {currencyFormatter.format(earnings.amount)}
        </h3>
        <p
          className={cn(
            "text-sm font-semibold mt-2",
            earnings.change >= 0 ? "text-green-500" : "text-red-500"
          )}
        >
          {earnings.change >= 0 ? "+" : ""}
          {currencyFormatter.format(earnings.change)} {earnings.changePeriod}
        </p>
      </section>

      {/* Sub-Stats Grid */}
      <section className="grid grid-cols-2 gap-4" aria-label="Projects and Clients">
        {subStats.map((stat, index) => (
          <div key={index} className="bg-muted rounded-lg p-4">
            <p className="text-2xl font-bold">{stat.value} <span className="text-base font-normal text-muted-foreground">{stat.label}</span></p>
            <p className="text-xs text-muted-foreground mt-1">{stat.subLabel}</p>
          </div>
        ))}
      </section>

      {/* Ranking Section */}
      <section
        className="flex items-center justify-between bg-primary-foreground text-primary p-4 rounded-lg"
        aria-label={`Ranking: ${ranking.place}`}
      >
        <div>
          <h4 className="text-xl font-bold">{ranking.place}</h4>
          <p className="text-sm text-primary/80">{ranking.category}</p>
        </div>
        {ranking.icon && <div aria-hidden="true">{ranking.icon}</div>}
      </section>

      {/* Availability Section */}
      <section aria-labelledby="availability-title">
        <h4 id="availability-title" className="text-md font-semibold">{availability.title}</h4>
        <motion.div
          className="flex items-end gap-1 h-12 mt-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Availability chart"
        >
          {availability.bars.map((bar, index) => {
            // Determine the color based on the index
            const colorIndex = Math.floor((index / availability.bars.length) * (barColors.length - 1));
            const color = bar.level > 0 ? barColors[colorIndex] : 'hsl(var(--muted))';

            return (
              <div key={index} className="w-full h-full rounded-sm flex items-end" style={{ backgroundColor: bar.level > 0 ? 'transparent' : 'hsl(var(--muted))'}}>
                 <motion.div
                    className="w-full rounded-sm"
                    style={{ 
                        height: `${bar.level * 100}%`,
                        backgroundColor: color,
                     }}
                    variants={barVariants}
                 />
              </div>
            );
          })}
        </motion.div>
        <p className="text-xs text-muted-foreground mt-2">{availability.label}</p>
      </section>
    </div>
  );
});

FreelancerStatsCard.displayName = "FreelancerStatsCard";