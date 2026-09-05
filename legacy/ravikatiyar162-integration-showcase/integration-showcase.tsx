// components/ui/integration-showcase.tsx

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

/**
 * Type definition for a single integration item.
 * @property {string} name - The name of the integration (e.g., "Notion").
 * @property {string} description - A brief description of the integration.
 * @property {string} iconSrc - The URL for the integration's icon.
 */
export interface Integration {
  name: string;
  description: string;
  iconSrc: string;
}

/**
 * Props for the IntegrationShowcase component.
 * @property {string} title - The main heading. Use `~` to wrap the word you want to highlight (e.g., "Connect your ~favorite~ tools").
 * @property {string} subtitle - The descriptive text below the title.
 * @property {string} illustrationSrc - The URL for the decorative illustration.
 * @property {string} illustrationAlt - Alt text for the illustration.
 * @property {Integration[]} integrations - An array of integration objects to display in the grid.
 * @property {string} [className] - Optional additional class names for the container.
 */
export interface IntegrationShowcaseProps {
  title: string;
  subtitle: string;
  illustrationSrc: string;
  illustrationAlt: string;
  integrations: Integration[];
  className?: string;
}

// Function to parse the title and wrap the highlighted word in a span
const HighlightedTitle = ({ text }: { text: string }) => {
  const parts = text.split(/~/);
  return (
    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      {parts.map((part, index) =>
        index === 1 ? (
          <span key={index} className="relative whitespace-nowrap">
            <span className="relative">{part}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute -bottom-1.5 left-0 h-auto w-full text-primary"
              preserveAspectRatio="none"
            >
              <path
                d="M203.371.916c-26.013-2.078-76.686 1.98-114.243 8.919-37.556 6.939-78.622 17.103-122.256 28.703-43.633 11.6-4.984 14.306 43.123 7.021 48.107-7.285 93.638-16.096 146.446-17.742 52.808-1.646 105.706 5.429 158.649 14.13 52.943 8.701 105.886 19.342 158.826 29.483 52.94 10.141 52.94 10.141-11.41-19.043C371.18 14.363 322.753 5.488 281.339 2.143 239.925-1.201 203.371.916 203.371.916z"
                fill="currentColor"
              />
            </svg>
          </span>
        ) : (
          part
        ),
      )}
    </h2>
  );
};

export const IntegrationShowcase = React.forwardRef<
  HTMLElement,
  IntegrationShowcaseProps
>(({ title, subtitle, illustrationSrc, illustrationAlt, integrations, className }, ref) => {
  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={ref} className={cn('w-full py-16 sm:py-24', className)}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 items-start gap-x-12 gap-y-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <HighlightedTitle text={title} />
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center justify-center lg:justify-center">
            <img 
              src={illustrationSrc} 
              alt={illustrationAlt} 
              className="w-64 h-auto object-contain"
            />
          </div>
        </div>

        {/* Integrations Grid */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible" // Can be changed to whileInView for scroll-triggered animation
          viewport={{ once: true, amount: 0.2 }}
        >
          {integrations.map((item) => (
            <motion.div key={item.name} variants={itemVariants} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={item.iconSrc} 
                  alt={`${item.name} logo`} 
                  className="h-8 w-8 object-contain" 
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

IntegrationShowcase.displayName = 'IntegrationShowcase';