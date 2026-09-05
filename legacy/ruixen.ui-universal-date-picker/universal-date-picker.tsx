"use client";

import * as React from "react";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useId, useState } from "react";

import { cn } from "../_utils/cn";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Label } from "./label";
import { Card } from "./card";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { DateRange } from "react-day-picker";

type Mode = "single" | "range";

export function UniversalDatePicker({ className }: { className?: string }) {
  const id = useId();
  const [mode, setMode] = useState<Mode>("single");
  const [date, setDate] = useState<Date | undefined>();
  const [range, setRange] = useState<DateRange | undefined>();

  const today = new Date();
  const presets = [
    { label: "Today", range: { from: today, to: today } },
    { label: "Yesterday", range: { from: subDays(today, 1), to: subDays(today, 1) } },
    { label: "Last 7 days", range: { from: subDays(today, 6), to: today } },
    { label: "Last 30 days", range: { from: subDays(today, 29), to: today } },
    { label: "This Month", range: { from: startOfMonth(today), to: endOfMonth(today) } },
    { label: "Last Month", range: { from: startOfMonth(subMonths(today, 1)), to: endOfMonth(subMonths(today, 1)) } },
    { label: "This Year", range: { from: startOfYear(today), to: endOfYear(today) } },
  ];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>Date picker (Advanced)</Label>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mode === "single" ? "default" : "outline"}
            onClick={() => setMode("single")}
          >
            Single
          </Button>
          <Button
            size="sm"
            variant={mode === "range" ? "default" : "outline"}
            onClick={() => setMode("range")}
          >
            Range
          </Button>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "group w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
              !date && !range && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {mode === "single" && date
                ? format(date, "PPP")
                : mode === "range" && range
                ? `${range.from ? format(range.from, "PPP") : "—"} – ${
                    range.to ? format(range.to, "PPP") : "—"
                  }`
                : "Pick a date"}
            </span>
            <CalendarIcon
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto max-h-[300px] overflow-y-auto p-3 space-y-3" align="start">
          {/* Presets */}
          <Card className="p-2">
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <Button
                  key={p.label}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    if (mode === "single") {
                      setDate(p.range.to);
                    } else {
                      setRange(p.range);
                    }
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Calendar */}
          <Calendar
            mode={mode}
            selected={mode === "single" ? date : range}
            onSelect={mode === "single" ? setDate : setRange}
            showOutsideDays
            className="rounded-md border"
          />

          {/* Year Selector */}
          <Card className="p-3">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 9 }, (_, i) => today.getFullYear() - 4 + i).map(
                (year) => (
                  <Button
                    key={year}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const yDate = new Date(year, today.getMonth(), today.getDate());
                      if (mode === "single") {
                        setDate(yDate);
                      } else {
                        setRange({ from: startOfYear(yDate), to: endOfYear(yDate) });
                      }
                    }}
                  >
                    {year}
                  </Button>
                )
              )}
            </div>
          </Card>
        </PopoverContent>
      </Popover>
      <div className="mt-4 text-xs text-center text-muted-foreground">
        Minimal design • Inspired by{" "}
        <a href="https://www.ruixen.com" target="_blank" className="underline">
          ruixen.com
        </a>
      </div>
    </div>
  );
}
