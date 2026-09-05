"use client";

import * as React from "react";
import { format, setMonth, setYear } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DropdownMultiCalendar() {
  const today = new Date();
  const [month, setMonthState] = React.useState(today.getMonth());
  const [year, setYearState] = React.useState(today.getFullYear());
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);

  const handleRemove = (date: Date) => {
    setSelectedDates((prev) =>
      prev.filter((d) => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd"))
    );
  };

  const handleMonthChange = (newMonth: number) => {
    setMonthState(newMonth);
  };

  const handleYearChange = (newYear: number) => {
    setYearState(newYear);
  };

  const displayMonth = setMonth(setYear(today, year), month);

  return (
    <Card className="w-[400px] shadow-none border-none bg-background">
      <CardContent className="flex flex-col gap-4">
        {/* Dropdowns */}
        <div className="flex gap-2">
          {/* Year Select */}
          <Select
            value={year.toString()}
            onValueChange={(val) => handleYearChange(Number(val))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 50 }, (_, i) => year - 25 + i).map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Select */}
          <Select
            value={month.toString()}
            onValueChange={(val) => handleMonthChange(Number(val))}
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
          mode="multiple"
          selected={selectedDates}
          onSelect={(dates) => setSelectedDates(dates ?? [])}
          month={displayMonth}
          onMonthChange={(date) => {
            setMonthState(date.getMonth());
            setYearState(date.getFullYear());
          }}
          className="rounded-md border"
        />

        {/* Selected dates list */}
        <div className="flex flex-wrap gap-2">
          {selectedDates.length === 0 && (
            <p className="text-xs text-muted-foreground">No dates selected</p>
          )}
          {selectedDates
            .sort((a, b) => a.getTime() - b.getTime())
            .map((d) => (
              <Badge
                key={d.toISOString()}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {format(d, "PPP")}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemove(d)}
                >
                  ✕
                </Button>
              </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          size="sm"
          onClick={() => console.log("Selected dates:", selectedDates)}
          disabled={selectedDates.length === 0}
        >
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
}

export { DropdownMultiCalendar };
