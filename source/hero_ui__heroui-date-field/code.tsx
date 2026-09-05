"use client";

import * as React from "react";

const sourcePreviewStrings = ["mm/dd/yyyy", "2/3/2025", "6/1/2026", "Current value: (empty)"];

type Granularity = "day" | "hour" | "minute" | "second";
type DateLikeInput = DateValue | string | null | undefined;

export type DateValue = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  timeZone?: string;
  toString: () => string;
  compare: (other: DateValue) => number;
};

type DateFieldContextValue = {
  id: string;
  name?: string;
  value: DateValue | null;
  setValue: (value: DateValue | null) => void;
  placeholderValue: DateValue;
  granularity: Granularity;
  isDisabled: boolean;
  isInvalid: boolean;
  isRequired: boolean;
};

type DateFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "children"> & {
  children: React.ReactNode | ((values: {
    isDisabled: boolean;
    isInvalid: boolean;
    isReadOnly: boolean;
    isRequired: boolean;
    isFocused: boolean;
    isFocusWithin: boolean;
    isFocusVisible: boolean;
  }) => React.ReactNode);
  name?: string;
  value?: DateValue | null;
  defaultValue?: DateLikeInput;
  onChange?: (value: DateValue | null) => void;
  placeholderValue?: DateLikeInput;
  granularity?: Granularity;
  fullWidth?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  minValue?: DateValue | null;
};

type DateInputGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
};

type SegmentType = "month" | "day" | "year" | "hour" | "minute" | "second" | "literal";

type Segment = {
  type: SegmentType;
  text: string;
  placeholder: string;
};

const DateFieldContext = React.createContext<DateFieldContextValue | null>(null);
const DateInputGroupContext = React.createContext<{ variant: "primary" | "secondary" }>({
  variant: "primary",
});

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function compareParts(a: DateValue, b: DateValue) {
  for (const key of ["year", "month", "day", "hour", "minute", "second"] as const) {
    const diff = (a[key] ?? 0) - (b[key] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function makeDateValue(
  year: number,
  month: number,
  day: number,
  hour?: number,
  minute?: number,
  second?: number,
  timeZone?: string,
): DateValue {
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    timeZone,
    toString() {
      const date = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (hour === undefined) return date;
      const time = `${String(hour).padStart(2, "0")}:${String(minute ?? 0).padStart(2, "0")}:${String(second ?? 0).padStart(2, "0")}`;
      return timeZone ? `${date}T${time}[${timeZone}]` : `${date}T${time}`;
    },
    compare(other) {
      return compareParts(this, other);
    },
  };
}

export function parseDate(value: string): DateValue {
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
  return makeDateValue(year || 2025, month || 1, day || 1);
}

export function parseZonedDateTime(value: string): DateValue {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?\[(.+)\]$/);
  if (!match) return parseDate(value);
  return makeDateValue(
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] ?? 0),
    match[7],
  );
}

