"use client";

import * as React from "react";

type ColorFormat = "hex" | "css";
type ColorChannel = "hue" | "saturation" | "lightness";

export type ColorValue = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  sourceHex?: string;
  toString: (format?: ColorFormat) => string;
};

type ColorFieldContextValue = {
  id: string;
  name?: string;
  value: ColorValue | null;
  setValue: (value: ColorValue | null) => void;
  channel?: ColorChannel;
  colorSpace?: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
};

type ColorFieldRootProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  children: React.ReactNode | ((props: {
    isDisabled: boolean;
    isInvalid: boolean;
    isReadOnly: boolean;
    isFocused: boolean;
    isFocusWithin: boolean;
    isFocusVisible: boolean;
    isRequired: boolean;
  }) => React.ReactNode);
  name?: string;
  value?: ColorValue | null;
  defaultValue?: string | ColorValue | null;
  onChange?: (value: ColorValue | null) => void;
  channel?: ColorChannel;
  colorSpace?: string;
  fullWidth?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  render?: (props: React.HTMLAttributes<HTMLDivElement>) => React.ReactNode;
};

type ColorFieldGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  render?: (props: React.HTMLAttributes<HTMLDivElement>) => React.ReactNode;
};

type ColorFieldInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "value" | "onChange"> & {
  defaultValue?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type ColorSwatchProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: ColorValue | string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = (((h % 360) + 360) % 360) / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const convert = (t: number) => {
    let next = t;
    if (next < 0) next += 1;
    if (next > 1) next -= 1;
    if (next < 1 / 6) return p + (q - p) * 6 * next;
    if (next < 1 / 2) return q;
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
    return p;
  };
  return [convert(hue + 1 / 3), convert(hue), convert(hue - 1 / 3)].map((part) => Math.round(part * 255)) as [
    number,
    number,
    number,
  ];
}

function rgbToHsl(r: number, g: number, b: number): Pick<ColorValue, "hue" | "saturation" | "lightness"> {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let hue = 0;
  let saturation = 0;
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta !== 0) {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
    if (max === green) hue = (blue - red) / delta + 2;
    if (max === blue) hue = (red - green) / delta + 4;
    hue *= 60;
  }

  return { hue, saturation, lightness };
}

