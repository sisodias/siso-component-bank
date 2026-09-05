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

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "brand" | "neutral" | "error" | "success" | "warning";
  size?: "x-large" | "large" | "medium" | "small" | "x-small";
  children?: React.ReactNode;
  image?: string;
  square?: boolean;
  className?: string;
}

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  function Component(
    {
      variant = "brand",
      size = "medium",
      children,
      image,
      square = false,
      className,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        {...otherProps}
        className={SubframeUtils.twClassNames(
          "group/bec25ae6 relative flex h-8 w-8 flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-100",
          {
            "rounded-md": square,
            "h-5 w-5": size === "x-small",
            "h-6 w-6": size === "small",
            "h-12 w-12": size === "large",
            "h-16 w-16": size === "x-large",
            "bg-warning-100": variant === "warning",
            "bg-success-100": variant === "success",
            "bg-error-100": variant === "error",
            "bg-neutral-100": variant === "neutral",
          },
          className
        )}
      >
        {children ? (
          <span
            className={SubframeUtils.twClassNames(
              "absolute line-clamp-1 w-full text-center font-['Inter'] text-[14px] font-[500] leading-[14px] text-brand-800",
              {
                "text-[10px] leading-[10px]":
                  size === "x-small" || size === "small",
                "text-[18px] leading-[18px]": size === "large",
                "text-[24px] leading-[24px]": size === "x-large",
                "text-warning-800": variant === "warning",
                "text-success-800": variant === "success",
                "text-error-800": variant === "error",
                "text-neutral-800": variant === "neutral",
              }
            )}
          >
            {children}
          </span>
        ) : null}

        {image ? (
          <img
            src={image}
            alt=""
            className={SubframeUtils.twClassNames(
              "absolute h-8 w-8 flex-none object-cover",
              {
                "h-5 w-5": size === "x-small",
                "h-6 w-6": size === "small",
                "h-12 w-12": size === "large",
                "h-16 w-16": size === "x-large",
              }
            )}
          />
        ) : null}
      </div>
    );
  }
);

// Named + default export
export default Component;
