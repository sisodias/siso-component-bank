// components/ui/registration-stepper.tsx
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a utility for class names

// Define the type for a single step
export interface StepProps {
  step: number;
  title: string;
  description: string;
  content: React.ReactNode;
}

// Define the props for the main component
interface RegistrationStepperProps {
  className?: string;
  steps: StepProps[];
  currentStep: number;
  headerTitle: string;
  headerStatus: string;
}

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
};

const contentVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
};

export const RegistrationStepper = ({
  className,
  steps,
  currentStep,
  headerTitle,
  headerStatus,
}: RegistrationStepperProps) => {

  return (
    <div className={cn("w-screen max-w-md mx-auto", className)}>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-none tracking-tight text-lg">{headerTitle}</h3>
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              {headerStatus}
            </span>
          </div>
        </div>

        <div className="p-6 pt-0">
          <ol className="space-y-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;

              return (
                <li key={step.title} className="overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        <AnimatePresence>
                          {isCompleted ? (
                            <motion.div
                              key="check"
                              variants={iconVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="circle"
                              initial={{ scale: 1 }}
                              animate={{ scale: isActive ? 1.1 : 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Circle
                                className={cn(
                                  "h-8 w-8 text-muted-foreground",
                                  isActive && "text-primary"
                                )}
                              />
                              <span
                                className={cn(
                                  "absolute text-sm font-semibold text-muted-foreground",
                                   "inset-0 flex items-center justify-center",
                                   isActive && "text-primary-foreground bg-primary rounded-full h-6 w-6 m-1"
                                )}
                              >
                                {stepNumber}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Connector line */}
                      {index < steps.length - 1 && (
                         <div className="mt-2 h-8 w-px bg-border" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h4 className={cn("font-medium", isActive && "text-foreground", isCompleted && "text-muted-foreground")}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isActive && "rotate-180")} />
                      </div>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            key="content"
                            variants={contentVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="overflow-hidden"
                          >
                            <div className="pt-4">{step.content}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};