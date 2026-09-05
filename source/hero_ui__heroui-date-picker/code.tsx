"use client";

import * as React from "react";

type DateValue = {
  month: string;
  day: string;
  year: string;
  era?: string;
  display?: string;
  iso?: string;
};

type DatePickerProps = {
  label?: React.ReactNode;
  value?: DateValue | null;
  defaultValue?: DateValue | null;
  description?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  minWidth?: string;
  customIndicator?: React.ReactNode;
  showTime?: boolean;
  international?: boolean;
  onChange?: (value: DateValue | null) => void;
};

const MONTH_DAYS = [31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarIcon() {
  return (
    <svg aria-hidden="true" aria-label="Calendar icon" fill="none" height="1em" role="presentation" viewBox="0 0 13 14" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M3.75 4.5A.75.75 0 0 1 3 3.75v-.748a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 1 1-1.5 0v-.75h-4v.747a.75.75 0 0 1-.75.75ZM8.5 1.501h-4V.75a.75.75 0 0 0-1.5 0v.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0v.75Zm-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5h-10Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" role="img" className="iconify iconify--gravity-ui size-4" width="1em" height="1em" viewBox="0 0 16 16">
      <path fill="currentColor" fillRule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" clipRule="evenodd" />
    </svg>
  );
}

function segmentText(value: DateValue | null | undefined, key: keyof DateValue, fallback: string) {
  return value?.[key] || fallback;
}

function formatValue(value: DateValue | null | undefined, showTime?: boolean, international?: boolean) {
  if (!value) return ["mm", "/", "dd", "/", "yyyy"];
  if (value.display) return value.display.split("|");
  if (international) return [value.day, "/", value.month, "/", value.year, " ", value.era || "शक"];
  if (showTime) return [value.month, "/", value.day, "/", value.year, ", ", "\u20668:45\u2069", " AM GMT+4"];
  return [value.month, "/", value.day, "/", value.year];
}

export function DatePicker({
  label = "Date",
  value,
  defaultValue = null,
  description,
  disabled = false,
  invalid = false,
  required = false,
  minWidth = "w-64",
  customIndicator,
  showTime = false,
  international = false,
  onChange,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = React.useState<DateValue | null>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [focusedSegment, setFocusedSegment] = React.useState<string | null>(null);
  const currentValue = isControlled ? value : innerValue;
  const segments = formatValue(currentValue, showTime, international);

  const setDate = React.useCallback(
    (next: DateValue | null) => {
      if (!isControlled) setInnerValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleTrigger = () => {
    if (!disabled) setOpen((next) => !next);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((next) => !next);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const base = currentValue || { month: "6", day: "1", year: "2026", iso: "2026-06-01" };
      const delta = event.key === "ArrowUp" ? 1 : -1;
      const day = Math.max(1, Math.min(30, Number(base.day || 1) + delta));
      setDate({ ...base, day: String(day), iso: `2026-06-${String(day).padStart(2, "0")}` });
    }
  };

  const selectDay = (day: number) => {
    const next = international
      ? { month: "3", day: "11", year: "1948", era: "शक", iso: "2026-06-01" }
      : { month: "6", day: String(day), year: "2026", iso: `2026-06-${String(day).padStart(2, "0")}` };
    setDate(next);
    setOpen(false);
  };

  return (
    <div data-slot="date-picker" className={`date-picker ${minWidth}`} data-rac="" data-disabled={disabled || undefined} data-invalid={invalid || undefined} data-open={open || undefined}>
      <HeroUIStyles />
      <span className="label" data-slot="label">{label}{required ? <span className="required-mark" aria-hidden="true"> *</span> : null}</span>
      <div
        data-react-aria-pressable="true"
        role="group"
        aria-invalid={invalid || undefined}
        aria-disabled={disabled || undefined}
        className="date-input-group date-input-group--full-width date-input-group--primary"
        data-slot="date-input-group"
        data-rac=""
        onKeyDown={handleKeyDown}
      >
        <div role="presentation" data-react-aria-pressable="true" className="date-input-group__input" data-slot="date-input-group-input" data-rac="">
          {segments.map((segment, index) => {
            const isLiteral = ["/", ", ", " ", " AM GMT+4"].includes(segment);
            return (
              <span
                key={`${segment}-${index}`}
                data-slot="date-input-group-segment"
                role={isLiteral ? undefined : "spinbutton"}
                aria-label={isLiteral ? undefined : index === 0 && international ? "दिन, " : index === 2 && international ? "माह, " : index === 4 && international ? "वर्ष, " : index === 0 ? "month, " : index === 2 ? "day, " : "year, "}
                aria-disabled={disabled || undefined}
                data-placeholder={!currentValue && !isLiteral ? "true" : undefined}
                contentEditable={!disabled && !isLiteral}
                suppressContentEditableWarning
                tabIndex={disabled || isLiteral ? undefined : 0}
                className="date-input-group__segment"
                data-focused={focusedSegment === `${index}` || undefined}
                data-rac=""
                onFocus={() => setFocusedSegment(`${index}`)}
                onBlur={() => setFocusedSegment(null)}
              >
                {segment}
              </span>
            );
          })}
        </div>
        <input type="text" hidden name="date" value={currentValue?.iso || ""} readOnly />
        <div className="date-input-group__suffix" data-slot="date-input-group-suffix">
          <button
            data-slot="date-picker-trigger"
            className="date-picker__trigger"
            data-rac=""
            type="button"
            aria-label="Calendar"
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={handleTrigger}
          >
            <span aria-hidden="true" className="date-picker__trigger-indicator" data-slot="date-picker-trigger-indicator">
              {customIndicator || <CalendarIcon />}
            </span>
          </button>
        </div>
      </div>
      {description ? <span className="description" data-slot="description" slot="description">{description}</span> : null}
      {open ? (
        <div data-slot="date-picker-popover" className="date-picker__popover" role="dialog" aria-label={`${label}, June 2026`}>
          <CalendarView selectedDay={Number(currentValue?.day || 0)} onSelect={selectDay} />
        </div>
      ) : null}
    </div>
  );
}

function CalendarView({ selectedDay, onSelect }: { selectedDay: number; onSelect: (day: number) => void }) {
  const [yearMode, setYearMode] = React.useState(false);
  return (
    <div role="application" data-slot="calendar" className="calendar" aria-label="Event date, June 2026">
      <header data-slot="calendar-header" className="calendar__header">
        <button type="button" data-slot="calendar-year-picker-trigger" className="calendar-year-picker__trigger" onClick={() => setYearMode((next) => !next)}>
          <span data-slot="calendar-year-picker-trigger-heading" className="calendar-year-picker__trigger-heading">June 2026</span>
          <span data-slot="calendar-year-picker-trigger-indicator" className="calendar-year-picker__trigger-indicator"><ChevronDownIcon /></span>
        </button>
        <button type="button" data-slot="calendar-nav-button" className="calendar__nav-button" aria-label="Previous month">‹</button>
        <button type="button" data-slot="calendar-nav-button" className="calendar__nav-button" aria-label="Next month">›</button>
      </header>
      <table role="grid" data-slot="calendar-grid" className="calendar__grid" aria-label="June 2026">
        <thead data-slot="calendar-grid-header" className="calendar__grid-header">
          <tr>{WEEK_DAYS.map((day) => <th key={day} data-slot="calendar-header-cell" className="calendar__header-cell">{day}</th>)}</tr>
        </thead>
        <tbody data-slot="calendar-grid-body" className="calendar__grid-body">
          {[0, 1, 2, 3, 4].map((row) => (
            <tr key={row}>
              {MONTH_DAYS.slice(row * 7, row * 7 + 7).map((day, index) => {
                const outside = row === 0 && index === 0 || row === 4 && index > 1;
                const selected = !outside && selectedDay === day;
                return (
                  <td key={`${row}-${index}`}>
                    <button
                      type="button"
                      role="button"
                      data-slot="calendar-cell"
                      className="calendar__cell"
                      data-outside-month={outside || undefined}
                      data-selected={selected || undefined}
                      onClick={() => !outside && onSelect(day)}
                    >
                      {day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {yearMode ? (
        <div role="listbox" data-slot="calendar-year-picker-grid" className="calendar-year-picker__year-grid">
          {Array.from({ length: 25 }, (_, index) => 2014 + index).map((year) => (
            <button key={year} type="button" data-slot="calendar-year-picker-year-cell" className="calendar-year-picker__year-cell" data-selected={year === 2026 || undefined}>{year}</button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" }) {
  return <button data-slot="button" className={`button button--md button--${variant}`} type="button" onClick={onClick}>{children}</button>;
}

export function HeroUIStyles() {
  return (
    <style>{`
      .date-picker,.date-picker *{box-sizing:border-box}
      .date-picker{position:relative;display:inline-flex;flex-direction:column;gap:.25rem;color:hsl(var(--foreground,240 10% 3.9%));font-family:Inter,ui-sans-serif,system-ui,sans-serif;overflow:visible}
      .date-picker[data-open=true]{z-index:80}
      .date-picker.w-64{width:16rem}.date-picker.min-w-72{min-width:18rem;width:fit-content}.date-picker[data-disabled=true]{opacity:.6}
      .label{font-size:.875rem;line-height:1.25rem;font-weight:500;color:hsl(var(--foreground,240 10% 3.9%))}
      .required-mark{color:#ef4444}
      .description{font-size:.875rem;line-height:1.25rem;color:hsl(var(--muted-foreground,240 3.8% 46.1%))}
      .date-input-group{display:inline-flex;align-items:center;height:2.25rem;overflow:hidden;border-radius:.75rem;border:1px solid hsl(var(--border,240 5.9% 90%));background:hsl(var(--background,0 0% 100%));box-shadow:0 1px 2px rgba(0,0,0,.04);outline:none;transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease}
      .date-input-group:hover{border-color:hsl(var(--foreground,240 10% 3.9%) / .32)}
      .date-input-group:focus-within{border-color:hsl(var(--foreground,240 10% 3.9%) / .38);box-shadow:0 0 0 2px hsl(var(--ring,240 5% 64.9%) / .35)}
      .date-input-group[aria-invalid=true]{border-color:hsl(var(--destructive,0 84% 60%));box-shadow:0 0 0 2px hsl(var(--destructive,0 84% 60%) / .18)}
      .date-input-group[aria-disabled=true]{pointer-events:none;background:hsl(var(--muted,240 4.8% 95.9%));color:hsl(var(--muted-foreground,240 3.8% 46.1%))}
      .date-input-group__input{display:flex;flex:1;align-items:center;gap:1px;min-width:0;padding:.5rem .5rem .5rem .75rem;border:0;background:transparent;font-size:.875rem;line-height:1.25rem;unicode-bidi:isolate}
      .date-input-group__segment{display:inline-block;outline:none;border-radius:.375rem;padding:0 .125rem;color:inherit;text-align:end;text-wrap:nowrap;caret-color:transparent}
      .date-input-group__segment[data-placeholder=true]{color:hsl(var(--muted-foreground,240 3.8% 46.1%))}
      .date-input-group__segment:focus,.date-input-group__segment[data-focused=true]{background:hsl(var(--primary,221 83% 53%) / .14);color:hsl(var(--foreground,240 10% 3.9%))}
      .date-input-group__suffix{pointer-events:none;display:flex;align-items:center;flex-shrink:0;margin-right:.75rem;color:hsl(var(--muted-foreground,240 3.8% 46.1%))}
      .date-picker__trigger{pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;padding:.25rem;border:0;border-radius:.75rem;background:transparent;color:hsl(var(--muted-foreground,240 3.8% 46.1%));cursor:pointer;transition:box-shadow .15s ease,background-color .16s ease,color .16s ease,transform .12s ease}
      .date-picker__trigger:hover{background:hsl(var(--accent,240 4.8% 95.9%));color:hsl(var(--foreground,240 10% 3.9%))}
      .date-picker__trigger:active{transform:scale(.96)}
      .date-picker__trigger:focus-visible{outline:2px solid hsl(var(--ring,240 5% 64.9%));outline-offset:2px}
      .date-picker__trigger-indicator{display:inline-flex;align-items:center;justify-content:center;font-size:1rem}
      .date-picker__popover{position:absolute;z-index:100;top:calc(100% + .5rem);left:0;width:var(--trigger-width,16rem);max-width:var(--trigger-width,16rem);overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;border-radius:min(32px,1.25rem);border:0;background:hsl(var(--popover,0 0% 100%));box-shadow:0 16px 40px rgba(0,0,0,.16),0 2px 8px rgba(0,0,0,.08);padding:.75rem;transform-origin:top;animation:datePickerPopover .16s ease-out}
      .calendar{display:flex;flex-direction:column;gap:.5rem;min-width:0}
      .calendar__header{display:flex;align-items:center;gap:.25rem;height:2rem}
      .calendar-year-picker__trigger{display:flex;align-items:center;gap:.375rem;height:2rem;padding:0 .5rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-weight:500;cursor:pointer}
      .calendar-year-picker__trigger:hover,.calendar__nav-button:hover{background:hsl(var(--accent,240 4.8% 95.9%))}
      .calendar-year-picker__trigger-heading{font-size:.875rem}.calendar-year-picker__trigger-indicator{display:inline-flex;color:hsl(var(--muted-foreground,240 3.8% 46.1%))}
      .calendar__nav-button{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-size:1.125rem;cursor:pointer}.calendar__nav-button + .calendar__nav-button{margin-left:0}
      .calendar__grid{width:100%;border-collapse:separate;border-spacing:0 .125rem;table-layout:fixed}
      .calendar__grid th,.calendar__grid td{padding:0;text-align:center;vertical-align:middle}
      .calendar__header-cell{height:2rem;text-align:center;font-size:.75rem;font-weight:500;color:hsl(var(--muted-foreground,240 3.8% 46.1%))}
      .calendar__cell{display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border:0;border-radius:999px;background:transparent;color:inherit;font-size:.875rem;cursor:pointer;transition:background-color .14s ease,color .14s ease,transform .12s ease}
      .calendar__cell:hover{background:hsl(var(--accent,240 4.8% 95.9%))}
      .calendar__cell:focus-visible{outline:2px solid hsl(var(--ring,240 5% 64.9%));outline-offset:1px}
      .calendar__cell:active{transform:scale(.95)}
      .calendar__cell[data-outside-month=true]{color:hsl(var(--muted-foreground,240 3.8% 46.1%) / .55)}
      .calendar__cell[data-selected=true]{background:hsl(var(--primary,221 83% 53%));color:hsl(var(--primary-foreground,0 0% 98%));font-weight:500}
      .calendar-year-picker__year-grid{max-height:9rem;overflow:auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.25rem;border-top:1px solid hsl(var(--border,240 5.9% 90%));padding-top:.5rem}
      .calendar-year-picker__year-cell{height:2rem;border:0;border-radius:.5rem;background:transparent;color:inherit;font-size:.8125rem;cursor:pointer}
      .calendar-year-picker__year-cell[data-selected=true]{background:hsl(var(--primary,221 83% 53%));color:white}
      .button{display:inline-flex;align-items:center;justify-content:center;height:2.5rem;border-radius:.75rem;border:1px solid transparent;padding:0 .875rem;font-size:.875rem;font-weight:500;transition:background-color .16s ease,transform .12s ease;cursor:pointer}.button:active{transform:scale(.98)}
      .button--primary{background:hsl(var(--primary,221 83% 53%));color:white}.button--primary:hover{background:hsl(var(--primary,221 83% 48%))}
      .button--secondary{background:hsl(var(--secondary,240 4.8% 95.9%));color:hsl(var(--foreground,240 10% 3.9%));border-color:hsl(var(--border,240 5.9% 90%))}
      @keyframes datePickerPopover{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      .dark .label,.dark .date-picker{color:hsl(var(--foreground,0 0% 98%))}
      .dark .description,.dark .date-input-group__segment[data-placeholder=true],.dark .calendar__header-cell{color:hsl(var(--muted-foreground,240 5% 64.9%))}
      .dark .date-input-group{border-color:hsl(var(--border,240 3.7% 15.9%));background:hsl(var(--background,240 10% 3.9%));box-shadow:0 1px 2px rgba(0,0,0,.35)}
      .dark .date-input-group:hover{border-color:hsl(var(--foreground,0 0% 98%) / .28)}
      .dark .date-input-group[aria-disabled=true]{background:hsl(var(--muted,240 3.7% 15.9%));color:hsl(var(--muted-foreground,240 5% 64.9%))}
      .dark .date-picker__trigger:hover,.dark .calendar-year-picker__trigger:hover,.dark .calendar__nav-button:hover,.dark .calendar__cell:hover{background:hsl(var(--accent,240 3.7% 15.9%))}
      .dark .date-picker__popover{background:hsl(var(--popover,240 10% 3.9%));box-shadow:0 18px 44px rgba(0,0,0,.55),0 2px 8px rgba(0,0,0,.32)}
      .dark .button--secondary{background:hsl(var(--secondary,240 3.7% 15.9%));color:hsl(var(--foreground,0 0% 98%));border-color:hsl(var(--border,240 3.7% 15.9%))}
    `}</style>
  );
}
