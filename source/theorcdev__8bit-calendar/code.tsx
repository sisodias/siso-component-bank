"use client";

import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Native 8-bit calendar — no react-day-picker dependency

export const calendarVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface CalendarProps extends VariantProps<typeof calendarVariants> {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: "single";
}

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Pixel-art chevron left
function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="0.25"
      className={cn("size-4 shrink-0", className)}
      aria-label="chevron-left"
    >
      <rect width="14" height="14" rx="1" transform="matrix(-1 0 0 1 128 136)" />
      <rect width="14" height="14" rx="1" transform="matrix(-1 0 0 1 144 152)" />
      <rect width="14" height="14" rx="1" transform="matrix(-1 0 0 1 160 72)" />
      <rect width="14" height="14" rx="1" transform="matrix(-1 0 0 1 160 168)" />
      <rect width="14" height="14" rx="1" transform="matrix(-1 0 0 1 112 120)" />
      <rect width="14" height="14" rx="1" transform="matrix(-1 0 0 1 128 104)" />
      <rect width="14" height="14" rx="1" transform="matrix(-1 0 0 1 144 88)" />
    </svg>
  );
}

// Pixel-art chevron right
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="0.25"
      className={cn("size-4 shrink-0", className)}
      aria-label="chevron-right"
    >
      <rect x="128" y="136" width="14" height="14" rx="1" />
      <rect x="112" y="152" width="14" height="14" rx="1" />
      <rect x="96" y="72" width="14" height="14" rx="1" />
      <rect x="96" y="168" width="14" height="14" rx="1" />
      <rect x="144" y="120" width="14" height="14" rx="1" />
      <rect x="128" y="104" width="14" height="14" rx="1" />
      <rect x="112" y="88" width="14" height="14" rx="1" />
    </svg>
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function Calendar({ className, classNames: _classNames, font, selected, onSelect, mode = "single" }: CalendarProps & { classNames?: Record<string, string> }) {
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(selected?.getMonth() ?? today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className={cn(
        "bg-popover relative border-y-6 border-foreground dark:border-ring w-max",
        calendarVariants({ font }),
        className
      )}
    >
      <div className="p-3">
        {/* Header: prev / month+year / next */}
        <div className="flex items-center justify-between mb-3 gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={cn(
              "size-7 bg-transparent p-0 flex items-center justify-center hover:opacity-50 border-2 border-foreground dark:border-ring"
            )}
          >
            <ChevronLeft />
          </button>
          <span className="text-xs font-medium retro">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className={cn(
              "size-7 bg-transparent p-0 flex items-center justify-center hover:opacity-50 border-2 border-foreground dark:border-ring"
            )}
          >
            <ChevronRight />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="flex items-center justify-center h-8 w-8 text-[8px] text-muted-foreground retro">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-10 w-8" />;
            }
            const date = new Date(viewYear, viewMonth, day);
            const isSelected = selected ? isSameDay(selected, date) : false;
            const isToday = isSameDay(today, date);

            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelect?.(isSelected ? undefined : date)}
                className={cn(
                  "h-10 w-8 text-xs font-normal retro hover:bg-accent hover:text-accent-foreground transition-colors",
                  isSelected && "bg-primary text-primary-foreground",
                  isToday && !isSelected && "text-primary font-bold"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

export { Calendar };

export default Calendar;