function createColor(hue: number, saturation: number, lightness: number, alpha = 1, sourceHex?: string): ColorValue {
  return {
    hue: clamp(Math.round(hue), 0, 360),
    saturation: clamp(saturation, 0, 1),
    lightness: clamp(lightness, 0, 1),
    alpha: clamp(alpha, 0, 1),
    sourceHex,
    toString(format: ColorFormat = "css") {
      const [red, green, blue] = hslToRgb(this.hue, this.saturation, this.lightness);
      if (format === "hex") {
        if (this.sourceHex) return this.sourceHex;
        return `#${[red, green, blue].map((part) => part.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
      }
      return `rgba(${red}, ${green}, ${blue}, ${this.alpha})`;
    },
  };
}

export function parseColor(value: string): ColorValue {
  const normalized = value.trim();
  const hex = normalized.match(/^#?([0-9a-fA-F]{6})$/);
  if (!hex) return createColor(0, 0, 0);
  const int = Number.parseInt(hex[1], 16);
  const red = (int >> 16) & 255;
  const green = (int >> 8) & 255;
  const blue = int & 255;
  const hsl = rgbToHsl(red, green, blue);
  return createColor(hsl.hue, hsl.saturation, hsl.lightness, 1, `#${hex[1].toUpperCase()}`);
}

function toColor(value: string | ColorValue | null | undefined): ColorValue | null {
  if (!value) return null;
  if (typeof value === "string") return parseColor(value);
  return value;
}

function ColorFieldStyles() {
  return (
    <style>{`
      [data-slot="color-field"] {
        display: flex;
        flex-direction: column;
        gap: 4px;
        color: hsl(var(--foreground, 240 10% 96%));
      }
      [data-slot="color-field"][data-full-width="true"] { width: 100%; }
      [data-slot="color-field"][data-disabled="true"] { opacity: .5; }
      [data-slot="label"] {
        display: block;
        color: hsl(var(--foreground, 240 10% 96%));
        font-size: 14px;
        line-height: 20px;
        cursor: default;
      }
      [data-slot="label"][data-required="true"]::after {
        content: " *";
        color: rgb(244 63 94);
      }
      [data-slot="description"] {
        display: block;
        color: hsl(var(--muted-foreground, 240 5% 64%));
        font-size: 12px;
        line-height: 16px;
      }
      [data-slot="field-error"] {
        display: block;
        color: rgb(248 113 113);
        font-size: 12px;
        line-height: 16px;
        padding-inline: 4px;
      }
      [data-slot="color-input-group"] {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 36px;
        border-radius: 12px;
        background: hsl(var(--surface-input, 240 6% 10%));
        color: hsl(var(--foreground, 240 10% 96%));
        transition: background-color 150ms ease, box-shadow 150ms ease, outline-color 150ms ease;
      }
      [data-slot="color-input-group"][data-variant="secondary"] {
        background: hsl(var(--surface-secondary, 240 5% 14%));
      }
      [data-slot="color-field"][data-invalid="true"] [data-slot="color-input-group"] {
        box-shadow: 0 0 0 1px rgb(244 63 94 / .85);
      }
      [data-slot="color-field"]:focus-within [data-slot="color-input-group"] {
        box-shadow: 0 0 0 2px rgb(139 92 246 / .55);
      }
      [data-slot="color-field"][data-disabled="true"] [data-slot="color-input-group"] {
        cursor: not-allowed;
      }
      [data-slot="color-input-group-input"] {
        display: flex;
        min-width: 0;
        flex: 1 1 auto;
        height: 36px;
        border: 0;
        background: transparent;
        color: inherit;
        padding: 8px 12px;
        font-size: 14px;
        line-height: 20px;
        outline: none;
      }
      [data-slot="color-input-group-prefix"] {
        display: flex;
        align-items: center;
        margin-inline-start: 12px;
        color: hsl(var(--muted-foreground, 240 5% 64%));
      }
      [data-slot="color-input-group-prefix"] + [data-slot="color-input-group-input"] {
        padding-inline-start: 8px;
      }
      [data-slot="color-input-group-suffix"] {
        display: flex;
        align-items: center;
        margin-inline-end: 12px;
        color: hsl(var(--muted-foreground, 240 5% 64%));
      }
      [data-slot="color-swatch"] {
        display: block;
        forced-color-adjust: none;
        background: var(--color-swatch-current, transparent);
        box-shadow: inset 0 0 0 1px rgb(0 0 0 / .1);
      }
      [data-slot="color-swatch"][data-shape="circle"] { border-radius: 9999px; }
      [data-slot="color-swatch"][data-shape="square"] { border-radius: 6px; }
      [data-slot="color-swatch"][data-size="xs"] { width: 16px; height: 16px; }
      [data-slot="color-swatch"][data-size="sm"] { width: 20px; height: 20px; }
      [data-slot="color-swatch"][data-size="md"] { width: 28px; height: 28px; }
      [data-slot="color-swatch"][data-size="lg"] { width: 36px; height: 36px; }
      [data-slot="color-swatch"][data-size="xl"] { width: 44px; height: 44px; }
      [data-slot="surface"] {
        background: hsl(var(--surface-input, 240 6% 10%));
        color: hsl(var(--foreground, 240 10% 96%));
      }
      [data-slot="button"] {
        min-height: 32px;
        border-radius: 10px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 20px;
        transition: background-color 150ms ease, opacity 150ms ease, transform 150ms ease;
      }
      [data-slot="button"][data-variant="tertiary"] {
        background: hsl(var(--surface-input, 240 6% 10%));
        color: hsl(var(--foreground, 240 10% 96%));
      }
      [data-slot="button"][data-variant="primary"] {
        background: rgb(124 58 237);
        color: white;
      }
      [data-slot="button"]:not(:disabled):hover {
        background: hsl(var(--surface-secondary, 240 5% 18%));
      }
      [data-slot="button"]:not(:disabled):active { transform: scale(.97); }
      [data-slot="button"]:disabled { opacity: .5; cursor: not-allowed; }
      .light [data-slot="color-field"] {
        --foreground: 240 10% 4%;
        --muted-foreground: 240 4% 46%;
        --surface-input: 240 5% 96%;
        --surface-secondary: 240 5% 91%;
      }
      .dark [data-slot="color-field"],
      .dark [data-slot="surface"] {
        --foreground: 240 10% 96%;
        --muted-foreground: 240 5% 64%;
        --surface-input: 240 6% 10%;
        --surface-secondary: 240 5% 14%;
      }
      .light [data-slot="surface"] {
        --foreground: 240 10% 4%;
        --muted-foreground: 240 4% 46%;
        --surface-input: 240 5% 96%;
        --surface-secondary: 240 5% 91%;
      }
    `}</style>
  );
}

const ColorFieldContext = React.createContext<ColorFieldContextValue | null>(null);
const RequiredContext = React.createContext(false);

function useColorFieldContext() {
  const context = React.useContext(ColorFieldContext);
  if (!context) throw new Error("ColorField subcomponents must be used inside ColorField");
  return context;
}

function formatChannelValue(color: ColorValue | null, channel?: ColorChannel) {
  if (!color) return "";
  if (channel === "hue") return `${Math.round(color.hue)}\u00b0`;
  if (channel === "saturation") return `${Math.round(color.saturation * 100)}%`;
  if (channel === "lightness") return `${Math.round(color.lightness * 100)}%`;
  return color.toString("hex");
}

function updateChannel(color: ColorValue | null, channel: ColorChannel, raw: string) {
  const base = color ?? createColor(0, 0, 0);
  const numeric = Number.parseFloat(raw.replace(/[^\d.-]/g, ""));
  if (Number.isNaN(numeric)) return color;
  if (channel === "hue") return createColor(clamp(numeric, 0, 360), base.saturation, base.lightness, base.alpha);
  if (channel === "saturation") return createColor(base.hue, clamp(numeric, 0, 100) / 100, base.lightness, base.alpha);
  return createColor(base.hue, base.saturation, clamp(numeric, 0, 100) / 100, base.alpha);
}

function ColorFieldRoot({
  children,
  className,
  value,
  defaultValue,
  onChange,
  channel,
  colorSpace,
  fullWidth,
  isDisabled,
  isReadOnly,
  isInvalid,
  isRequired,
  name,
  render,
  ...props
}: ColorFieldRootProps) {
  const reactId = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState<ColorValue | null>(() => toColor(defaultValue));
  const [isFocusWithin, setIsFocusWithin] = React.useState(false);
  const current = value !== undefined ? value : uncontrolled;
  const disabled = Boolean(isDisabled || props["aria-disabled"]);
  const readOnly = Boolean(isReadOnly);
  const invalid = Boolean(isInvalid);

  const setValue = React.useCallback(
    (next: ColorValue | null) => {
      if (value === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const renderProps = {
    isDisabled: disabled,
    isInvalid: invalid,
    isReadOnly: readOnly,
    isFocused: isFocusWithin,
    isFocusWithin,
    isFocusVisible: isFocusWithin,
    isRequired: Boolean(isRequired),
  };

  const rootProps: React.HTMLAttributes<HTMLDivElement> = {
    ...props,
    id: props.id,
    className: cn("color-field", fullWidth && "color-field--full-width", className),
    "data-slot": "color-field",
    "data-disabled": disabled ? "true" : undefined,
    "data-invalid": invalid ? "true" : undefined,
    "data-readonly": readOnly ? "true" : undefined,
    "data-required": isRequired ? "true" : undefined,
    "data-full-width": fullWidth ? "true" : undefined,
    "data-channel": channel,
    onFocus: (event) => {
      setIsFocusWithin(true);
      props.onFocus?.(event);
    },
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocusWithin(false);
      props.onBlur?.(event);
    },
  };

  return (
    <ColorFieldContext.Provider
      value={{ id: props.id ?? reactId, name, value: current, setValue, channel, colorSpace, isDisabled: disabled, isReadOnly: readOnly, isInvalid: invalid }}
    >
      <RequiredContext.Provider value={Boolean(isRequired)}>
        <ColorFieldStyles />
        {render ? (
          render(rootProps)
        ) : (
          <div {...rootProps}>{typeof children === "function" ? children(renderProps) : children}</div>
        )}
      </RequiredContext.Provider>
    </ColorFieldContext.Provider>
  );
}

const ColorFieldGroup = React.forwardRef<HTMLDivElement, ColorFieldGroupProps>(
  ({ children, className, variant = "primary", fullWidth, render, ...props }, ref) => {
    const context = useColorFieldContext();
    const groupProps: React.HTMLAttributes<HTMLDivElement> = {
      ...props,
      ref,
      role: "presentation",
      className: cn("color-input-group", `color-input-group--${variant}`, fullWidth && "color-input-group--full-width", className),
      "data-slot": "color-input-group",
      "data-variant": variant,
      "data-disabled": context.isDisabled ? "true" : undefined,
    } as React.HTMLAttributes<HTMLDivElement>;
    return render ? render(groupProps) : <div {...groupProps}>{children}</div>;
  },
);
ColorFieldGroup.displayName = "ColorField.Group";

const ColorFieldPrefix = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("color-input-group__prefix", className)} data-slot="color-input-group-prefix" {...props} />
  ),
);
ColorFieldPrefix.displayName = "ColorField.Prefix";

const ColorFieldSuffix = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("color-input-group__suffix", className)} data-slot="color-input-group-suffix" {...props} />
  ),
);
ColorFieldSuffix.displayName = "ColorField.Suffix";

