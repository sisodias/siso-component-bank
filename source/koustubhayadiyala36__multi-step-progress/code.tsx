"use client"

import React from "react"

export interface Step {
  id: number
  title: string
  description: string
}

export interface MultiStepProgressProps {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
}

export function MultiStepProgress({
  steps,
  currentStep,
  onStepChange,
}: MultiStepProgressProps) {
  const getState = (id: number) => {
    if (id < currentStep) return "completed"
    if (id === currentStep) return "current"
    return "upcoming"
  }

  return (
    <div className="w-full flex flex-col items-center py-10 bg-muted/30">
      <style>{`
        @keyframes check-draw { to { stroke-dashoffset: 0; } }
        @keyframes pulse { 
          0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,.4); } 
          50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
        }
        .step-circle { transition: all .3s ease; }
        .step-circle.current { animation: pulse 2s ease infinite; }
        .step-circle:hover { transform: scale(1.07); }
        .connector { transition: background-color .4s ease; }
      `}</style>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground">Setup Progress</h1>
        <p className="text-muted-foreground">Complete the steps below</p>
      </div>

      {/* STEPS */}
      <div className="flex items-start justify-between w-full max-w-3xl mb-10">
        {steps.map((step, index) => {
          const state = getState(step.id)
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className={`flex items-start ${!isLast ? "flex-1" : ""}`}>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepChange?.(step.id)}
                  className={`
                    step-circle rounded-full w-12 h-12 flex items-center justify-center border-2 cursor-pointer
                    ${
                      state === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : state === "current"
                        ? "bg-background border-primary text-primary current"
                        : "bg-background border-muted text-muted-foreground"
                    }
                  `}
                >
                  {state === "completed" ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        style={{
                          strokeDasharray: 24,
                          strokeDashoffset: 24,
                          animation: "check-draw .3s ease forwards",
                        }}
                      />
                    </svg>
                  ) : (
                    <span className="text-base font-semibold">{step.id}</span>
                  )}
                </button>

                <div className="text-center mt-2">
                  <p
                    className={`
                      text-sm font-semibold
                      ${state === "completed" || state === "current" ? "text-primary" : "text-muted-foreground"}
                    `}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* CONNECTOR */}
              {!isLast && (
                <div
                  className={`
                    connector h-[3px] flex-1 mx-2 rounded-full
                    ${step.id < currentStep ? "bg-green-500" : "bg-muted"}
                  `}
                  style={{ marginTop: "22px" }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* CURRENT STEP PANEL */}
      <div className="bg-background border rounded-2xl shadow-sm p-10 text-center w-full max-w-lg mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-primary">{currentStep}</span>
        </div>

        <h2 className="text-2xl font-semibold text-foreground">
          {steps[currentStep - 1].title}
        </h2>

        <p className="text-muted-foreground">
          {steps[currentStep - 1].description}
        </p>

        <p className="text-sm text-muted-foreground mt-3">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between w-full max-w-lg">
        <button
          onClick={() => onStepChange?.(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-lg border text-sm font-medium flex items-center gap-2 disabled:text-muted-foreground disabled:border-muted disabled:cursor-not-allowed">
          ← Previous
        </button>

        <button
          onClick={() => onStepChange?.(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
          className="px-6 py-3 rounded-lg text-sm font-mono text-primary disabled:bg-muted disabled:cursor-not-allowed bg-secondary"
        >
          {currentStep === steps.length ? "Completed" : "Next →"}
        </button>
      </div>
    </div>
  )
}