export function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function today(_timeZone?: string): DateValue {
  const now = new Date();
  return makeDateValue(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function toDateValue(value: DateLikeInput): DateValue | null {
  if (!value) return null;
  if (typeof value === "string") return value.includes("T") ? parseZonedDateTime(value) : parseDate(value);
  return value;
}

function useDateField() {
  const context = React.useContext(DateFieldContext);
  if (!context) throw new Error("DateField compound components must be rendered inside DateField");
  return context;
}

function DateFieldStyles() {
  return (
    <style>{`
      [data-slot="date-field"] {
        display: flex;
        flex-direction: column;
        gap: 4px;
        color: hsl(var(--foreground, 240 10% 96%));
      }
      [data-slot="date-field"][data-full-width="true"] { width: 100%; }
      [data-slot="date-field"][data-disabled="true"] { opacity: .5; }
      [data-slot="date-field"][data-invalid="true"] [data-slot="description"] { display: none; }
      [data-slot="label"] {
        display: block;
        width: fit-content;
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
        padding-inline: 4px;
      }
      [data-slot="field-error"] {
        display: block;
        color: rgb(248 113 113);
        font-size: 12px;
        line-height: 16px;
        padding-inline: 4px;
      }
      [data-slot="date-input-group"] {
        display: inline-flex;
        align-items: center;
        height: 36px;
        overflow: visible;
        border-radius: 12px;
        border: 1px solid hsl(var(--border, 240 4% 24%));
        background: hsl(var(--field, 240 6% 10%));
        color: hsl(var(--foreground, 240 10% 96%));
        box-shadow: 0 1px 2px rgb(0 0 0 / .28);
        outline: none;
        transition: background-color 150ms cubic-bezier(.4,0,.2,1), border-color 150ms cubic-bezier(.4,0,.2,1), box-shadow 150ms cubic-bezier(0,0,.2,1);
      }
      [data-slot="date-input-group"][data-full-width="true"] { width: 100%; }
      [data-slot="date-input-group"][data-variant="secondary"] {
        box-shadow: none;
        background: hsl(var(--default, 240 5% 14%));
      }
      [data-slot="date-input-group"]:hover:not(:focus-within) {
        background: hsl(var(--field-hover, 240 5% 13%));
        border-color: hsl(var(--border, 240 4% 30%));
      }
      [data-slot="date-input-group"]:focus-within {
        border-color: rgb(139 92 246 / .65);
        box-shadow: 0 0 0 3px rgb(139 92 246 / .2);
      }
      [data-slot="date-input-group"][data-invalid="true"] {
        border-color: rgb(244 63 94);
        background: hsl(var(--field-focus, 240 5% 12%));
        box-shadow: 0 0 0 1px rgb(244 63 94 / .65);
      }
      [data-slot="date-input-group"][data-disabled="true"] {
        pointer-events: none;
        opacity: .5;
      }
      [data-slot="date-input-group-input"] {
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        gap: 1px;
        min-width: 0;
        height: 100%;
        padding: 8px 12px;
        border: 0;
        background: transparent;
        font-size: 14px;
        line-height: 20px;
        outline: none;
        cursor: text;
      }
      [data-slot="date-input-group"]:has([data-slot="date-input-group-prefix"]) [data-slot="date-input-group-input"] { padding-left: 8px; }
      [data-slot="date-input-group"]:has([data-slot="date-input-group-suffix"]) [data-slot="date-input-group-input"] { padding-right: 8px; }
      [data-slot="date-input-group-segment"] {
        display: inline-block;
        border-radius: 6px;
        padding-inline: 2px;
        white-space: nowrap;
        text-align: end;
        outline: none;
      }
      [data-slot="date-input-group-segment"][data-type="literal"] {
        padding-inline: 0;
        color: hsl(var(--muted-foreground, 240 5% 64%));
      }
      [data-slot="date-input-group-segment"][data-placeholder="true"] {
        color: hsl(var(--field-placeholder, 240 5% 56%));
      }
      [data-slot="date-input-group-segment"]:focus,
      [data-slot="date-input-group-segment"][data-focused="true"] {
        background: oklab(0.62039 -0.0543154 -0.187265 / 0.15);
        color: oklab(0.497363 -0.0375369 -0.132786);
      }
      [data-slot="date-input-group-segment"][data-invalid="true"] {
        color: rgb(248 113 113);
      }
      [data-slot="date-input-group-segment"][data-invalid="true"]:focus {
        background: rgb(244 63 94 / .18);
        color: rgb(254 202 202);
      }
      [data-slot="date-input-group-prefix"] {
        pointer-events: none;
        flex-shrink: 0;
        margin-left: 12px;
        margin-right: 0;
        display: flex;
        align-items: center;
        color: hsl(var(--field-placeholder, 240 5% 56%));
      }
      [data-slot="date-input-group-suffix"] {
        pointer-events: none;
        flex-shrink: 0;
        margin-right: 12px;
        display: flex;
        align-items: center;
        color: hsl(var(--field-placeholder, 240 5% 56%));
      }
      [data-slot="surface"] {
        border-radius: 16px;
        border: 1px solid hsl(var(--border, 240 4% 22%));
        background: hsl(var(--surface, 240 5% 9%));
        box-shadow: 0 10px 30px rgb(0 0 0 / .28);
      }
      [data-slot="button"] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 36px;
        border-radius: 10px;
        padding-inline: 14px;
        border: 1px solid hsl(var(--border, 240 4% 24%));
        background: hsl(var(--default, 240 5% 14%));
        color: hsl(var(--foreground, 240 10% 96%));
        font-size: 14px;
        line-height: 20px;
        transition: transform 120ms ease, background-color 150ms ease, border-color 150ms ease;
      }
      [data-slot="button"]:hover:not(:disabled) { background: hsl(var(--default-hover, 240 4% 18%)); }
      [data-slot="button"]:active:not(:disabled) { transform: scale(.98); }
      [data-slot="button"]:focus-visible { outline: 2px solid rgb(139 92 246 / .7); outline-offset: 2px; }
      [data-slot="button"]:disabled { opacity: .45; cursor: not-allowed; }
      [data-slot="select"] { position: relative; display: flex; flex-direction: column; gap: 4px; }
      [data-slot="select-trigger"] {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        height: 36px;
        border-radius: 12px;
        border: 1px solid hsl(var(--border, 240 4% 24%));
        background: hsl(var(--default, 240 5% 14%));
        color: hsl(var(--foreground, 240 10% 96%));
        padding-inline: 12px;
        font-size: 14px;
        outline: none;
      }
      [data-slot="select-trigger"]:focus-visible { box-shadow: 0 0 0 3px rgb(139 92 246 / .2); border-color: rgb(139 92 246 / .65); }
      [data-slot="select-popover"] {
        position: absolute;
        z-index: 20;
        top: calc(100% + 6px);
        left: 0;
        width: 132px;
        border-radius: 12px;
        border: 1px solid hsl(var(--border, 240 4% 24%));
        background: hsl(var(--popover, 240 6% 10%));
        padding: 4px;
        box-shadow: 0 12px 32px rgb(0 0 0 / .4);
      }
      [data-slot="list-box"] { display: flex; flex-direction: column; gap: 2px; }
      [data-slot="list-box-item"] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 32px;
        border-radius: 8px;
        padding-inline: 8px;
        color: hsl(var(--foreground, 240 10% 96%));
        font-size: 14px;
        outline: none;
      }
      [data-slot="list-box-item"][data-focused="true"],
      [data-slot="list-box-item"]:hover { background: hsl(var(--accent, 262 83% 58%) / .16); }
      [data-slot="tooltip"] { position: relative; display: inline-flex; }
      [data-slot="tooltip-content"] {
        position: absolute;
        top: calc(100% + 7px);
        left: 0;
        z-index: 30;
        width: 250px;
        border-radius: 12px;
        border: 1px solid hsl(var(--border, 240 4% 24%));
        background: hsl(var(--popover, 240 6% 10%));
        color: hsl(var(--foreground, 240 10% 96%));
        padding: 10px 12px;
        font-size: 12px;
        line-height: 18px;
        box-shadow: 0 12px 32px rgb(0 0 0 / .38);
      }
      .light [data-slot="date-field"], .light [data-slot="label"] { color: hsl(var(--foreground, 240 10% 4%)); }
      .light [data-slot="description"],
      .light [data-slot="date-input-group-segment"][data-type="literal"],
      .light [data-slot="date-input-group-prefix"],
      .light [data-slot="date-input-group-suffix"] { color: hsl(var(--muted-foreground, 240 4% 46%)); }
      .light [data-slot="date-input-group"] {
        background: hsl(var(--field, 0 0% 100%));
        color: hsl(var(--foreground, 240 10% 4%));
        border-color: hsl(var(--border, 240 6% 90%));
        box-shadow: 0 1px 2px rgb(0 0 0 / .06);
      }
      .light [data-slot="date-input-group"]:hover:not(:focus-within) { background: hsl(var(--field-hover, 240 5% 96%)); }
      .light [data-slot="date-input-group"][data-variant="secondary"],
      .light [data-slot="select-trigger"],
      .light [data-slot="button"] { background: hsl(var(--default, 240 5% 96%)); color: hsl(var(--foreground, 240 10% 4%)); border-color: hsl(var(--border, 240 6% 90%)); }
      .light [data-slot="surface"],
      .light [data-slot="select-popover"],
      .light [data-slot="tooltip-content"] { background: hsl(var(--surface, 0 0% 100%)); color: hsl(var(--foreground, 240 10% 4%)); border-color: hsl(var(--border, 240 6% 90%)); box-shadow: 0 10px 30px rgb(0 0 0 / .08); }
    `}</style>
  );
}

function DateFieldRoot({
  children,
  className,
  defaultValue,
  fullWidth,
  granularity = "day",
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  name,
  onChange,
  placeholderValue,
  value,
  ...props
}: DateFieldProps) {
  const id = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState<DateValue | null>(() => toDateValue(defaultValue));
  const current = value !== undefined ? value : uncontrolled;
  const setValue = React.useCallback(
    (next: DateValue | null) => {
      if (value === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const context = React.useMemo<DateFieldContextValue>(
    () => ({
      id,
      name,
      value: current ?? null,
      setValue,
      placeholderValue: toDateValue(placeholderValue) ?? makeDateValue(2026, 1, 1),
      granularity,
      isDisabled,
      isInvalid,
      isRequired,
    }),
    [current, granularity, id, isDisabled, isInvalid, isRequired, name, placeholderValue, setValue],
  );

  return (
    <DateFieldContext.Provider value={context}>
      <DateFieldStyles />
      <div
        className={cn("date-field", fullWidth && "date-field--full-width", className)}
        data-disabled={isDisabled || undefined}
        data-full-width={fullWidth || undefined}
        data-invalid={isInvalid || undefined}
        data-required={isRequired || undefined}
        data-slot="date-field"
        role="group"
        {...props}
      >
        {typeof children === "function"
          ? children({ isDisabled, isInvalid, isReadOnly: false, isRequired, isFocused: false, isFocusWithin: false, isFocusVisible: false })
          : children}
      </div>
    </DateFieldContext.Provider>
  );
}

function DateInputGroup({ children, className, fullWidth, variant = "primary", ...props }: DateInputGroupProps) {
  const field = useDateField();
  return (
    <DateInputGroupContext.Provider value={{ variant }}>
      <div
        className={cn("date-input-group", `date-input-group--${variant}`, fullWidth && "date-input-group--full-width", className)}
        data-disabled={field.isDisabled || undefined}
        data-full-width={fullWidth || undefined}
        data-invalid={field.isInvalid || undefined}
        data-slot="date-input-group"
        data-variant={variant}
        {...props}
      >
        {children}
      </div>
    </DateInputGroupContext.Provider>
  );
}

function getSegments(value: DateValue | null, placeholderValue: DateValue, granularity: Granularity): Segment[] {
  const display = value ?? placeholderValue;
  const dateSegments: Segment[] = [
    { type: "month", text: value ? String(display.month) : "mm", placeholder: "mm" },
    { type: "literal", text: "/", placeholder: "/" },
    { type: "day", text: value ? String(display.day) : "dd", placeholder: "dd" },
    { type: "literal", text: "/", placeholder: "/" },
    { type: "year", text: value ? String(display.year) : "yyyy", placeholder: "yyyy" },
  ];
  if (granularity === "day") return dateSegments;
  const hour = display.hour ?? 8;
  const minute = display.minute ?? 45;
  const second = display.second ?? 0;
  const timeSegments: Segment[] = [
    { type: "literal", text: ", ", placeholder: ", " },
    { type: "hour", text: value ? String(hour) : "--", placeholder: "--" },
  ];
  if (granularity === "minute" || granularity === "second") {
    timeSegments.push({ type: "literal", text: ":", placeholder: ":" }, { type: "minute", text: value ? String(minute).padStart(2, "0") : "--", placeholder: "--" });
  }
  if (granularity === "second") {
    timeSegments.push({ type: "literal", text: ":", placeholder: ":" }, { type: "second", text: value ? String(second).padStart(2, "0") : "--", placeholder: "--" });
  }
  return dateSegments.concat(timeSegments);
}

function updateDatePart(value: DateValue | null, placeholder: DateValue, type: SegmentType, delta: number): DateValue {
  const base = value ?? placeholder;
  const current = type === "hour" ? (base.hour ?? 8) : type === "minute" ? (base.minute ?? 45) : type === "second" ? (base.second ?? 0) : Number(base[type as keyof DateValue] ?? 1);
  return setDatePart(value, placeholder, type, current + delta);
}

function setDatePart(value: DateValue | null, placeholder: DateValue, type: SegmentType, rawPart: number): DateValue {
  const base = value ?? placeholder;
  const next = {
    year: base.year,
    month: base.month,
    day: base.day,
    hour: base.hour,
    minute: base.minute,
    second: base.second,
    timeZone: base.timeZone,
  };
  if (type === "month") next.month = Math.min(12, Math.max(1, rawPart));
  if (type === "day") next.day = Math.min(31, Math.max(1, rawPart));
  if (type === "year") next.year = Math.min(2099, Math.max(1, rawPart));
  if (type === "hour") next.hour = Math.min(23, Math.max(0, rawPart));
  if (type === "minute") next.minute = Math.min(59, Math.max(0, rawPart));
  if (type === "second") next.second = Math.min(59, Math.max(0, rawPart));
  return makeDateValue(next.year, next.month, next.day, next.hour, next.minute, next.second, next.timeZone);
}

function segmentMaxLength(type: SegmentType) {
  if (type === "year") return 4;
  if (type === "literal") return 0;
  return 2;
}

function DateInput({ className }: { className?: string; children?: (segment: Segment) => React.ReactNode }) {
  const field = useDateField();
  const segments = getSegments(field.value, field.placeholderValue, field.granularity);
  const firstEditable = React.useRef<HTMLSpanElement | null>(null);
  const segmentRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const moveFocus = React.useCallback((fromIndex: number, direction: 1 | -1) => {
    const next = segmentRefs.current
      .slice(direction === 1 ? fromIndex + 1 : 0, direction === 1 ? undefined : fromIndex)
      [direction === 1 ? "find" : "findLast"]((node) => node?.getAttribute("role") === "spinbutton");
    next?.focus();
  }, []);

  return (
    <div
      aria-label={field.name ?? "Date"}
      className={cn("date-input-group__input", className)}
      data-slot="date-input-group-input"
      onClick={() => firstEditable.current?.focus()}
      role="presentation"
    >
      {segments.map((segment, index) => (
        <DateSegment
          key={`${segment.type}-${index}`}
          ref={(node) => {
            segmentRefs.current[index] = node;
            if (segment.type !== "literal" && node && !firstEditable.current) firstEditable.current = node;
          }}
          segment={segment}
          segmentIndex={index}
          moveFocus={moveFocus}
        />
      ))}
      {field.name ? <input name={field.name} readOnly type="hidden" value={field.value?.toString() ?? ""} /> : null}
    </div>
  );
}

const DateSegment = React.forwardRef<HTMLSpanElement, { segment: Segment; segmentIndex: number; moveFocus: (fromIndex: number, direction: 1 | -1) => void }>(function DateSegment({ segment, segmentIndex, moveFocus }, ref) {
  const field = useDateField();
  const [focused, setFocused] = React.useState(false);
  const editBuffer = React.useRef("");
  const editable = segment.type !== "literal";
  const commitDigit = React.useCallback((digit: string) => {
    const maxLength = segmentMaxLength(segment.type);
    const nextBuffer = (editBuffer.current + digit).slice(-maxLength);
    editBuffer.current = nextBuffer;
    field.setValue(setDatePart(field.value, field.placeholderValue, segment.type, Number.parseInt(nextBuffer, 10)));
    if (nextBuffer.length >= maxLength) {
      editBuffer.current = "";
      moveFocus(segmentIndex, 1);
    }
  }, [field, moveFocus, segment.type, segmentIndex]);
  return (
    <span
      ref={ref}
      aria-disabled={field.isDisabled || undefined}
      aria-invalid={field.isInvalid || undefined}
      aria-label={editable ? segment.type : undefined}
      aria-valuetext={editable ? segment.text : undefined}
      className="date-input-group__segment"
      data-focused={focused || undefined}
      data-invalid={field.isInvalid || undefined}
      data-placeholder={!field.value && editable ? true : undefined}
      data-slot="date-input-group-segment"
      data-type={segment.type}
      onBlur={() => {
        editBuffer.current = "";
        setFocused(false);
      }}
      onFocus={() => {
        editBuffer.current = "";
        setFocused(true);
      }}
      onKeyDown={(event) => {
        if (!editable || field.isDisabled) return;
        if (/^\d$/.test(event.key)) {
          event.preventDefault();
          commitDigit(event.key);
        }
        if (event.key === "Backspace" || event.key === "Delete") {
          event.preventDefault();
          editBuffer.current = "";
          field.setValue(null);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          moveFocus(segmentIndex, 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveFocus(segmentIndex, -1);
        }
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          editBuffer.current = "";
          field.setValue(updateDatePart(field.value, field.placeholderValue, segment.type, event.key === "ArrowUp" ? 1 : -1));
        }
      }}
      role={editable ? "spinbutton" : undefined}
      tabIndex={editable && !field.isDisabled ? 0 : undefined}
    >
      {segment.text}
    </span>
  );
});

function InputContainer({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("date-input-group__input-container", className)} data-slot="date-input-group-input-container" {...props}>
      {children}
    </div>
  );
}

function Prefix({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("date-input-group__prefix", className)} data-slot="date-input-group-prefix" {...props}>
      {children}
    </div>
  );
}

function Suffix({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("date-input-group__suffix", className)} data-slot="date-input-group-suffix" {...props}>
      {children}
    </div>
  );
}

export function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const context = React.useContext(DateFieldContext);
  return (
    <label className={className} data-required={context?.isRequired || undefined} data-slot="label" {...props}>
      {children}
    </label>
  );
}

export function Description({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={className} data-slot="description" {...props}>
      {children}
    </span>
  );
}

export function FieldError({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={className} data-slot="field-error" role="alert" {...props}>
      {children}
    </span>
  );
}

export function Surface({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} data-slot="surface" {...props}>
      {children}
    </div>
  );
}

