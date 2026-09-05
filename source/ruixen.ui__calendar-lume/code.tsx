"use client";

import { useState } from "react";
import {
  format,
  eachYearOfInterval,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from "date-fns";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

function CalendarLume() {
  const today = new Date();
  const [step, setStep] = useState<"year" | "month" | "day">("year");
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  // years 1900 → 2100
  const yearRange = eachYearOfInterval({
    start: startOfYear(new Date(1900, 0, 1)),
    end: endOfYear(new Date(2100, 11, 31)),
  });

  return (
    <div className="rounded-xl bg-background/80 backdrop-blur-md w-[380px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">
          {step === "year" && "Select a Year"}
          {step === "month" && `Year ${selectedYear}`}
          {step === "day" && format(selectedDate ?? today, "MMMM yyyy")}
        </h2>

        {/* Breadcrumb buttons */}
        <div className="flex gap-2">
          <Button
            variant={step === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setStep("year")}
          >
            Year
          </Button>
          <Button
            variant={step === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setStep("month")}
            disabled={step === "year"} // can't go to month before selecting a year
          >
            Month
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "year" && (
          <motion.div
            key="year"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-80"
          >
            <ScrollArea className="h-full">
              <div className="grid grid-cols-3 gap-2">
                {yearRange.map((year) => (
                  <Button
                    key={year.getFullYear()}
                    variant={
                      year.getFullYear() === selectedYear ? "default" : "outline"
                    }
                    size="sm"
                    className="h-10"
                    onClick={() => {
                      setSelectedYear(year.getFullYear());
                      setStep("month");
                    }}
                  >
                    {year.getFullYear()}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}

        {step === "month" && (
          <motion.div
            key="month"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-3 gap-2"
          >
            {eachMonthOfInterval({
              start: startOfYear(new Date(selectedYear, 0, 1)),
              end: endOfYear(new Date(selectedYear, 11, 31)),
            }).map((month) => (
              <Button
                key={month.toISOString()}
                variant={
                  month.getMonth() === selectedMonth ? "default" : "outline"
                }
                size="sm"
                className="h-12 flex flex-col"
                onClick={() => {
                  setSelectedMonth(month.getMonth());
                  setStep("day");
                  setSelectedDate(new Date(selectedYear, month.getMonth(), 1));
                }}
              >
                <span className="text-sm font-medium">
                  {format(month, "MMM")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedYear}
                </span>
              </Button>
            ))}
          </motion.div>
        )}

        {step === "day" && (
          <motion.div
            key="day"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <BaseCalendar
              mode="single"
              month={new Date(selectedYear, selectedMonth, 1)}
              selected={selectedDate}
              onSelect={setSelectedDate}
              onMonthChange={(date) => {
                setSelectedYear(date.getFullYear());
                setSelectedMonth(date.getMonth());
              }}
              className="rounded-lg border border-border bg-card mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { CalendarLume };
