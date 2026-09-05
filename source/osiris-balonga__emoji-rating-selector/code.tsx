"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EmojiOption {
  value: number | string;
  image: string;
  label: string;
}

export interface EmojiRatingSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: EmojiOption[];
  value?: number | string;
  onChange: (value: number | string) => void;
  defaultImage?: string;
  defaultLabel?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  disabled?: boolean;
}

const sizeConfig = {
  sm: {
    mainSize: 64,
    optionSize: 32,
    label: "text-xs",
    optionButton: "w-10 h-10",
    gap: "gap-1",
  },
  md: {
    mainSize: 96,
    optionSize: 40,
    label: "text-sm",
    optionButton: "w-14 h-14",
    gap: "gap-2",
  },
  lg: {
    mainSize: 128,
    optionSize: 52,
    label: "text-base",
    optionButton: "w-18 h-18",
    gap: "gap-3",
  },
};

const EmojiRatingSelector = React.forwardRef<
  HTMLDivElement,
  EmojiRatingSelectorProps
>(
  (
    {
      options,
      value,
      onChange,
      defaultImage,
      defaultLabel = "Hover to choose",
      size = "md",
      showLabel = true,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [hoveredValue, setHoveredValue] = React.useState<
      number | string | null
    >(null);

    const config = sizeConfig[size];

    const fallbackImage = defaultImage || options[Math.floor(options.length / 2)]?.image;

    const displayOption = React.useMemo(() => {
      const activeValue = hoveredValue ?? value;
      if (activeValue !== null && activeValue !== undefined) {
        const found = options.find((opt) => opt.value === activeValue);
        if (found) return found;
      }
      return { image: fallbackImage, label: defaultLabel, value: null };
    }, [hoveredValue, value, options, fallbackImage, defaultLabel]);

    const handleSelect = (optionValue: number | string) => {
      if (disabled) return;
      onChange(optionValue);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative"
            style={{ width: config.mainSize, height: config.mainSize }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={displayOption.image}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="absolute inset-0"
              >
                <img
                  src={displayOption.image}
                  alt={displayOption.label}
                  width={config.mainSize}
                  height={config.mainSize}
                  className="select-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {showLabel && (
            <AnimatePresence mode="wait">
              <motion.p
                key={displayOption.label}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  config.label,
                  "text-muted-foreground mt-3 font-medium"
                )}
              >
                {displayOption.label}
              </motion.p>
            </AnimatePresence>
          )}
        </div>

        <div
          className={cn("relative flex items-center", config.gap)}
          onMouseLeave={() => setHoveredValue(null)}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            const isHovered = hoveredValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHoveredValue(option.value)}
                onFocus={() => setHoveredValue(option.value)}
                onBlur={() => setHoveredValue(null)}
                disabled={disabled}
                className={cn(
                  "relative rounded-full flex items-center justify-center transition-transform duration-150",
                  config.optionButton,
                  "hover:scale-110 active:scale-95",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
                aria-label={option.label}
                aria-pressed={isSelected}
              >
                {(isHovered || isSelected) && (
                  <motion.div
                    layoutId="emoji-rating-bg"
                    className={cn(
                      "absolute inset-0 rounded-full",
                      isSelected
                        ? "bg-primary/20 ring-2 ring-primary/40"
                        : "bg-muted"
                    )}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                <img
                  src={option.image}
                  alt={option.label}
                  width={config.optionSize}
                  height={config.optionSize}
                  className={cn(
                    "relative z-10 select-none transition-all duration-200",
                    isHovered || isSelected
                      ? "grayscale-0 scale-110"
                      : "grayscale opacity-70"
                  )}
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

EmojiRatingSelector.displayName = "EmojiRatingSelector";

export { EmojiRatingSelector };
