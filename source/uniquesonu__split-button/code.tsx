import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, Edit, Trash2, Ban, RefreshCcw } from 'lucide-react';

// Note: This component requires 'framer-motion'.

// --- Internal Data Structure ---
export interface SecondaryAction {
  /** Unique key for the action. */
  key: string;
  /** The label displayed in the dropdown. */
  label: string;
  /** Icon for the menu item. */
  icon: React.ElementType;
  /** If true, the action is destructive (e.g., delete). */
  isDestructive?: boolean;
}

// --- 📦 API (Props) Definition ---
export interface MultiActionSplitButtonProps {
  /** The label for the main, primary button action. */
  primaryLabel: string;
  /** The icon for the primary button action. */
  primaryIcon?: React.ElementType;
  /** Callback for when the primary button is clicked. */
  onPrimaryClick: () => void;
  /** Array of secondary actions for the dropdown menu. */
  secondaryActions: SecondaryAction[];
  /** Callback when a secondary action is selected. */
  onSecondaryActionSelect: (key: string) => void;
  /** If true, disables both the primary button and the dropdown. */
  disabled?: boolean;
  /** Optional class name for the container. */
  className?: string;
}

/**
 * An animated split button component combining a high-priority action with a dropdown
 * of secondary actions. Ideal for maximizing efficiency on admin dashboards.
 */
const MultiActionSplitButton: React.FC<MultiActionSplitButtonProps> = ({
  primaryLabel,
  primaryIcon: PrimaryIcon = Plus,
  onPrimaryClick,
  secondaryActions,
  onSecondaryActionSelect,
  disabled = false,
  className,
}) => {
  // Framer Motion variants for the primary button click feedback
  const primaryButtonVariants = {
    tap: { scale: 0.97, transition: { duration: 0.1 } },
  };

  // Filter out any invalid items for display
  const validSecondaryActions = secondaryActions.filter(action => action.label && action.key);

  return (
    <div className={cn("inline-flex rounded-lg overflow-hidden shadow-md", className)}>
      {/* 1. Primary Action Button */}
      <motion.div
        whileTap="tap"
        variants={primaryButtonVariants}
      >
        <Button
          onClick={onPrimaryClick}
          disabled={disabled}
          className={cn(
            "h-10 rounded-r-none border-r border-primary/50 transition-colors duration-150",
            disabled && "cursor-not-allowed"
          )}
          aria-label={primaryLabel}
        >
          <PrimaryIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          {primaryLabel}
        </Button>
      </motion.div>

      {/* 2. Secondary Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            disabled={disabled || validSecondaryActions.length === 0}
            className={cn(
              "h-10 px-2 rounded-l-none border-l-0 transition-colors duration-150",
              disabled && "cursor-not-allowed"
            )}
            aria-label="More actions"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        
        {/* Framer Motion is applied to the content via the inherited context/default shadcn animation */}
        <DropdownMenuContent align="end" className="w-48 p-1">
          {validSecondaryActions.map((action, index) => {
            const ActionIcon = action.icon;
            
            // Render a separator if the key indicates it (simple method)
            if (action.key === 'separator') {
                return <DropdownMenuSeparator key={`sep-${index}`} />;
            }

            return (
              <DropdownMenuItem
                key={action.key}
                onClick={() => onSecondaryActionSelect(action.key)}
                className={cn(
                  "flex items-center cursor-pointer p-2 transition-colors duration-100",
                  action.isDestructive ? "text-red-600 focus:bg-red-500/10 focus:text-red-700 dark:text-red-400 dark:focus:text-red-300" : ""
                )}
              >
                <ActionIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};


const mockSecondaryActions: SecondaryAction[] = [
  { key: 'edit', label: 'Edit Configuration', icon: Edit },
  { key: 'clone', label: 'Clone Item', icon: Plus },
  { key: 'separator', label: '', icon: Plus }, // Placeholder for separator
  { key: 'delete', label: 'Delete Record', icon: Trash2, isDestructive: true },
];

const ExampleUsage = () => {
  const handlePrimary = () => {
    alert("Primary Action: Add New Item Triggered!");
  };

  const handleSecondary = (key: string) => {
    alert(`Secondary Action Triggered: ${key}`);
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-lg mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Split Action Button Demo</h3>
      
      <div className="flex justify-center">
        <MultiActionSplitButton
          primaryLabel="Add New Item"
          onPrimaryClick={handlePrimary}
          secondaryActions={mockSecondaryActions}
          onSecondaryActionSelect={handleSecondary}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <MultiActionSplitButton
          primaryLabel="Update Status"
          primaryIcon={Edit}
          onPrimaryClick={() => alert("Status Updated!")}
          secondaryActions={[
              { key: 'pause', label: 'Pause Service', icon: Ban }, // Ban from lucide-react
              { key: 'reboot', label: 'Reboot Server', icon: RefreshCcw } // RefreshCcw from lucide-react
          ]}
          onSecondaryActionSelect={handleSecondary}
          disabled={false}
          className="shadow-xl"
        />
      </div>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Click the left side for the primary action or the right side for the menu.
      </p>
    </div>
  );
};

export default ExampleUsage; 