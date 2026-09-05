import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn"; // Your utility for merging class names

// --- TYPE DEFINITIONS ---

interface Coin {
  iconUrl: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
}

interface Dominance {
  name: string;
  percentage: number;
  color: string; // e.g., 'bg-blue-500' or a CSS variable
}

interface CryptoStatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  marketCapUSD: number;
  marketCapChange: number;
  chartData: number[];
  dominanceData: Dominance[];
  coinData: Coin[];
  currencySymbol?: string;
}

// --- HELPER FUNCTIONS ---

const formatMarketCap = (num: number): string => {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  return num.toString();
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// --- SUB-COMPONENTS ---

/**
 * An animated SVG sparkline chart component.
 * Uses framer-motion for a draw-in animation effect.
 */
const SparkLineChart = ({
  data,
  width = 280,
  height = 80,
  strokeWidth = 2,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - strokeWidth * 2) + strokeWidth;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-primary", className)}
      aria-label="Sparkline chart showing market trend over the last month"
    >
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M${points}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d={`M${points} L${width},${height} L0,${height} Z`}
        fill="url(#sparkline-gradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
      />
    </svg>
  );
};

// --- MAIN COMPONENT ---

export const CryptoStatsCard = React.forwardRef<
  HTMLDivElement,
  CryptoStatsCardProps
>(
  (
    {
      marketCapUSD,
      marketCapChange,
      chartData,
      dominanceData,
      coinData,
      currencySymbol = "USD",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6",
          className
        )}
        {...props}
      >
        {/* Market Cap Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Crypto market cap
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {formatMarketCap(marketCapUSD)}
            </span>
            <span className="text-lg font-medium text-muted-foreground">
              {currencySymbol}
            </span>
          </div>
          <div
            className={cn(
              "text-sm font-semibold",
              marketCapChange >= 0 ? "text-green-500" : "text-destructive"
            )}
          >
            {marketCapChange >= 0 ? "+" : ""}
            {marketCapChange.toFixed(2)}%
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex justify-center -mx-6 my-4">
            <SparkLineChart data={chartData} />
        </div>

        {/* Dominance Section */}
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Bitcoin dominance</h3>
            <div className="flex items-center justify-between text-xs">
                {dominanceData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", item.color)} />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-semibold text-card-foreground">{item.percentage.toFixed(2)}%</span>
                    </div>
                ))}
            </div>
            <div className="flex h-2 w-full rounded-full overflow-hidden">
                {dominanceData.map((item) => (
                    <div key={item.name} className={cn("h-full", item.color)} style={{ width: `${item.percentage}%` }} />
                ))}
            </div>
        </div>

        {/* Coin List Section */}
        <div className="space-y-4 pt-4 border-t">
            {coinData.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={coin.iconUrl} alt={`${coin.name} icon`} className="h-8 w-8"/>
                        <div>
                            <p className="font-semibold">{coin.name}</p>
                            <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{formatPrice(coin.price)} <span className="text-xs text-muted-foreground">{currencySymbol}</span></p>
                        <p className={cn("text-xs font-medium", coin.change >= 0 ? "text-green-500" : "text-destructive")}>
                            {coin.change.toFixed(2)}%
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  }
);
CryptoStatsCard.displayName = "CryptoStatsCard";