import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, CloudLightning, RefreshCcw, Settings, Terminal, Database } from 'lucide-react';

// Define the icon type.
type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

// --- 📦 API (Props) Definition ---
export interface QuickActionItem {
  /** A unique key for the action. */
  key: string;
  /** The icon representing the action. */
  icon: IconType;
  /** The title of the action (e.g., "Add New User"). */
  title: string;
  /** A brief description of what the action does. */
  description: string;
  /** Callback function when the action card is clicked. */
  onClick: (key: string) => void;
  /** If true, the action is currently disabled. */
  disabled?: boolean;
}

export interface QuickActionButtonPanelProps {
  /** Array of quick action items to display. */
  actions: QuickActionItem[];
  /** Optional title for the panel section. */
  panelTitle?: string;
  /** Optional class name for the main container. */
  className?: string;
}

/**
 * A professional, animated grid of quick action buttons for an admin dashboard.
 * Uses Cards and Framer Motion for clear visual hierarchy and excellent click feedback.
 */
const QuickActionButtonPanel: React.FC<QuickActionButtonPanelProps> = ({
  actions,
  panelTitle = "Quick Actions",
  className,
}) => {
  // Framer Motion variants for enhanced click and hover feedback
  const cardVariants = {
    hover: { y: -3, boxShadow: "0 8px 12px -5px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06)" },
    tap: { scale: 0.98, boxShadow: "0 4px 6px -3px rgb(0 0 0 / 0.05)" },
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-xl font-semibold text-foreground">{panelTitle}</h3>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="list">
        {actions.map((action) => (
          <motion.div
            key={action.key}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            role="listitem"
            className={cn(
                "relative h-full",
                action.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={() => !action.disabled && action.onClick(action.key)}
            aria-disabled={action.disabled}
          >
            <Card className={cn(
                "flex flex-col h-full transition-all duration-200 p-4 border-2 hover:border-primary/50",
                action.disabled && "hover:border-border" // Ensure disabled state doesn't show hover color
            )}>
              <CardHeader className="flex flex-row items-start justify-between p-0 pb-3">
                <div className={cn(
                    "p-2 rounded-lg transition-colors duration-200",
                    action.disabled ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                )}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                {/* Optional: Add a subtle status badge here if needed */}
              </CardHeader>
              <CardContent className="flex-grow p-0 space-y-1">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {action.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {action.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


// --- Example Usage Snippet ---

const handleAction = (key: string) => {
    alert(`Action triggered: ${key}`);
    // In a real app, this would dispatch a global event or navigate
};

const mockActions: QuickActionItem[] = [
  {
    key: "add_user",
    icon: UserPlus,
    title: "Add New User",
    description: "Create a new account and assign roles/permissions.",
    onClick: handleAction,
  },
  {
    key: "clear_cache",
    icon: CloudLightning,
    title: "Clear CDN Cache",
    description: "Instantly purge all cached static assets for a fresh load.",
    onClick: handleAction,
  },
  {
    key: "run_sync",
    icon: RefreshCcw,
    title: "Force Data Sync",
    description: "Manually trigger the full synchronization job now.",
    onClick: handleAction,
    disabled: false,
  },
  {
    key: "edit_settings",
    icon: Settings,
    title: "Global Settings",
    description: "Access and modify core platform configurations.",
    onClick: handleAction,
  },
  {
    key: "db_backup",
    icon: Database,
    title: "Database Backup",
    description: "Initiate an immediate full backup of the production database.",
    onClick: handleAction,
    disabled: true, // Example of a disabled action
  },
  {
    key: "terminal",
    icon: Terminal,
    title: "System Console",
    description: "Access the secure terminal for advanced diagnostics.",
    onClick: handleAction,
  },
];

const ExampleUsage = () => {
  return (
    <div className="p-8 bg-background border rounded-lg max-w-7xl mx-auto shadow-md">
      <QuickActionButtonPanel actions={mockActions} />
      <p className="mt-6 text-sm text-muted-foreground">
        Note: The 'Database Backup' action is disabled for demonstration purposes.
      </p>
    </div>
  );
};

export default ExampleUsage;