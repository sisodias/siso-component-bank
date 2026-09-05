import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a cn utility from shadcn

// Define the props for the FlightCard component
export interface FlightCardProps {
  imageUrl: string;
  airline: string;
  flightCode: string;
  flightClass: string;
  departureCode: string;
  departureCity: string;
  departureTime: string;
  arrivalCode: string;
  arrivalCity: string;
  arrivalTime: string;
  duration: string;
  className?: string;
}

// Main component definition
export const FlightCard = React.forwardRef<HTMLDivElement, FlightCardProps>(
  (
    {
      imageUrl,
      airline,
      flightCode,
      flightClass,
      departureCode,
      departureCity,
      departureTime,
      arrivalCode,
      arrivalCity,
      arrivalTime,
      duration,
      className,
    },
    ref
  ) => {
    // Animation variants for the container and its children
    const cardVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "max-w-sm w-full font-sans rounded-2xl overflow-hidden shadow-lg bg-card border border-border",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      >
        {/* Flight Image */}
        <div className="relative h-40">
          <img
            src={imageUrl}
            alt="View from airplane window"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Flight Details Container */}
        <div className="p-6 pt-4">
          {/* Main Flight Route */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="text-left">
              <p className="text-sm text-muted-foreground">{departureTime}</p>
              <p className="text-4xl font-bold text-card-foreground">
                {departureCode}
              </p>
              <p className="text-xs text-muted-foreground">{departureCity}</p>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">{flightCode}</p>
              <div className="flex items-center gap-2 my-1">
                <div className="h-px w-8 bg-border" />
                <Plane className="h-4 w-4 text-muted-foreground" />
                <div className="h-px w-8 bg-border" />
              </div>
              <p className="text-xs text-muted-foreground">{duration}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">{arrivalTime}</p>
              <p className="text-4xl font-bold text-card-foreground">
                {arrivalCode}
              </p>
              <p className="text-xs text-muted-foreground">{arrivalCity}</p>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="border-t border-dashed border-border my-5"
          />

          {/* Additional Details */}
          <motion.div
            variants={itemVariants}
            className="flex justify-between text-center"
          >
            <InfoItem label="Airline" value={airline} />
            <InfoItem label="Flight Code" value={flightCode} />
            <InfoItem label="Class" value={flightClass} />
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

FlightCard.displayName = "FlightCard";

// Helper component for bottom info items
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="font-semibold text-card-foreground">{value}</span>
  </div>
);