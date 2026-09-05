"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "./button"; // Assuming shadcn button is in this path
import { Separator } from "./separator"; // Assuming shadcn separator
import { cn } from "../_utils/cn"; // Assuming shadcn utility

// --- TYPE DEFINITIONS ---
interface TimeEntry {
  date: string;
  duration: string;
}

interface FinancialDetail {
  label: string;
  value: number;
  isCommission?: boolean;
}

interface TimesheetConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  taskName: string;
  timeEntries: TimeEntry[];
  financials: FinancialDetail[];
  totalHours: string;
  takeHomeAmount: number;
  className?: string;
}

// --- CURRENCY FORMATTER ---
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// --- MAIN COMPONENT ---
export function TimesheetConfirmation({
  isOpen,
  onClose,
  clientName,
  taskName,
  timeEntries = [],
  financials = [],
  totalHours,
  takeHomeAmount,
  className,
}: TimesheetConfirmationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "relative m-4 w-full max-w-4xl overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg",
              className
            )}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Panel: Confirmation */}
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-center bg-background/50">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, transition: { delay: 0.2, type: "spring", stiffness: 200, damping: 15 } }}
                >
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </motion.div>
                <h2 className="text-2xl font-semibold">Your timesheet is on its way for approval!</h2>
                <p className="text-sm text-muted-foreground">
                  We've sent it to your clients and are just waiting on their approval to get you paid.
                </p>
                <div className="mt-4 flex flex-col w-full max-w-xs gap-2">
                  <Button onClick={onClose} size="lg">Got It</Button>
                  <Button onClick={onClose} variant="ghost">Submit another Timecard</Button>
                </div>
              </div>

              {/* Right Panel: Summary */}
              <div className="relative p-8">
                <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={onClose}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
                <h3 className="text-xl font-semibold mb-6">Timecard Summary</h3>
                
                {/* Client & Task Details */}
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Task</p>
                    <p className="font-medium">{taskName}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Time Entries */}
                <div className="space-y-3">
                  {timeEntries.map((entry, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-center text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + index * 0.1 } }}
                    >
                      <p className="text-muted-foreground">{entry.date}</p>
                      <p className="font-mono">{entry.duration}</p>
                    </motion.div>
                  ))}
                  <div className="flex justify-between items-center text-sm font-medium pt-2">
                    <p>Total</p>
                    <p className="font-mono">{totalHours}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Financial Summary */}
                <div className="space-y-3 text-sm">
                  {financials.map((item, index) => (
                    <motion.div
                      key={index}
                      className={`flex justify-between items-center ${item.isCommission ? "text-destructive" : ""}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: 0.5 + index * 0.1 } }}
                    >
                      <p>{item.label}</p>
                      <p className="font-mono">{item.isCommission ? "-" : ""}{currencyFormatter.format(item.value)}</p>
                    </motion.div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <motion.div 
                  className="flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.8 } }}
                >
                  <p className="font-semibold">Take Home</p>
                  <p className="text-2xl font-bold text-primary">{currencyFormatter.format(takeHomeAmount)}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}