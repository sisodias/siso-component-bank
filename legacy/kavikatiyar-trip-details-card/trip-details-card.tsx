import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../_utils/cn";
import { Badge } from "./badge";
import { Button } from "./button";

// Define variants for the status badge using cva
const badgeVariants = cva(
  "capitalize",
  {
    variants: {
      status: {
        upcoming: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  }
);

// Define the type for each action button
export interface TripAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

// Define the props for the main component
export interface TripDetailsCardProps extends VariantProps<typeof badgeVariants> {
  origin: string;
  destination: string;
  travelerName: string;
  tripId: string;
  travelDate: Date;
  actions: TripAction[];
  className?: string;
  status: "upcoming" | "completed" | "cancelled";
}

const TripDetailsCard = React.forwardRef<
  HTMLDivElement,
  TripDetailsCardProps
>(({ 
    className, 
    origin,
    destination,
    travelerName,
    status,
    tripId,
    travelDate,
    actions,
    ...props 
}, ref) => {
  
  // Format the date for display
  const formattedDate = travelDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "max-w-4xl w-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {/* Main content section */}
      <div className="p-6 space-y-4">
        {/* Header with locations and status */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {origin} <ArrowRight className="h-5 w-5 text-muted-foreground" /> {destination}
            </h2>
            <p className="text-sm text-muted-foreground">
              {travelerName} is travelling
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={cn(badgeVariants({ status }))}>{status}</Badge>
            <span className="text-xs text-muted-foreground font-mono">Trip ID: {tripId}</span>
          </div>
        </div>
        
        {/* Date Section */}
        <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">{origin} → {destination}</p>
            <p className="text-lg font-semibold text-foreground">{formattedDate}</p>
        </div>
      </div>
      
      {/* Actions Toolbar */}
      <div className="bg-muted/50 px-6 py-3 border-t">
        <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 -mb-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'ghost'}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className="flex-shrink-0"
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

TripDetailsCard.displayName = "TripDetailsCard";

export { TripDetailsCard };