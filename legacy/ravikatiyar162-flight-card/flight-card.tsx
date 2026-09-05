import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "../_utils/cn";
import { Badge } from "./badge";
import { Button } from "./button";

// Updated the props interface for the logo
interface FlightCardProps {
  airline: {
    name: string;
    logo: string; // Changed from React.ReactNode to string for the image URL
    flightNumber: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  currency?: string;
  offer?: string;
  refundableType: string;
  onBook?: () => void;
  onFlightDetails?: () => void;
  className?: string;
}

// A helper for formatting currency
const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const FlightCard: React.FC<FlightCardProps> = ({
  airline,
  departureTime,
  arrivalTime,
  duration,
  stops,
  price,
  currency = 'INR',
  offer,
  refundableType,
  onBook,
  onFlightDetails,
  className,
}) => {
  const stopText = stops === 0 ? "Non-stop" : `${stops} stop${stops > 1 ? "s" : ""}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full max-w-4xl rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="bg-secondary/50">{refundableType}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-x-6 items-center">
          {/* Airline Info */}
          <div className="md:col-span-3 flex flex-col">
            <div className="flex items-center gap-3">
              {/* Updated to use an <img> tag for the logo */}
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted overflow-hidden">
                <img src={airline.logo} alt={`${airline.name} logo`} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{airline.name}</p>
                <p className="text-sm text-muted-foreground">{airline.flightNumber}</p>
              </div>
            </div>
             <Button 
                variant="link" 
                className="p-0 h-auto justify-start mt-2 text-sm" 
                onClick={onFlightDetails}
                aria-label="View flight details"
            >
                Flight Details
            </Button>
          </div>

          {/* Timeline */}
          <div className="md:col-span-5 flex items-center gap-2">
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{departureTime}</p>
            </div>
            <div className="flex-grow text-center">
                <p className="text-sm text-muted-foreground">{duration}</p>
                <div className="relative w-full h-px bg-border my-1">
                    <div className="absolute top-1/2 left-0 w-full h-px flex items-center justify-center">
                       {stops > 0 && <div className="w-2 h-2 rounded-full bg-primary border-2 border-card"></div>}
                    </div>
                </div>
                <p className="text-xs font-medium text-primary">{stopText}</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">{arrivalTime}</p>
            </div>
          </div>

          {/* Pricing and Booking */}
          <div className="md:col-span-4 flex flex-col md:items-end gap-2">
             <p className="text-2xl font-bold text-foreground">{formatCurrency(price, currency)}</p>
             {offer && <p className="text-sm text-green-600 dark:text-green-500 text-right">{offer}</p>}
             <Button onClick={onBook} className="w-full md:w-auto mt-2" aria-label={`Book flight for ${formatCurrency(price, currency)}`}>
                Book
                <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};