const ColorFieldInput = React.forwardRef<HTMLInputElement, ColorFieldInputProps>(
  ({ className, placeholder, defaultValue, value, onBlur, onChange, onFocus, onKeyDown, ...props }, ref) => {
    const context = useColorFieldContext();
    const controlledText = value ?? (context.channel ? formatChannelValue(context.value, context.channel) : context.value?.toString("hex") ?? "");
    const [draft, setDraft] = React.useState(defaultValue ?? controlledText);
    const [isEditing, setIsEditing] = React.useState(false);
    const shown = isEditing ? draft : (value !== undefined || context.value !== undefined ? controlledText : draft);

    React.useEffect(() => {
      if (!isEditing && (context.value || context.channel)) setDraft(controlledText);
    }, [context.channel, context.value, controlledText, isEditing]);

    return (
      <input
        ref={ref}
        aria-invalid={context.isInvalid ? "true" : undefined}
        aria-readonly={context.isReadOnly ? "true" : undefined}
        autoComplete="off"
        autoCorrect="off"
        className={cn("color-input-group__input", className)}
        data-slot="color-input-group-input"
        disabled={context.isDisabled}
        id={context.id}
        inputMode={context.channel ? "numeric" : "text"}
        name={context.channel ? undefined : context.name}
        placeholder={placeholder}
        readOnly={context.isReadOnly}
        spellCheck={false}
        type="text"
        value={shown}
        {...props}
        onBlur={(event) => {
          setIsEditing(false);
          onBlur?.(event);
        }}
        onChange={(event) => {
          setDraft(event.target.value);
          if (context.channel) {
            const next = updateChannel(context.value, context.channel, event.target.value);
            context.setValue(next);
            setDraft(formatChannelValue(next, context.channel));
          } else if (/^#?[0-9a-fA-F]{6}$/.test(event.target.value.trim())) {
            context.setValue(parseColor(event.target.value));
          } else if (event.target.value.trim() === "") {
            context.setValue(null);
          }
          onChange?.(event);
        }}
        onFocus={(event) => {
          setIsEditing(true);
          setDraft(controlledText);
          onFocus?.(event);
        }}
        onKeyDown={(event) => {
          if (context.channel && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
            event.preventDefault();
            const step = context.channel === "hue" ? 1 : 1;
            const numeric = Number.parseFloat(shown.replace(/[^\d.-]/g, "")) || 0;
            const next = updateChannel(context.value, context.channel, String(numeric + (event.key === "ArrowUp" ? step : -step)));
            context.setValue(next);
            setDraft(formatChannelValue(next, context.channel));
          }
          onKeyDown?.(event);
        }}
      />
    );
  },
);
ColorFieldInput.displayName = "ColorField.Input";

