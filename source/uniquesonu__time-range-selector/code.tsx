import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, subMonths, subYears } from 'date-fns';
import { CalendarIcon, Clock, XCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker'; // This type comes from 'react-day-picker'

// Note: This component requires 'framer-motion' and 'react-day-picker'.

// --- Internal Data Structures & Helpers ---
export type PresetTimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

interface PresetOption {
  value: PresetTimeRange;
  label: string;
}

const presetOptions: PresetOption[] = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' },
];

const calculatePresetDateRange = (preset: PresetTimeRange): DateRange | undefined => {
  const today = new Date();
  if (preset === '24h') return { from: subDays(today, 1), to: today };
  if (preset === '7d') return { from: subDays(today, 7), to: today };
  if (preset === '30d') return { from: subDays(today, 30), to: today };
  if (preset === '90d') return { from: subDays(today, 90), to: today };
  if (preset === '1y') return { from: subYears(today, 1), to: today };
  if (preset === 'all') return undefined; // 'All time' might mean no specific 'from' date
  return undefined;
};

// --- 📦 API (Props) Definition ---
export interface TimeRangeSelectorProps {
  /** The currently selected time range, or undefined for 'All time'. */
  selectedRange: DateRange | undefined;
  /** The currently selected preset, or 'custom' if a custom range is active. */
  activePreset: PresetTimeRange | 'custom';
  /** Callback when the time range or preset changes. */
  onRangeChange: (range: DateRange | undefined, preset: PresetTimeRange | 'custom') => void;
  /** Optional class name for the container. */
  className?: string;
  /** Optional size for the trigger button. */
  buttonSize?: "sm" | "default" | "lg" | "icon";
}

/**
 * An animated component for selecting predefined or custom time ranges.
 * Essential for dashboards displaying time-series data.
 */
const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  activePreset,
  onRangeChange,
  className,
  buttonSize = "default",
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Framer Motion variants for buttons
  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.15 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  const displayValue = useMemo(() => {
    if (activePreset !== 'custom') {
      return presetOptions.find(p => p.value === activePreset)?.label || 'Select Range';
    }
    if (selectedRange?.from) {
      const from = format(selectedRange.from, 'LLL dd, y');
      const to = selectedRange.to ? format(selectedRange.to, 'LLL dd, y') : 'Present';
      return `${from} - ${to}`;
    }
    return 'Custom Range';
  }, [selectedRange, activePreset]);

  const handlePresetChange = (value: PresetTimeRange) => {
    if (value === 'all') {
        onRangeChange(undefined, 'all');
    } else {
        onRangeChange(calculatePresetDateRange(value), value);
    }
    setIsCalendarOpen(false); // Close popover if opened through preset change
  };

  const handleCustomRangeChange = (range: DateRange | undefined) => {
    if (range?.from) { // Only update if 'from' date is selected
        onRangeChange(range, 'custom');
    } else {
        // If range is cleared (e.g. from date picker), treat as 'All time' or default
        onRangeChange(undefined, 'all'); 
    }
  };

  const handleClearCustomRange = () => {
    onRangeChange(undefined, 'all');
    setIsCalendarOpen(false);
  }

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {/* Preset Buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {presetOptions.map((option) => (
          <motion.div
            key={option.value}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant={activePreset === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetChange(option.value)}
              className="h-8 text-sm px-3"
              aria-pressed={activePreset === option.value}
            >
              {option.label}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Custom Range Picker */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant={"outline"}
              size={buttonSize}
              className={cn(
                "w-[240px] justify-start text-left font-normal transition-colors duration-150",
                !selectedRange && "text-muted-foreground",
                activePreset === 'custom' && "border-primary bg-primary/10"
              )}
              aria-label="Select custom date range"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayValue}
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from || new Date()}
            selected={selectedRange}
            onSelect={handleCustomRangeChange}
            numberOfMonths={2}
          />
          {activePreset === 'custom' && selectedRange?.from && (
            <div className="p-2 border-t flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearCustomRange}
                className="text-red-500 hover:bg-red-500/10"
                aria-label="Clear custom date range"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear Custom Range
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};


const ExampleUsage = () => {
  const [range, setRange] = useState<DateRange | undefined>(calculatePresetDateRange('7d'));
  const [preset, setPreset] = useState<PresetTimeRange | 'custom'>('7d');

  const handleRangeChange = (newRange: DateRange | undefined, newPreset: PresetTimeRange | 'custom') => {
    setRange(newRange);
    setPreset(newPreset);
    console.log(`New Range: ${newPreset}`, newRange);
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-5xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">Dashboard Time Range Selector</h3>
      
      <TimeRangeSelector
        selectedRange={range}
        activePreset={preset}
        onRangeChange={handleRangeChange}
      />

      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p>
          Currently Selected: <strong className="text-foreground">{preset.toUpperCase()}</strong>
        </p>
        <p>
          From: <strong className="text-foreground">{range?.from ? format(range.from, 'PPP') : 'N/A'}</strong>
        </p>
        <p>
          To: <strong className="text-foreground">{range?.to ? format(range.to, 'PPP') : 'N/A'}</strong>
        </p>
        <pre className="mt-3 p-2 bg-card rounded-md overflow-x-auto text-foreground">
          {JSON.stringify(range, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ExampleUsage;