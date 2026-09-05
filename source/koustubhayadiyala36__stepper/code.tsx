"use client"

import React, { useState, createContext, useContext, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperContextType {
  value: number
  onChange: (step: number) => void
}

const StepperContext = createContext<StepperContextType | undefined>(undefined)

function useStepperContext() {
  const context = useContext(StepperContext)
  if (!context) {
    throw new Error("Stepper components must be used within a Stepper")
  }
  return context
}

interface StepperProps {
  value: number
  onChange: (step: number) => void
  children: ReactNode
}

export function Stepper({ value, onChange, children }: StepperProps) {
  return (
    <StepperContext.Provider value={{ value, onChange }}>
      <div className="w-full">{children}</div>
    </StepperContext.Provider>
  )
}

interface StepperItemProps {
  step: number
  title: string
}

export function StepperItem({ step, title }: StepperItemProps) {
  const { value } = useStepperContext()
  const isActive = value === step
  const isCompleted = value > step

  return (
    <div className="flex items-center" key={`step-${step}`}>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            isCompleted
              ? "bg-muted text-muted-foreground"
              : isActive
                ? "bg-primary text-primary-foreground"
                : "border-2 border-border text-foreground"
          )}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : step}
        </div>
        <p className="mt-2 text-sm font-medium text-center">{title}</p>
      </div>
      {step < 3 && (
        <div className="flex-1 h-0.5 mx-4 bg-border" />
      )}
    </div>
  )
}

interface StepperContentProps {
  step: number
  children: ReactNode
}

export function StepperContent({ step, children }: StepperContentProps) {
  const { value } = useStepperContext()
  const isActive = value === step

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={`content-${step}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function StepperNavigation() {
  const { value, onChange } = useStepperContext()
  const isFirstStep = value === 1
  const isLastStep = value === 3

  return (
    <div className="flex gap-3 mt-8">
      <button
        onClick={() => onChange(value - 1)}
        disabled={isFirstStep}
        className={cn(
          "flex-1 px-4 py-2 rounded-md border transition-colors",
          isFirstStep
            ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
            : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        )}
      >
        Back
      </button>
      <button
        onClick={() => onChange(value + 1)}
        className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {isLastStep ? "Finish" : "Next"}
      </button>
    </div>
  )
}
