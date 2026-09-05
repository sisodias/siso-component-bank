import * as React from 'react';
import { cn } from '@/lib/utils'; // Assuming a standard shadcn setup

/**
 * Props for the VisionCard component.
 */
export interface VisionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The main title text to display on the card.
   */
  title: string;
  /**
   * The URL of the background image.
   */
  imageUrl: string;
  /**
   * The alternative text for the background image, for accessibility.
   */
  imageAlt: string;
  /**
   * The direction of the text and gradient overlay.
   * @default 'left'
   */
  direction?: 'left' | 'right';
}

const VisionCard = React.forwardRef<HTMLDivElement, VisionCardProps>(
  ({ className, title, imageUrl, imageAlt, direction = 'left', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'group relative flex h-52 w-full max-w-2xl items-center overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm',
          // Transitions
          'transition-shadow hover:shadow-lg',
          className
        )}
        {...props}
      >
        {/* Background Image with Hover Animation */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Gradient Overlay for Text Readability */}
        <div
          className={cn(
            'absolute inset-0 z-10 from-card via-card/80 to-transparent',
            direction === 'left' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'
          )}
        />

        {/* Text Content */}
        <div
          className={cn(
            'relative z-20 flex h-full w-2/3 items-center p-6 md:w-1/2 md:p-8',
            direction === 'left' ? 'justify-start' : 'justify-end'
          )}
        >
          <h2 className={cn(
            'text-2xl font-semibold tracking-tight md:text-3xl',
            // Align text based on direction
            direction === 'right' ? 'text-right' : 'text-left'
          )}>
            {title}
          </h2>
        </div>
      </div>
    );
  }
);
VisionCard.displayName = 'VisionCard';

export { VisionCard };