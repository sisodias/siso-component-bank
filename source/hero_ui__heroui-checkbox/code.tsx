"use client";

import * as React from "react";

type CheckboxColor = "primary" | "secondary" | "success" | "warning" | "danger" | "default";
type CheckboxSize = "sm" | "md" | "lg";
type CheckboxRadius = "none" | "sm" | "md" | "lg" | "full";

type CheckboxContextValue = {
  selected: boolean;
  indeterminate: boolean;
  disabled: boolean;
  invalid: boolean;
  selectedColor: string;
  toggle: () => void;
};

const CheckboxContext = React.createContext<CheckboxContextValue | null>(null);

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const colorClasses: Record<CheckboxColor, string> = {
  primary: "data-[selected=true]:border-violet-600 data-[selected=true]:text-white data-[selected=true]:after:bg-violet-600",
  secondary:
    "data-[selected=true]:border-slate-500 data-[selected=true]:text-white data-[selected=true]:after:bg-slate-500",
  success:
    "data-[selected=true]:border-emerald-500 data-[selected=true]:text-white data-[selected=true]:after:bg-emerald-500",
  warning:
    "data-[selected=true]:border-amber-500 data-[selected=true]:text-slate-950 data-[selected=true]:after:bg-amber-500",
  danger: "data-[selected=true]:border-rose-500 data-[selected=true]:text-white data-[selected=true]:after:bg-rose-500",
  default:
    "data-[selected=true]:border-zinc-700 data-[selected=true]:text-white data-[selected=true]:after:bg-zinc-700 dark:data-[selected=true]:border-zinc-200 dark:data-[selected=true]:text-zinc-950 dark:data-[selected=true]:after:bg-zinc-200",
};

const sizeClasses: Record<CheckboxSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const labelSizeClasses: Record<CheckboxSize, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

const selectedColorVars: Record<CheckboxColor, string> = {
  primary: "#7c3aed",
  secondary: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#f43f5e",
  default: "#3f3f46",
};

const radiusClasses: Record<CheckboxRadius, string> = {
  none: "rounded-none",
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};


function CheckboxStyles() {
  return (
    <style>{`
      [data-slot="checkbox-control"] [data-slot="checkbox-border"] {
        position: absolute;
        inset: 0;
        z-index: 1;
        border: 2px solid #d4d4d8;
        border-radius: inherit;
        pointer-events: none;
        transition: border-color 200ms linear, background-color 200ms linear;
      }
      .dark [data-slot="checkbox-control"] [data-slot="checkbox-border"] { border-color: #52525b; }
      [data-slot="checkbox-control"][data-selected="true"] [data-slot="checkbox-border"] {
        border-color: var(--checkbox-selected-bg);
      }
      [data-slot="checkbox-control"] [data-slot="checkbox-fill"] {
        position: absolute;
        inset: 0;
        z-index: 0;
        border-radius: inherit;
        background: var(--checkbox-selected-bg);
        opacity: 0;
        transform: scale(.5);
        transform-origin: center;
        transition: transform 200ms linear, opacity 200ms linear;
      }
      [data-slot="checkbox-control"][data-selected="true"] [data-slot="checkbox-fill"] {
        opacity: 1;
        transform: scale(1);
      }
      [data-slot="checkbox-indicator"] {
        opacity: 0;
        transform: scale(.72);
        transition: transform 200ms ease, opacity 200ms ease;
      }
      [data-slot="checkbox-indicator"][data-visible="true"] {
        opacity: 1;
        transform: scale(1);
      }
      [data-slot="checkbox-control"]:active,
      .group:active [data-slot="checkbox-control"] {
        transform: scale(.95);
      }
      @media (prefers-reduced-motion: reduce) {
        [data-slot="checkbox-control"],
        [data-slot="checkbox-control"] [data-slot="checkbox-fill"],
        [data-slot="checkbox-indicator"] { transition: none; }
      }
    `}</style>
  );
}

export interface CheckboxProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  id?: string;
  name?: string;
  value?: string;
  defaultSelected?: boolean;
  isSelected?: boolean;
  selected?: boolean;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  color?: CheckboxColor;
  size?: CheckboxSize;
  radius?: CheckboxRadius;
  lineThrough?: boolean;
  icon?: React.ReactNode | ((props: { className?: string }) => React.ReactNode);
  onValueChange?: (selected: boolean) => void;
  onChange?: (selected: boolean) => void;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 17 18" className={className}>
      <polyline
        points="3.6 9.2 7.1 12.7 13.8 5.9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 17 18" className={className}>
      <path d="M4 9h9" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}

const CheckboxControl = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CheckboxContext);

    return (
      <span
        ref={ref}
        data-slot="checkbox-control"
        data-selected={context?.selected || context?.indeterminate ? "true" : "false"}
        data-disabled={context?.disabled ? "true" : "false"}
        data-invalid={context?.invalid ? "true" : "false"}
        className={cn(
          "relative inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-md text-white transition-transform duration-200 active:scale-95 before:absolute before:inset-0 before:z-0 before:bg-zinc-100/70 before:opacity-0 before:transition-colors hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 dark:before:bg-white/10",
          "data-[invalid=true]:border-rose-500 data-[disabled=true]:opacity-50",
          className,
        )}
        style={{
          ...props.style,
          "--checkbox-selected-bg": context?.selectedColor ?? selectedColorVars.primary,
        } as React.CSSProperties}
        {...props}
      >
        <span aria-hidden="true" data-slot="checkbox-fill" />
        <span aria-hidden="true" data-slot="checkbox-border" />
        {children ?? <CheckboxIndicator />}
      </span>
    );
  },
);
CheckboxControl.displayName = "Checkbox.Control";

