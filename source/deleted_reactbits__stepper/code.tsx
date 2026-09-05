import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
  useEffect,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (clicked: number) => void;
  }) => ReactNode;
}

const StepperComponent = ({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-[4/3] md:aspect-[2/1]"
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-md rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${stepCircleContainerClassName}`}
      >
        <div
          className={`${stepContainerClassName} flex w-full items-center p-6 sm:p-8`}
        >
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-6 sm:px-8 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-6 sm:px-8 pb-6 sm:pb-8 ${footerClassName}`}>
            <div
              className={`mt-8 sm:mt-10 flex ${
                currentStep !== 1 ? "justify-between" : "justify-end"
              }`}
            >
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition duration-150 ease-in-out ${
                    currentStep === 1
                      ? "pointer-events-none opacity-50 text-slate-400 dark:text-slate-500"
                      : "text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="flex items-center justify-center rounded-md bg-sky-500 py-1.5 px-4 text-sm font-medium tracking-tight text-white transition duration-150 ease-in-out hover:bg-sky-600 active:bg-sky-700"
                {...nextButtonProps}
              >
                {isLastStep ? "Complete" : nextButtonText}
              </button>
            </div>
          </div>
        )}
         {isCompleted && (
          <div className="p-6 sm:p-8 text-center">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">All steps completed!</h3>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className = "",
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0, width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

interface StepProps {
  children: ReactNode;
  className?: string;
}

const StepComponent = ({ children, className = "" }: StepProps) => {
  return <div className={`py-2 ${className}`}>{children}</div>;
};

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false,
}: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
        ? "inactive"
        : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  const indicatorVariants: Variants = {
    inactive: { scale: 1, backgroundColor: "#475569", color: "#e2e8f0" }, // slate-600 BG, slate-200 text
    active: { scale: 1.1, backgroundColor: "#0ea5e9", color: "white" }, // sky-500 BG, white text
    complete: { scale: 1, backgroundColor: "#22c55e", color: "white" }, // green-500 BG, white text
  };


  return (
    <motion.div
      onClick={handleClick}
      className={`relative outline-none focus:outline-none ${!disableStepIndicators && step !== currentStep ? 'cursor-pointer' : 'cursor-default'}`}
      animate={status}
      initial={false}
      variants={indicatorVariants}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm"
      >
        {status === "complete" ? (
          <CheckIcon className="h-4 w-4 text-white" />
        ) : status === "active" ? (
          <span className="font-bold text-xs" style={{ color: indicatorVariants.active.color as string }}>{step}</span>
        ) : (
          <span className="text-xs" style={{ color: indicatorVariants.inactive.color as string }}>{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "#94a3b8" }, // slate-400 (works on both light/dark track)
    complete: { width: "100%", backgroundColor: "#22c55e" }, // green-500
  };

  return (
    <div className="relative mx-2 h-1 flex-1 overflow-hidden rounded bg-slate-200 dark:bg-slate-600">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export { StepperComponent as Stepper, StepComponent as Step };