export const ColorField = Object.assign(ColorFieldRoot, {
  Root: ColorFieldRoot,
  Group: ColorFieldGroup,
  Input: ColorFieldInput,
  Prefix: ColorFieldPrefix,
  Suffix: ColorFieldSuffix,
});

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const context = React.useContext(ColorFieldContext);
  const required = React.useContext(RequiredContext);
  return (
    <label
      className={cn("label", className)}
      data-required={required ? "true" : undefined}
      data-slot="label"
      htmlFor={props.htmlFor ?? context?.id}
      {...props}
    >
      {children}
    </label>
  );
}

export function Description({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("description", className)} data-slot="description" {...props} />;
}

export function FieldError({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("field-error", className)} data-slot="field-error" data-visible="true" {...props} />;
}

export function ColorSwatch({ className, color, size = "md", shape = "circle", style, ...props }: ColorSwatchProps) {
  const current = typeof color === "string" ? color : color?.toString("css") ?? "rgba(255, 255, 255, 0)";
  return (
    <div
      aria-label={current}
      aria-roledescription="color swatch"
      className={cn("color-swatch", `color-swatch--${shape}`, `color-swatch--${size}`, className)}
      data-shape={shape}
      data-size={size}
      data-slot="color-swatch"
      role="img"
      style={{ "--color-swatch-current": current, ...style } as React.CSSProperties}
      {...props}
    />
  );
}

export function Surface({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface surface--default", className)} data-slot="surface" {...props} />;
}

export function Button({
  className,
  isDisabled,
  isPending,
  onPress,
  onClick,
  variant = "tertiary",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isDisabled?: boolean;
  isPending?: boolean;
  onPress?: () => void;
  variant?: "primary" | "tertiary";
}) {
  return (
    <button
      className={cn(className)}
      data-slot="button"
      data-variant={variant}
      disabled={Boolean(isDisabled || isPending || props.disabled)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onPress?.();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export type ColorFieldProps = React.ComponentProps<typeof ColorFieldRoot>;
