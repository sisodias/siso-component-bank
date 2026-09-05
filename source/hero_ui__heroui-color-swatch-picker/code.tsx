"use client";

import * as React from "react";

type ColorValue = {
  value: string;
  toString: (format?: "hex" | "css") => string;
  getChannelValue: (channel: "red" | "green" | "blue") => number;
};

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Variant = "circle" | "square";
type Layout = "grid" | "stack";

type PickerContextValue = {
  selected: string | null;
  setSelected: (color: string) => void;
  register: (color: string, disabled: boolean, ref: React.RefObject<HTMLButtonElement | null>) => void;
  focusByOffset: (color: string, offset: number) => void;
  variant: Variant;
};

type ItemContextValue = {
  color: string;
  selected: boolean;
};

const PickerContext = React.createContext<PickerContextValue | null>(null);
const ItemContext = React.createContext<ItemContextValue | null>(null);

const colorOrder = ["red", "green", "blue"] as const;

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function normalizeHex(input: string) {
  const raw = input.trim();
  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    return `#${raw
      .slice(1)
      .split("")
      .map((char) => char + char)
      .join("")}`.toUpperCase();
  }
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toUpperCase();
  return raw;
}

function hexToRgb(input: string) {
  const hex = normalizeHex(input);
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return { red: 0, green: 0, blue: 0 };
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function colorToString(value: string | ColorValue | null | undefined) {
  if (!value) return null;
  if (typeof value === "string") return normalizeHex(value);
  return normalizeHex(value.toString("hex"));
}

export function parseColor(value: string): ColorValue {
  const hex = normalizeHex(value);
  return {
    value: hex,
    toString: (format = "hex") => (format === "css" ? hex : hex),
    getChannelValue: (channel) => hexToRgb(hex)[channel],
  };
}

function toColorValue(value: string | ColorValue): ColorValue {
  return typeof value === "string" ? parseColor(value) : value;
}

function getLuminance(color: string) {
  const rgb = hexToRgb(color);
  return (0.2126 * rgb.red + 0.7152 * rgb.green + 0.0722 * rgb.blue) / 255;
}

function ColorSwatchPicker({
  children,
  className,
  layout = "grid",
  size = "md",
  variant = "circle",
  value,
  defaultValue,
  onChange,
  render,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  layout?: Layout;
  size?: Size;
  variant?: Variant;
  value?: string | ColorValue;
  defaultValue?: string | ColorValue;
  onChange?: (value: ColorValue) => void;
  render?: (props: React.HTMLAttributes<HTMLDivElement>) => React.ReactElement;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() => colorToString(defaultValue));
  const selected = value !== undefined ? colorToString(value) : uncontrolledValue;
  const itemRefs = React.useRef<Array<{ color: string; disabled: boolean; ref: React.RefObject<HTMLButtonElement | null> }>>([]);

  const setSelected = React.useCallback(
    (color: string) => {
      const normalized = normalizeHex(color);
      if (value === undefined) setUncontrolledValue(normalized);
      onChange?.(parseColor(normalized));
    },
    [onChange, value],
  );

  const register = React.useCallback((color: string, disabled: boolean, ref: React.RefObject<HTMLButtonElement | null>) => {
    itemRefs.current = itemRefs.current.filter((item) => item.ref !== ref);
    itemRefs.current.push({color: normalizeHex(color), disabled, ref});
  }, []);

  const focusByOffset = React.useCallback((color: string, offset: number) => {
    const enabled = itemRefs.current.filter((item) => !item.disabled && item.ref.current);
    const index = enabled.findIndex((item) => item.color === normalizeHex(color));
    if (index === -1 || enabled.length === 0) return;
    const next = enabled[(index + offset + enabled.length) % enabled.length];
    next.ref.current?.focus();
    setSelected(next.color);
  }, [setSelected]);

  const baseProps: React.HTMLAttributes<HTMLDivElement> = {
    ...props,
    role: "radiogroup",
    "data-slot": "color-swatch-picker",
    className: cn(
      "color-swatch-picker",
      `color-swatch-picker--${layout}`,
      `color-swatch-picker--${size}`,
      `color-swatch-picker--${variant}`,
      className,
    ),
  };

  return (
    <PickerContext.Provider value={{selected, setSelected, register, focusByOffset, variant}}>
      <ColorSwatchPickerStyles />
      {render ? render(baseProps) : <div {...baseProps}>{children}</div>}
    </PickerContext.Provider>
  );
}

function ColorSwatchPickerItem({
  children,
  color,
  isDisabled = false,
  className,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  color: string | ColorValue;
  isDisabled?: boolean;
}) {
  const context = React.useContext(PickerContext);
  if (!context) throw new Error("ColorSwatchPicker.Item must be used inside ColorSwatchPicker");

  const colorValue = colorToString(color) ?? "#000000";
  const ref = React.useRef<HTMLButtonElement>(null);
  const selected = context.selected === colorValue;
  const [focusVisible, setFocusVisible] = React.useState(false);

  React.useEffect(() => {
    context.register(colorValue, isDisabled, ref);
  }, [colorValue, context, isDisabled]);

  return (
    <ItemContext.Provider value={{color: colorValue, selected}}>
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-disabled={isDisabled || undefined}
        disabled={isDisabled}
        data-disabled={isDisabled ? "true" : undefined}
        data-focus-visible={focusVisible ? "true" : undefined}
        data-selected={selected ? "true" : undefined}
        data-slot="color-swatch-picker-item"
        className={cn("color-swatch-picker__item", className)}
        style={{"--color-swatch-current": colorValue} as React.CSSProperties}
        onClick={(event) => {
          props.onClick?.(event);
          if (!event.defaultPrevented && !isDisabled) context.setSelected(colorValue);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          setFocusVisible(event.currentTarget.matches(":focus-visible"));
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setFocusVisible(false);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          const keyOffsets: Record<string, number> = {
            ArrowRight: 1,
            ArrowDown: 1,
            ArrowLeft: -1,
            ArrowUp: -1,
          };
          if (event.key in keyOffsets) {
            event.preventDefault();
            context.focusByOffset(colorValue, keyOffsets[event.key]);
          }
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            context.setSelected(colorValue);
          }
        }}
        {...props}
      >
        {typeof children === "function" ? children({color: toColorValue(colorValue), isSelected: selected}) : children}
      </button>
    </ItemContext.Provider>
  );
}

