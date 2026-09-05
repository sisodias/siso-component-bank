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
  hideCheckbox?: boolean;
  children?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

/* -------------------- Component -------------------- */

export const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  function Component(
    { hideCheckbox = false, children, className, ...otherProps },
    ref
  ) {
    return (
      <SubframeCore.Checkbox.Root asChild {...otherProps}>
        <button
          ref={ref}
          className={SubframeUtils.twClassNames(
            // card base
            "group inline-flex w-full cursor-pointer items-center gap-4 rounded-md border p-4 text-left transition-colors",
            // light
            "border-zinc-300 bg-white hover:bg-zinc-50",
            // dark
            "dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800",
            // focus
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900",
            // checked state accent
            "aria-[checked=true]:border-indigo-300 aria-[checked=true]:bg-indigo-50",
            "dark:aria-[checked=true]:border-indigo-600/50 dark:aria-[checked=true]:bg-indigo-900/30",
            // disabled
            "disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
        >
          <div
            className={SubframeUtils.twClassNames(
              "flex h-5 w-5 flex-none items-center justify-center rounded-[3px] border-2 transition-colors",
              // default box
              "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900",
              // focus/active accent via parent group
              "group-active:border-indigo-600 group-focus-within:border-indigo-600",
              // checked fill
              "group-aria-[checked=true]:border-indigo-600 group-aria-[checked=true]:bg-indigo-600",
              // disabled
              "group-disabled:border-zinc-300 group-disabled:bg-zinc-100 dark:group-disabled:bg-zinc-800",
              { hidden: hideCheckbox }
            )}
          >
            <FeatherCheck
              className={SubframeUtils.twClassNames(
                "hidden group-aria-[checked=true]:inline-flex",
                "text-white text-[14px] leading-[14px]"
              )}
            />
          </div>

          {children ? (
            <div className="flex min-w-0 grow items-center gap-4">
              {children}
            </div>
          ) : null}
        </button>
      </SubframeCore.Checkbox.Root>
    );
  }
);

// Named + default export
export default Component;
