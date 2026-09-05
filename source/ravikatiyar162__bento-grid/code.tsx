import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * BentoGrid is a responsive grid container that arranges its children in a bento-style layout.
 * It uses CSS Grid and is configured to adapt to different screen sizes.
 */
const BentoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
BentoGrid.displayName = "BentoGrid";

/**
 * BentoGridItem is a flexible component designed to be a child of BentoGrid.
 * It provides a consistent structure with a header, title, and description,
 * and now includes a subtle scaling effect on hover.
 */
interface BentoGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}

const BentoGridItem = React.forwardRef<HTMLDivElement, BentoGridItemProps>(
  ({ className, title, description, header, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        {/* Header content, now perfect for images */}
        <div className="flex h-full min-h-[6rem] flex-1 overflow-hidden rounded-md bg-muted">
            {header}
        </div>

        {/* Title and description */}
        <div className="transition-transform duration-200 group-hover:translate-x-1">
          <div className="font-sans text-sm font-bold text-card-foreground">
            {title}
          </div>
          <p className="font-sans text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    );
  }
);
BentoGridItem.displayName = "BentoGridItem";

export { BentoGrid, BentoGridItem };
