import React from 'react';
import { Button } from "./button";
import { cn } from "../_utils/cn"; // Assumes shadcn's utility for class merging
import { FileText, PlusCircle } from 'lucide-react';
import { Search, FolderOpen, AlertTriangle } from 'lucide-react';

// Define the icon type. Using React.ElementType for flexibility.
type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

// --- 📦 API (Props) Definition ---
export interface EmptyStateProps {
  /** The primary title of the empty state (e.g., "No Documents Found"). */
  title: string;
  /** The detailed descriptive message. */
  message: string;
  /** Optional label for the primary action button. */
  actionLabel?: string;
  /** Optional icon for the primary action button. Defaults to PlusCircle. */
  actionIcon?: IconType;
  /** Callback function when the primary action button is clicked. */
  onActionClick?: () => void;
  /** The main icon to display prominently in the empty state. Defaults to FileText. */
  mainIcon?: IconType;
  /** Optional class name for the container div. */
  className?: string;
}

/**
 * A professional, accessible, and responsive component for indicating the absence of data.
 * It guides the user with a clear message and an optional call-to-action.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  actionIcon: ActionIcon = PlusCircle, // Default to PlusCircle
  onActionClick,
  mainIcon: MainIcon = FileText, // Default to FileText
  className,
}) => {
  const showAction = actionLabel && onActionClick;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 md:p-16 border-2 border-dashed border-border rounded-lg bg-card transition-colors duration-200",
        className
      )}
      role="status" // ARIA role to indicate status information
      aria-live="polite"
    >
      {/* Main Icon */}
      <div className="mb-4 p-3 rounded-full bg-muted text-muted-foreground border border-border">
        <MainIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>

      {/* Message */}
      <p className="max-w-md text-sm text-muted-foreground mb-6">{message}</p>

      {/* Action Button (Optional) */}
      {showAction && (
        <Button
          onClick={onActionClick}
          className="transition-shadow duration-200 hover:shadow-md"
          aria-label={actionLabel}
        >
          <ActionIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// export default EmptyState;


const ExampleUsage = () => {
  return (
    <div className="p-8 bg-background flex flex-col gap-8">
      {/* Example 1: Standard Empty State (No Content) */}
      <EmptyState
        title="No Reports Generated Yet"
        message="It looks like you haven't run any analysis reports. Click the button below to start your first financial summary."
        actionLabel="Generate First Report"
        onActionClick={() => console.log("Action: Generate Report")}
        mainIcon={FolderOpen}
        className="max-w-3xl mx-auto"
      />

      {/* Example 2: Search Empty State */}
      <EmptyState
        title="No Results Found"
        message="We couldn't find any items matching your search criteria. Try simplifying your query or checking your spelling."
        mainIcon={Search}
        className="max-w-xl mx-auto"
      />

      {/* Example 3: Error/Configuration Empty State (No Action) */}
      <EmptyState
        title="Configuration Required"
        message="The system is not yet configured with a data source. Please contact your administrator to set up the connection."
        mainIcon={AlertTriangle}
        className="max-w-2xl mx-auto"
      />
    </div>
  );
};

export default ExampleUsage;