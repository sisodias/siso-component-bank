"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { cn } from "../_utils/cn"; // Your path to shadcn's 'cn' utility

// --- TYPE DEFINITIONS ---
type Airport = {
  code: string;
  name: string;
};

type Passenger = {
  name: string;
  type: "Adult" | "Child" | "Infant";
  baggage: string;
};

interface FlightTicketProps {
  /** The departure airport details. */
  departure: Airport;
  /** The arrival airport details. */
  arrival: Airport;
  /** The date and time of the flight. */
  flightDate: Date;
  /** An array of passenger objects. */
  passengers: Passenger[];
  /** NEW: Choose the appearance of the ticket stub. Defaults to 'barcode'. */
  stubVariant?: 'barcode' | 'solid';
  /** Optional custom class names for the container. */
  className?: string;
}

// --- BARCODE SUBCOMPONENT ---
const Barcode = React.memo(() => (
  <svg aria-hidden="true" className="w-full h-14" preserveAspectRatio="none">
    <rect x="0" y="0" width="100%" height="100%" fill="hsl(var(--card))" />
    {Array.from({ length: 80 }).map((_, i) => (
      <rect
        key={i}
        x={`${(i * 100) / 80}%`}
        y="0"
        width={Math.random() > 0.4 ? "1.2px" : "0.6px"}
        height="100%"
        fill="hsl(var(--card-foreground))"
      />
    ))}
  </svg>
));
Barcode.displayName = "Barcode";

// --- MAIN FLIGHT TICKET COMPONENT ---
export const FlightTicket = React.forwardRef<
  HTMLDivElement,
  FlightTicketProps
>(({ departure, arrival, flightDate, passengers, stubVariant = 'barcode', className }, ref) => {
  const formattedDate = flightDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = flightDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "w-full max-w-xs font-sans bg-card text-card-foreground border rounded-2xl shadow-lg overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      aria-label={`Flight ticket from ${departure.code} to ${arrival.code}`}
    >
      <div className="p-6 space-y-4">
        {/* Header and Flight Details... */}
        <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-card-foreground text-background rounded-full">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Flight Date</p>
              <p className="text-base font-bold">
                {formattedDate} &bull; {formattedTime}
              </p>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* Flight Route */}
          <div className="flex items-center justify-between text-center">
            <div className="w-2/5">
              <h2 className="text-4xl font-black">{departure.code}</h2>
              <p className="text-xs text-muted-foreground truncate">{departure.name}</p>
            </div>
            <Plane className="w-5 h-5 text-muted-foreground" />
            <div className="w-2/5">
              <h2 className="text-4xl font-black">{arrival.code}</h2>
              <p className="text-xs text-muted-foreground truncate">{arrival.name}</p>
            </div>
          </div>

          <hr className="border-border/60" />
          
        {/* Passenger List */}
        <div className="space-y-3">
          {passengers.map((p, i) => (
             <div key={i} className="flex justify-between items-baseline">
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Baggage</p>
                  <p className="font-semibold text-sm">{p.baggage}</p>
                </div>
              </div>
          ))}
        </div>
      </div>

      {/* --- CONDITIONAL STUB AREA --- */}
      <div className="bg-card p-6 pt-4 border-t-2 border-dashed border-border">
        {stubVariant === 'barcode' ? (
          <Barcode />
        ) : (
          <div 
            className="w-full h-14 bg-card-foreground rounded-lg" 
            aria-label="Solid security strip"
          ></div>
        )}
      </div>
    </motion.div>
  );
});

FlightTicket.displayName = "FlightTicket";