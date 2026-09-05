import * as React from "react";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * @typedef CreditScoreCardProps
 * @property score - The numerical score to display.
 * @property [maxScore=850] - The maximum possible score for calculating progress.
 * @property [onDetailsClick] - Optional click handler for the 'Details' button.
 * @property [statusEmojiUrl] - URL for the emoji image.
 * @property [totalSegments=30] - The number of segments in the progress bar.
 */
export interface CreditScoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  maxScore?: number;
  onDetailsClick?: () => void;
  statusEmojiUrl?: string;
  totalSegments?: number;
}

// Helper function to determine the descriptive status from the score
const getScoreStatus = (score: number): string => {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Very Good";
  if (score >= 650) return "Good";
  if (score >= 600) return "Fair";
  return "Poor";
};

const CreditScoreCard = React.forwardRef<HTMLDivElement, CreditScoreCardProps>(
  (
    {
      className,
      score,
      maxScore = 850,
      onDetailsClick,
      statusEmojiUrl = "https://em-content.zobj.net/source/apple/391/smiling-face-with-sunglasses_1f60e.png",
      totalSegments = 30,
      ...props
    },
    ref
  ) => {
    // Memoize calculations for performance
    const { status, activeSegments } = React.useMemo(() => {
      const calculatedStatus = getScoreStatus(score);
      const calculatedActiveSegments = Math.round((score / maxScore) * totalSegments);
      return { status: calculatedStatus, activeSegments: calculatedActiveSegments };
    }, [score, maxScore, totalSegments]);

    // Animation variants for Framer Motion
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02 }, // Stagger animation of each bar segment
      },
    };

    const segmentVariants = {
      hidden: { opacity: 0, scaleY: 0 },
      visible: { opacity: 1, scaleY: 1, transition: { duration: 0.3, ease: "easeOut" } },
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-4",
          className
        )}
        {...props}
      >
        {/* Card Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold tracking-tight">Credit Score</h3>
          </div>
          {onDetailsClick && (
            <Button variant="outline" size="sm" onClick={onDetailsClick}>
              Details
            </Button>
          )}
        </header>

        {/* Score Display Section */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your credit score is</p>
            <p className="text-4xl font-bold tracking-tight text-foreground">{score}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This score is considered to be <span className="font-medium text-primary">{status}</span>.
            </p>
          </div>
          {statusEmojiUrl && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <img src={statusEmojiUrl} alt={`${status} score emoji`} className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Animated Progress Bar */}
        <div
          role="meter"
          aria-valuemin={0}
          aria-valuemax={maxScore}
          aria-valuenow={score}
          aria-label={`Credit score: ${score} out of ${maxScore}`}
        >
          <motion.div
            className="flex w-full gap-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={score} // Re-trigger animation when score changes
          >
            {Array.from({ length: totalSegments }).map((_, index) => (
              <motion.div
                key={index}
                variants={segmentVariants}
                className={cn("h-2.5 flex-1 rounded-full", {
                  "bg-green-500": index < activeSegments, // Status color
                  "bg-muted": index >= activeSegments,
                })}
              />
            ))}
          </motion.div>
        </div>
      </div>
    );
  }
);
CreditScoreCard.displayName = "CreditScoreCard";

export { CreditScoreCard };