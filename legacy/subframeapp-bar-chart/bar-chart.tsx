"use client";

import * as React from "react";
import * as SubframeCore from "@subframe/core";

/**
 * IMPORTANT: Local SubframeUtils lives INSIDE this component file.
 * Provides createTwClassNames() and twClassNames instance.
 */
namespace SubframeUtils {
  export type ClassValue =
    | string
    | null
    | undefined
    | false
    | Record<string, boolean>;

  export function createTwClassNames() {
    return (...classes: ClassValue[]) =>
      classes
        .flatMap((c) => {
          if (!c) return [];
          if (typeof c === "string") return [c];
          return Object.entries(c)
            .filter(([, ok]) => !!ok)
            .map(([k]) => k);
        })
        .join(" ");
  }

  export const twClassNames = createTwClassNames();
}

export interface ComponentProps
  extends React.ComponentProps<typeof SubframeCore.BarChart> {
  stacked?: boolean;
  className?: string;
}

export const Component = React.forwardRef<
  React.ElementRef<typeof SubframeCore.BarChart>,
  ComponentProps
>(function Component({ stacked = false, className, ...otherProps }, ref) {
  return (
    <SubframeCore.BarChart
      ref={ref}
      className={SubframeUtils.twClassNames("h-80 w-full", className)}
      stacked={stacked}
      colors={["#0c6d62", "#083932", "#12a594", "#09443c", "#10b3a3", "#0b544a"]}
      dark
      {...otherProps}
    />
  );
});

// Named + default export
export default Component;
