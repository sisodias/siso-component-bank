import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a 'cn' utility from shadcn

// TSDoc for props documentation
export interface AudiobookCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The URL for the book cover image. */
  imageUrl: string;
  /** The main title of the audiobook. */
  title: string;
  /** The author's name. */
  author: string;
  /** The category or genre of the book. */
  category: string;
  /** The publication year. */
  year: number;
  /** The total number of pages or chapters. */
  totalPages: number;
  /** The number of pages or chapters already read. */
  pagesRead: number;
  /** A React node for the icon, e.g., from lucide-react. */
  icon: React.ReactNode;
}

const AudiobookCard = React.forwardRef<HTMLDivElement, AudiobookCardProps>(
  (
    {
      className,
      imageUrl,
      title,
      author,
      category,
      year,
      totalPages,
      pagesRead,
      icon,
      ...props
    },
    ref
  ) => {
    // Calculate progress percentage, ensuring no division by zero
    const progressPercentage = totalPages > 0 ? (pagesRead / totalPages) * 100 : 0;
    const pagesLeft = totalPages - pagesRead;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-2xl p-5 text-card-foreground shadow-lg",
          "bg-gradient-to-br from-[hsl(var(--muted)/0.4)] to-[hsl(var(--card)/0.8)] backdrop-blur-sm",
          "border border-white/10",
          className
        )}
        {...props}
      >
        {/* Main content layout */}
        <div className="flex flex-col gap-4">
          {/* Header with Icon and Image */}
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-black/20 p-2 text-white/80">
              {icon}
            </div>
            <img
              src={imageUrl}
              alt={title}
              width={96}
              height={96}
              className="h-24 w-24 rounded-lg object-cover shadow-2xl"
            />
          </div>

          {/* Book Details */}
          <div className="flex flex-col items-start">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {author} &bull; {category} &bull; {year}
            </p>
          </div>

          {/* Progress Bar Section */}
          <div className="flex flex-col gap-2">
            <div
              className="h-4 w-full rounded-full"
              // The segmented effect is created using a repeating gradient as a background
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, hsl(var(--muted-foreground)/0.3), hsl(var(--muted-foreground)/0.3) 1px, transparent 1px, transparent 11.5%)",
                backgroundSize: "100% 100%",
              }}
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                // Animate the width based on progress
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} // Smooth ease-out cubic bezier
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${title} reading progress`}
              />
            </div>
            <p className="self-end text-xs font-medium text-muted-foreground">
              {pagesLeft} left
            </p>
          </div>
        </div>
      </div>
    );
  }
);

AudiobookCard.displayName = "AudiobookCard";

export { AudiobookCard };