import React from 'react';
import { ChevronDown, Check, Filter as FilterIcon } from 'lucide-react';
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty } from "./command";
import { Separator } from "./separator";
import { cn } from "../_utils/cn"; // Assumes shadcn's utility for class merging

// --- 📦 API (Props) Definition ---

export interface FilterOption {
  /** Unique key for the filter option. */
  value: string;
  /** Display label for the filter option. */
  label: string;
  /** Optional icon for the filter option. */
  icon?: React.ElementType;
}

export interface DataTableFilterProps {
  /** The descriptive label for the filter (e.g., "Status", "Priority"). */
  label: string;
  /** Array of available filter options. */
  options: FilterOption[];
  /** The currently selected filter value(s). Can be a single string or an array for multi-select. */
  selectedValues: string | string[];
  /** Callback function when the selection changes. */
  onChange: (newValues: string[]) => void;
  /** If true, allows multiple options to be selected. */
  isMultiSelect?: boolean;
  /** Optional class name for the trigger button. */
  className?: string;
}

/**
 * A professional, accessible, and responsive filter component for data tables.
 * Uses shadcn/ui and Tailwind for minimal, monochrome design with light/dark theme support.
 */
const DataTableFilter: React.FC<DataTableFilterProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  isMultiSelect = false,
  className,
}) => {
  const currentValues = Array.isArray(selectedValues) ? selectedValues : (selectedValues ? [selectedValues] : []);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    let newValues: string[] = [];

    if (isMultiSelect) {
      // Toggle selection for multi-select
      if (currentValues.includes(value)) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
    } else {
      // Single select: toggle or set new value
      newValues = currentValues.includes(value) ? [] : [value];
      setOpen(false); // Close popover on single-select change
    }
    
    onChange(newValues);
  };

  const getButtonText = () => {
    if (currentValues.length === 0) {
      return label;
    }
    
    if (currentValues.length === 1) {
      return options.find(o => o.value === currentValues[0])?.label || label;
    }
    
    return `${label} (${currentValues.length} selected)`;
  };

  const isAllSelected = currentValues.length === options.length;
  const isNoneSelected = currentValues.length === 0;

  const handleClear = () => {
    onChange([]);
    if (!isMultiSelect) {
      setOpen(false);
    }
  }
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(options.map(o => o.value));
    }
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed transition-colors duration-150 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            currentValues.length > 0 && "bg-accent border-solid",
            className
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={`Filter by ${label}. Current selection: ${getButtonText()}`}
        >
          <FilterIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="font-medium text-sm">{getButtonText()}</span>
          <ChevronDown className="ml-2 h-3 w-3 opacity-70" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="start">
        <Command>
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = currentValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          
          {(isMultiSelect || currentValues.length > 0) && (
            <>
              <Separator />
              <div className="flex items-center justify-between p-1">
                {isMultiSelect && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAll}
                        className="w-1/2 h-7 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        {isAllSelected ? "Deselect All" : "Select All"}
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={isNoneSelected}
                    className={cn(
                        "h-7 text-xs text-red-500 hover:bg-red-500/10 transition-colors",
                        isMultiSelect ? "w-1/2" : "w-full"
                    )}
                >
                    Clear Filter
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};


// --- Example Usage Snippet ---

import { Zap, Clock, Ban } from 'lucide-react';

const StatusOptions: FilterOption[] = [
  { value: "active", label: "Active", icon: Zap },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "deactivated", label: "Deactivated", icon: Ban },
];

const PriorityOptions: FilterOption[] = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
];

const ExampleUsage = () => {
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = React.useState<string>("");

  return (
    <div className="flex flex-wrap gap-4 p-8 bg-background border rounded-lg max-w-4xl mx-auto">
      <h3 className="w-full text-lg font-semibold text-foreground mb-2">Filter Controls</h3>
      
      {/* Example 1: Multi-Select Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">Status:</span>
        <DataTableFilter
          label="Status"
          options={StatusOptions}
          selectedValues={selectedStatus}
          onChange={setSelectedStatus}
          isMultiSelect
        />
      </div>

      {/* Example 2: Single-Select Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">Priority:</span>
        <DataTableFilter
          label="Priority"
          options={PriorityOptions}
          selectedValues={selectedPriority}
          onChange={(values) => setSelectedPriority(values[0] || "")} // Convert array back to single string
        />
      </div>
      
      <div className="w-full mt-4 p-3 bg-muted rounded-md text-sm text-muted-foreground">
          <p>Current Status Filter: <strong className="text-foreground">{selectedStatus.length > 0 ? selectedStatus.join(", ") : "None"}</strong></p>
          <p>Current Priority Filter: <strong className="text-foreground">{selectedPriority || "None"}</strong></p>
      </div>
    </div>
  );
};

export default ExampleUsage;