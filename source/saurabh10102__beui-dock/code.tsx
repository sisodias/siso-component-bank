"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export interface SharedLayoutBgProps {
  children: ReactNode;
  className?: string;
  pillClassName?: string;
  inset?: number;
}

type ChildProps = HTMLAttributes<HTMLElement> & {
  className?: string;
  children?: ReactNode;
};

export function SharedLayoutBg({
  children,
  className,
  pillClassName,
  inset = 20,
}: SharedLayoutBgProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const uid = useId();

  return (
    <div
      onMouseLeave={() => setActiveId(null)}
      className={cn("flex w-full flex-col", className)}
    >
      {Children.toArray(children)
        .filter(isValidElement)
        .map((child, index) => {
          const el = child as ReactElement<ChildProps>;
          const childKey = el.key ? String(el.key) : `${uid}-item-${index}`;
          const active = activeId === childKey;

          const pillStyle: CSSProperties = {
            left: -inset,
            right: -inset,
            opacity: active ? 1 : 0,
            filter: active ? "blur(0px)" : "blur(6px)",
            transition: `opacity 180ms ${EASE_OUT_CSS}, filter 180ms ${EASE_OUT_CSS}`,
          };

          return cloneElement(
            el,
            {
              key: childKey,
              className: cn("relative", el.props.className),
              onMouseEnter: (event) => {
                el.props.onMouseEnter?.(event);
                setActiveId(childKey);
              },
            },
            <>
              <div
                className="pointer-events-none absolute inset-y-0"
                style={pillStyle}
              >
                <div
                  className={cn(
                    "pointer-events-none h-full w-full rounded-2xl bg-primary/[0.06]",
                    pillClassName,
                  )}
                />
              </div>

              <div className="relative z-10">{el.props.children}</div>
            </>,
          );
        })}
    </div>
  );
}