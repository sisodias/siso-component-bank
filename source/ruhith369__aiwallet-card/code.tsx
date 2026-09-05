"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Wallet2, Plus, Activity } from "lucide-react";

interface AIWalletCardProps {
  title?: string;
  description?: string;
  balance?: number;
  usage?: number;
  currency?: string;
  onTopUp?: () => void;
  showTransactions?: boolean;
}

export function AIWalletCard({
  title = "AI Credit Wallet",
  description = "Manage your credits easily",
  balance = 120,
  usage = 60,
  currency = "$",
  onTopUp,
  showTransactions = true,
}: AIWalletCardProps) {
  return (
    <Card className="w-full max-w-md bg-white dark:bg-[#0D1117] border border-gray-200 dark:border-gray-800 shadow-md relative overflow-hidden transition-colors">
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-[#161B22]">
              <Wallet2 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {description}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="text-xs font-semibold bg-gray-100 dark:bg-[#161B22] text-gray-700 dark:text-gray-300"
          >
            ACTIVE
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Current Balance
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {currency}
            {balance}
          </span>
        </div>

        <Progress
          value={usage}
          className="h-2 bg-gray-200 dark:bg-gray-800 [&>div]:bg-gray-700 dark:[&>div]:bg-gray-300"
        />

        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{usage}% used</span>
          <span>{100 - usage}% available</span>
        </div>

        {showTransactions && (
          <div className="mt-6 bg-gray-50 dark:bg-[#161B22] p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Recent Transactions
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                View All
              </Button>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex justify-between">
                <span>API Usage</span> <span>−{currency}5</span>
              </li>
              <li className="flex justify-between">
                <span>Model Upgrade</span> <span>−{currency}15</span>
              </li>
              <li className="flex justify-between">
                <span>Top-up Bonus</span> <span>+{currency}25</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter className="relative z-10">
        <Button
          onClick={onTopUp}
          className="w-full bg-gray-900 hover:bg-black dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-black font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Top Up Credits
        </Button>
      </CardFooter>
    </Card>
  );
}
