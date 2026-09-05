import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Assumes you have a `cn` utility from shadcn/ui

// Define the color schemes for different weather conditions
// These classes will be applied to the card to change its appearance
const weatherStyles = {
  Sunny: "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/50",
  Cloudy: "bg-gradient-to-br from-slate-400 to-gray-600 shadow-gray-500/50",
  Rainy: "bg-gradient-to-br from-blue-500 to-indigo-700 shadow-blue-500/50",
  Stormy: "bg-gradient-to-br from-gray-700 to-gray-900 shadow-gray-800/50",
};

// Define the types for the component's props for type safety and reusability
export interface WeatherCardProps extends React.HTMLAttributes<HTMLDivElement> {
  temperature: number;
  high: number;
  low: number;
  location: string;
  condition: keyof typeof weatherStyles;
  icon: React.ReactNode;
}

// A small animated text component for smooth transitions
const AnimatedText = ({ text, className }: { text: string | number; className?: string }) => (
  <motion.div
    key={text.toString()}
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="absolute"
  >
    <p className={className}>{text}</p>
  </motion.div>
);

const WeatherCard = React.forwardRef<HTMLDivElement, WeatherCardProps>(
  (
    {
      className,
      temperature,
      high,
      low,
      location,
      condition,
      icon,
      ...props
    },
    ref
  ) => {
    // Select the appropriate style based on the weather condition prop
    const cardStyle = weatherStyles[condition] || "bg-card text-card-foreground";

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-[220px] w-full max-w-[380px] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-500",
          cardStyle,
          className
        )}
        {...props}
      >
        {/* Decorative icon in the background with reduced opacity */}
        <div className="absolute -right-6 -top-6 text-white/10">
          {React.cloneElement(icon as React.ReactElement, { size: 140 })}
        </div>
        
        {/* Main temperature display with animation */}
        <div className="relative h-[60px]">
          <AnimatePresence mode="wait">
            <AnimatedText text={`${temperature}°`} className="z-10 text-6xl font-bold" />
          </AnimatePresence>
        </div>

        {/* Weather details section with animations */}
        <div className="z-10 flex items-end justify-between">
          <div className="relative h-[40px] w-48">
             <AnimatePresence mode="wait">
                <motion.div
                    key={location}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute bottom-0"
                >
                    <p className="text-sm text-white/80">
                      H:{high}° L:{low}°
                    </p>
                    <p className="font-semibold">{location}</p>
                </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative h-[20px] w-24 text-right">
            <AnimatePresence mode="wait">
              <AnimatedText text={condition} className="text-sm font-semibold" />
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }
);

WeatherCard.displayName = "WeatherCard";

export { WeatherCard };
