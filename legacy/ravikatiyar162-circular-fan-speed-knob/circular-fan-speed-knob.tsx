// components/ui/radial-selector.tsx
import * as React from "react"
import { cn } from "../_utils/cn"

// Define the shape of each option
interface RadialSelectorOption {
  value: string;
  label: string;
}

// Define the component's props for reusability
export interface RadialSelectorProps {
  options: RadialSelectorOption[];
  name: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const RadialSelector = React.forwardRef<HTMLDivElement, RadialSelectorProps>(
  ({ options, name, defaultValue, onValueChange, className, ...props }, ref) => {
    // State to manage the currently selected value
    const [selectedValue, setSelectedValue] = React.useState(
      defaultValue ?? (options.length > 0 ? options[0].value : "")
    );

    // Find the index of the selected option to calculate rotation
    const selectedIndex = React.useMemo(() => {
      const index = options.findIndex((opt) => opt.value === selectedValue);
      return index === -1 ? 0 : index;
    }, [selectedValue, options]);

    // Calculate the rotation degrees for the indicator dot
    const rotation = selectedIndex * (360 / options.length);

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      if (onValueChange) {
        onValueChange(value);
      }
    };
    
    // Calculate the rotation for each label
    const getLabelRotation = (index: number) => {
      return index * (360 / options.length);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-60 h-60 rounded-full bg-background select-none",
          "flex items-center justify-center",
          "shadow-inner-lg dark:shadow-inner-xl", // Custom shadow for depth
          "border-4 border-muted",
          className
        )}
        role="radiogroup" // Accessibility improvement
        {...props}
      >
        {/* Inner decorative circles for depth */}
        <div className="absolute w-[92%] h-[92%] rounded-full bg-muted shadow-lg" />
        <div className="absolute w-[60%] h-[60%] rounded-full bg-background border-2 border-border shadow-inner-md" />
        <div className="absolute w-[50%] h-[50%] rounded-full bg-accent" />


        {/* Indicator Dot */}
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-2.5 -translate-y-1/2 origin-left transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary" />
        </div>

        {/* Dynamic Options */}
        {options.map((option, index) => {
          const labelRotation = getLabelRotation(index);
          return (
            <label
              key={option.value}
              className="absolute top-1/2 left-1/2 w-1/2 h-20 -translate-y-1/2 origin-left flex items-center"
              style={{ transform: `rotate(${labelRotation}deg)` }}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleSelect(option.value)}
                className="sr-only" // Hide the actual radio button
              />
              <span
                className="absolute right-4 text-sm font-medium cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                style={{ transform: `rotate(${-labelRotation}deg)` }}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    );
  }
);

RadialSelector.displayName = "RadialSelector";

export { RadialSelector };