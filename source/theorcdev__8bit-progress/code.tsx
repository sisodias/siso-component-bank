import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const progressVariants = cva("", {
  variants: {
    variant: {
      default: "",
      retro: "retro",
    },
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  className?: string;
  font?: VariantProps<typeof progressVariants>["font"];
  progressBg?: string;
  value?: number;
}

function Progress({
  className,
  font,
  variant,
  value,
  progressBg,
  ...props
}: BitProgressProps) {
  const heightMatch = className?.match(/h-(\d+|\[.*?\])/);
  const heightClass = heightMatch ? heightMatch[0] : "h-2";
  const v = value ?? 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          "bg-primary/20 relative w-full overflow-hidden",
          heightClass,
          font !== "normal" && "retro",
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all",
            variant === "retro" ? "flex w-full" : "w-full flex-1",
            variant !== "retro" && (progressBg || "bg-primary"),
          )}
          style={
            variant === "retro"
              ? undefined
              : { transform: `translateX(-${100 - v}%)` }
          }
        >
          {variant === "retro" && (
            <div className="flex w-full">
              {Array.from({ length: 20 }).map((_, i) => {
                const filledSquares = Math.round((v / 100) * 20);
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 h-full mx-[1px]",
                      i < filledSquares
                        ? progressBg || "bg-primary"
                        : "bg-transparent",
                    )}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute inset-0 border-y-4 -my-1 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 border-x-4 -mx-1 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export { Progress };

export default Progress;
