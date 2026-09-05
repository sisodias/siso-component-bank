import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Diamond } from "lucide-react";

// Define the props for the PricingCard component
interface PricingCardProps {
  title: string;
  price?: string;
  priceDescription?: string;
  description: string;
  features?: string[];
  buttonText: string;
  imageSrc?: string;
  imageAlt?: string;
  isUnique?: boolean; // A prop to handle the unique request card style
  className?: string;
}

// Framer Motion variants for animations
const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: "0px 15px 30px -5px hsl(var(--foreground) / 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const imageVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: -5,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      title,
      price,
      priceDescription,
      description,
      features,
      buttonText,
      imageSrc,
      imageAlt,
      isUnique = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        className={cn(
          "relative flex flex-col justify-between rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-shadow duration-300",
          className
        )}
        {...props}
      >
        <div className="flex flex-col space-y-4">
          {/* Card Header with optional image */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              {price && (
                <div className="mt-2">
                  <span className="text-4xl font-bold">{price}</span>
                  <p className="text-sm text-muted-foreground">
                    {priceDescription}
                  </p>
                </div>
              )}
            </div>
            {imageSrc && (
              <motion.img
                src={imageSrc}
                alt={imageAlt || title}
                width={80}
                height={80}
                className="select-none"
                variants={imageVariants}
              />
            )}
          </div>

          {/* Card Description */}
          <p className="text-muted-foreground">{description}</p>

          {/* Feature List */}
          {features && (
            <ul className="space-y-2 pt-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Diamond className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Card Footer with Button */}
        <div className="mt-6">
          <Button className="w-full">{buttonText}</Button>
        </div>
      </motion.div>
    );
  }
);
PricingCard.displayName = "PricingCard";

export { PricingCard };