// components/ui/event-card.tsx

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { cn } from "../_utils/cn"; // Assumes you have a `cn` utility from shadcn

// Prop definitions for the EventCard component
export interface EventCardProps {
  heading: string;
  description: string;
  date: Date;
  imageUrl: string;
  imageAlt: string;
  eventName: string;
  location: string;
  time: string;
  actionLabel: string;
  onActionClick: () => void;
  className?: string;
}

const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
  (
    {
      heading,
      description,
      date,
      imageUrl,
      imageAlt,
      eventName,
      location,
      time,
      actionLabel,
      onActionClick,
      className,
    },
    ref
  ) => {
    // Format date parts for display
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-2xl border bg-card p-6 text-card-foreground shadow-sm font-sans",
          className
        )}
        aria-labelledby="event-name"
      >
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold">{heading}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground">
                {dayOfWeek}
              </p>
              <p className="text-4xl font-bold text-foreground">
                <span className="mr-2">{month}</span>
                {day}
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="my-6 aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Details Section */}
          <div>
            <h3 id="event-name" className="text-lg font-semibold text-foreground">
              {eventName}
            </h3>
            <div className="mt-3 flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{time}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onActionClick}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);

EventCard.displayName = "EventCard";

export { EventCard };