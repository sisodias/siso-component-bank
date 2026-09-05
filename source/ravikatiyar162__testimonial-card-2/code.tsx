import React from 'react';
import { cn } from '@/lib/utils'; // Your utility for merging Tailwind classes

// Define the props for the component for type safety and reusability
export interface QuoteDisplayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImageSrc: string;
}

const QuoteDisplayCard = React.forwardRef<HTMLDivElement, QuoteDisplayCardProps>(
  ({ className, quote, authorName, authorTitle, authorImageSrc, ...props }, ref) => {
    return (
      // The 'group' class enables hover effects on child elements
      <div
        ref={ref}
        className={cn('group relative w-full max-w-xl lg:max-w-3xl', className)}
        {...props}
      >
        {/* Quote Block */}
        <div 
          className="relative rounded-2xl bg-[#4a5c78] text-primary-foreground shadow-lg
                     w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] ml-auto 
                     p-6 pl-12 sm:p-8 sm:pl-16 lg:p-12 lg:pl-24"
        >
          {/* Decorative quotation mark */}
          <span className="pointer-events-none absolute top-4 right-6 sm:top-6 sm:right-8 text-[8rem] font-bold leading-none text-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            “
          </span>
          
          <blockquote className="relative z-10 text-base sm:text-lg leading-relaxed">
            {quote}
          </blockquote>
          
          <footer className="relative z-10 mt-6">
            <cite className="not-italic">
              <div className="text-sm font-bold uppercase tracking-wider text-white">
                {authorName}
              </div>
              <div className="text-xs text-white/70">{authorTitle}</div>
            </cite>
          </footer>
        </div>

        {/* Author Image Block (Absolutely positioned to overlap) */}
        <div 
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hover:-left-5
                     h-48 w-24 sm:h-64 sm:w-32 lg:h-80 lg:w-40 
                     p-2 shadow-2xl bg-[#401C18] 
                     rounded-[16px] transition-all duration-500 ease-in-out group-hover:rounded-2xl"
        >
          <img
            src={authorImageSrc}
            alt={`Portrait of ${authorName}`}
            className="h-full w-full rounded-lg object-cover transition-all duration-500 ease-in-out group-hover:rounded-lg"
          />
        </div>
      </div>
    );
  }
);

QuoteDisplayCard.displayName = 'QuoteDisplayCard';

export { QuoteDisplayCard };