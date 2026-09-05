import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ArrowUp, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils"; // Your shadcn/ui utility for merging classes
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the types for the component props for type-safety and reusability
interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

interface TopUser {
  name: string;
  avatarUrl: string;
  metricLabel: string;
  metricValue: string | number;
}

interface MetricData {
  label: string;
  value: string;
  percentageChange: number;
  users: User[];
}

interface PerformanceCardProps {
  title?: string;
  icon?: React.ReactNode;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  topUser: TopUser;
  metricData: MetricData;
  footerNote: string;
  className?: string;
}

// The main component definition
export const PerformanceCard = ({
  title = "Performance",
  icon = <TrendingUp className="h-5 w-5 text-muted-foreground" />,
  tabs,
  activeTab,
  onTabChange,
  topUser,
  metricData,
  footerNote,
  className,
}: PerformanceCardProps) => {
  return (
    <Card className={cn("w-full max-w-sm rounded-2xl shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tab navigation */}
        <div className="mb-6 flex w-full items-center justify-between rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "secondary" : "ghost"}
              className="h-8 flex-1 rounded-md text-sm font-medium"
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Animated content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top User Section */}
            <div className="flex flex-col items-center rounded-xl border bg-card p-4 text-center">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Top User</p>
              <Avatar className="my-2 h-16 w-16">
                <AvatarImage src={topUser.avatarUrl} alt={topUser.name} />
                <AvatarFallback>{topUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="font-bold text-card-foreground">{topUser.name}</p>
              <p className="text-sm text-muted-foreground">{topUser.metricLabel}</p>
              <p className="text-lg font-bold text-card-foreground">{topUser.metricValue} items</p>
            </div>

            {/* Total Metric Section */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase text-muted-foreground">{metricData.label}</p>
                <p className="text-4xl font-bold text-card-foreground">{metricData.value}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-500">
                <ArrowUp className="h-4 w-4" />
                <span>{metricData.percentageChange}%</span>
              </div>
            </div>

            {/* User Avatar Stack */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex -space-x-2">
                {metricData.users.slice(0, 5).map((user, index) => (
                  <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="text-sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Note */}
        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-muted-foreground">{footerNote}</p>
        </div>
      </CardContent>
    </Card>
  );
};