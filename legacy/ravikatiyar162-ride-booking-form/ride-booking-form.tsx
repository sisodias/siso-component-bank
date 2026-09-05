// components/ui/ride-booking-form.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Your utility for merging class names

// Assuming you have lucide-react for icons, a standard in shadcn/ui setups
import { MapPin, Send, Plus, Calendar, Clock, ArrowRight } from "lucide-react";

// Props definition for the component
interface RideBookingFormProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  city?: string;
  onSearch: (details: {
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
  }) => void;
}

export const RideBookingForm = React.forwardRef<HTMLDivElement, RideBookingFormProps>(
  ({ className, imageUrl, city = "Chandigarh, IN", onSearch, ...props }, ref) => {
    // State management for form inputs
    const [pickup, setPickup] = React.useState("");
    const [dropoff, setDropoff] = React.useState("");
    const [date] = React.useState("Today");
    const [time] = React.useState("Now");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch({ pickup, dropoff, date, time });
    };
    
    // Animation variants for framer-motion
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
      },
    };

    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 },
      },
    };

    return (
      <div
        className={cn("w-full max-w-6xl mx-auto p-4 lg:p-8", className)}
        ref={ref}
        {...props}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-background rounded-lg overflow-hidden">
          {/* Left Side: Booking Form */}
          <motion.div 
            className="p-4 sm:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="text-sm text-muted-foreground">
                <MapPin className="inline-block h-4 w-4 mr-2" />
                {city}
                <a href="#" className="ml-2 text-sm font-medium text-primary hover:underline">
                  Change city
                </a>
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-foreground mb-8">
              Go anywhere with Uber
            </motion.h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Location Inputs with connecting line */}
              <motion.div variants={itemVariants} className="relative bg-muted/40 p-4 rounded-lg">
                <div className="absolute left-6 top-9 bottom-9 w-px bg-border border-l border-dashed"></div>
                <div className="relative flex items-center mb-2">
                  <div className="z-10 bg-background p-1 rounded-full border">
                     <MapPin className="h-4 w-4 text-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-transparent text-foreground focus:outline-none"
                    aria-label="Pickup location"
                  />
                   <button type="button" className="absolute right-2 p-1 text-muted-foreground hover:text-foreground">
                     <Send className="h-5 w-5" />
                   </button>
                </div>
                
                <hr className="border-border mx-12" />

                <div className="relative flex items-center mt-2">
                   <div className="z-10 bg-background p-1 rounded-full border">
                     <Plus className="h-4 w-4 text-foreground" />
                   </div>
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="w-full pl-4 py-2 bg-transparent text-foreground focus:outline-none"
                    aria-label="Dropoff location"
                  />
                </div>
              </motion.div>

              {/* Date and Time Inputs */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <div className="flex items-center bg-muted/40 rounded-lg px-4 py-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="ml-3 text-foreground">{date}</span>
                </div>
                <div className="flex items-center bg-muted/40 rounded-lg px-4 py-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="ml-3 text-foreground">{time}</span>
                  <select aria-label="Select time" className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"></select>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8"
                >
                  See prices
                </button>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  Log in to see your recent activity
                  <ArrowRight className="inline-block h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </form>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div 
            className="hidden lg:block w-full h-full p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img
              src={imageUrl}
              alt="Illustration of a person getting into a car in a city"
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    );
  }
);

RideBookingForm.displayName = "RideBookingForm";