function ColorSwatchPickerSwatch({className, style, ...props}: React.HTMLAttributes<HTMLSpanElement>) {
  const item = React.useContext(ItemContext);
  if (!item) throw new Error("ColorSwatchPicker.Swatch must be used inside ColorSwatchPicker.Item");
  return (
    <span
      data-slot="color-swatch-picker-swatch"
      className={cn("color-swatch-picker__swatch", className)}
      style={{backgroundColor: item.color, ...style}}
      {...props}
    />
  );
}

function ColorSwatchPickerIndicator({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  children?: React.ReactNode | ((props: {color: ColorValue; isSelected: boolean}) => React.ReactNode);
}) {
  const item = React.useContext(ItemContext);
  if (!item) throw new Error("ColorSwatchPicker.Indicator must be used inside ColorSwatchPicker.Item");
  const light = getLuminance(item.color) > 0.5;
  const state = {color: parseColor(item.color), isSelected: item.selected};
  return (
    <span
      aria-hidden="true"
      className={cn("color-swatch-picker__indicator", className)}
      data-light-color={light ? "true" : undefined}
      data-slot="color-swatch-picker-indicator"
      {...props}
    >
      {typeof children === "function" ? (
        children(state)
      ) : children ? (
        children
      ) : (
        <svg
          aria-hidden="true"
          data-slot="color-swatch-picker-checkmark"
          fill="none"
          role="presentation"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          viewBox="0 0 12 12"
        >
          <polyline points="2.5 6 5 8.5 9.5 3" />
        </svg>
      )}
    </span>
  );
}

