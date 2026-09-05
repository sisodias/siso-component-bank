import React, { useEffect } from 'react';
// FIX: Import 'animate' directly from framer-motion
import { motion, useAnimation, useInView, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- PROPS INTERFACE ---
interface GoalTrackerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The source URL for the goal's image. */
  imageUrl: string;
  /** The title or name of the goal. */
  title: string;
  /** The current amount saved or progress made. */
  currentAmount: number;
  /** The target amount for the goal. */
  goalAmount: number;
  /** The total number of segments in the progress bar. */
  totalSegments?: number;
}

// --- CURRENCY FORMATTER ---
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// --- COMPONENT DEFINITION ---
export function GoalTrackerCard({
  imageUrl,
  title,
  currentAmount,
  goalAmount,
  totalSegments = 30,
  className,
  ...props
}: GoalTrackerCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.5 });
  const controls = useAnimation();
  const mainControls = useAnimation();

  const percentage = Math.round((currentAmount / goalAmount) * 100);
  const filledSegments = Math.round((percentage / 100) * totalSegments);

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
      controls.start('visible');
    }
  }, [isInView, mainControls, controls]);

  // Animation variants for the card container
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Animation variants for the progress bar segments
  const progressBarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Stagger animation for each segment
      },
    },
  };

  const segmentVariant = {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  };

  // Custom hook for animating numbers
  const useAnimatedCounter = (to: number) => {
    const [count, setCount] = React.useState(0);
    useEffect(() => {
      if (!isInView) return;
      // FIX: Call 'animate' directly, not motion.animate
      const animation = animate(0, to, {
        duration: 1.5,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setCount(Math.round(latest));
        },
      });
      return () => animation.stop();
    }, [isInView, to]);
    return count;
  };

  const animatedPercentage = useAnimatedCounter(percentage);

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={mainControls}
      className={cn(
        'flex w-full max-w-sm items-center gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {/* Image */}
      <img
        src={imageUrl}
        alt={title}
        className="h-20 w-20 rounded-lg object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        
        {/* Animated Percentage */}
        <p className="text-4xl font-bold tracking-tight text-primary">
          {animatedPercentage}%
        </p>

        {/* Segmented Progress Bar */}
        <motion.div
          className="my-2 flex items-center gap-1"
          variants={progressBarVariants}
          initial="hidden"
          animate={controls}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} progress`}
        >
          {Array.from({ length: totalSegments }).map((_, index) => (
            <motion.div
              key={index}
              variants={segmentVariant}
              className={cn('h-2 flex-1 rounded-full', 
                index < filledSegments ? 'bg-primary' : 'bg-muted/60'
              )}
            />
          ))}
        </motion.div>

        {/* Amounts */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currencyFormatter.format(currentAmount)}</span>
          <span>{currencyFormatter.format(goalAmount)}</span>
        </div>
      </div>
    </motion.div>
  );
}