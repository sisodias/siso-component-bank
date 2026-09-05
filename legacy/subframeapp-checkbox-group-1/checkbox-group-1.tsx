"use client";

import * as React from "react";

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

/* -------------------- Types -------------------- */

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  error?: boolean;
  horizontal?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/* -------------------- Component -------------------- */

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  function Component(
    { label, helpText, error = false, horizontal = false, children, className, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        {...otherProps}
        className={SubframeUtils.twClassNames(
          "flex flex-col items-start gap-2",
          className
        )}
      >
        {label ? (
          <span
            className={SubframeUtils.twClassNames(
              "text-sm font-medium",
              error ? "text-red-700" : "text-zinc-900 dark:text-zinc-100"
            )}
          >
            {label}
          </span>
        ) : null}

        {children ? (
          <div
            className={SubframeUtils.twClassNames(
              // items wrapper switches layout when horizontal
              horizontal
                ? "flex flex-row flex-wrap items-center gap-4"
                : "flex flex-col items-start gap-2"
            )}
          >
            {children}
          </div>
        ) : null}

        {helpText ? (
          <span
            className={SubframeUtils.twClassNames(
              "text-xs",
              error ? "text-red-700" : "text-zinc-600 dark:text-zinc-400"
            )}
          >
            {helpText}
          </span>
        ) : null}
      </div>
    );
  }
);

// Named + default export
export default Component;
