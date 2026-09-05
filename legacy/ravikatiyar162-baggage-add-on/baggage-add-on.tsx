import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "../_utils/cn"; // Your shadcn/ui utility for class merging
import { MoreHorizontal } from 'lucide-react';

// Type for a single option
export interface Option {
  id: string;
  icon: React.ReactNode;
  label: string;
  price: number;
}

// Props for the component
export interface MinimalistOptionSelectorProps {
  options: Option[];
  title?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
  priceCurrency?: string;
}

export const MinimalistOptionSelector = React.forwardRef<HTMLDivElement, MinimalistOptionSelectorProps>(
  (
    {
      options,
      title = 'Additional Baggage',
      defaultValue,
      onValueChange,
      className,
      priceCurrency = '$',
      ...props
    },
    ref
  ) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue);

    const handleSelectionChange = (id: string) => {
      setSelectedValue(id);
      if (onValueChange) {
        onValueChange(id);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full h-full max-w-sm rounded-2xl border bg-card text-card-foreground shadow-sm p-6',
          className
        )}
        role="radiogroup"
        aria-labelledby="option-selector-title"
        {...props}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 id="option-selector-title" className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <button className="text-muted-foreground transition-colors hover:text-foreground">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {options.map((option) => {
            const isSelected = selectedValue === option.id;
            return (
              <label
                key={option.id}
                className="relative flex items-center p-3.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50"
                htmlFor={option.id}
              >
                {/* Subtle background animation */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      layoutId="minimalist-selected-highlight"
                      className="absolute inset-0 bg-muted rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    />
                  )}
                </AnimatePresence>

                <input
                  type="radio"
                  id={option.id}
                  name="minimalist-option"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleSelectionChange(option.id)}
                  className="sr-only"
                />
                
                <div className="relative z-10 flex items-center gap-4 w-full">
                    <div className="text-foreground">{option.icon}</div>
                    <span className="text-sm font-medium text-foreground">{option.label}</span>
                    <span className={cn(
                        "ml-auto text-sm font-medium", 
                        isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>
                        {priceCurrency}{option.price}
                    </span>
                </div>

                {/* Minimalist Radio Button Visual */}
                <div className="relative z-10 ml-4 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground transition-colors">
                  <AnimatePresence>
                    {isSelected && (
                       <motion.div
                         className="absolute inset-0 rounded-full bg-foreground border-foreground flex items-center justify-center"
                         initial={{ scale: 0.5, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         exit={{ scale: 0.5, opacity: 0 }}
                         transition={{ duration: 0.2, ease: 'easeInOut' }}
                       >
                         {/* Inner white dot */}
                         <div className="h-1.5 w-1.5 rounded-full bg-background"/>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
);

MinimalistOptionSelector.displayName = 'MinimalistOptionSelector';