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

export interface ComponentProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "brand-primary"
    | "brand-secondary"
    | "brand-tertiary"
    | "neutral-primary"
    | "neutral-secondary"
    | "neutral-tertiary"
    | "destructive-primary"
    | "destructive-secondary"
    | "destructive-tertiary"
    | "inverse";
  size?: "large" | "medium" | "small";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
}

/* -------------------- Variant B (self-contained Tailwind colors) -------------------- */

const VARIANT_BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-3 border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANT_STYLES: Record<
  NonNullable<ComponentProps["variant"]>,
  string
> = {
  // Brand
  "brand-primary":
    "h-8 border-transparent bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-600 focus:ring-indigo-500",
  "brand-secondary":
    "h-8 border-transparent bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-50 focus:ring-indigo-300",
  "brand-tertiary":
    "h-8 border-transparent bg-transparent text-indigo-700 hover:bg-indigo-50 active:bg-indigo-100 focus:ring-indigo-300",

  // Neutral
  "neutral-primary":
    "h-8 border-transparent bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:bg-zinc-100 focus:ring-zinc-400",
  "neutral-secondary":
    "h-8 border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 active:bg-white focus:ring-zinc-300",
  "neutral-tertiary":
    "h-8 border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 focus:ring-zinc-300",

  // Destructive
  "destructive-primary":
    "h-8 border-transparent bg-red-600 text-white hover:bg-red-500 active:bg-red-600 focus:ring-red-500",
  "destructive-secondary":
    "h-8 border-transparent bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-50 focus:ring-red-300",
  "destructive-tertiary":
    "h-8 border-transparent bg-transparent text-red-700 hover:bg-red-50 active:bg-red-100 focus:ring-red-300",

  // Inverse (for dark backgrounds)
  inverse:
    "h-8 border-transparent bg-transparent text-white hover:bg-white/15 active:bg-white/25 focus:ring-white",
};

const SIZE_STYLES: Record<
  NonNullable<ComponentProps["size"]>,
  { wrapper: string; icon: string; loader: string; text: string }
> = {
  small: {
    wrapper: "h-6 px-2 text-xs",
    icon: "text-current",
    loader: "text-current",
    text: "text-xs font-medium",
  },
  medium: {
    wrapper: "h-8 px-3 text-sm",
    icon: "text-current",
    loader: "text-current",
    text: "text-sm font-medium",
  },
  large: {
    wrapper: "h-10 px-4 text-base",
    icon: "text-current",
    loader: "text-current",
    text: "text-base font-medium",
  },
};

/* -------------------- Component -------------------- */

export const Component = React.forwardRef<HTMLButtonElement, ComponentProps>(
  function Component(
    {
      variant = "brand-primary",
      size = "medium",
      children,
      icon = null,
      iconRight = null,
      loading = false,
      className,
      type = "button",
      ...otherProps
    },
    ref
  ) {
    const sizeStyles = SIZE_STYLES[size];
    return (
      <button
        ref={ref}
        type={type}
        {...otherProps}
        className={SubframeUtils.twClassNames(
          VARIANT_BASE,
          VARIANT_STYLES[variant],
          sizeStyles.wrapper,
          className
        )}
      >
        {/* Left icon (hidden while loading) */}
        {icon ? (
          <SubframeCore.IconWrapper
            className={SubframeUtils.twClassNames(
              sizeStyles.icon,
              loading && "hidden"
            )}
          >
            {icon}
          </SubframeCore.IconWrapper>
        ) : null}

        {/* Loader (shown only while loading) */}
        <span
          className={SubframeUtils.twClassNames(
            "hidden items-center justify-center",
            loading && "inline-flex"
          )}
        >
          <SubframeCore.Loader className={sizeStyles.loader} />
        </span>

        {/* Label */}
        {children ? (
          <span
            className={SubframeUtils.twClassNames(
              sizeStyles.text,
              loading && "hidden"
            )}
          >
            {children}
          </span>
        ) : null}

        {/* Right icon (hidden while loading) */}
        {iconRight ? (
          <SubframeCore.IconWrapper
            className={SubframeUtils.twClassNames(
              sizeStyles.icon,
              loading && "hidden"
            )}
          >
            {iconRight}
          </SubframeCore.IconWrapper>
        ) : null}
      </button>
    );
  }
);

// Named + default export
export default Component;
