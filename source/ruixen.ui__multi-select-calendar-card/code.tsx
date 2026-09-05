"use client";

import * as React from "react";
import { format } from "date-fns";
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

function MultiSelectCalendarCard() {
  const [dates, setDates] = React.useState<Date[]>([]);

  const handleRemove = (date: Date) => {
    setDates((prev) =>
      prev.filter((d) => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd"))
    );
  };

  return (
    <Card className="w-[380px] shadow-none border-none bg-background">
      <CardHeader>
        <CardTitle className="text-base">Select Multiple Dates</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Calendar */}
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={(selected) => setDates(selected ?? [])}
          className="rounded-md border"
        />

        {/* Selected dates list */}
        <div className="flex flex-wrap gap-2">
          {dates.length === 0 && (
            <p className="text-xs text-muted-foreground">No dates selected</p>
          )}
          {dates.map((d) => (
            <Badge
              key={d.toISOString()}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {format(d, "PP")}
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
          onClick={() => {
            console.log("Selected Dates:", dates);
          }}
          disabled={dates.length === 0}
        >
          Confirm
        </Button>
      </CardFooter>
    </Card>
  );
}

export { MultiSelectCalendarCard };
