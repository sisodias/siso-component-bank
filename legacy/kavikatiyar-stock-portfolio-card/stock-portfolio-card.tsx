import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, MoreHorizontal, TrendingUp, TrendingDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a utility for class names

// --- TYPE DEFINITIONS ---
type StockHolding = {
  ticker: string;
  name: string;
  shares: number;
  lastPrice: number;
  changeValue: number;
  changePercent: number;
};

type NewsArticle = {
  category: string;
  time: string;
  title: string;
  source: string;
};

type StockPortfolioCardProps = {
  totalGain: number;
  returnPercentage: number;
  asOfDate: string;
  holdings: StockHolding[];
  news: NewsArticle[];
  className?: string;
};

// --- HELPER TO FORMAT CURRENCY ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// --- SUB-COMPONENTS ---
const StockHoldingItem: React.FC<{ holding: StockHolding }> = ({ holding }) => {
  const isPositive = holding.changeValue >= 0;
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <span className="font-bold text-muted-foreground">{holding.ticker}</span>
        </div>
        <div>
          <p className="font-semibold text-card-foreground">{holding.name}</p>
          <p className="text-sm text-muted-foreground">{holding.shares} shares</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-card-foreground">{formatCurrency(holding.lastPrice)}</p>
        <div className={cn("flex items-center justify-end gap-1 text-sm", isPositive ? "text-green-500" : "text-red-500")}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{formatCurrency(holding.changeValue)}</span>
          <span>({holding.changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
};

const NewsItem: React.FC<{ article: NewsArticle }> = ({ article }) => (
  <div className="flex-shrink-0 w-[220px] p-4 bg-muted/50 rounded-lg">
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
      <span>{article.category}</span>
      <span>•</span>
      <span>{article.time}</span>
    </div>
    <p className="font-semibold text-sm text-card-foreground leading-snug mb-3">{article.title}</p>
    <a href="#" className="flex items-center text-xs font-semibold text-primary hover:underline">
      {article.source} <ArrowRight className="ml-1 h-3 w-3" />
    </a>
  </div>
);


// --- MAIN COMPONENT ---
export const StockPortfolioCard = ({
  totalGain,
  returnPercentage,
  asOfDate,
  holdings,
  news,
  className,
}: StockPortfolioCardProps) => {
  const isPositiveReturn = returnPercentage >= 0;

  // Animation variants for Framer Motion
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
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full max-w-2xl mx-auto rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6", className)}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Total gain</p>
          <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(totalGain)}</h2>
          <div className={cn("mt-1 flex items-center gap-2 text-sm font-medium", isPositiveReturn ? "text-green-500" : "text-red-500")}>
            {isPositiveReturn ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {returnPercentage.toFixed(2)}% Return
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 sm:mt-0">As of {asOfDate}</p>
      </motion.div>

      {/* Holdings Section */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Holdings</h3>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        <div className="divide-y divide-border">
          {holdings.map((holding) => (
            <StockHoldingItem key={holding.ticker} holding={holding} />
          ))}
        </div>
      </motion.div>

      {/* Related News Section */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Related news</h3>
          <div className="flex gap-2">
            <button className="p-1 rounded-full border bg-background hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-1 rounded-full border bg-background hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
            {news.map((article, index) => (
                <NewsItem key={index} article={article} />
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};