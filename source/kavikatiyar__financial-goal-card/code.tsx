// components/ui/financial-goal-card.tsx
import * as React from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowLeft, ChevronRight, MoreHorizontal, TrendingUp, DollarSign, Repeat } from "lucide-react";

import { cn } from "@/lib/utils"; // Your shadcn/ui utility for merging class names
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- TYPE DEFINITIONS ---
interface Transaction {
  id: string;
  icon: React.ElementType;
  type: string;
  date: string;
  amount: number;
}

interface InvestmentInfo {
  icon: React.ElementType;
  name: string;
  yield: string;
}

export interface FinancialGoalCardProps {
  goalName: string;
  targetDate: string;
  currentAmount: number;
  targetAmount: number;
  imageUrl: string;
  investmentInfo: InvestmentInfo;
  transactions: Transaction[];
}

// --- SUB-COMPONENTS ---
// Custom animated progress bar to match the design
const SegmentedProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const totalSegments = 50;
  const filledSegments = Math.round((percentage / 100) * totalSegments);

  const segmentVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.02,
        duration: 0.1,
      },
    }),
  };

  return (
    <div className="flex w-full items-center gap-1">
      {Array.from({ length: totalSegments }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={segmentVariants}
          className={cn(
            "h-4 w-1 flex-1 rounded-full",
            i < filledSegments ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
export const FinancialGoalCard = ({
  goalName,
  targetDate,
  currentAmount,
  targetAmount,
  imageUrl,
  investmentInfo,
  transactions,
}: FinancialGoalCardProps) => {
  const percentage = targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  }, [controls]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <Card className="w-full max-w-4xl mx-auto rounded-3xl p-4 md:p-6 shadow-lg bg-card/80 backdrop-blur-sm border">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Panel */}
        <motion.div variants={itemVariants} className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Badge variant="secondary">{targetDate}</Badge>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">{goalName}</h1>
            <motion.p
                className="text-6xl font-bold text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                {percentage}%
            </motion.p>
          </div>
          <div className="space-y-2">
            <SegmentedProgressBar value={currentAmount} max={targetAmount} />
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>{formatCurrency(currentAmount)}</span>
              <span>{formatCurrency(targetAmount)}</span>
            </div>
          </div>
          <motion.div
            className="relative h-48 w-full overflow-hidden rounded-2xl"
            variants={itemVariants}
          >
            <img src={imageUrl} alt={goalName} className="absolute inset-0 h-full w-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Right Panel */}
        <motion.div variants={itemVariants} className="flex flex-col space-y-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline">Edit</Button>
            <Button>Add funds</Button>
          </div>

          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            <investmentInfo.icon className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{investmentInfo.name}</p>
                        <p className="text-sm text-muted-foreground">{investmentInfo.yield}</p>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground"/>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold mb-3">Transactions</h2>
            <div className="space-y-3">
              {transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: (i: number) => ({
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.5 + i * 0.1 },
                    }),
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <tx.icon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600 dark:text-green-500">
                    +{formatCurrency(tx.amount)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
};