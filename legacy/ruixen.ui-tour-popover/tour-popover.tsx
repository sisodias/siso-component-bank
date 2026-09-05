"use client";

import { useState } from "react";
import { Button } from "./button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./popover";
import { Progress } from "./progress";
import { Separator } from "./separator";
import { Home, Settings, HelpCircle, Keyboard, LucideIcon } from "lucide-react";

interface TourStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const tourSteps: TourStep[] = [
  {
    icon: Home,
    title: "Workspace",
    description:
      "This is your workspace. Here you can manage projects, activities, and settings.",
  },
  {
    icon: Settings,
    title: "Toolbar & Settings",
    description:
      "Use the toolbar to create new projects, invite team members, or adjust your preferences.",
  },
  {
    icon: HelpCircle,
    title: "Support",
    description:
      "Need help? Click the support icon in the top-right corner to access our help center and documentation.",
  },
  {
    icon: Keyboard,
    title: "Command Palette",
    description:
      "Press ⌘K to open the command palette for quick navigation and actions.",
  },
];

function TourPopover() {
  const [step, setStep] = useState(0);

  const Icon = tourSteps[step].icon;
  const progress = ((step + 1) / tourSteps.length) * 100;

  const next = () => setStep((s) => Math.min(s + 1, tourSteps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const restart = () => setStep(0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Start tour</Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 space-y-4 p-4"
        side="bottom"
        align="center"
      >
        {/* Step header */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">{tourSteps[step].title}</p>
            <p className="text-xs text-muted-foreground">
              Step {step + 1} of {tourSteps.length}
            </p>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <p className="text-sm leading-relaxed">
          {tourSteps[step].description}
        </p>

        {/* Progress bar */}
        <Progress value={progress} className="h-2" />

        {/* Controls */}
        <div className="flex items-center justify-between pt-1">
          {step > 0 ? (
            <Button variant="ghost" size="sm" onClick={prev}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step === tourSteps.length - 1 ? (
            <Button size="sm" onClick={restart}>
              Restart
            </Button>
          ) : (
            <Button size="sm" onClick={next}>
              Next
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { TourPopover };
