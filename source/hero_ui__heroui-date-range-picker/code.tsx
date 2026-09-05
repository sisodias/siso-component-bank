"use client";

import * as React from "react";

type SegmentType = "month" | "day" | "year" | "hour" | "minute" | "second" | "era";
type DatePart = {
  month: number;
  day: number;
  year: number;
  hour?: number;
  minute?: number;
  second?: number;
  era?: string;
  timeZone?: string;
};
type DateRangeValue = { start: DatePart; end: DatePart } | null;

type DateRangePickerProps = {
  label?: React.ReactNode;
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  description?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  showTime?: boolean;
  international?: boolean;
  customIndicator?: React.ReactNode;
  minWidth?: string;
  onChange?: (value: DateRangeValue) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_DAYS = [31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4];

function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}

function iso(part: DatePart) {
  return `${pad(part.year, 4)}-${pad(part.month)}-${pad(part.day)}`;
}

function makeDate(month: number, day: number, year = 2026, hour?: number, minute?: number, second?: number): DatePart {
  return { month, day, year, hour, minute, second };
}

export function parseDate(value: string): DatePart {
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10));
  return makeDate(month || 1, day || 1, year || 2026);
}

export function parseZonedDateTime(value: string): DatePart {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\[(.+)\])?$/);
  if (!match) return parseDate(value);
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6] ?? 0),
    timeZone: match[7],
  };
}

