import * as React from "react";
import { DayPicker } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarCheckIcon,
  CalendarFoldIcon,
  ChevronDownIcon,
  ClockIcon,
  CalendarX2Icon,
  SunIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  addDays,
  format,
  isFriday,
  isToday,
  nextFriday,
  startOfDay,
} from "date-fns";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  classNames,
  showOutsideDays = true,
  ...rest
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      classNames={{
        multiple_months: "",
        caption_end: "p-3",
        months: "flex divide-x",
        month: "space-y-2",
        caption:
          "flex justify-center items-center relative rounded-lg bg-accent h-9",
        caption_label:
          "text-sm leading-5 tracking-[-0.006em] font-medium text-muted-foreground select-none",
        nav: "flex items-center",
        nav_button:
          "border bg-background absolute flex items-center justify-center rounded-lg shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-6.5",
        nav_button_previous: "top-1/2 -translate-y-1/2 left-1.5",
        nav_button_next: "top-1/2 -translate-y-1/2 right-1.5",
        table: "w-full border-collapse",
        head_row: "flex gap-2",
        head_cell:
          "text-muted-foreground text-xs leading-5 tracking-[-0.006em] font-medium uppercase size-10 flex items-center justify-center text-center select-none",
        row: "grid grid-flow-col auto-cols-auto w-full mt-2 gap-2",
        cell: cn(
          // base
          "group/cell relative size-10 shrink-0 select-none p-0",
          // range
          "[&:has(.day-range-middle)]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
          // first range el
          "[&:not(:has(button))+:has(.day-range-middle)]:rounded-l-lg",
          // last range el
          "[&:not(:has(+_*_button))]:rounded-r-lg",
          // hide before if next sibling not selected
          "[&:not(:has(+_*_[type=button]))]:before:hidden",
          // merged bg
          "before:absolute before:inset-y-0 before:-right-2 before:hidden before:w-2 before:bg-accent",
          "last:[&:has(.day-range-middle)]:before:hidden",
          // middle
          "[&:has(.day-range-middle)]:before:block",
          // start
          "[&:has(.day-range-start)]:before:block"
          // end
        ),
        day: cn(
          // base
          "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-center text-sm leading-5 tracking-[-0.006em] font-medium text-primary outline-none",
          "transition duration-200 ease-out",
          // hover
          "hover:bg-accent",
          // selected
          "aria-[selected]:bg-primary aria-[selected]:text-primary-foreground",
          // focus visible
          "focus:outline-none focus-visible:bg-accent"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "day-selected",
        day_range_middle: "day-range-middle !text-foreground !bg-transparent",
        day_today: "day-today",
        day_outside:
          "day-outside !opacity-50 !text-muted-foreground !bg-transparent",
        day_disabled: "day-disabled !opacity-50 !bg-transparent",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <ChevronLeftIcon className="size-4 text-muted-foreground" />
        ),
        IconRight: () => (
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        ),
      }}
      {...rest}
    />
  );
}

export const Component = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const formatDateForPreset = (
    d: Date | undefined,
    formatType: "weekday" | "full"
  ) => {
    if (!d) return "";
    if (formatType === "weekday") {
      return format(d, "EEEE");
    }
    return format(d, "EEEE, MMMM dd");
  };

  const handlePresetClick = (presetType: string) => {
    let newDate: Date | undefined;
    const today = startOfDay(new Date());

    switch (presetType) {
      case "tomorrow":
        newDate = addDays(today, 1);
        break;
      case "laterThisWeek":
        let friday = nextFriday(today);
        if (isFriday(today) && isToday(friday)) {
          friday = addDays(friday, 7);
        }
        newDate = friday;
        break;
      case "nextWeek":
        newDate = addDays(today, 7);
        break;
      case "noDate":
        newDate = undefined;
        break;
      default:
        newDate = undefined;
    }
    setDate(newDate);
  };

  const tomorrowDate = addDays(new Date(), 1);

  let laterThisWeekDate = nextFriday(new Date());
  if (isFriday(new Date()) && isToday(laterThisWeekDate)) {
    laterThisWeekDate = addDays(laterThisWeekDate, 7);
  }

  const nextWeekDate = addDays(new Date(), 7);

  return (
    <Card className="w-fit rounded-t-2xl shadow-none p-0">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <ClockIcon
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="text-muted-foreground"
              />
              <div className="text-sm leading-5 tracking-[-0.006em] font-medium text-muted-foreground">
                Select a time
              </div>
            </div>
            <Button size="icon" variant="ghost" className="size-7">
              <XIcon
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="text-muted-foreground"
              />
            </Button>
          </div>

          <div className="flex flex-col gap-0.5 p-2">
            <button
              type="button"
              className="text-sm w-full items-center hover:bg-accent cursor-pointer flex justify-between gap-2.5 rounded-lg px-3 py-2"
              onClick={() => handlePresetClick("tomorrow")}
            >
              <div className="flex items-center gap-2.5">
                <SunIcon
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-yellow-500"
                />
                <span className="text-sm leading-5 tracking-[-0.006em] font-medium text-muted-foreground">
                  Tomorrow
                </span>
              </div>
              <span className="text-sm leading-5 tracking-[-0.006em] font-medium text-primary/40">
                {formatDateForPreset(tomorrowDate, "weekday")}
              </span>
            </button>
            <button
              type="button"
              className="text-sm w-full items-center hover:bg-accent cursor-pointer flex justify-between gap-2.5 rounded-lg px-3 py-2"
              onClick={() => handlePresetClick("laterThisWeek")}
            >
              <div className="flex items-center gap-2.5">
                <CalendarFoldIcon
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-green-500"
                />
                <span className="text-sm leading-5 tracking-[-0.006em] font-medium text-muted-foreground">
                  Later this week
                </span>
              </div>
              <span className="text-sm leading-5 tracking-[-0.006em] font-medium text-primary/40">
                {formatDateForPreset(laterThisWeekDate, "full")}
              </span>
            </button>
            <button
              type="button"
              className="text-sm w-full items-center hover:bg-accent cursor-pointer flex justify-between gap-2.5 rounded-lg px-3 py-2"
              onClick={() => handlePresetClick("nextWeek")}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheckIcon
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-blue-500"
                />
                <span className="text-sm leading-5 tracking-[-0.006em] font-medium text-muted-foreground">
                  Next week
                </span>
              </div>
              <span className="text-sm leading-5 tracking-[-0.006em] font-medium text-primary/40">
                {formatDateForPreset(nextWeekDate, "full")}
              </span>
            </button>
            <button
              type="button"
              className="text-sm w-full items-center hover:bg-accent cursor-pointer flex justify-between gap-2.5 rounded-lg px-3 py-2"
              onClick={() => handlePresetClick("noDate")}
            >
              <div className="flex items-center gap-2.5">
                <CalendarX2Icon
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-destructive/80"
                />
              <span className="text-sm leading-5 tracking-[-0.006em] font-medium  text-muted-foreground">
                No date
              </span>
            </div>
          </button>
        </div>

        <Calendar mode="single" selected={date} onSelect={setDate} />

        <div className="flex justify-start  gap-4 border-t p-4">
          <p className="text-sm leading-5 tracking-[-0.006em] font-medium">
            {date ? formatDateForPreset(date, "full") : "Select a date"}
          </p>
        </div>
      </div>
    </Card>
  );
};
