import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";

interface Step {
  text: string;
  afterText?: string;
  async?: boolean;
  duration?: number;
  action?: () => void;
}

interface MultiStepLoaderProps {
  steps: Step[];
  loading: boolean;
  preventClose?: boolean;
  onStateChange?: (state: number) => void;
  onComplete?: () => void;
  onClose?: () => void;
}

const MultiStepLoader: React.FC<MultiStepLoaderProps> = ({
  steps,
  loading,
  preventClose = false,
  onStateChange,
  onComplete,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!loading) {
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    if (currentStep >= steps.length) {
      onComplete?.();
      return;
    }

    const step = steps[currentStep];
    onStateChange?.(currentStep);

    // Execute action if provided
    step.action?.();

    // Handle async steps
    if (step.async !== undefined) {
      if (!step.async) {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setTimeout(() => setCurrentStep((prev) => prev + 1), 500);
      }
      return;
    }

    // Handle duration-based steps
    const duration = step.duration || 2000;
    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setTimeout(() => setCurrentStep((prev) => prev + 1), 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [loading, currentStep, steps, onStateChange, onComplete]);

  const handleClose = useCallback(() => {
    if (!preventClose) {
      onClose?.();
    }
  }, [preventClose, onClose]);

  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-md bg-white/10 p-8 shadow-2xl dark:bg-neutral-900/20 border border-white/10"
        >
          {!preventClose && (
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-md p-1 text-white transition-colors hover:cursor-pointer dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </motion.div>
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 className="h-6 w-6 text-white" />
                      </motion.div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-300 dark:border-neutral-700" />
                    )}
                  </div>

                  <div className="flex-1">
                    <motion.p
                      className={`text-sm font-medium transition-colors ${
                        isCompleted
                          ? "text-white line-through dark:text-white"
                          : isCurrent
                          ? "text-gray-400 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {isCompleted && step.afterText
                        ? step.afterText
                        : step.text}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Demo Component
export function Component() {
  const [simpleLoading, setSimpleLoading] = useState(false);
  const [asyncLoading, setAsyncLoading] = useState(false);
  const [asyncStates, setAsyncStates] = useState({
    isProcessing: false,
    isSavingOrder: false,
    sendingMails: false,
  });

  const simpleSteps: Step[] = [
    { text: "Checking Payment", duration: 2000 },
    { text: "Saving Order", duration: 1500 },
    { text: "Sending Confirmation Email", duration: 2500 },
    { text: "Processing Request", duration: 1800 },
    { text: "Finalizing", duration: 1000 },
    {
      text: "Redirecting",
      duration: 1000,
      action: () => {
        setTimeout(() => {
          alert("Simple loading complete!");
          setSimpleLoading(false);
        }, 1000);
      },
    },
  ];

  const asyncSteps: Step[] = [
    {
      text: "Checking Payment",
      async: asyncStates.isProcessing,
      afterText: "Payment Verified",
    },
    {
      text: "Saving Order",
      async: asyncStates.isSavingOrder,
      afterText: "Order Saved",
    },
    {
      text: "Sending Confirmation Email",
      async: asyncStates.sendingMails,
      afterText: "Email Sent",
    },
    {
      text: "Redirecting",
      duration: 1000,
      action: () => {
        setTimeout(() => {
          alert("Async loading complete!");
          setAsyncLoading(false);
        }, 1000);
      },
    },
  ];

  const startAsyncLoading = async () => {
    setAsyncLoading(true);
    setAsyncStates({
      isProcessing: true,
      isSavingOrder: true,
      sendingMails: true,
    });

    // Simulate async operations
    setTimeout(
      () => setAsyncStates((prev) => ({ ...prev, isProcessing: false })),
      2000
    );
    setTimeout(
      () => setAsyncStates((prev) => ({ ...prev, isSavingOrder: false })),
      5000
    );
    setTimeout(
      () => setAsyncStates((prev) => ({ ...prev, sendingMails: false })),
      7500
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full max-w-2xl space-y-8">
        {/* Simple Loading Demo */}
        <section className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Simple Loading Demo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prevents closing until complete
          </p>
          <button
            onClick={() => setSimpleLoading(!simpleLoading)}
            className="rounded-sm bg-black px-6 py-3 text-sm font-medium text-white transition-all active:scale-95 dark:bg-white dark:text-black hover:cursor-pointer"
          >
            {simpleLoading ? "Stop Loading" : "Start Simple Loading"}
          </button>
        </section>

        {/* Async Loading Demo */}
        <section className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Async Loading Demo
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Can be closed manually
          </p>
          <button
            onClick={startAsyncLoading}
            disabled={asyncLoading}
            className="rounded-sm bg-black px-6 py-3 text-sm font-medium transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10 bg-gray-500/10 text-black dark:text-white border border-black/20 hover:cursor-pointer"
          >
            Start Async Loading
          </button>
        </section>

        {/* Loaders */}
        <MultiStepLoader
          steps={simpleSteps}
          loading={simpleLoading}
          preventClose={true}
        />

        <MultiStepLoader
          steps={asyncSteps}
          loading={asyncLoading}
          onClose={() => setAsyncLoading(false)}
        />
      </div>
    </div>
  );
}
