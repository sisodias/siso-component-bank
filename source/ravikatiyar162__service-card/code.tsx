import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Defines the card's base styles and variants (dark/light)
const cardVariants = cva(
  "relative group flex h-[350px] flex-col justify-between overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-lg",
  {
    variants: {
      variant: {
        dark: "text-primary-foreground",
        light: "bg-card text-card-foreground border",
      },
    },
    defaultVariants: {
      variant: "dark",
    },
  }
);

// Defines the button's styles based on the card's variant
const buttonVariants = cva("", {
  variants: {
    variant: {
      dark: "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
      light: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
  },
  defaultVariants: {
    variant: "dark",
  },
});

export interface ServiceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: React.ReactNode;
  description: string;
  buttonText: string;
  imageUrl: string;
  href: string;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      className,
      variant,
      title,
      description,
      buttonText,
      imageUrl,
      href,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        whileHover="hover"
        variants={{
          hover: { y: -6 }, // Card lift animation
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        {...props}
      >
        {/* Background Image with Zoom Effect */}
        <motion.div
          className="absolute inset-0 z-0"
          variants={{
            hover: { scale: 1.05 },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <img
            src={imageUrl}
            alt={typeof title === 'string' ? title : 'Service background'}
            className="h-full w-full object-cover"
          />
        </motion.div>
        
        {/* Gradient Overlay for Dark Variant to ensure text readability */}
        <div
          className={cn(
            "absolute inset-0 z-10",
            variant === "dark" && "bg-gradient-to-r from-black/70 via-black/50 to-transparent"
          )}
        />

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col justify-between p-6 md:p-8">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h3>
            <p className="mt-2 max-w-[280px] text-sm md:text-base opacity-90">{description}</p>
          </div>
          <div className="mt-8">
            <Button asChild className={cn(buttonVariants({ variant }))}>
              <a href={href}>
                {buttonText}
                {/* Stretched link to make the entire card clickable */}
                <span className="absolute inset-0" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }
);
ServiceCard.displayName = "ServiceCard";

export { ServiceCard };