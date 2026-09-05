import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a cn utility from shadcn

// Define the type for a single slot
export interface Slot {
  id: string | number;
  day: number;
  month: string;
}

// Define the props for the AvailabilityCard component
export interface AvailabilityCardProps {
  /**
   * The main title for the card.
   */
  title?: string;
  /**
   * An array of available slots to display.
   */
  slots: Slot[];
  /**
   * The ID of the currently selected slot.
   */
  selectedSlotId: string | number | null;
  /**
   * Callback function triggered when a slot is selected.
   */
  onSlotSelect: (id: string | number) => void;
  /**
   * Optional additional class names for the card container.
   */
  className?: string;
}

/**
 * A card component to display and select available time slots.
 * It's responsive, theme-aware, and includes animations.
 */
export const AvailabilityCard = ({
  title = "Free Slots Available",
  slots,
  selectedSlotId,
  onSlotSelect,
  className,
}: AvailabilityCardProps) => {
  // Animation variants for the container to orchestrate children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // Animation variants for each slot item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-lg",
        className
      )}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      <motion.div
        className="grid grid-cols-2 gap-4 p-6 pt-0 sm:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {slots.map((slot) => (
          <motion.button
            key={slot.id}
            onClick={() => onSlotSelect(slot.id)}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={slot.id === selectedSlotId}
            className={cn(
              "flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              slot.id === selectedSlotId
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <span className="text-3xl font-bold leading-none">
              {slot.day.toString().padStart(2, '0')}
            </span>
            <span
              className={cn(
                "mt-1",
                slot.id === selectedSlotId
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              {slot.month}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};