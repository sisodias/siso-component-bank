import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from "../_utils/cn";
import { Button } from "./button";

// Type definitions for the component props
interface FeatureItem {
  text: string;
  href?: string;
}

interface FeatureCategory {
  icon: React.ReactNode;
  title: string;
  items: FeatureItem[];
}

export interface FeatureGridProps {
  title: React.ReactNode;
  subtitle: string;
  illustrationSrc: string;
  illustrationAlt?: string;
  categories: FeatureCategory[];
  buttonText: string;
  buttonHref: string;
  className?: string;
}

// Animation variants for Framer Motion
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * A responsive grid component to showcase features or categories with animations.
 */
export const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  (
    {
      title,
      subtitle,
      illustrationSrc,
      illustrationAlt = 'Feature illustration',
      categories,
      buttonText,
      buttonHref,
      className,
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn('w-full max-w-6xl mx-auto py-12 md:py-20 px-4', className)}
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              {subtitle}
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={illustrationSrc}
              alt={illustrationAlt}
              className="w-48 h-auto"
            />
          </div>
        </div>

        {/* Grid Container */}
        <motion.div
          className="rounded-xl border bg-card text-card-foreground p-6 md:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-start"
              >
                <div className="mb-3 text-pink-500">{category.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">
                  {category.title}
                </h3>
                <ul className="space-y-1.5 text-muted-foreground">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="hover:text-primary hover:underline underline-offset-2 transition-colors"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span>{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12"
          >
            <Button asChild size="lg" className="px-6">
              <a href={buttonHref}>{buttonText}</a>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    );
  },
);

FeatureGrid.displayName = 'FeatureGrid';