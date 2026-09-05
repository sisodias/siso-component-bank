import * as React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Flame } from "lucide-react";

import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Card } from "./card"; // Assuming shadcn Card component
import { Button } from "./button"; // Assuming shadcn Button component

// Type definition for a single stock item
interface Stock {
  ticker: string;
  name: string;
  logoUrl: string;
  price: number;
  currency: string;
  changePercent: number;
}

// Props for the main component
interface StockTrendsCarouselProps {
  title: string;
  subtitle: string;
  stocks: Stock[];
  className?: string;
}

// Utility to format currency
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// --- Main Component ---
export const StockTrendsCarousel = React.forwardRef<
  HTMLDivElement,
  StockTrendsCarouselProps
>(({ title, subtitle, stocks, className }, ref) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  
  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section
      ref={ref}
      className={cn("w-full max-w-6xl mx-auto space-y-4", className)}
    >
      {/* Header */}
      <div className="px-4 md:px-0">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
          🇺🇸 {title} <ChevronRight className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground">
          {subtitle}
        </h3>
      </div>

      {/* Carousel */}
      <div className="relative">
        <motion.div
          ref={scrollContainerRef}
          className="flex w-full space-x-4 overflow-x-auto pb-4 px-4 md:px-0 scrollbar-hide"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stocks.map((stock) => (
             <motion.div 
               key={stock.ticker} 
               variants={itemVariants} 
               whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
               className="flex-shrink-0"
            >
              <Card className="w-64 p-4 h-full flex flex-col justify-between border-border/60 hover:border-border transition-colors duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={stock.logoUrl} alt={`${stock.name} logo`} className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-foreground">{stock.ticker}</p>
                        <Flame className="h-4 w-4 text-orange-400" />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {formatCurrency(stock.price, stock.currency).replace("$","")}{" "}
                    <span className="text-sm font-medium text-muted-foreground">{stock.currency}</span>
                  </p>
                  <p className={cn(
                      "font-semibold",
                      stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Scroll Button */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
           <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
});
StockTrendsCarousel.displayName = "StockTrendsCarousel";