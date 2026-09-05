// components/ui/onboarding-checklist.tsx

import * as React from "react";
import { CheckCircle2, CircleDot, Sparkles, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils"; // Assumes shadcn/ui setup
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Type definitions for component props
type StepStatus = "completed" | "inProgress" | "pending";

interface OnboardingStepProps {
  title: string;
  status: StepStatus;
  children: React.ReactNode;
}

interface OnboardingSectionProps {
  title: string;
  steps: OnboardingStepProps[];
}

interface UpgradeCardProps {
  title: string;
  description: string;
  onUpgrade: () => void;
}

interface OnboardingChecklistProps {
  sections: OnboardingSectionProps[];
  upgradeCard?: UpgradeCardProps;
}

// Icon and color mapping based on step status
const statusIcons: { [key in StepStatus]: React.ElementType } = {
  completed: CheckCircle2,
  inProgress: Sparkles,
  pending: CircleDot,
};

const statusColors: { [key in StepStatus]: string } = {
  completed: "text-green-500",
  inProgress: "text-yellow-500",
  pending: "text-muted-foreground",
};

/**
 * A responsive, multi-section onboarding checklist component.
 */
const OnboardingChecklist = React.forwardRef<
  HTMLDivElement,
  OnboardingChecklistProps
>(({ sections, upgradeCard, ...props }, ref) => {
  // Find the first "inProgress" step and open it by default
  const defaultOpenStep = React.useMemo(() => 
    sections
      .flatMap((section) => section.steps)
      .find((step) => step.status === "inProgress")?.title,
    [sections]
  );

  const [openStep, setOpenStep] = React.useState<string | undefined>(defaultOpenStep);

  return (
    <div
      ref={ref}
      className="max-w-2xl w-full mx-auto space-y-8"
      {...props}
    >
      {/* Map through each section */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              {section.title}
            </h2>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full bg-card border rounded-lg"
            value={openStep}
            onValueChange={setOpenStep}
          >
            {/* Map through each step in the section */}
            {section.steps.map((step, stepIndex) => {
              const Icon = statusIcons[step.status];
              return (
                <AccordionItem
                  key={step.title}
                  value={step.title}
                  className={cn("px-4", stepIndex === section.steps.length - 1 && "border-b-0")}
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 w-full">
                      <Icon className={cn("h-5 w-5 flex-shrink-0", statusColors[step.status])} />
                      <span className="text-sm font-medium text-foreground flex-1 text-left">
                        {step.title}
                      </span>
                      {step.status === "completed" && (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                          Ready
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* Animation for content visibility */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pt-2 border-t">{step.children}</div>
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      ))}

      {/* Optional Upgrade Card */}
      {upgradeCard && (
        <div className="bg-muted/30 border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{upgradeCard.title}</h3>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">PRO</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{upgradeCard.description}</p>
          <Button onClick={upgradeCard.onUpgrade} className="w-full sm:w-auto">Upgrade</Button>
        </div>
      )}
    </div>
  );
});
OnboardingChecklist.displayName = "OnboardingChecklist";

export { OnboardingChecklist };