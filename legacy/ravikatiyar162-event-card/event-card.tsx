// components/ui/event-card.tsx

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Your utility for merging class names

// Define the props for the EventCard component
export interface EventCardProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  locationIcon: React.ReactNode;
  location: string;
  frequency: string;
  className?: string;
}

/**
 * A reusable event card component with animations and theme support.
 * It displays event details in a structured and visually appealing format.
 */
const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
  (
    {
      icon,
      title,
      date,
      startTime,
      endTime,
      locationIcon,
      location,
      frequency,
      className,
    },
    ref
  ) => {
    // Animation variants for the card
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-md rounded-2xl border bg-card p-6 text-card-foreground shadow-sm",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{
          scale: 1.02,
          boxShadow: "0px 10px 20px -5px hsl(var(--primary) / 0.1)",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        aria-label={`${title} event details`}
      >
        <div className="flex flex-col space-y-4">
          {/* Row 1: Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          </div>

          {/* Row 2: Date & Time */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="text-muted-foreground">on</span>
            <span className="rounded-md bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
              {date}
            </span>
            <span className="text-muted-foreground">from</span>
            <span className="rounded-md bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
              {startTime}
            </span>
            <span className="text-muted-foreground">until</span>
            <span className="rounded-md bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
              {endTime}
            </span>
          </div>

          {/* Row 3: Location & Frequency */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="text-muted-foreground">at</span>
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
              {locationIcon}
              <span>{location}</span>
            </div>
            <span className="text-muted-foreground">every</span>
            <span className="rounded-md bg-muted px-2.5 py-1 font-semibold text-muted-foreground">
              {frequency}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

EventCard.displayName = "EventCard";

export { EventCard };