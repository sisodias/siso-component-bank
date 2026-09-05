// components/ui/trail-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Button } from "./button"; // Assuming you have a Button component

// Define the props interface for type safety and reusability
interface TrailCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  mapImageUrl: string;
  title: string;
  location: string;
  difficulty: string;
  creators: string;
  distance: string;
  elevation: string;
  duration: string;
  onDirectionsClick?: () => void;
}

// Define stat item component for DRY principle
const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm font-semibold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const TrailCard = React.forwardRef<HTMLDivElement, TrailCardProps>(
  (
    {
      className,
      imageUrl,
      mapImageUrl,
      title,
      location,
      difficulty,
      creators,
      distance,
      elevation,
      duration,
      onDirectionsClick,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg",
          className
        )}
        whileHover={{ y: -5, scale: 1.02 }} // Subtle lift and scale animation on hover
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {/* Top section with background image and content */}
        <div className="relative h-60 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-4">
            <div className="text-white">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm text-white/90">{location}</p>
            </div>
            {/* The button will animate in on hover of the parent card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileHover={{ opacity: 1, x: 0 }}
              animate={{ opacity: 0, x: 20 }} // Kept hidden by default
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Button
                variant="secondary"
                onClick={onDirectionsClick}
                aria-label={`Get directions to ${title}`}
              >
                Directions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Bottom section with trail details */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">{difficulty}</p>
              <p className="text-xs text-muted-foreground">{creators}</p>
            </div>
            {/* Simple SVG or image representation of the trail map */}
            <img
              src={mapImageUrl}
              alt="Trail map"
              className="h-10 w-20 object-contain"
            />
          </div>
          <div className="my-4 h-px w-full bg-border" />
          <div className="flex justify-between">
            <StatItem label="Distance" value={distance} />
            <StatItem label="Elevation" value={elevation} />
            <StatItem label="Duration" value={duration} />
          </div>
        </div>
      </motion.div>
    );
  }
);

TrailCard.displayName = "TrailCard";

export { TrailCard };