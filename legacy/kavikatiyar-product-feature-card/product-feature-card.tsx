// components/ui/product-feature-card.tsx

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../_utils/cn";

// Define the props for the component
interface ProductFeatureCardProps {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  className?: string;
}

// Framer Motion animation variants
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const ProductFeatureCard = React.forwardRef<
  HTMLDivElement,
  ProductFeatureCardProps
>(
  (
    {
      imageUrl,
      imageAlt,
      title,
      description,
      linkText,
      linkHref,
      className,
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative w-full max-w-sm overflow-hidden rounded-xl border bg-card p-6 shadow-sm",
          "transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1",
          className
        )}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.5 }}
        variants={cardVariants}
      >
        {/* Image Section */}
        <div className="mb-6 flex justify-center">
          <img
            src={imageUrl}
            alt={imageAlt}
            width={300}
            height={200}
            className="h-auto w-full max-w-[280px] object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-card-foreground">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
          <a
            href={linkHref}
            className="group/link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            {linkText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </a>
        </div>
      </motion.div>
    );
  }
);

ProductFeatureCard.displayName = "ProductFeatureCard";

export { ProductFeatureCard };