"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepTabItem {
  value: string;
  label: string;
  content?: React.ReactNode;
}

interface ProgressiveStepTabsProps {
  items?: StepTabItem[];
  currentStep?: number;
  className?: string;
}

export default function ProgressiveStepTabs({
  items = [
    { value: "step1", label: "Step 1", content: "Step 1 content" },
    { value: "step2", label: "Step 2", content: "Step 2 content" },
    { value: "step3", label: "Step 3", content: "Step 3 content" },
    { value: "step4", label: "Step 4", content: "Step 4 content" },
  ],
  currentStep = 0,
  className,
}: ProgressiveStepTabsProps) {
  const [active, setActive] = React.useState(currentStep);

  return (
    <div className={cn("flex flex-col items-center justify-center w-full min-h-[60vh]", className)}>
      <Tabs
        value={items[active]?.value}
        onValueChange={(val) => {
          const idx = items.findIndex((i) => i.value === val);
          if (idx >= 0) setActive(idx);
        }}
        className="w-full max-w-2xl"
      >
        {/* Step Tabs */}
        <div className="relative flex items-center w-full">
          <TabsList className="flex justify-between w-full bg-background/20 p-2 rounded-xl border gap-1 relative z-10">
            {items.map((item, i) => {
              const isCompleted = i < active;
              const isCurrent = i === active;
              return (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all relative text-sm font-medium",
                    isCompleted
                      ? "bg-primary/20 text-primary"
                      : isCurrent
                      ? "bg-primary text-white shadow-md scale-105"
                      : "bg-background/50 text-foreground/60"
                  )}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Progress Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-primary/20 -z-10 rounded-full">
            <div
              className="h-0.5 bg-primary rounded-full transition-all"
              style={{
                width: `${(active / (items.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 w-full max-w-2xl">
          {items.map((item) => (
            <TabsContent key={item.value} value={item.value}>
              <div className="p-4 bg-card">{item.content}</div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
