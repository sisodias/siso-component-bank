import * as React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { cn } from "../_utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

// Types remain the same for a consistent API
interface StorageCategory {
  name: string;
  size: number;
  color: string;
}

interface ApplicationItem {
  name: string;
  size: number;
  icon: React.ReactNode;
}

export interface StorageCardProps extends React.ComponentProps<typeof Card> {
  title: string;
  seeAllHref?: string;
  totalStorage: number;
  categories: StorageCategory[];
  applications: ApplicationItem[];
  alertMessage?: React.ReactNode;
}

const StorageCard = React.forwardRef<
  HTMLDivElement,
  StorageCardProps
>(({ 
  className,
  title,
  seeAllHref = "#",
  totalStorage,
  categories,
  applications,
  alertMessage,
  ...props 
}, ref) => {
  const usedStorage = React.useMemo(
    () => categories.reduce((acc, category) => acc + category.size, 0),
    [categories]
  );

  return (
    <Card className={cn("w-full max-w-md", className)} ref={ref} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <a
            href={seeAllHref}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            See All
          </a>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <div 
            className="relative flex h-3 w-full overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-valuenow={usedStorage}
            aria-valuemin={0}
            aria-valuemax={totalStorage}
            aria-label="Storage usage breakdown"
          >
            {categories.map((category, index) => {
              const percentage = (category.size / totalStorage) * 100;
              return (
                <motion.div
                  key={index}
                  className={cn(
                    "h-full", 
                    category.color,
                    index < categories.length - 1 && "border-r-2 border-card"
                  )}
                  initial={{ width: "0%" }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                  style={{ flexShrink: 0 }}
                />
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", category.color)} />
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:mt-0">
              {usedStorage} GB of {totalStorage} GB Used
            </p>
          </div>
        </div>
        
        {alertMessage && (
          <div className="rounded-lg border border-yellow-200/60 bg-yellow-50/50 p-4 text-sm text-yellow-900 dark:border-yellow-900/50 dark:bg-yellow-950/50 dark:text-yellow-200">
            “{alertMessage}”
          </div>
        )}

        {/* --- FIX STARTS HERE --- */}
        {/* The entire application list is now wrapped to control padding and borders */}
        <div>
          <h3 className="text-base font-semibold text-card-foreground">Application</h3>
          {/* This new container adds the outer border and controls the inset look */}
          <div className="mt-2 overflow-hidden rounded-lg border">
            {applications.map((app, index) => (
              <a
                key={index}
                href="#"
                className={cn(
                  "flex items-center justify-between p-4 transition-colors hover:bg-muted/50",
                  // The border is now correctly constrained within the padded container
                  index < applications.length - 1 && "border-b"
                )}
              >
                <div className="flex items-center gap-4">
                  {app.icon}
                  <span className="font-medium">{app.name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">{app.size} GB</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
        {/* --- FIX ENDS HERE --- */}

      </CardContent>
    </Card>
  );
});
StorageCard.displayName = "StorageCard";

export { StorageCard };