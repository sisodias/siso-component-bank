// components/ui/flight-search-card.tsx

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, Plane } from "lucide-react";

import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Button } from "./button";
import { Separator } from "./separator";

// Interface for the component's props
export interface FlightSearchCardProps {
  fromLocation: string;
  toLocation: string;
  departureDate: string;
  returnDate?: string | null;
  passengers: string;
  onSwapLocations: () => void;
  onRemoveReturnDate?: () => void;
  onSearch: () => void;
  className?: string;
}

// A smaller, reusable component for each section of the card
const InfoSection = ({ label, value, className }: { label: string; value: string; className?: string }) => (
  <div className={cn("grid gap-1.5", className)}>
    <span className="text-sm text-muted-foreground">{label}</span>
    <p className="text-lg font-semibold text-foreground truncate">{value}</p>
  </div>
);

export const FlightSearchCard = React.forwardRef<HTMLDivElement, FlightSearchCardProps>(
  (
    {
      fromLocation,
      toLocation,
      departureDate,
      returnDate,
      passengers,
      onSwapLocations,
      onRemoveReturnDate,
      onSearch,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden",
          className
        )}
      >
        <div className="p-6 space-y-6">
          {/* From/To Section with animation */}
          <div className="relative">
            <motion.div layoutId="fromLocation">
              <InfoSection label="From" value={fromLocation} />
            </motion.div>
            
            <Separator className="my-4" />

            <motion.div layoutId="toLocation">
              <InfoSection label="To" value={toLocation} />
            </motion.div>

            {/* Swap Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full h-10 w-10 bg-background hover:bg-muted"
              onClick={onSwapLocations}
              aria-label="Swap locations"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />

          {/* Date and Passenger Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoSection label="Departure date" value={departureDate} />
              <div className="relative">
                <AnimatePresence>
                  {returnDate && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <InfoSection label="Return date" value={returnDate} />
                      <Button
                        variant="link"
                        className="absolute -right-3 -bottom-3 text-xs text-muted-foreground"
                        onClick={onRemoveReturnDate}
                      >
                        Remove
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <InfoSection label="Passenger" value={passengers} />
          </div>
        </div>

        {/* Search Button Footer */}
        <div className="bg-muted/50 p-4">
          <Button onClick={onSearch} className="w-full" size="lg">
            <Plane className="mr-2 h-4 w-4" />
            Search Flights
          </Button>
        </div>
      </div>
    );
  }
);

FlightSearchCard.displayName = "FlightSearchCard";