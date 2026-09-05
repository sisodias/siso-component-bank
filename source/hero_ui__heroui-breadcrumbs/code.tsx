"use client";

import * as React from "react";

type BreadcrumbSize = "sm" | "md" | "lg";
type BreadcrumbColor =
  | "foreground"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type BreadcrumbUnderline = "none" | "hover" | "always" | "active" | "focus";
type BreadcrumbVariant = "light" | "solid" | "bordered";
type BreadcrumbRadius = "none" | "sm" | "md" | "lg" | "full";

type SlotClasses = Partial<{
  base: string;
  list: string;
  ellipsis: string;
  separator: string;
}>;

type ItemSlotClasses = Partial<{
  base: string;
  item: string;
  separator: string;
}>;

type BreadcrumbItemProps = Omit<React.LiHTMLAttributes<HTMLLIElement>, "color"> & {
  href?: string;
  isCurrent?: boolean;
  isDisabled?: boolean;
  isLast?: boolean;
  separator?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  hideSeparator?: boolean;
  color?: BreadcrumbColor;
  size?: BreadcrumbSize;
  underline?: BreadcrumbUnderline;
  disableAnimation?: boolean;
  classNames?: ItemSlotClasses;
  onPress?: () => void;
};

type BreadcrumbsProps = Omit<React.HTMLAttributes<HTMLElement>, "color" | "onAction"> & {
  children: React.ReactNode;
  separator?: React.ReactNode;
  isDisabled?: boolean;
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  renderEllipsis?: (props: {
    collapsedItem: React.ReactNode;
    items: BreadcrumbItemProps[];
    maxItems: number;
    ellipsisIcon: React.ReactNode;
    itemsBeforeCollapse: number;
    itemsAfterCollapse: number;
    separator: React.ReactNode;
  }) => React.ReactNode;
  onAction?: (key: React.Key) => void;
  color?: BreadcrumbColor;
  size?: BreadcrumbSize;
  underline?: BreadcrumbUnderline;
  variant?: BreadcrumbVariant;
  radius?: BreadcrumbRadius;
  hideSeparator?: boolean;
  disableAnimation?: boolean;
  classNames?: SlotClasses;
  itemClasses?: ItemSlotClasses;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      aria-label="Chevron right icon"
      fill="none"
      height="16"
      role="presentation"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function EllipsisIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      role="presentation"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.5 10a1.5 1.5 0 1 0 0 .01M10 10a1.5 1.5 0 1 0 0 .01M15.5 10a1.5 1.5 0 1 0 0 .01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

const itemColorClasses: Record<BreadcrumbColor, string> = {
  foreground: "text-zinc-500 dark:text-zinc-400",
  primary: "text-blue-600/80 dark:text-blue-400/80",
  secondary: "text-violet-600/80 dark:text-violet-400/80",
  success: "text-emerald-600/80 dark:text-emerald-400/80",
  warning: "text-amber-600/80 dark:text-amber-400/80",
  danger: "text-rose-600/80 dark:text-rose-400/80",
};

const currentColorClasses: Record<BreadcrumbColor, string> = {
  foreground: "text-zinc-950 dark:text-zinc-50",
  primary: "text-blue-600 dark:text-blue-400",
  secondary: "text-violet-600 dark:text-violet-400",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
};

const sizeClasses: Record<BreadcrumbSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const radiusClasses: Record<BreadcrumbRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

function BreadcrumbItem({
  children,
  className,
  classNames,
  color = "foreground",
  endContent,
  hideSeparator = false,
  href,
  isCurrent = false,
  isDisabled = false,
  isLast = false,
  onPress,
  separator = <ChevronRightIcon />,
  size = "md",
  startContent,
  underline = "hover",
  disableAnimation = false,
  ...props
}: BreadcrumbItemProps) {
  const contentClassName = cn(
    "flex items-center gap-1 whitespace-nowrap rounded-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
    sizeClasses[size],
    isCurrent ? currentColorClasses[color] : itemColorClasses[color],
    isCurrent && "cursor-default",
    !isCurrent && !isDisabled && "cursor-pointer hover:opacity-80 active:opacity-50",
    isDisabled && "pointer-events-none opacity-50",
    !disableAnimation && "transition-opacity",
    underline === "none" && "no-underline",
    underline === "hover" && !isCurrent && "hover:underline underline-offset-4",
    underline === "always" && !isCurrent && "underline underline-offset-4",
    underline === "active" && !isCurrent && "active:underline underline-offset-4",
    underline === "focus" && !isCurrent && "focus:underline underline-offset-4",
    classNames?.item,
  );
  const Component = href && !isCurrent ? "a" : "span";

  return (
    <li
      className={cn("flex items-center", classNames?.base, className)}
      data-current={isCurrent || undefined}
      data-disabled={isDisabled || undefined}
      data-slot="breadcrumbs-item"
      {...props}
    >
      <Component
        aria-current={isCurrent ? "page" : undefined}
        aria-disabled={isDisabled || undefined}
        className={contentClassName}
        data-current={isCurrent || undefined}
        data-disabled={isDisabled || undefined}
        data-slot="breadcrumbs-link"
        href={Component === "a" ? href : undefined}
        onClick={(event) => {
          if (isDisabled || isCurrent) {
            event.preventDefault();
            return;
          }
          onPress?.();
        }}
        role={Component === "span" && href ? "link" : undefined}
      >
        {startContent}
        {children}
        {endContent}
      </Component>
      {!isLast && !hideSeparator && (
        <span
          aria-hidden="true"
          className={cn("px-1 text-zinc-400 dark:text-zinc-500 rtl:rotate-180", classNames?.separator)}
          data-slot="breadcrumbs-separator"
        >
          {separator}
        </span>
      )}
    </li>
  );
}

function BreadcrumbsRoot({
  children,
  className,
  classNames,
  color = "foreground",
  disableAnimation = false,
  hideSeparator = false,
  isDisabled = false,
  itemClasses,
  itemsAfterCollapse = 2,
  itemsBeforeCollapse = 1,
  maxItems = 8,
  onAction,
  radius = "sm",
  renderEllipsis,
  separator = <ChevronRightIcon />,
  size = "md",
  underline = "hover",
  variant = "light",
  ...props
}: BreadcrumbsProps) {
  const childArray = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<
    BreadcrumbItemProps
  >[];
  const childCount = childArray.length;
  const visibleItems = React.useMemo(() => {
    if (childCount <= maxItems || itemsBeforeCollapse + itemsAfterCollapse >= childCount) {
      return childArray.map((child, index) => ({ child, index }));
    }

    const hidden = childArray.slice(itemsBeforeCollapse, childCount - itemsAfterCollapse);
    const ellipsisIcon = <EllipsisIcon className="text-zinc-500 dark:text-zinc-400" />;
    const collapsedItem = (
      <BreadcrumbItem key="ellipsis" color={color} separator={separator} size={size}>
        {ellipsisIcon}
      </BreadcrumbItem>
    );
    const ellipsis =
      renderEllipsis?.({
        collapsedItem,
        items: hidden.map((item) => item.props),
        maxItems,
        ellipsisIcon,
        itemsBeforeCollapse,
        itemsAfterCollapse,
        separator: <span className="px-1 text-zinc-400 dark:text-zinc-500">{separator}</span>,
      }) ?? collapsedItem;

    return [
      ...childArray.slice(0, itemsBeforeCollapse).map((child, index) => ({ child, index })),
      { child: ellipsis as React.ReactElement<BreadcrumbItemProps>, index: -1 },
      ...childArray
        .slice(childCount - itemsAfterCollapse)
        .map((child, offset) => ({ child, index: childCount - itemsAfterCollapse + offset })),
    ];
  }, [
    childArray,
    childCount,
    color,
    itemsAfterCollapse,
    itemsBeforeCollapse,
    maxItems,
    renderEllipsis,
    separator,
    size,
  ]);

  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn(classNames?.base, className)}
      data-slot="breadcrumbs"
      {...props}
    >
      <ol
        className={cn(
          "flex flex-wrap items-center list-none",
          variant === "solid" && "max-w-fit bg-zinc-100 dark:bg-zinc-900",
          variant === "bordered" &&
            "max-w-fit border border-zinc-200 shadow-sm dark:border-zinc-800",
          variant !== "light" && size === "sm" && "px-2 py-1",
          variant !== "light" && size === "md" && "px-2.5 py-1.5",
          variant !== "light" && size === "lg" && "px-3 py-2",
          radiusClasses[radius],
          classNames?.list,
        )}
        data-slot="breadcrumbs-list"
      >
        {visibleItems.map(({ child, index }, visibleIndex) => {
          const isLast = visibleIndex === visibleItems.length - 1;
          const key = child.key ?? (index === -1 ? "ellipsis" : index);

          return React.cloneElement(child, {
            color,
            disableAnimation,
            hideSeparator,
            isDisabled: isDisabled && !isLast,
            isLast,
            isCurrent: isLast || child.props.isCurrent,
            separator,
            size,
            underline,
            classNames: {
              ...itemClasses,
              ...child.props.classNames,
            },
            key,
            onPress: () => {
              child.props.onPress?.();
              onAction?.(key);
            },
            ...child.props,
          });
        })}
      </ol>
    </nav>
  );
}

const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbItem,
});

export { Breadcrumbs, BreadcrumbsRoot, BreadcrumbItem, ChevronRightIcon };
export type { BreadcrumbsProps, BreadcrumbItemProps };