const CheckboxIndicator = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CheckboxContext);
    const visible = Boolean(context?.selected || context?.indeterminate);

    return (
      <span
        ref={ref}
        data-slot="checkbox-indicator"
        data-visible={visible ? "true" : "false"}
        className={cn(
          "relative z-10 inline-flex items-center justify-center",
          className,
        )}
        {...props}
      >
        {children ?? (context?.indeterminate ? <MinusIcon className="h-3 w-4" /> : <CheckIcon className="h-3 w-4" />)}
      </span>
    );
  },
);
CheckboxIndicator.displayName = "Checkbox.Indicator";

const CheckboxContent = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} data-slot="checkbox-content" className={cn("grid gap-0.5 leading-none", className)} {...props} />
  ),
);
CheckboxContent.displayName = "Checkbox.Content";

const CheckboxRoot = React.forwardRef<HTMLLabelElement, CheckboxProps>(
  (
    {
      className,
      children,
      id,
      name,
      value,
      defaultSelected = false,
      isSelected,
      selected,
      isIndeterminate = false,
      isDisabled = false,
      isInvalid = false,
      color = "primary",
      size = "md",
      radius = "md",
      lineThrough = false,
      icon,
      onValueChange,
      onChange,
      ...props
    },
    ref,
  ) => {
    const controlled = isSelected ?? selected;
    const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
    const actualSelected = controlled ?? internalSelected;

    const toggle = React.useCallback(() => {
      if (isDisabled) return;
      const next = !actualSelected;
      if (controlled === undefined) setInternalSelected(next);
      onValueChange?.(next);
      onChange?.(next);
    }, [actualSelected, controlled, isDisabled, onChange, onValueChange]);

    const context = React.useMemo(
      () => ({
        selected: actualSelected,
        indeterminate: isIndeterminate,
        disabled: isDisabled,
        invalid: isInvalid,
        selectedColor: selectedColorVars[color],
        toggle,
      }),
      [actualSelected, color, isDisabled, isIndeterminate, isInvalid, toggle],
    );

    const customChildren = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        [CheckboxControl, CheckboxContent, CheckboxIndicator].includes(child.type as never),
    );

    return (
      <>
        <CheckboxStyles />
        <CheckboxContext.Provider value={context}>
        <label
          ref={ref}
          data-selected={actualSelected || isIndeterminate ? "true" : "false"}
          data-disabled={isDisabled ? "true" : "false"}
          data-invalid={isInvalid ? "true" : "false"}
          className={cn(
            "group relative inline-flex max-w-fit cursor-pointer select-none items-center justify-start gap-2 p-2 -m-2 text-foreground",
            isDisabled && "pointer-events-none opacity-50",
            isInvalid && "text-rose-600 dark:text-rose-400",
            className,
          )}
          onClick={props.onClick}
          {...props}
        >
          <input
            id={id}
            name={name}
            value={value}
            type="checkbox"
            checked={actualSelected}
            disabled={isDisabled}
            aria-invalid={isInvalid || undefined}
            aria-checked={isIndeterminate ? "mixed" : actualSelected}
            onChange={toggle}
            className="sr-only"
          />
          {customChildren ? (
            children
          ) : (
            <>
              <CheckboxControl className={cn(sizeClasses[size], radiusClasses[radius], colorClasses[color])}>
                <CheckboxIndicator>
                  {icon ? (
                    typeof icon === "function" ? (
                      icon({ className: cn(size === "lg" ? "size-4" : "size-3.5") })
                    ) : (
                      icon
                    )
                  ) : isIndeterminate ? (
                    <MinusIcon className={size === "lg" ? "h-4 w-5" : "h-3 w-4"} />
                  ) : (
                    <CheckIcon className={size === "lg" ? "h-4 w-5" : "h-3 w-4"} />
                  )}
                </CheckboxIndicator>
              </CheckboxControl>
              {children ? (
                <span
                  className={cn(
                    "relative inline-flex flex-col justify-center gap-1 leading-none text-zinc-900 transition-colors dark:text-zinc-100",
                    labelSizeClasses[size],
                    lineThrough &&
                      "after:absolute after:left-0 after:top-[0.85rem] after:h-0.5 after:w-0 after:bg-current after:transition-all group-data-[selected=true]:opacity-60 group-data-[selected=true]:after:w-full",
                  )}
                >
                  {children}
                </span>
              ) : null}
            </>
          )}
        </label>
        </CheckboxContext.Provider>
      </>
    );
  },
);
CheckboxRoot.displayName = "Checkbox";

type CheckboxComponent = typeof CheckboxRoot & {
  Control: typeof CheckboxControl;
  Indicator: typeof CheckboxIndicator;
  Content: typeof CheckboxContent;
};

export const Checkbox = CheckboxRoot as CheckboxComponent;
Checkbox.Control = CheckboxControl;
Checkbox.Indicator = CheckboxIndicator;
Checkbox.Content = CheckboxContent;

export function Label({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-sm font-medium text-zinc-900 dark:text-zinc-100", className)} {...props} />;
}

export function Description({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)} {...props} />;
}

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300",
        className,
      )}
      {...props}
    />
  );
}

export default Checkbox;
