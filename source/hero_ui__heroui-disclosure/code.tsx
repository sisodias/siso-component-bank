"use client";

import * as React from "react";

type DisclosureContextValue = {
  isExpanded: boolean;
  isDisabled: boolean;
  panelId: string;
  triggerId: string;
  toggle: () => void;
};

type DisclosureRenderProps = {
  isExpanded: boolean;
  isDisabled: boolean;
};

type DisclosureProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: React.ReactNode | ((values: DisclosureRenderProps) => React.ReactNode);
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  isDisabled?: boolean;
};

type DisclosureHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

type DisclosureTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode | ((values: DisclosureRenderProps) => React.ReactNode);
};

type DisclosureContentProps = React.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
};

type DisclosureBodyProps = React.HTMLAttributes<HTMLDivElement>;
type DisclosureIndicatorProps = React.SVGAttributes<SVGSVGElement>;

const DisclosureContext = React.createContext<DisclosureContextValue | null>(null);

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

function useDisclosureContext(part: string) {
  const context = React.useContext(DisclosureContext);
  if (!context) {
    throw new Error(`${part} must be used inside Disclosure`);
  }
  return context;
}

function DisclosureRoot({
  children,
  className,
  defaultExpanded = false,
  isExpanded,
  onExpandedChange,
  isDisabled = false,
  ...props
}: DisclosureProps) {
  const reactId = React.useId();
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded);
  const expanded = isExpanded ?? uncontrolledExpanded;

  const setExpanded = React.useCallback(
    (next: boolean) => {
      if (isDisabled) return;
      if (isExpanded === undefined) setUncontrolledExpanded(next);
      onExpandedChange?.(next);
    },
    [isDisabled, isExpanded, onExpandedChange],
  );

  const value = React.useMemo(
    () => ({
      isExpanded: expanded,
      isDisabled,
      panelId: `disclosure-panel-${reactId}`,
      triggerId: `disclosure-trigger-${reactId}`,
      toggle: () => setExpanded(!expanded),
    }),
    [expanded, isDisabled, reactId, setExpanded],
  );

  return (
    <DisclosureContext.Provider value={value}>
      <DisclosureStyles />
      <div
        className={cn("disclosure", className)}
        data-expanded={expanded ? "true" : undefined}
        data-slot="disclosure"
        {...props}
      >
        {typeof children === "function" ? children({ isExpanded: expanded, isDisabled }) : children}
      </div>
    </DisclosureContext.Provider>
  );
}

function DisclosureHeading({ className, level = 3, ...props }: DisclosureHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={cn("disclosure__heading", className)}
      data-slot="disclosure-heading"
      {...props}
    />
  );
}

function DisclosureTrigger({ children, className, onClick, onKeyDown, disabled, ...props }: DisclosureTriggerProps) {
  const context = useDisclosureContext("Disclosure.Trigger");
  const isDisabled = Boolean(disabled || context.isDisabled);

  return (
    <button
      aria-controls={context.panelId}
      aria-disabled={isDisabled || undefined}
      aria-expanded={context.isExpanded}
      className={cn("disclosure__trigger", className)}
      data-expanded={context.isExpanded ? "true" : undefined}
      data-slot="disclosure-trigger"
      disabled={disabled}
      id={context.triggerId}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.toggle();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || isDisabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          context.toggle();
        }
      }}
      {...props}
    >
      {typeof children === "function"
        ? children({ isExpanded: context.isExpanded, isDisabled })
        : children}
    </button>
  );
}

function DisclosureContent({ children, className, forceMount = false, style, ...props }: DisclosureContentProps) {
  const context = useDisclosureContext("Disclosure.Content");
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const updateHeight = () => setHeight(element.scrollHeight);
    updateHeight();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children, context.isExpanded]);

  if (!forceMount && !context.isExpanded && height === 0) {
    return (
      <div
        aria-hidden="true"
        aria-labelledby={context.triggerId}
        className={cn("disclosure__content", className)}
        data-expanded={undefined}
        data-slot="disclosure-content"
        id={context.panelId}
        role="region"
        style={{ ...style, "--disclosure-panel-height": "0px" } as React.CSSProperties}
        {...props}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    );
  }

  return (
    <div
      aria-hidden={!context.isExpanded}
      aria-labelledby={context.triggerId}
      className={cn("disclosure__content", className)}
      data-expanded={context.isExpanded ? "true" : undefined}
      data-slot="disclosure-content"
      id={context.panelId}
      role="region"
      style={
        {
          ...style,
          "--disclosure-panel-height": context.isExpanded ? `${height}px` : "0px",
        } as React.CSSProperties
      }
      {...props}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

function DisclosureBody({ children, className, ...props }: DisclosureBodyProps) {
  return (
    <div className="disclosure__body" data-slot="disclosure-body" {...props}>
      <div className={cn("disclosure__body-inner", className)}>{children}</div>
    </div>
  );
}

function DisclosureIndicator({ className, ...props }: DisclosureIndicatorProps) {
  const context = useDisclosureContext("Disclosure.Indicator");

  return (
    <svg
      aria-hidden="true"
      aria-label="Chevron down icon"
      className={cn("disclosure__indicator", className)}
      data-expanded={context.isExpanded ? "true" : undefined}
      data-slot="disclosure-indicator"
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
        d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function DisclosureStyles() {
  return (
    <style>{`
      .disclosure {
        position: relative;
      }

      .disclosure__heading {
        display: flex;
        margin: 0;
      }

      .disclosure__trigger {
        cursor: pointer;
      }

      .disclosure__trigger:focus-visible,
      .disclosure__trigger[data-focus-visible="true"] {
        outline: 2px solid oklab(0.497363 -0.0375369 -0.132786);
        outline-offset: 2px;
      }

      .disclosure__trigger:disabled,
      .disclosure__trigger[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: .5;
      }

      .disclosure__indicator {
        margin-left: auto;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        color: inherit;
        transition: transform 250ms ease, opacity 250ms ease;
      }

      .disclosure__indicator[data-expanded="true"] {
        transform: rotate(-180deg);
      }

      .disclosure__content {
        height: var(--disclosure-panel-height, 0px);
        opacity: 0;
        overflow: clip;
        transition: height 200ms cubic-bezier(.25, .46, .45, .94), opacity 200ms ease-out;
      }

      .disclosure__content[data-expanded="true"] {
        opacity: 1;
        will-change: height, opacity;
      }

      .disclosure__body {
        padding: 8px;
      }

      @media (prefers-reduced-motion: reduce) {
        .disclosure__indicator,
        .disclosure__content {
          transition: none;
        }
      }
    `}</style>
  );
}

const Disclosure = Object.assign(DisclosureRoot, {
  Heading: DisclosureHeading,
  Trigger: DisclosureTrigger,
  Content: DisclosureContent,
  Body: DisclosureBody,
  Indicator: DisclosureIndicator,
});

export {
  Disclosure,
  DisclosureRoot,
  DisclosureHeading,
  DisclosureTrigger,
  DisclosureContent,
  DisclosureBody,
  DisclosureIndicator,
};

