"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "./calendar";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { ScrollArea } from "./scroll-area";

function SidePanelMultiCalendar() {
  const [dates, setDates] = React.useState<Date[]>([]);

  // Group selected dates by month-year
  const groupedDates = dates.reduce<Record<string, Date[]>>((acc, date) => {
    const key = format(date, "MMMM yyyy");
    if (!acc[key]) acc[key] = [];
    acc[key].push(date);
    return acc;
  }, {});

  const handleRemove = (date: Date) => {
    setDates((prev) =>
      prev.filter((d) => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd"))
    );
  };

  const handleClearMonth = (monthKey: string) => {
    setDates((prev) =>
      prev.filter((d) => format(d, "MMMM yyyy") !== monthKey)
    );
  };

  return (
    <Card className="w-[700px] shadow-none border-none bg-background">
      <CardHeader>
        <CardTitle className="text-base">Multi-Select Calendar with Side Panel</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        {/* Calendar Section */}
          <Calendar
            mode="multiple"
            selected={dates}
            onSelect={(selected) => setDates(selected ?? [])}
            className="rounded-md"
          />

        {/* Side Panel Section */}
        <div className="w-[260px]">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Selected Dates
          </p>
          <ScrollArea className="h-[280px] pr-2">
            {Object.keys(groupedDates).length === 0 && (
              <p className="text-xs text-muted-foreground">
                No dates selected
              </p>
            )}
            {Object.entries(groupedDates).map(([monthKey, datesInMonth]) => (
              <div key={monthKey} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold">{monthKey}</span>
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => handleClearMonth(monthKey)}
                  >
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {datesInMonth
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((d) => (
                      <Button
                        key={d.toISOString()}
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                        onClick={() => handleRemove(d)}
                      >
                        {format(d, "d")}
                      </Button>
                    ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          size="sm"
          onClick={() => console.log("Confirmed:", dates)}
          disabled={dates.length === 0}
        >
          Confirm
        </Button>
      </CardFooter>
      <div className="mt-4 text-xs text-center text-muted-foreground">
        Minimal design • Inspired by{" "}
        <a href="https://www.ruixen.com" target="_blank" className="underline">
          ruixen.com
        </a>
      </div>
    </Card>
  );
}

export { SidePanelMultiCalendar };
