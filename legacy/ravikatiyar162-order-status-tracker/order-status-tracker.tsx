import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";
import { Button } from "./button";

// Define TypeScript types for the component props for type safety and reusability
interface OrderItemProps {
  imageUrl: string;
  name: string;
  details: string;
  price: number;
}

interface OrderSummaryItemProps {
  label: string;
  value: string;
}

interface OrderStatusProps {
  illustrationUrl: string;
  statusTitle: string;
  statusDescription: string;
  item: OrderItemProps;
  summary: OrderSummaryItemProps[];
  trackingStatus: string;
  onTrackOrder?: () => void;
  className?: string;
}

// Reusable Card component for consistent styling
const InfoCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground p-6",
        className
      )}
      {...props}
    />
  )
);
InfoCard.displayName = "InfoCard";


export const OrderStatus: React.FC<OrderStatusProps> = ({
  illustrationUrl,
  statusTitle,
  statusDescription,
  item,
  summary,
  trackingStatus,
  onTrackOrder,
  className,
}) => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={cn("max-w-md w-full mx-auto p-4 font-sans", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header section with illustration and status */}
      <motion.div variants={itemVariants} className="text-center space-y-2 mb-8">
        <img
          src={illustrationUrl}
          alt="Order Status Illustration"
          className="w-32 h-32 mx-auto"
        />
        <h1 className="text-2xl font-bold text-foreground">{statusTitle}</h1>
        <p className="text-muted-foreground">{statusDescription}</p>
      </motion.div>

      {/* Ordered item details card */}
      <motion.div variants={itemVariants} className="mb-6">
        <InfoCard>
          <div className="flex items-center space-x-4">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 rounded-lg bg-muted object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.details}</p>
            </div>
            <p className="font-bold text-foreground">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </InfoCard>
      </motion.div>
      
      {/* Order summary card */}
      <motion.div variants={itemVariants} className="mb-8">
        <InfoCard className="space-y-4">
            <h2 className="font-semibold text-lg text-foreground">Order Summary</h2>
            {summary.map((line, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">{line.label}</p>
                    <p className="text-foreground font-medium text-right">{line.value}</p>
                </div>
            ))}
        </InfoCard>
      </motion.div>

      {/* Action button and final status text */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <Button onClick={onTrackOrder} className="w-full">
            Track order
        </Button>
        <p className="text-xs text-green-600 dark:text-green-500 font-medium">{trackingStatus}</p>
      </motion.div>
    </motion.div>
  );
};