"use client";

import * as React from "react";
import { FeatherChevronRight } from "@subframe/core";

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

/* ---------- Item ---------- */

export interface ItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
}

const Item = React.forwardRef<HTMLSpanElement, ItemProps>(function Item(
  { children, active = false, className, ...otherProps },
  ref
) {
  return children ? (
    <span
      ref={ref}
      {...otherProps}
      className={SubframeUtils.twClassNames(
        "group/bbdc1640 line-clamp-1 cursor-pointer break-words text-body font-body text-subtext-color hover:text-default-font",
        { "text-default-font": active },
        className
      )}
    >
      {children}
    </span>
  ) : null;
});

/* ---------- Divider ---------- */

export interface DividerProps
  extends React.ComponentProps<typeof FeatherChevronRight> {
  className?: string;
}

const Divider = React.forwardRef<
  React.ElementRef<typeof FeatherChevronRight>,
  DividerProps
>(function Divider({ className, ...otherProps }, ref) {
  return (
    <FeatherChevronRight
      ref={ref}
      {...otherProps}
      className={SubframeUtils.twClassNames(
        "text-body font-body text-subtext-color",
        className
      )}
    />
  );
});

/* ---------- Root ---------- */

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const Root = React.forwardRef<HTMLDivElement, ComponentProps>(function Component(
  { children, className, ...otherProps },
  ref
) {
  return children ? (
    <div
      ref={ref}
      {...otherProps}
      className={SubframeUtils.twClassNames("flex items-center gap-2", className)}
    >
      {children}
    </div>
  ) : null;
});

/* ---------- Compound export (named + default) ---------- */

export const Component = Object.assign(Root, { Item, Divider });
export default Component;
