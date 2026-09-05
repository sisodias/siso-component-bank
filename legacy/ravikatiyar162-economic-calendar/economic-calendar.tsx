// components/ui/economic-calendar.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Code2 } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

// Type definition for a single economic event
export interface EconomicEvent {
  countryCode: string;
  time: string;
  eventName: string;
  actual: string | null;
  forecast: string | null;
  prior: string | null;
  impact: 'high' | 'medium' | 'low';
}

// Props for the main component
interface EconomicCalendarProps {
  title: string;
  events: EconomicEvent[];
  className?: string;
}

// A simple volatility icon component
const VolatilityIcon = ({ impact }: { impact: EconomicEvent['impact'] }) => {
  const barCount = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
  return (
    <div className="flex items-end gap-0.5 h-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-full",
            i === 0 ? "h-2" : i === 1 ? "h-3" : "h-4",
            i < barCount ? "bg-foreground/80" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
};

export const EconomicCalendar = React.forwardRef<
  HTMLDivElement,
  EconomicCalendarProps
>(({ title, events, className }, ref) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Function to handle scrolling and update button states
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll function for navigation buttons
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [events]);

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
      },
    },
  };

  return (
    <div ref={ref} className={cn("w-full max-w-6xl mx-auto font-sans p-4", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          {title}
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </h2>
        <div className="flex items-center gap-2">
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="p-1.5 rounded-full bg-background border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </motion.button>
          )}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="p-1.5 rounded-full bg-background border hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </motion.button>
          )}
          <Code2 className="h-6 w-6 text-muted-foreground ml-2" />
        </div>
      </div>

      {/* Scrollable Events Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
      >
        <motion.div
            className="flex flex-nowrap gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {events.map((event, index) => (
            <motion.div
                key={index}
                variants={itemVariants}
                className="flex-shrink-0 w-72 bg-card border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
                <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Today</p>
                    <span className="text-sm font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">
                    {event.time}
                    </span>
                </div>
                <VolatilityIcon impact={event.impact} />
                </div>

                <div className="flex items-center gap-3 mb-4">
                <img
                    // FIX: Updated the image source URL to a more reliable provider
                    src={`https://flagcdn.com/w40/${event.countryCode.toLowerCase()}.png`}
                    alt={`${event.countryCode} flag`}
                    className="h-8 w-8 rounded-full object-cover bg-muted"
                />
                <h3 className="font-semibold text-foreground truncate">{event.eventName}</h3>
                </div>

                <div className="grid grid-cols-3 text-center text-sm">
                <div>
                    <p className="text-muted-foreground">Actual</p>
                    <p className="font-medium text-foreground mt-1">{event.actual ?? "—"}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Forecast</p>
                    <p className="font-medium text-foreground mt-1">{event.forecast ?? "—"}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Prior</p>
                    <p className="font-medium text-foreground mt-1">{event.prior ?? "—"}</p>
                </div>
                </div>
            </motion.div>
            ))}
        </motion.div>
      </div>
      
      {/* Footer Link */}
      <a href="#" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
        See all market events ›
      </a>
    </div>
  );
});

EconomicCalendar.displayName = "EconomicCalendar";