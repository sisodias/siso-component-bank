import * as React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a `cn` utility for merging Tailwind classes

// Define the types for the component props for type safety and clarity
export interface Avatar {
  src: string;
  alt: string;
}

export interface PaymentSummaryCardProps {
  /** The main title of the card, e.g., "Payment Templates" */
  title: string;
  /** The primary numerical value to display */
  amount: number;
  /** The currency symbol, defaults to '$' */
  currency?: string;
  /** The title for the interactive sub-card */
  subCardTitle: string;
  /** The subtitle or description for the sub-card */
  subCardSubtitle: string;
  /** An array of avatar objects to display */
  avatars: Avatar[];
  /** The number to display in the "+N" circle */
  moreCount?: number;
  /** A callback function to execute when the sub-card is clicked */
  onSubCardClick?: () => void;
  /** Optional additional class names for custom styling */
  className?: string;
}

/**
 * A card component for displaying a financial summary with an interactive sub-section.
 * It is fully responsive and theme-adaptive using shadcn/ui variables.
 */
export const PaymentSummaryCard = React.forwardRef<
  HTMLDivElement,
  PaymentSummaryCardProps
>(({
  title,
  amount,
  currency = '$',
  subCardTitle,
  subCardSubtitle,
  avatars,
  moreCount,
  onSubCardClick,
  className,
}, ref) => {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === 'Enter' || event.key === ' ') && onSubCardClick) {
      event.preventDefault();
      onSubCardClick();
    }
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        'w-full max-w-sm rounded-2xl bg-card p-6 text-card-foreground shadow-lg',
        className
      )}
    >
      {/* Main Card Header */}
      <h2 className="text-lg font-medium text-muted-foreground">{title}</h2>
      
      {/* Main Amount Display */}
      <p className="mt-2 text-5xl font-bold tracking-tight">
        {currency}
        {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>

      {/* Interactive Sub-Card */}
      <div
        role="button"
        tabIndex={0}
        onClick={onSubCardClick}
        onKeyDown={handleKeyDown}
        className="group mt-8 cursor-pointer rounded-xl bg-muted/50 p-4 transition-all duration-300 ease-in-out hover:bg-muted/80 hover:shadow-md"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-card-foreground">{subCardTitle}</p>
            <p className="text-sm text-muted-foreground">{subCardSubtitle}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background transition-transform duration-300 group-hover:scale-110">
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Avatar Stack */}
        <div className="mt-4 flex items-center">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar.src}
              alt={avatar.alt}
              className="h-10 w-10 rounded-full border-2 border-background object-cover"
              style={{ marginLeft: index > 0 ? '-12px' : 0 }}
            />
          ))}
          {moreCount && moreCount > 0 && (
            <div
              className="ml-[-12px] flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-sm font-semibold text-primary-foreground"
            >
              +{moreCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PaymentSummaryCard.displayName = 'PaymentSummaryCard';