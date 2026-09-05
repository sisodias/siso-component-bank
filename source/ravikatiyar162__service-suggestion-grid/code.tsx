import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Interface for a single service item
interface ServiceItem {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  ctaText: string;
  href: string;
}

// Props for the main grid component
export interface ServiceSuggestionGridProps {
  items: ServiceItem[];
  className?: string;
}

const ServiceSuggestionGrid = React.forwardRef<
  HTMLDivElement,
  ServiceSuggestionGridProps
>(({ items, className }, ref) => {

  // Animation variants for the container to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for each card item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className={cn("w-full max-w-6xl mx-auto py-8 px-4", className)}>
      <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">
        Suggestions
      </h2>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group relative flex flex-col justify-between p-6 bg-card rounded-xl border border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-card-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <a href={item.href} className="w-fit">
                <Button variant="outline" size="sm">
                  {item.ctaText}
                </Button>
              </a>
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                className="w-20 h-20 object-contain transform transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
});

ServiceSuggestionGrid.displayName = "ServiceSuggestionGrid";

export { ServiceSuggestionGrid };