export function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function today(_timeZone?: string) {
  const now = new Date();
  return makeDate(now.getMonth() + 1, now.getDate(), now.getFullYear());
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="1em" role="presentation" viewBox="0 0 13 14" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path clipRule="evenodd" d="M3.75 4.5A.75.75 0 0 1 3 3.75v-.748a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 1 1-1.5 0v-.75h-4v.747a.75.75 0 0 1-.75.75ZM8.5 1.501h-4V.75a.75.75 0 0 0-1.5 0v.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0v.75Zm-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5h-10Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="size-4" height="1em" role="img" viewBox="0 0 16 16" width="1em">
      <path clipRule="evenodd" d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

function normalizeRange(value: DateRangeValue | undefined): DateRangeValue {
  if (value === undefined) return null;
  return value;
}

function clampByType(type: SegmentType, value: number) {
  if (type === "month") return Math.max(1, Math.min(12, value));
  if (type === "day") return Math.max(1, Math.min(31, value));
  if (type === "hour") return Math.max(1, Math.min(12, value));
  if (type === "minute" || type === "second") return Math.max(0, Math.min(59, value));
  return Math.max(1, Math.min(9999, value));
}

function segmentLabel(type: SegmentType) {
  if (type === "month") return "month, ";
  if (type === "day") return "day, ";
  if (type === "year") return "year, ";
  if (type === "hour") return "hour, ";
  if (type === "minute") return "minute, ";
  if (type === "second") return "second, ";
  return "era, ";
}

function segmentText(part: DatePart | null | undefined, type: SegmentType, international?: boolean, showTime?: boolean) {
  if (!part) {
    if (type === "month") return "mm";
    if (type === "day") return "dd";
    if (type === "year") return "yyyy";
    if (type === "hour") return "hh";
    if (type === "minute" || type === "second") return "00";
    return "";
  }
  if (type === "month") return String(international ? part.day : part.month);
  if (type === "day") return String(international ? part.month : part.day);
  if (type === "year") return String(part.year);
  if (type === "hour") return String(part.hour ?? (showTime ? 8 : ""));
  if (type === "minute") return pad(part.minute ?? 45);
  if (type === "second") return pad(part.second ?? 0);
  return part.era || "शक";
}

function partWith(part: DatePart | null | undefined, type: SegmentType, raw: number, international?: boolean): DatePart {
  const base = part || makeDate(6, 1, 2026);
  const value = clampByType(type, raw);
  if (type === "month") return international ? { ...base, day: value } : { ...base, month: value };
  if (type === "day") return international ? { ...base, month: value } : { ...base, day: value };
  if (type === "year") return { ...base, year: value };
  if (type === "hour") return { ...base, hour: value };
  if (type === "minute") return { ...base, minute: value };
  if (type === "second") return { ...base, second: value };
  return base;
}

export function DateRangePicker({
  label = "Trip dates",
  value,
  defaultValue = null,
  description,
  disabled = false,
  invalid = false,
  required = false,
  showTime = false,
  international = false,
  customIndicator,
  minWidth = "w-80",
  onChange,
}: DateRangePickerProps) {
  const controlled = value !== undefined;
  const [innerValue, setInnerValue] = React.useState<DateRangeValue>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [focusKey, setFocusKey] = React.useState<string | null>(null);
  const [entryBuffer, setEntryBuffer] = React.useState("");
  const segmentRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const current = controlled ? normalizeRange(value) : innerValue;

  const setRange = React.useCallback((next: DateRangeValue) => {
    if (!controlled) setInnerValue(next);
    onChange?.(next);
  }, [controlled, onChange]);

  const updateSegment = (side: "start" | "end", type: SegmentType, raw: number) => {
    const next = current || { start: makeDate(6, 1, 2026), end: makeDate(6, 6, 2026) };
    setRange({ ...next, [side]: partWith(next[side], type, raw, international) });
  };

  const clearSegment = (side: "start" | "end", type: SegmentType) => {
    const next = current || { start: makeDate(6, 1, 2026), end: makeDate(6, 6, 2026) };
    const part = { ...next[side] };
    if (type === "month") part.month = 1;
    if (type === "day") part.day = 1;
    if (type === "year") part.year = 2026;
    if (type === "hour") part.hour = 8;
    if (type === "minute") part.minute = 0;
    if (type === "second") part.second = 0;
    setRange({ ...next, [side]: part });
  };

  const selectDay = (day: number) => {
    if (!current || (current.start && current.end)) {
      setRange({ start: makeDate(6, day, 2026), end: makeDate(6, day, 2026) });
      return;
    }
    const startDay = current.start.day;
    const end = makeDate(6, day, 2026);
    setRange(day < startDay ? { start: end, end: current.start } : { start: current.start, end });
  };

  const moveSegmentFocus = (index: number, direction: number) => {
    const next = segmentRefs.current[index + direction];
    next?.focus();
  };

  const segmentSpec = React.useMemo(() => {
    const base: Array<{ side: "start" | "end"; type: SegmentType }> = [
      { side: "start", type: "month" },
      { side: "start", type: "day" },
      { side: "start", type: "year" },
      { side: "end", type: "month" },
      { side: "end", type: "day" },
      { side: "end", type: "year" },
    ];
    if (!showTime) return base;
    return [
      { side: "start" as const, type: "month" as const },
      { side: "start" as const, type: "day" as const },
      { side: "start" as const, type: "year" as const },
      { side: "start" as const, type: "hour" as const },
      { side: "start" as const, type: "minute" as const },
      { side: "end" as const, type: "month" as const },
      { side: "end" as const, type: "day" as const },
      { side: "end" as const, type: "year" as const },
      { side: "end" as const, type: "hour" as const },
      { side: "end" as const, type: "minute" as const },
    ];
  }, [showTime]);

  const renderSegment = (side: "start" | "end", type: SegmentType, index: number) => {
    const part = current?.[side] ?? null;
    const key = `${side}-${type}`;
    const isPlaceholder = !part;
    return (
      <span
        ref={(node) => { segmentRefs.current[index] = node; }}
        key={key}
        data-slot="date-input-group-segment"
        className="date-input-group__segment"
        data-placeholder={isPlaceholder || undefined}
        data-focused={focusKey === key || undefined}
        role="spinbutton"
        aria-label={segmentLabel(type)}
        tabIndex={disabled ? undefined : 0}
        onFocus={() => {
          setFocusKey(key);
          setEntryBuffer("");
        }}
        onBlur={() => setFocusKey(null)}
        onKeyDown={(event) => {
          if (disabled) return;
          if (/^\d$/.test(event.key)) {
            event.preventDefault();
            const maxLen = type === "year" ? 4 : 2;
            const nextBuffer = (entryBuffer + event.key).slice(-maxLen);
            setEntryBuffer(nextBuffer);
            updateSegment(side, type, Number(nextBuffer));
            if (nextBuffer.length >= maxLen) moveSegmentFocus(index, 1);
            return;
          }
          if (event.key === "Backspace" || event.key === "Delete") {
            event.preventDefault();
            setEntryBuffer("");
            clearSegment(side, type);
            return;
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            moveSegmentFocus(index, 1);
            return;
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveSegmentFocus(index, -1);
            return;
          }
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            setEntryBuffer("");
            const currentText = Number(segmentText(part, type, international, showTime).replace(/\D/g, "")) || 1;
            updateSegment(side, type, currentText + (event.key === "ArrowUp" ? 1 : -1));
          }
        }}
      >
        {segmentText(part, type, international, showTime)}
      </span>
    );
  };

  const renderInput = (side: "start" | "end", startIndex: number) => {
    const part = current?.[side] ?? null;
    if (showTime) {
      return (
        <>
          {renderSegment(side, "month", startIndex)}
          <span className="date-input-group__literal">/</span>
          {renderSegment(side, "day", startIndex + 1)}
          <span className="date-input-group__literal">/</span>
          {renderSegment(side, "year", startIndex + 2)}
          <span className="date-input-group__literal">,&nbsp;</span>
          <span className="date-input-group__literal">⁦</span>
          {renderSegment(side, "hour", startIndex + 3)}
          <span className="date-input-group__literal">:</span>
          {renderSegment(side, "minute", startIndex + 4)}
          <span className="date-input-group__literal">⁩ {side === "start" ? "AM" : "PM"} GMT+4</span>
        </>
      );
    }
    if (international) {
      return (
        <>
          {renderSegment(side, "month", startIndex)}
          <span className="date-input-group__literal">/</span>
          {renderSegment(side, "day", startIndex + 1)}
          <span className="date-input-group__literal">/</span>
          {renderSegment(side, "year", startIndex + 2)}
          <span className="date-input-group__literal">&nbsp;{part?.era || "शक"}</span>
        </>
      );
    }
    return (
      <>
        {renderSegment(side, "month", startIndex)}
        <span className="date-input-group__literal">/</span>
        {renderSegment(side, "day", startIndex + 1)}
        <span className="date-input-group__literal">/</span>
        {renderSegment(side, "year", startIndex + 2)}
      </>
    );
  };

  return (
    <div data-slot="date-range-picker" className={`date-range-picker ${minWidth}`} data-disabled={disabled || undefined} data-invalid={invalid || undefined} data-open={open || undefined} data-required={required || undefined}>
      <HeroUIStyles />
      <span className="label" data-slot="label" data-required={required || undefined}>{label}</span>
      <div
        aria-disabled={disabled || undefined}
        aria-invalid={invalid || undefined}
        className="date-input-group"
        data-slot="date-input-group"
        role="group"
      >
        <div className="date-input-group__input" data-slot="date-input-group-input">
          <span data-slot="date-range-start-input" className="date-range-picker__input">{renderInput("start", 0)}</span>
          <span data-slot="date-range-picker-range-separator" className="date-range-picker__separator"> - </span>
          <span data-slot="date-range-end-input" className="date-range-picker__input">{renderInput("end", showTime ? 5 : 3)}</span>
        </div>
        <input hidden name="start" readOnly value={current ? iso(current.start) : ""} />
        <input hidden name="end" readOnly value={current ? iso(current.end) : ""} />
        <div className="date-input-group__suffix" data-slot="date-input-group-suffix">
          <button
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label="Calendar"
            className="date-range-picker__trigger"
            data-slot="date-range-picker-trigger"
            disabled={disabled}
            onClick={() => !disabled && setOpen((next) => !next)}
            type="button"
          >
            <span aria-hidden="true" className="date-range-picker__trigger-indicator" data-slot="date-range-picker-trigger-indicator">{customIndicator || <CalendarIcon />}</span>
          </button>
        </div>
      </div>
      {description ? <span className="description" data-slot="description">{description}</span> : null}
      {invalid ? <span className="field-error" data-slot="field-error">Please enter a valid date range.</span> : null}
      {open ? (
        <div className="date-range-picker__popover" data-slot="date-range-picker-popover" role="dialog" aria-label={`${label}, June 2026`}>
          <RangeCalendar selected={current} onSelect={selectDay} />
        </div>
      ) : null}
    </div>
  );
}

