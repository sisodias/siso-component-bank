// components/ui/meeting-scheduler.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { cn } from "../_utils/cn"; // Your utility for merging class names
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Switch } from "./switch";
import { Label } from "./label";

// Define the props for the component
interface MeetingSchedulerProps {
  /** The main title for the scheduler card. */
  title?: string;
  /** A short description under the title. */
  description?: string;
  /** The text for the schedule confirmation button. */
  scheduleButtonText?: string;
  /** The text for the cancel button. */
  cancelButtonText?: string;
  /** Initial selected start date. */
  initialStartDate?: Date;
  /** Initial selected end date. */
  initialEndDate?: Date;
  /** Callback function when the schedule button is clicked. */
  onSchedule: (details: { startDate: Date | null; endDate: Date | null; aiNotes: boolean }) => void;
  /** Callback function when the cancel button is clicked. */
  onCancel: () => void;
}

// Helper to format time for display
const formatTime = (date: Date | null) => (date ? format(date, "h:mm a") : "Select time");

// Main component
export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  title = "Schedule a meeting",
  description = "Create your next meeting easily.",
  scheduleButtonText = "Schedule",
  cancelButtonText = "Cancel",
  initialStartDate,
  initialEndDate,
  onSchedule,
  onCancel,
}) => {
  // State management
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialStartDate || new Date()));
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);
  const [aiNotes, setAiNotes] = useState(false);

  // Calendar logic
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (isBefore(day, startDate)) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Determine the event summary text
  const getEventSummary = () => {
    if (!startDate) return "Select a date to begin.";
    const startFormatted = format(startDate, "MMM d");
    if (!endDate) return `Event: ${startFormatted}`;
    const endFormatted = format(endDate, "MMM d");
    return `Event: ${startFormatted} - ${endFormatted}, from ${formatTime(startDate)} - ${formatTime(endDate)}`;
  };
  
  // Handlers
  const handleSchedule = () => {
    // In a real app, you'd likely parse time from inputs and combine with date
    // For this example, we pass the full date object
    onSchedule({ startDate, endDate, aiNotes });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg border-none bg-card/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left Side: Calendar */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={format(currentMonth, "MMMM yyyy")}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-medium text-center"
                >
                  {format(currentMonth, "MMMM yyyy")}
                </motion.h3>
              </AnimatePresence>
              <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
                const isInRange = startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);

                return (
                  <motion.button
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200",
                      !isSameMonth(day, currentMonth) && "text-muted-foreground/50",
                      isSameDay(day, new Date()) && "text-primary font-bold",
                      isSelected && "bg-primary text-primary-foreground",
                      isInRange && "bg-primary/10 text-primary-foreground rounded-none",
                      startDate && isSameDay(day, startDate) && "rounded-r-none",
                      endDate && isSameDay(day, endDate) && "rounded-l-none"
                    )}
                  >
                    {format(day, "d")}
                     {isInRange && <div className="absolute inset-0 bg-primary/20" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
          
          {/* Right Side: Inputs */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
               {/* Start Date */}
              <div>
                <Label htmlFor="start-date" className="text-sm font-medium">Start date*</Label>
                <div className="flex items-center mt-2 p-3 rounded-md border bg-background">
                  <span className="text-sm flex-grow">{startDate ? format(startDate, "MMMM d, yyyy") : "Select date"}</span>
                  <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-md">{formatTime(startDate)}</span>
                </div>
              </div>

               {/* End Date */}
              <div>
                <Label htmlFor="end-date" className="text-sm font-medium">End date*</Label>
                <div className="flex items-center mt-2 p-3 rounded-md border bg-background">
                  <span className="text-sm flex-grow">{endDate ? format(endDate, "MMMM d, yyyy") : "Select date"}</span>
                  <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-md">{formatTime(endDate)}</span>
                </div>
              </div>

              {/* AI Notes Toggle */}
              <div className="flex items-center justify-between pt-4">
                <Label htmlFor="ai-notes" className="font-medium">Enable AI notes</Label>
                <Switch id="ai-notes" checked={aiNotes} onCheckedChange={setAiNotes} />
              </div>
            </div>
            
            {/* Footer section */}
            <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">{getEventSummary()}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel}>{cancelButtonText}</Button>
                    <Button onClick={handleSchedule} disabled={!startDate || !endDate}>{scheduleButtonText}</Button>
                </div>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
};