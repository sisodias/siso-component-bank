// components/ui/crypto-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a utility for classnames

// Define the props for the component
interface CryptoCardProps {
  icon: React.ReactNode;
  name: string;
  ticker: string;
  percentageChange: number;
  currentPrice: number;
  portfolioValue: number;
  portfolioChange: number;
  leverage: number;
  gradientFrom: string; // e.g., 'from-red-500'
  className?: string;
}

// Helper for formatting currency
const formatCurrency = (value: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatCompact = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(value);
}

// SVG Icons for actions
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
  </svg>
);

const DotsHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
  </svg>
);

const ChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 13.5H14V14.5H1V13.5ZM1 1.5L4 4.5L6.5 2.5L10.5 7.5L14 3.5V11.5H1V1.5Z" fill="currentColor"></path>
  </svg>
);


export const CryptoCard = ({
  icon,
  name,
  ticker,
  percentageChange,
  currentPrice,
  portfolioValue,
  portfolioChange,
  leverage,
  gradientFrom,
  className,
}: CryptoCardProps) => {
  const isPositive = percentageChange >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className={cn(
        "flex w-full max-w-sm rounded-2xl overflow-hidden bg-card border shadow-lg",
        className
      )}
    >
      {/* Left Panel - Gradient */}
      <div
        className={cn(
          "w-2/5 p-4 flex flex-col justify-between text-white bg-gradient-to-br",
          gradientFrom,
          isPositive ? "to-green-800" : "to-red-800"
        )}
      >
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold">{percentageChange.toFixed(2)}%</p>
          <p className="text-sm opacity-80">{formatCurrency(currentPrice, "USD").replace('$', '$ ')}</p>
        </div>
      </div>

      {/* Right Panel - Data */}
      <div className="w-3/5 p-4 flex flex-col justify-between bg-card text-card-foreground">
        <div>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold tracking-tight">{formatCurrency(portfolioValue)}</p>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded-full",
                isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
              )}>
                {isPositive ? '+' : ''}{formatCompact(portfolioChange)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">{leverage}X</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{name} / {ticker}</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2 text-muted-foreground">
            <button className="hover:text-primary transition-colors" aria-label="Add">
              <PlusIcon />
            </button>
            <button className="hover:text-primary transition-colors" aria-label="More options">
              <DotsHorizontalIcon />
            </button>
          </div>
          <button className="text-muted-foreground hover:text-primary transition-colors" aria-label="View chart">
            <ChartIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
};