function RangeCalendar({ selected, onSelect }: { selected: DateRangeValue; onSelect: (day: number) => void }) {
  const [yearMode, setYearMode] = React.useState(false);
  const start = selected?.start.day ?? 0;
  const end = selected?.end.day ?? 0;
  return (
    <div className="calendar" data-slot="range-calendar" role="application" aria-label="Trip dates, June 2026">
      <header className="calendar__header" data-slot="calendar-header">
        <button className="calendar-year-picker__trigger" data-slot="calendar-year-picker-trigger" onClick={() => setYearMode((next) => !next)} type="button">
          <span className="calendar-year-picker__trigger-heading" data-slot="calendar-year-picker-trigger-heading">June 2026</span>
          <span className="calendar-year-picker__trigger-indicator" data-slot="calendar-year-picker-trigger-indicator"><ChevronDownIcon /></span>
        </button>
        <button aria-label="Previous month" className="calendar__nav-button" data-slot="calendar-nav-button" type="button">‹</button>
        <button aria-label="Next month" className="calendar__nav-button" data-slot="calendar-nav-button" type="button">›</button>
      </header>
      <table aria-label="June 2026" className="calendar__grid" data-slot="calendar-grid" role="grid">
        <thead className="calendar__grid-header" data-slot="calendar-grid-header">
          <tr>{WEEK_DAYS.map((day) => <th className="calendar__header-cell" data-slot="calendar-header-cell" key={day}>{day}</th>)}</tr>
        </thead>
        <tbody className="calendar__grid-body" data-slot="calendar-grid-body">
          {[0, 1, 2, 3, 4].map((row) => (
            <tr key={row}>
              {MONTH_DAYS.slice(row * 7, row * 7 + 7).map((day, index) => {
                const outside = (row === 0 && index === 0) || (row === 4 && index > 1);
                const selectedCell = !outside && (day === start || day === end);
                const inRange = !outside && start && end && day > Math.min(start, end) && day < Math.max(start, end);
                return (
                  <td key={`${row}-${index}`}>
                    <button
                      className="calendar__cell"
                      data-in-range={inRange || undefined}
                      data-outside-month={outside || undefined}
                      data-selected={selectedCell || undefined}
                      data-slot="calendar-cell"
                      onClick={() => !outside && onSelect(day)}
                      role="button"
                      type="button"
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
        <div className="calendar-year-picker__year-grid" data-slot="calendar-year-picker-grid" role="listbox">
          {Array.from({ length: 25 }, (_, index) => 2014 + index).map((year) => (
            <button className="calendar-year-picker__year-cell" data-selected={year === 2026 || undefined} data-slot="calendar-year-picker-year-cell" key={year} type="button">{year}</button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" }) {
  return <button className={`button button--${variant}`} data-slot="button" onClick={onClick} type="button">{children}</button>;
}

export function HeroUIStyles() {
  return (
    <style>{`
      .date-range-picker,.date-range-picker *{box-sizing:border-box}
      .date-range-picker{position:relative;display:inline-flex;flex-direction:column;gap:4px;color:hsl(var(--foreground,240 10% 96%));font-family:Inter,ui-sans-serif,system-ui,sans-serif;overflow:visible}
      .date-range-picker[data-open=true]{z-index:80}
      .date-range-picker.w-80{width:20rem}.date-range-picker.min-w-96{min-width:24rem;width:fit-content}.date-range-picker[data-disabled=true]{opacity:.5}
      .label{display:block;width:fit-content;color:hsl(var(--foreground,240 10% 96%));font-size:14px;line-height:20px;font-weight:400;cursor:default}
      .label[data-required=true]::after{content:" *";color:rgb(244 63 94)}
      .description{display:block;color:hsl(var(--muted-foreground,240 5% 64%));font-size:12px;line-height:16px;padding-inline:4px}
      .field-error{display:block;color:rgb(248 113 113);font-size:12px;line-height:16px;padding-inline:4px}
      .date-input-group{display:inline-flex;align-items:center;width:100%;height:36px;overflow:visible;border-radius:12px;border:1px solid hsl(var(--border,240 4% 24%));background:hsl(var(--field,240 6% 10%));color:hsl(var(--foreground,240 10% 96%));box-shadow:0 1px 2px rgb(0 0 0 / .28);outline:none;transition:background-color 150ms cubic-bezier(.4,0,.2,1),border-color 150ms cubic-bezier(.4,0,.2,1),box-shadow 150ms cubic-bezier(0,0,.2,1)}
      .date-input-group:hover:not(:focus-within){background:hsl(var(--field-hover,240 5% 13%));border-color:hsl(var(--border,240 4% 30%))}
      .date-input-group:focus-within{border-color:rgb(139 92 246 / .65);box-shadow:0 0 0 3px rgb(139 92 246 / .2)}
      .date-input-group[aria-invalid=true]{border-color:rgb(244 63 94);background:hsl(var(--field-focus,240 5% 12%));box-shadow:0 0 0 1px rgb(244 63 94 / .65)}
      .date-input-group[aria-disabled=true]{pointer-events:none;opacity:.5}
      .date-input-group__input{display:flex;flex:1 1 auto;align-items:center;gap:1px;min-width:0;height:100%;padding:8px 8px 8px 12px;border:0;background:transparent;font-size:14px;line-height:20px;white-space:nowrap;unicode-bidi:isolate}
      .date-range-picker__input{display:inline-flex;align-items:center;gap:1px;min-width:0}
      .date-input-group__segment{display:inline-block;min-width:1ch;border-radius:6px;padding:0 2px;color:inherit;text-align:end;outline:none;caret-color:transparent;font-variant-numeric:tabular-nums}
      .date-input-group__segment[data-placeholder=true]{color:hsl(var(--muted-foreground,240 5% 64%))}
      .date-input-group__segment:focus,.date-input-group__segment[data-focused=true]{background:oklab(0.62039 -0.0543154 -0.187265 / .15);color:oklab(0.497363 -0.0375369 -0.132786)}
      .date-input-group__literal,.date-range-picker__separator{color:inherit;white-space:pre}
      .date-input-group__suffix{pointer-events:none;display:flex;align-items:center;flex-shrink:0;margin-right:6px;color:hsl(var(--muted-foreground,240 5% 64%))}
      .date-range-picker__trigger{pointer-events:auto;display:inline-flex;width:24px;height:24px;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:inherit;padding:0;cursor:pointer;transition:background-color 150ms ease,color 150ms ease}
      .date-range-picker__trigger:hover{background:hsl(var(--default,240 5% 18%));color:hsl(var(--foreground,240 10% 96%))}
      .date-range-picker__trigger:focus-visible{outline:2px solid rgb(139 92 246);outline-offset:2px}
      .date-range-picker__trigger-indicator{display:inline-flex;width:16px;height:16px;align-items:center;justify-content:center}.date-range-picker__trigger-indicator svg{width:16px;height:16px}
      .date-range-picker__popover{position:absolute;top:calc(100% + 6px);left:0;z-index:100;width:100%;min-width:256px;border-radius:14px;border:1px solid hsl(var(--border,240 4% 24%));background:hsl(var(--popover,240 6% 10%));color:hsl(var(--popover-foreground,240 10% 96%));box-shadow:0 12px 28px rgb(0 0 0 / .38),0 2px 8px rgb(0 0 0 / .24);padding:12px}
      .calendar{display:flex;flex-direction:column;gap:12px;width:100%;min-width:232px}
      .calendar__header{display:flex;align-items:center;gap:4px}
      .calendar-year-picker__trigger{display:inline-flex;height:28px;align-items:center;gap:4px;border:0;border-radius:8px;background:transparent;color:inherit;padding:0 8px;font-size:14px;font-weight:500}
      .calendar-year-picker__trigger:hover,.calendar__nav-button:hover{background:hsl(var(--default,240 5% 18%))}
      .calendar-year-picker__trigger-indicator{display:inline-flex;color:hsl(var(--muted-foreground,240 5% 64%))}
      .calendar__nav-button{margin-left:auto;display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:inherit;font-size:20px;line-height:1}.calendar__nav-button + .calendar__nav-button{margin-left:0}
      .calendar__grid{width:100%;border-collapse:separate;border-spacing:0 3px;table-layout:fixed}
      .calendar__header-cell{height:28px;color:hsl(var(--muted-foreground,240 5% 64%));font-size:12px;font-weight:500;text-align:center}
      .calendar__cell{display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border:0;border-radius:999px;background:transparent;color:inherit;font-size:13px;line-height:1;cursor:pointer;transition:background-color 120ms ease,color 120ms ease,transform 120ms ease}
      .calendar__cell:hover{background:hsl(var(--default,240 5% 18%))}
      .calendar__cell[data-in-range=true]{border-radius:8px;background:rgb(139 92 246 / .16);color:rgb(196 181 253)}
      .calendar__cell[data-selected=true]{background:rgb(124 58 237);color:white;font-weight:600}
      .calendar__cell[data-outside-month=true]{color:hsl(var(--muted-foreground,240 5% 64%) / .45)}
      .calendar-year-picker__year-grid{position:absolute;inset:48px 12px 12px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;overflow:auto;border-radius:12px;background:hsl(var(--popover,240 6% 10%));padding:8px}
      .calendar-year-picker__year-cell{height:30px;border:0;border-radius:8px;background:transparent;color:inherit;font-size:13px}.calendar-year-picker__year-cell[data-selected=true]{background:rgb(124 58 237);color:white}
      .button{display:inline-flex;height:36px;align-items:center;justify-content:center;border:0;border-radius:12px;padding:0 14px;font-size:14px;font-weight:500;cursor:pointer;transition:background-color 150ms ease,transform 120ms ease}.button:active{transform:scale(.98)}
      .button--primary{background:rgb(124 58 237);color:white}.button--primary:hover{background:rgb(109 40 217)}.button--secondary{background:hsl(var(--default,240 5% 18%));color:hsl(var(--foreground,240 10% 96%))}.button--secondary:hover{background:hsl(var(--default,240 5% 22%))}
      html:not(.dark) .date-range-picker{color:hsl(var(--foreground,240 10% 3.9%))}
      html:not(.dark) .label{color:hsl(var(--foreground,240 10% 3.9%))}
      html:not(.dark) .date-input-group{background:#fff;border-color:hsl(var(--border,240 5.9% 90%));color:hsl(var(--foreground,240 10% 3.9%));box-shadow:0 1px 2px rgb(0 0 0 / .04)}
      html:not(.dark) .date-input-group:hover:not(:focus-within){background:#fafafa;border-color:hsl(var(--border,240 5.9% 84%))}
      html:not(.dark) .date-range-picker__popover{background:#fff;border-color:hsl(var(--border,240 5.9% 90%));color:hsl(var(--foreground,240 10% 3.9%));box-shadow:0 12px 28px rgb(0 0 0 / .12),0 2px 8px rgb(0 0 0 / .08)}
      html:not(.dark) .date-range-picker__trigger:hover,html:not(.dark) .calendar-year-picker__trigger:hover,html:not(.dark) .calendar__nav-button:hover,html:not(.dark) .calendar__cell:hover,html:not(.dark) .button--secondary{background:#f4f4f5;color:#18181b}
      html:not(.dark) .calendar-year-picker__year-grid{background:#fff}
    `}</style>
  );
}
