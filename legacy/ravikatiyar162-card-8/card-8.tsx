'use client'; // Required for framer-motion animations

import * as React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { cn } from "../_utils/cn"; // Assuming 'cn' utility from shadcn

// Props interface remains the same
interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  authorName: string;
  authorImageUrl: string;
  date: string;
  onShareClick?: () => void;
}

/**
 * An animated, responsive card component for displaying articles.
 * Uses framer-motion for hover and entry animations.
 */
const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      title,
      description,
      authorName,
      authorImageUrl,
      date,
      onShareClick,
      ...props
    },
    ref
  ) => {
    // Animation variants for the card container
    const cardVariants = {
      initial: { opacity: 0, y: 20 },
      whileInView: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeInOut' },
      },
      whileHover: {
        scale: 1.03,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.1)', // Example shadow
        transition: { duration: 0.3 },
      },
    };

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="initial"
        whileInView="whileInView"
        whileHover="whileHover"
        viewport={{ once: true, amount: 0.2 }} // Animate once when 20% is visible
        className={cn(
          'group flex max-w-2xl flex-col overflow-hidden rounded-xl bg-card shadow-sm md:flex-row',
          className
        )}
        {...props}
      >
        {/* Image Section */}
        <div className="md:w-2/5">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-6 md:w-3/5">
          <div className="flex-1">
            {/* Title */}
            <h2 className="mb-2 text-xl font-semibold leading-tight text-card-foreground">
              {title}
            </h2>
            {/* Description */}
            <p className="mb-4 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Footer Section with Author and Share Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={authorImageUrl}
                alt={authorName}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {authorName}
                </p>
                <p className="text-xs text-muted-foreground">{date}</p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={onShareClick}
              aria-label="Share article"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
);
ArticleCard.displayName = 'ArticleCard';

export { ArticleCard };