function ColorSwatchPickerStyles() {
  return (
    <style>{`
      .color-swatch-picker{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem}
      .color-swatch-picker--stack{flex-direction:column}
      .color-swatch-picker__item{position:relative;display:flex;width:2rem;height:2rem;align-items:center;justify-content:center;border-radius:1rem;border:2px solid transparent;outline:2px solid transparent;outline-offset:2px;cursor:pointer;background:transparent;padding:0;-webkit-tap-highlight-color:transparent;transition:border-color 100ms cubic-bezier(.4,0,.2,1),box-shadow 100ms cubic-bezier(.4,0,.2,1);transform:translateZ(0)}
      .color-swatch-picker__item:focus-visible,.color-swatch-picker__item[data-focus-visible="true"]{box-shadow:0 0 0 2px hsl(var(--background,0 0% 100%)),0 0 0 4px hsl(var(--ring,221 83% 53%))}
      .color-swatch-picker__item[data-disabled="true"]{cursor:not-allowed;opacity:.5}
      .color-swatch-picker__item[data-selected="true"]{border-color:var(--color-swatch-current);box-shadow:0 1px 2px rgba(0,0,0,.08)}
      .color-swatch-picker__item[data-selected="true"] .color-swatch-picker__swatch{transform:scale(.77)}
      .color-swatch-picker__swatch{display:block;width:100%;height:100%;border-radius:inherit;transition:transform 100ms cubic-bezier(.4,0,.2,1);transform:translateZ(0)}
      @media (hover:hover){.color-swatch-picker__item:not([data-selected="true"]):not([data-disabled="true"]) .color-swatch-picker__swatch:hover{transform:scale(1.1)}}
      .color-swatch-picker__indicator{pointer-events:none;position:absolute;inset:0;z-index:10;display:flex;align-items:center;justify-content:center}
      .color-swatch-picker__indicator>*{width:33.333333%;height:33.333333%;color:white;transform:scale(0) translateZ(0);transition:transform 150ms cubic-bezier(.4,0,.2,1)}
      .color-swatch-picker__indicator[data-light-color="true"]>*{color:black}
      .color-swatch-picker__item[data-selected="true"] .color-swatch-picker__indicator>*{transform:scale(1) translateZ(0)}
      .color-swatch-picker--xs .color-swatch-picker__item{width:1rem;height:1rem;border-width:1px;border-radius:.5rem}
      .color-swatch-picker--sm .color-swatch-picker__item{width:1.5rem;height:1.5rem;border-radius:.75rem}
      .color-swatch-picker--lg .color-swatch-picker__item{width:2.25rem;height:2.25rem;border-width:3px;border-radius:1.5rem}
      .color-swatch-picker--xl .color-swatch-picker__item{width:2.5rem;height:2.5rem;border-width:3px;border-radius:1.5rem}
      .color-swatch-picker--square .color-swatch-picker__item{border-radius:.75rem}
      .color-swatch-picker--square .color-swatch-picker__swatch{border-radius:.5rem}
      .color-swatch-picker--square.color-swatch-picker--xs .color-swatch-picker__item,.color-swatch-picker--square.color-swatch-picker--xs .color-swatch-picker__swatch{border-radius:.375rem}
      .color-swatch-picker--square.color-swatch-picker--sm .color-swatch-picker__item{border-radius:.5rem}
      .color-swatch-picker--square.color-swatch-picker--sm .color-swatch-picker__swatch{border-radius:.375rem}
      .color-swatch-picker--square.color-swatch-picker--lg .color-swatch-picker__item,.color-swatch-picker--square.color-swatch-picker--xl .color-swatch-picker__item{border-radius:.75rem}
      .color-swatch-picker--square.color-swatch-picker--lg .color-swatch-picker__swatch,.color-swatch-picker--square.color-swatch-picker--xl .color-swatch-picker__swatch{border-radius:.5rem}
      @media (prefers-reduced-motion:reduce){.color-swatch-picker__item,.color-swatch-picker__swatch,.color-swatch-picker__indicator>*{transition:none}}
    `}</style>
  );
}

ColorSwatchPicker.Item = ColorSwatchPickerItem;
ColorSwatchPicker.Swatch = ColorSwatchPickerSwatch;
ColorSwatchPicker.Indicator = ColorSwatchPickerIndicator;

export {ColorSwatchPicker};
export type {ColorValue};
