import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Tag, X, Filter } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Note: This component requires 'framer-motion'.

// --- 📦 API (Props) Definition ---
export interface FilterTag {
  /** A unique key used to identify and remove the filter. */
  key: string;
  /** The displayed label of the filter (e.g., "Status: Active"). */
  label: string;
  /** Optional icon to display inside the tag. */
  icon?: React.ElementType;
}

export interface FilterTagContainerProps {
  /** Array of currently active filter tags. */
  activeFilters: FilterTag[];
  /** Callback function when a single filter is dismissed. Receives the key of the filter to remove. */
  onDismissFilter: (key: string) => void;
  /** Callback function to clear all filters. */
  onClearAll: () => void;
  /** Optional class name for the container. */
  className?: string;
}

/**
 * An animated container for displaying and managing active filter tags.
 * Uses Framer Motion for smooth adding/removing of individual tags.
 */
const FilterTagContainer: React.FC<FilterTagContainerProps> = ({
  activeFilters,
  onDismissFilter,
  onClearAll,
  className,
}) => {
  const hasFilters = activeFilters.length > 0;

  // Framer Motion variants for tags
  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -10 },
    visible: { opacity: 1, scale: 1, x: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  if (!hasFilters) {
    return (
      <div className={cn(
        "flex items-center space-x-2 text-sm text-muted-foreground p-2",
        className
      )}>
        <Filter className="h-4 w-4" aria-hidden="true" />
        <span>No active filters applied.</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 p-2 sm:p-3 border-y bg-card/50 transition-colors duration-200",
        className
      )}
      role="group"
      aria-label="Active Filters"
    >
      <span className="text-sm font-medium text-foreground mr-2 flex items-center space-x-1">
        <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
        <span>Filters:</span>
      </span>

      <AnimatePresence>
        {activeFilters.map((filter) => {
          const TagIcon = filter.icon || Tag;

          return (
            <motion.div
              key={filter.key}
              variants={tagVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout // Enables smooth position adjustment of remaining tags
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Badge
                variant="secondary"
                className="flex items-center text-sm font-medium pr-1 cursor-pointer transition-colors duration-150 hover:bg-muted-foreground/20"
                onClick={() => onDismissFilter(filter.key)}
                aria-label={`Remove filter: ${filter.label}`}
              >
                <TagIcon className="h-3 w-3 mr-1 text-primary" aria-hidden="true" />
                {filter.label}
                <X className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground/80 transition-colors duration-150" aria-hidden="true" />
              </Badge>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="ml-auto h-7 text-xs text-red-500 hover:bg-red-500/10 transition-colors duration-150"
        aria-label="Clear all active filters"
      >
        Clear All
      </Button>
    </div>
  );
};


import { Clock, CheckCircle, DollarSign } from 'lucide-react';

const initialFilters: FilterTag[] = [
  { key: 'status_active', label: 'Status: Active', icon: CheckCircle },
  { key: 'priority_high', label: 'Priority: High' },
  { key: 'revenue_gt_1k', label: 'Revenue > $1k', icon: DollarSign },
  { key: 'age_7days', label: 'Age: Last 7 Days', icon: Clock },
];

const ExampleUsage = () => {
  const [filters, setFilters] = React.useState<FilterTag[]>(initialFilters);
  const [nextFilterId, setNextFilterId] = React.useState(1);

  const handleDismiss = (key: string) => {
    setFilters(filters.filter(f => f.key !== key));
  };

  const handleClearAll = () => {
    setFilters([]);
  };

  const handleAddFilter = () => {
    const newFilter: FilterTag = {
        key: `custom_${nextFilterId}`,
        label: `Custom Filter ${nextFilterId}`,
        icon: Filter,
    };
    setFilters(prev => [...prev, newFilter]);
    setNextFilterId(prev => prev + 1);
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-5xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-4">Data Filter Management</h3>
      
      <FilterTagContainer
        activeFilters={filters}
        onDismissFilter={handleDismiss}
        onClearAll={handleClearAll}
      />

      <div className="mt-4 flex gap-3">
        <Button onClick={handleAddFilter} variant="outline" size="sm">
            Add Custom Filter
        </Button>
        <Button onClick={() => setFilters(initialFilters)} size="sm" disabled={filters.length === initialFilters.length}>
            Reset Filters
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Click any filter tag to dismiss it, or click "Clear All." Observe the smooth animation.
      </p>
    </div>
  );
};

export default ExampleUsage;