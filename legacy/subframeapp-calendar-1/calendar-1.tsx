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

/* -------------------- Types -------------------- */

export type ComponentProps = React.ComponentProps<typeof SubframeCore.Calendar> & {
  className?: string;
};

/* -------------------- Component -------------------- */

export const Component = React.forwardRef<
  React.ElementRef<typeof SubframeCore.Calendar>,
  ComponentProps
>(function Component({ className, ...otherProps }, ref) {
  return (
    <SubframeCore.Calendar
      ref={ref}
      {...otherProps}
      className={SubframeUtils.twClassNames("relative", className)}
      /**
       * Token-free Tailwind classes (self-contained)
       * Uses the Calendar's group state selectors (.selected, .outside, .range-*)
       */
      classNames={{
        root: "relative box-border",
        months: "relative flex max-w-fit flex-wrap gap-4",
        month: "flex flex-col gap-4",
        nav: "absolute flex h-8 w-full items-center justify-between p-0.5",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "text-sm font-semibold text-zinc-900",
        button_previous:
          "inline-flex h-8 w-8 items-center justify-center rounded border border-transparent bg-transparent hover:bg-zinc-100 active:bg-zinc-200",
        button_next:
          "inline-flex h-8 w-8 items-center justify-center rounded border border-transparent bg-transparent hover:bg-zinc-100 active:bg-zinc-200",
        chevron: "text-[18px] font-medium leading-[18px] text-zinc-600",

        weeks: "flex flex-col gap-2",
        weekdays: "flex pb-4",
        weekday: "w-8 text-xs font-semibold text-zinc-500",

        week: "flex overflow-hidden rounded-lg",

        day: "group flex h-8 w-8 cursor-pointer items-center justify-center text-sm text-zinc-900",

        day_button:
          [
            "flex h-8 w-8 items-center justify-center rounded-lg border-none",
            "hover:bg-zinc-100",
            // selected
            "group-[.selected]:bg-indigo-600 group-[.selected]:text-white",
            // outside days
            "group-[.outside]:bg-transparent group-[.outside]:text-zinc-400 group-[.outside]:hover:bg-zinc-100",
            // range selection states
            "group-[.range-start]:rounded-l-lg group-[.range-end]:rounded-r-lg",
            "group-[.range-middle]:bg-indigo-50 group-[.range-middle]:text-zinc-900",
          ].join(" "),

        selected: "selected",
        outside: "outside",
        range_start: "range-start bg-indigo-50",
        range_middle: "range-middle",
        range_end: "range-end bg-indigo-50",
      }}
    />
  );
});

// Named + default export
export default Component;
