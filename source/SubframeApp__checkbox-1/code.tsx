"use client";

import * as React from "react";
import * as SubframeCore from "@subframe/core";
import { FeatherCheck } from "@subframe/core";

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

export interface ComponentProps
  extends React.ComponentProps<typeof SubframeCore.Checkbox.Root> {
  label?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

/* -------------------- Component -------------------- */

export const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  function Component({ label, className, ...otherProps }, ref) {
    return (
      <SubframeCore.Checkbox.Root asChild {...otherProps}>
        <button
          ref={ref}
          className={SubframeUtils.twClassNames(
            "group flex cursor-pointer items-center gap-2 text-left",
            // disabled text color
            "enabled:text-zinc-900 dark:enabled:text-zinc-100 disabled:text-zinc-400",
            className
          )}
        >
          <div
            className={SubframeUtils.twClassNames(
              // base box
              "flex h-4 w-4 flex-none items-center justify-center rounded-[2px] border-2",
              // default (unchecked)
              "border-zinc-300 bg-white dark:bg-zinc-900",
              // hover/active/focus rings
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900",
              // active/focus border accent
              "group-active:border-indigo-600 group-focus-within:border-indigo-600",
              // checked styles
              "group-aria-[checked=true]:border-indigo-600 group-aria-[checked=true]:bg-indigo-600",
              // disabled styles
              "group-disabled:border-zinc-200 group-disabled:bg-zinc-100 dark:group-disabled:bg-zinc-800"
            )}
          >
            <FeatherCheck
              className={SubframeUtils.twClassNames(
                // hidden unless checked
                "hidden group-aria-[checked=true]:inline-flex",
                // icon sizing and color
                "text-[14px] leading-[14px] text-white"
              )}
            />
          </div>

          {label ? (
            <span
              className={SubframeUtils.twClassNames(
                "text-sm font-medium",
                "text-zinc-900 dark:text-zinc-100",
                "group-disabled:text-zinc-400"
              )}
            >
              {label}
            </span>
          ) : null}
        </button>
      </SubframeCore.Checkbox.Root>
    );
  }
);

// Named + default export
export default Component;
