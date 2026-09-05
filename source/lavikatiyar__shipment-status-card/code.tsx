import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Your utility for merging class names
import { Button } from "@/components/ui/button"; // Assuming shadcn Button component

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export interface ShipmentStatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt?: string;
  timeIcon?: React.ReactNode;
  title: string;
  description: string;
  statusIcon: React.ReactNode;
  statusText: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const ShipmentStatusCard = React.forwardRef<HTMLDivElement, ShipmentStatusCardProps>(
  ({ 
    className, 
    imageUrl, 
    imageAlt = "Shipment visual", 
    timeIcon,
    title,
    description,
    statusIcon,
    statusText,
    buttonText,
    onButtonClick,
    ...props 
  }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "max-w-sm w-full bg-card text-card-foreground border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {/* Image Section */}
        <motion.div variants={itemVariants} className="relative bg-muted/50 aspect-[16/9] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={imageAlt}
            className="w-full h-full object-contain p-4 sm:p-6"
          />
          {timeIcon && (
            <div className="absolute top-3 right-3 bg-card/50 backdrop-blur-sm p-2 rounded-full">
              {timeIcon}
            </div>
          )}
        </motion.div>

        {/* Content Section */}
        <div className="p-6">
          <motion.h3 variants={itemVariants} className="text-xl font-semibold mb-2">
            {title}
          </motion.h3>
          <motion.p variants={itemVariants} className="text-muted-foreground text-sm mb-6">
            {description}
          </motion.p>
          
          {/* Action and Status Footer */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
            <Button variant="outline" onClick={onButtonClick}>
              {buttonText}
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {statusIcon}
              <span>{statusText}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);
ShipmentStatusCard.displayName = "ShipmentStatusCard";

export { ShipmentStatusCard };