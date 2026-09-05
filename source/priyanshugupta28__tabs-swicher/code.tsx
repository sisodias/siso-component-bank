"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Types for our portfolio sections and stock data
type PortfolioSection = {
  id: string;
  title: string;
  description: string;
};

type StockData = {
  id: string;
  sectionId: string;
  symbol: string;
  name: string;
  icon: string;
  totalValue: string;
  avgCost: string;
  price: string;
};

// Sample data - in a real app, this would come from props or an API
const portfolioSections: PortfolioSection[] = [
  {
    id: "accounts",
    title: "All your accounts, one powerful view.",
    description:
      "Rearrange your portfolio your way—drag and drop positions between brokers, and unify your holdings into one beautiful, organized view.",
  },
  {
    id: "prices",
    title: "Live prices",
    description:
      "Your portfolio, always accurate. Fey delivers real-time prices, ensuring your positions are always up to date—no delays, no guesswork.",
  },
  {
    id: "earnings",
    title: "Earnings insights",
    description:
      "Stay ahead of earnings. Fey tracks your holdings to surface key earnings reports, past and upcoming, so you never miss what matters.",
  },
];

const stockData: StockData[] = [
  // Accounts section stocks
  {
    id: "aapl",
    sectionId: "accounts",
    symbol: "AAPL",
    name: "Apple Inc.",
    icon: "🍎",
    totalValue: "$70,312.21",
    avgCost: "$151.50",
    price: "$244.83",
  },
  {
    id: "tsla",
    sectionId: "accounts",
    symbol: "TSLA",
    name: "Tesla Inc.",
    icon: "🔋",
    totalValue: "$22,261.99",
    avgCost: "$124.11",
    price: "$355.04",
  },
  {
    id: "fico",
    sectionId: "accounts",
    symbol: "FICO",
    name: "Fair Isaac Corporation",
    icon: "🇫",
    totalValue: "$4,088.00",
    avgCost: "$942.50",
    price: "$799.53",
  },
  {
    id: "ma",
    sectionId: "accounts",
    symbol: "MA",
    name: "Mastercard Incorporated",
    icon: "💳",
    totalValue: "$12,312.24",
    avgCost: "$355.15",
    price: "$564.76",
  },

  // Tech bets section stocks
  {
    id: "nvda",
    sectionId: "prices",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    icon: "🎮",
    totalValue: "$23,414.46",
    avgCost: "$94.45",
    price: "$138.47",
  },
  {
    id: "amzn",
    sectionId: "prices",
    symbol: "AMZN",
    name: "Amazon.com Inc",
    icon: "📦",
    totalValue: "$16,001.58",
    avgCost: "$223.08",
    price: "$228.59",
  },
  {
    id: "asml",
    sectionId: "prices",
    symbol: "ASML",
    name: "ASML Holding N.V.",
    icon: "🔬",
    totalValue: "$9,432.41",
    avgCost: "$702.12",
    price: "$754.75",
  },

  // Earnings section stocks
  {
    id: "msft",
    sectionId: "earnings",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    icon: "🪟",
    totalValue: "$20,021.43",
    avgCost: "$321.62",
    price: "$408.13",
  },
  {
    id: "nflx",
    sectionId: "earnings",
    symbol: "NFLX",
    name: "Netflix Inc",
    icon: "🎬",
    totalValue: "$8,918.19",
    avgCost: "$871.29",
    price: "$1,058.05",
  },
  {
    id: "goog",
    sectionId: "earnings",
    symbol: "GOOG",
    name: "Alphabet Inc.",
    icon: "🔍",
    totalValue: "$7,851.69",
    avgCost: "$193.89",
    price: "$186.94",
  },
];

interface PortfolioDashboardProps {
  className?: string;
  accentColor?: string;
}

export function TabsSwitcher({
  className,
  accentColor = "#FF6B00", // Default orange accent color
}: PortfolioDashboardProps) {
  const [activeSection, setActiveSection] = useState<string>("accounts");

  // Filter stocks based on active section
  const filteredStocks = stockData.filter(
    (stock) => stock.sectionId === activeSection
  );

  // Get the current section title for the table header
  const currentSectionTitle =
    activeSection === "prices"
      ? "Tech bets"
      : activeSection === "earnings"
      ? "Earnings insights"
      : "401(k)";

  return (
    <div
      className={cn(
        "w-full rounded-3xl overflow-hidden",
        "bg-white text-zinc-900 border border-zinc-200 dark:border-none",
        "dark:bg-zinc-900 dark:text-white",
        className
      )}
    >
      <div className="p-8 pb-4">
        <h1 className="text-4xl font-bold mb-8">
          One portfolio, no boundaries.
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Portfolio sections */}
          <div className="w-full lg:w-1/3 space-y-12">
            {portfolioSections.map((section) => (
              <motion.div
                key={section.id}
                className="relative cursor-pointer hover:bg-background/60 lg:py-2 lg:px-4 rounded-lg"
                onHoverStart={() => setActiveSection(section.id)}
                onClick={() => setActiveSection(section.id)}
                initial={false} // Add this
              >
                {activeSection === section.id && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -left-8 top-0 bottom-0 w-1.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }} // Smoother animation
                  />
                )}

                <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                <p
                  className={cn(
                    "text-base",
                    "dark:text-zinc-400",
                    "text-zinc-600"
                  )}
                >
                  {section.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right side - Stock table */}
          <div className="w-full lg:w-2/3 overflow-x-auto">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">{currentSectionTitle}</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <span
                  className={cn(
                    "dark:text-zinc-400",
                    "text-zinc-600",
                    "whitespace-normal"
                  )}
                >
                  Total value
                </span>
                <span
                  className={cn(
                    "dark:text-zinc-400",
                    "text-zinc-600",
                    "whitespace-normal"
                  )}
                >
                  Avg cost
                </span>
                <span
                  className={cn(
                    "dark:text-zinc-400",
                    "text-zinc-600",
                    "whitespace-normal"
                  )}
                >
                  Price
                </span>
              </div>
            </div>

            <motion.div
              className="space-y-4"
              layout="position" // Change from layout to layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredStocks.map((stock) => (
                <motion.div
                  key={stock.id}
                  layoutId={`stock-${stock.id}`}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg",
                    "dark:bg-zinc-800 dark:hover:bg-zinc-700",
                    "bg-zinc-50 hover:bg-zinc-100"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-opacity-20"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <span>{stock.icon}</span>
                    </div>
                    <div>
                      <div className="font-bold">{stock.symbol}</div>
                      <div
                        className={cn(
                          "text-sm",
                          "dark:text-zinc-400",
                          "text-zinc-600"
                        )}
                      >
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-right">
                    <span>{stock.totalValue}</span>
                    <span>{stock.avgCost}</span>
                    <span className="font-bold">{stock.price}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}