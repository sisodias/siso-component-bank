import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

// Variants for the banner container
const bannerVariants = cva(
  "group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border p-4 text-left transition-all",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PromoBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

const PromoBanner = React.forwardRef<HTMLDivElement, PromoBannerProps>(
  ({ className, variant, title, description, icon, href, ...props }, ref) => {
    // Animation variants for Framer Motion
    const cardAnimation = {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      hover: { scale: 1.02, transition: { duration: 0.2 } },
    };

    const content = (
      <motion.div
        ref={ref}
        className={cn(bannerVariants({ variant, className }))}
        variants={cardAnimation}
        initial="initial"
        animate="animate"
        whileHover="hover"
        {...props}
      >
        {/* Text content */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>

        {/* Icon container */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {icon}
          </div>
        </div>
      </motion.div>
    );

    // Render as a link if href is provided, otherwise as a div
    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        >
          {content}
        </a>
      );
    }

    return content;
  }
);

PromoBanner.displayName = "PromoBanner";

export { PromoBanner, bannerVariants };