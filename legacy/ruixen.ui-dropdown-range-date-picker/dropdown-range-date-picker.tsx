"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import { Button } from "./button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Calendar as CalendarIcon } from "lucide-react";

function DropdownRangeDatePicker() {
  const today = new Date();
  const [selected, setSelected] = React.useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);

  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());

  // Display month for calendar
  const displayMonth = new Date(year, month, 1);

  const formattedValue = selected?.from
    ? selected.to
      ? `${format(selected.from, "PPP")} - ${format(selected.to, "PPP")}`
      : format(selected.from, "PPP")
    : "Pick a date range";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate overflow-hidden">{formattedValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          {/* Dropdowns */}
          <div className="flex gap-2">
            <Select
              value={year.toString()}
              onValueChange={(val) => setYear(Number(val))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 40 }, (_, i) => year - 20 + i).map(
                  (y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Select
              value={month.toString()}
              onValueChange={(val) => setMonth(Number(val))}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(2000, i, 1), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <Calendar
            mode="range"
            selected={selected}
            onSelect={setSelected}
            month={displayMonth}
            onMonthChange={(date) => {
              setMonth(date.getMonth());
              setYear(date.getFullYear());
            }}
            className="rounded-md border"
          />

          {/* Footer */}
          <div className="flex justify-between pt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelected(undefined)}
              disabled={!selected}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => console.log("Confirmed:", selected)}
              disabled={!selected}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DropdownRangeDatePicker };
