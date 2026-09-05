import React from 'react';
import { motion } from 'framer-motion';

// --- TYPE DEFINITIONS ---
// Defines the shape of a single news item object
export interface NewsItem {
  id: string | number;
  imageUrl: string;
  title: string;
  date: string;
  source: string;
  href: string;
}

// Defines the props for the main component
export interface LatestNewsCardProps {
  /** The main title for the card, e.g., "Latest News" */
  title: string;
  /** The text for the "View All" link */
  viewAllText?: string;
  /** The URL for the "View All" link */
  viewAllHref?: string;
  /** An array of news items to display */
  newsItems: NewsItem[];
}

// --- FRAMER MOTION VARIANTS ---
// Animation variants for the list container to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for each list item
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

/**
 * A responsive and theme-adaptive card component to display a list of news articles.
 * Includes animations for item loading.
 */
export const LatestNewsCard: React.FC<LatestNewsCardProps> = ({
  title,
  viewAllText = 'View all',
  viewAllHref = '#',
  newsItems,
}) => {
  return (
    <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <a
          href={viewAllHref}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          aria-label="View all news"
        >
          {viewAllText}
        </a>
      </div>

      {/* News List */}
      <motion.ul
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={`${title} list`}
      >
        {newsItems.map((item) => (
          <motion.li key={item.id} variants={itemVariants}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent"
            >
              <img
                src={item.imageUrl}
                alt={`Image for ${item.title}`}
                className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-medium leading-tight text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.date} &bull; {item.source}
                </p>
              </div>
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};