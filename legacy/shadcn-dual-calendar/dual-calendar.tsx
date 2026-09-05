// component.tsx
"use client";

import * as React from "react";

import { Calendar } from "./calendar";

const DualCalendarWithPreset = React.forwardRef<
  React.ElementRef<typeof Calendar>,
  React.ComponentPropsWithoutRef<typeof Calendar>
>((props, ref) => {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  );

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      numberOfMonths={2}
      selected={date}
      onSelect={setDate}
      className="rounded-lg border shadow-sm"
      {...props}
      ref={ref}
    />
  );
});

DualCalendarWithPreset.displayName = "DualCalendarWithPreset";

export default DualCalendarWithPreset;