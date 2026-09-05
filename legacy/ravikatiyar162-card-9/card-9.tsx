import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming you have a cn utility from shadcn

// Define the type for a single sentiment data point
export interface SentimentData {
  label: string;
  value: number;
  color: string; // e.g., 'bg-green-500' or a custom theme color
  icon: React.ReactNode;
}

// Define the props for the main component
export interface SentimentAnalysisCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  overallSentiment: string;
  overallSentimentIcon?: React.ReactNode;
  data: SentimentData[];
}

const SentimentAnalysisCard = React.forwardRef<HTMLDivElement, SentimentAnalysisCardProps>(
  ({ title, overallSentiment, overallSentimentIcon, data, className, ...props }, ref) => {
    
    // Calculate the total value to determine percentages
    const totalValue = React.useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

    return (
      <div
        ref={ref}
        className={cn(
          'w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-sm p-6',
          className
        )}
        aria-labelledby="sentiment-card-title"
        role="region"
        {...props}
      >
        {/* Card Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 id="sentiment-card-title" className="text-lg font-semibold text-card-foreground">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm font-medium text-green-500">
            {overallSentimentIcon}
            <span>{overallSentiment}</span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div 
          className="relative w-full h-4 flex overflow-hidden rounded-full bg-muted mb-4"
          role="progressbar"
          aria-label={`Sentiment distribution: ${data.map(d => `${d.label} ${((d.value / totalValue) * 100).toFixed(0)}%`).join(', ')}`}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {data.map((item, index) => {
            const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
            return (
              <motion.div
                key={index}
                className={cn('h-full', item.color)}
                initial={{ width: '0%' }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut', delay: index * 0.1 }}
                style={{
                  // Add a subtle border between segments for better visual separation
                  borderRight: index < data.length - 1 ? '2px solid hsl(var(--card))' : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-start items-center gap-6 text-sm text-muted-foreground">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

SentimentAnalysisCard.displayName = 'SentimentAnalysisCard';

export { SentimentAnalysisCard };