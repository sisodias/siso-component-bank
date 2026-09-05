import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

/**
 * @typedef EmptyStateProps
 * @property {string} iconSrc - The URL of the icon/image to display.
 * @property {string} title - The main heading text.
 * @property {React.ReactNode} description - The descriptive text below the title.
 * @property {string | number} [badgeContent] - Optional content for the notification badge.
 * @property {boolean} [showBadge=false] - Whether to show the notification badge.
 * @property {string} [className] - Optional additional class names for the container.
 * @property {string} [imageClassName] - Optional class names for the image container, e.g., to apply animations.
 */
interface EmptyStateProps {
  iconSrc: string;
  title: string;
  description: React.ReactNode;
  badgeContent?: string | number;
  showBadge?: boolean;
  className?: string;
  imageClassName?: string;
}

/**
 * A reusable component for displaying an empty state.
 * It is theme-adaptive and responsive.
 * @param {EmptyStateProps} props - The props for the component.
 */
export function EmptyState({
  iconSrc,
  title,
  description,
  badgeContent,
  showBadge = false,
  className,
  imageClassName,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center space-y-6 text-center p-8",
        className
      )}
    >
      {/* Image and Badge Container */}
      <div className={cn("relative", imageClassName)}>
        <img
          src={iconSrc}
          alt="Empty state icon"
          width={120}
          height={120}
          className="h-32 w-32 object-contain text-muted-foreground"
        />
        {showBadge && (
          <span
            className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-background"
            aria-label={`Notification count: ${badgeContent}`}
          >
            {badgeContent}
          </span>
        )}
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}