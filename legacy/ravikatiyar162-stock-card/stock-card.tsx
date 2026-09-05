import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Button } from "./button"; // Assuming shadcn button

/**
 * Props for the StockCard component.
 */
interface StockCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The source URL for the company logo. */
  logoSrc: string;
  /** The stock ticker symbol (e.g., "AAPL"). */
  ticker: string;
  /** The full name of the company (e.g., "Apple Inc."). */
  name: string;
  /** The current price of the stock. */
  price: number;
  /** The percentage change in the stock price. Positive for gain, negative for loss. */
  change: number;
  /** A callback function to be invoked when the "Buy" button is clicked. */
  onBuy: (ticker: string) => void;
}

const StockCard = React.forwardRef<HTMLDivElement, StockCardProps>(
  ({ className, logoSrc, ticker, name, price, change, onBuy, ...props }, ref) => {
    const isPositiveChange = change >= 0;

    // Format price to have two decimal places with a comma separator
    const formattedPrice = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

    // Format change to show absolute value with two decimal places
    const formattedChange = `${Math.abs(change).toFixed(2)}%`;

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.025, transition: { duration: 0.2 } }}
        className={cn(
          "flex items-center justify-between w-full max-w-md p-4 bg-card text-card-foreground",
          "rounded-xl border shadow-sm transition-shadow hover:shadow-md",
          className
        )}
        {...props}
      >
        {/* Left Section: Logo and Ticker Info */}
        <div className="flex items-center gap-4">
          <img src={logoSrc} alt={`${name} logo`} className="h-10 w-10 rounded-full" />
          <div>
            <p className="font-bold text-lg text-foreground">{ticker}</p>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
        </div>

        {/* Right Section: Price and Buy Button */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-right">
            <p className="font-semibold text-lg text-foreground">{formattedPrice}</p>
            <div className="flex items-center justify-end gap-1">
              {isPositiveChange ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={cn("text-sm", isPositiveChange ? "text-green-500" : "text-red-500")}>
                {formattedChange}
              </span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onBuy(ticker)}
            aria-label={`Buy ${ticker} stock`}
          >
            Buy
          </Button>
        </div>
      </motion.div>
    );
  }
);

StockCard.displayName = "StockCard";

export { StockCard };