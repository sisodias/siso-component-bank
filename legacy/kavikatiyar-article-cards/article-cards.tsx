import React from 'react';
import { cn } from "../_utils/cn"; // Assuming you have a clsx/tailwind-merge utility

/**
 * Props for the ArticleCard component.
 */
interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The category of the article (e.g., 'FOOD', 'ARCHITECTURE'). */
  category: string;
  /** The main title of the article. */
  title: string;
  /** The price to read the article. */
  price: number;
  /** The URL for the background image. */
  imageUrl: string;
  /** The gradient classes for the overlay, e.g., 'from-cyan-500 to-blue-500'. */
  gradient: string;
}

export const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  ({ category, title, price, imageUrl, gradient, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex h-80 cursor-pointer flex-col justify-between overflow-hidden rounded-xl bg-cover bg-center p-6 text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:shadow-2xl',
          className
        )}
        style={{ backgroundImage: `url(${imageUrl})` }}
        {...props}
      >
        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t opacity-70 transition-opacity duration-300 group-hover:opacity-80',
            gradient
          )}
        />
        
        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          {/* Top Section: Category */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest opacity-80">
              {category}
            </p>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          
          {/* Bottom Section: Read Button */}
          <div className="self-start">
            <span
              className={cn(
                'rounded-md bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30'
              )}
            >
              Read for ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ArticleCard.displayName = 'ArticleCard';