export function Button({
  children,
  isDisabled,
  isPending,
  onPress,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isDisabled?: boolean; isPending?: boolean; onPress?: () => void; variant?: string }) {
  return (
    <button data-slot="button" disabled={isDisabled || isPending} onClick={onPress} type="button" {...props}>
      {children}
    </button>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M4.5 1.5v2m7-2v2m-9 2.5h11m-10-3.5h9a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 12.5 14h-9A1.5 1.5 0 0 1 2 12.5V4a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function CircleQuestionIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M8 14.5A6.5 6.5 0 1 0 8 1.5a6.5 6.5 0 0 0 0 13Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.4 6.2A1.8 1.8 0 1 1 8.2 8c-.7.35-.7.8-.7 1.2M7.5 11.5h.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

type SelectContextValue = {
  open: boolean;
  value: string;
  setOpen: (open: boolean) => void;
  setValue: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

export function Select({
  children,
  className,
  onChange,
  value,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string; onChange: (value: string) => void; placeholder?: string; variant?: string }) {
  const [open, setOpen] = React.useState(false);
  const context = React.useMemo(
    () => ({
      open,
      value,
      setOpen,
      setValue: (next: string) => {
        onChange(next);
        setOpen(false);
      },
    }),
    [onChange, open, value],
  );
  return (
    <SelectContext.Provider value={context}>
      <div className={className} data-slot="select" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

Select.Trigger = function SelectTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SelectContext)!;
  return (
    <button
      aria-expanded={context.open}
      aria-haspopup="listbox"
      data-slot="select-trigger"
      onClick={() => context.setOpen(!context.open)}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          context.setOpen(true);
        }
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

Select.Value = function SelectValue() {
  const context = React.useContext(SelectContext)!;
  return <span>{context.value.charAt(0).toUpperCase() + context.value.slice(1)}</span>;
};

Select.Indicator = function SelectIndicator() {
  return <ChevronDownIcon className="size-4 text-muted" />;
};

Select.Popover = function SelectPopover({ children }: { children: React.ReactNode }) {
  const context = React.useContext(SelectContext)!;
  if (!context.open) return null;
  return (
    <div data-slot="select-popover">
      {children}
    </div>
  );
};

export function ListBox({ children }: { children: React.ReactNode }) {
  return (
    <div data-slot="list-box" role="listbox">
      {children}
    </div>
  );
}

ListBox.Item = function ListBoxItem({ children, id, textValue }: { children: React.ReactNode; id: string; textValue?: string }) {
  const context = React.useContext(SelectContext)!;
  const [focused, setFocused] = React.useState(false);
  const selected = context.value === id;
  return (
    <div
      aria-selected={selected}
      data-focused={focused || undefined}
      data-slot="list-box-item"
      id={id}
      onBlur={() => setFocused(false)}
      onClick={() => context.setValue(id)}
      onFocus={() => setFocused(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          context.setValue(id);
        }
      }}
      role="option"
      tabIndex={0}
    >
      {children}
      {selected ? <span aria-hidden="true" className="ml-2 text-xs">✓</span> : null}
    </div>
  );
};

ListBox.ItemIndicator = function ListBoxItemIndicator() {
  return null;
};

export function Tooltip({ children }: { children: React.ReactNode; delay?: number }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div data-slot="tooltip" onBlur={() => setOpen(false)} onFocus={() => setOpen(true)} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>
    </div>
  );
}

const TooltipContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

Tooltip.Trigger = function TooltipTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="inline-flex items-center justify-center" type="button" {...props}>
      {children}
    </button>
  );
};

Tooltip.Content = function TooltipContent({ children }: { children: React.ReactNode; placement?: string }) {
  const context = React.useContext(TooltipContext)!;
  if (!context.open) return null;
  return <div data-slot="tooltip-content">{children}</div>;
};

export const DateField = Object.assign(DateFieldRoot, {
  Root: DateFieldRoot,
  Group: DateInputGroup,
  Input: DateInput,
  InputContainer,
  Segment: DateSegment,
  Prefix,
  Suffix,
});
