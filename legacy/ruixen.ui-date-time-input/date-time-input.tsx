"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "../_utils/cn";

function DateTimeInput() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [time, setTime] = React.useState("12:00");

  return (
    <div className="flex flex-col gap-4">
      {/* Date Picker */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[250px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="time" className="text-xs font-medium">
          Time
        </Label>
        <div className="relative w-[250px]">
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            step="60" // minute granularity
            className="pl-8"
          />
          <Clock className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-md border p-2 text-sm text-muted-foreground">
        Selected:{" "}
        {date ? (
          <>
            {format(date, "PPP")} at {time}
          </>
        ) : (
          "No date selected"
        )}
      </div>
    </div>
  );
}

export { DateTimeInput };
