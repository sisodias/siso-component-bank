import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn/ui

// Define variants for the badge using cva
const statusBadgeVariants = cva(
  "inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        draft:
          "border border-dashed bg-secondary text-secondary-foreground hover:bg-muted",
        "in-progress":
          "border border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400",
        "in-review":
          "border border-transparent bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400",
        completed:
          "border border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400",
      },
    },
    defaultVariants: {
      status: "draft",
    },
  }
);

// Define props interface, extending cva variants
export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  // The 'status' prop is inherited from cva
}

// Define data for each status: icon and label
const statusData = {
  draft: {
    label: "Draft",
    icon: (
      <svg
        className="h-3 w-3"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="2"
        stroke="currentColor"
        strokeDasharray="3 3"
      >
        <circle cx="8" cy="8" r="7" />
      </svg>
    ),
  },
  "in-progress": {
    label: "In-progress",
    icon: (
      <svg
        className="h-3 w-3 animate-spin text-amber-500 dark:text-amber-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ),
  },
  "in-review": {
    label: "In-review",
    icon: (
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
  },
  completed: {
    label: "Completed",
    icon: (
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
      </svg>
    ),
  },
};

// The StatusBadge component
const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, ...props }, ref) => {
    // Fallback to 'draft' if status is null or undefined
    const currentStatus = status || 'draft';
    const { icon, label } = statusData[currentStatus];

    return (
      <div
        className={cn(statusBadgeVariants({ status }), className)}
        ref={ref}
        {...props}
      >
        {icon}
        <span className="font-semibold">{label}</span>
      </div>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };