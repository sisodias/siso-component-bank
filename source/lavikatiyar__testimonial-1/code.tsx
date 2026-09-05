import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Assuming you have a `cn` utility function

// Define variants for the card using cva
const testimonialCardVariants = cva(
  'relative group w-full max-w-2xl overflow-hidden rounded-2xl p-8 shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border',
        primary: 'bg-primary text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Define the props interface for type-safety and reusability
export interface TestimonialCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof testimonialCardVariants> {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorImage: string;
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ className, variant, quote, authorName, authorTitle, authorImage, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(testimonialCardVariants({ variant, className }))}
        {...props}
      >
        {/* Decorative Quote Icon */}
        <div className="absolute top-8 left-8 text-[8rem] font-bold leading-none text-foreground/5 opacity-50 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110">
          “
        </div>
        
        <div className="relative z-10 flex h-full flex-col justify-between text-background/90">
          {/* Main Quote Text */}
          <blockquote className="text-xl font-small leading-relaxed md:text-2xl">
            {quote}
          </blockquote>
          
          {/* Author Information */}
          <footer className="mt-8 flex items-center gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[35%] bg-muted transition-all duration-300 group-hover:rounded-2xl">
              <img
                src={authorImage}
                alt={`Photo of ${authorName}`}
                className="h-full w-full object-cover"
              />
            </div>
            <cite className="not-italic">
              <div className="text-base font-bold uppercase tracking-wider">
                {authorName}
              </div>
              <div className="text-sm text-muted-foreground">
                {authorTitle}
              </div>
            </cite>
          </footer>
        </div>
      </div>
    );
  }
);

TestimonialCard.displayName = 'TestimonialCard';

export { TestimonialCard, testimonialCardVariants };