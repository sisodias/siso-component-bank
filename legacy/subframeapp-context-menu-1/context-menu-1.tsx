"use client";

import * as React from "react";
import * as SubframeCore from "@subframe/core";
import { FeatherStar } from "@subframe/core";

/** Local utils inside the file */
namespace SubframeUtils {
  export type ClassValue = string | null | undefined | false | Record<string, boolean>;
  export function createTwClassNames() {
    return (...classes: ClassValue[]) =>
      classes
        .flatMap((c) => {
          if (!c) return [];
          if (typeof c === "string") return [c];
          return Object.entries(c).filter(([, ok]) => !!ok).map(([k]) => k);
        })
        .join(" ");
  }
  export const twClassNames = createTwClassNames();
}

/** Shared row UI */
function Row({
  children,
  icon,
  rightSlot,
  className,
  refCb,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  refCb?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={refCb ?? undefined}
      className={SubframeUtils.twClassNames(
        "group flex h-8 w-full cursor-pointer select-none items-center gap-2 rounded-md px-2",
        "hover:bg-zinc-100 active:bg-zinc-50 data-[highlighted]:bg-zinc-100",
        "dark:hover:bg-zinc-800 dark:active:bg-zinc-900 dark:data-[highlighted]:bg-zinc-800",
        className
      )}
    >
      <div className="flex h-4 w-4 flex-none items-center justify-center">
        {icon ? (
          <SubframeCore.IconWrapper className="text-zinc-700 dark:text-zinc-300">
            {icon}
          </SubframeCore.IconWrapper>
        ) : null}
      </div>
      {children ? (
        <span className="line-clamp-1 min-w-0 grow text-sm text-zinc-900 dark:text-zinc-100">
          {children}
        </span>
      ) : null}
      {rightSlot ? (
        <div className="ml-2 flex flex-none items-center justify-center">{rightSlot}</div>
      ) : null}
    </div>
  );
}

/** Item (ContextMenu only) */
export interface ItemProps
  extends Omit<React.ComponentProps<typeof SubframeCore.ContextMenu.Item>, "asChild"> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}
const Item = React.forwardRef<HTMLDivElement, ItemProps>(function Item(
  { children, icon = <FeatherStar />, rightSlot, className, ...otherProps },
  ref
) {
  return (
    <SubframeCore.ContextMenu.Item asChild {...otherProps}>
      <Row refCb={(el) => (ref ? (ref as any)(el) : undefined)} icon={icon} rightSlot={rightSlot} className={className}>
        {children}
      </Row>
    </SubframeCore.ContextMenu.Item>
  );
});

/** Divider */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { className, ...otherProps },
  ref
) {
  return (
    <div ref={ref} {...otherProps} className={SubframeUtils.twClassNames("px-1 py-1", className)}>
      <div className="h-px w-full bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
});

/** Root (ContextMenu only) */
export interface ComponentProps
  extends Omit<React.ComponentProps<typeof SubframeCore.ContextMenu.Root>, "children"> {
  /** Menu body (rows & dividers) */
  children?: React.ReactNode;
  /** Card classes */
  className?: string;
  /** Visible area to right-click on */
  trigger?: React.ReactNode;
}
const Root = React.forwardRef<HTMLDivElement, ComponentProps>(function Component(
  { children, className, trigger, ...rootProps },
  ref
) {
  if (!children) return null;

  const container = (
    <div
      ref={ref}
      className={SubframeUtils.twClassNames(
        "flex min-w-[192px] flex-col items-start rounded-md border px-1 py-1 shadow-lg",
        "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
    >
      {children}
    </div>
  );

  return (
    <SubframeCore.ContextMenu.Root {...rootProps}>
      <SubframeCore.ContextMenu.Trigger asChild>
        {trigger ?? (
          <div
            className={SubframeUtils.twClassNames(
              "rounded-md border border-dashed p-6 text-sm text-zinc-600",
              "hover:bg-zinc-50 dark:hover:bg-zinc-800",
              "border-zinc-300 dark:border-zinc-700 dark:text-zinc-300"
            )}
          >
            Right-click here
          </div>
        )}
      </SubframeCore.ContextMenu.Trigger>
      <SubframeCore.ContextMenu.Content asChild>{container}</SubframeCore.ContextMenu.Content>
    </SubframeCore.ContextMenu.Root>
  );
});

/** Compound export */
export const Component = Object.assign(Root, { Item, Divider });
export default Component;
