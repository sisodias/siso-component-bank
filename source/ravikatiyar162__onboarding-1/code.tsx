// components/ui/component.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assumes shadcn/ui setup
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

// Define the shape of a single question
export interface QuestionnaireQuestion {
  id: string;
  label: string;
  minLabel: string;
  midLabel: string;
  maxLabel: string;
  minIcon: React.ReactNode;
  maxIcon: React.ReactNode;
  defaultValue: number;
}

// Define the props for the main component
export interface OnboardingQuestionnaireProps {
  /** The main title for the questionnaire section */
  title: string;
  /** An array of question objects to render */
  questions: QuestionnaireQuestion[];
  /** The source URL for the image or GIF on the left panel */
  imageSrc: string;
  /** The current progress percentage (0-100) for the progress bar */
  progress: number;
  /** Whether to display the "Back" button */
  showBack?: boolean;
  /** Callback function when the "Next" button is clicked. Receives an object of answers. */
  onNext: (answers: Record<string, number>) => void;
  /** Callback function when the "Back" button is clicked */
  onBack: () => void;
  /** Callback function when the "Save and exit" link is clicked */
  onSaveAndExit: () => void;
  /** Custom class name to apply to the root element */
  className?: string;
}

/**
 * A responsive, multi-slider questionnaire component, perfect for onboarding flows.
 * It features an animated image panel and a form panel, following shadcn/ui patterns.
 */
export function OnboardingQuestionnaire({
  title,
  questions,
  imageSrc,
  progress,
  showBack = true,
  onNext,
  onBack,
  onSaveAndExit,
  className,
}: OnboardingQuestionnaireProps) {
  // State to hold the answers for all sliders
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Initialize the answers state when the questions prop changes
  useEffect(() => {
    const initialAnswers = questions.reduce(
      (acc, q) => {
        acc[q.id] = q.defaultValue;
        return acc;
      },
      {} as Record<string, number>,
    );
    setAnswers(initialAnswers);
  }, [questions]);

  /** Handles changes to any slider */
  const handleSliderChange = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  /** Handles the "Next" button click */
  const handleNextClick = () => {
    onNext(answers);
  };

  return (
    <div
      className={cn(
        "flex w-full min-h-screen flex-col md:flex-row",
        "bg-background text-foreground",
        className,
      )}
    >
      {/* 1. Left Panel: Image & Animation */}
      <div className="relative w-full overflow-hidden md:w-1/2 min-h-[300px] md:min-h-screen">
        <AnimatePresence>
          <motion.img
            key={imageSrc} // Animate when the image source changes
            src={imageSrc}
            alt="Onboarding visual"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="object-cover w-full h-full"
          />
        </AnimatePresence>
      </div>

      {/* 2. Right Panel: Form & Questions */}
      <div className="flex w-full flex-col p-8 md:w-1/2 md:p-12 lg:p-16">
        {/* Save & Exit Button */}
        <div className="flex w-full justify-end">
          <Button
            variant="ghost"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
            onClick={onSaveAndExit}
          >
            Save and exit
          </Button>
        </div>

        {/* Form Content */}
        <div className="flex flex-grow flex-col pt-8 md:pt-16">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>

          <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
            {questions.map((q) => (
              <div key={q.id}>
                <label className="block text-base font-medium text-foreground">
                  {q.label}
                </label>
                <div className="mt-4">
                  <Slider
                    value={[answers[q.id] || q.defaultValue]}
                    onValueChange={([val]) => handleSliderChange(q.id, val)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex w-full justify-between mt-2 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      {q.minIcon}
                      {q.minLabel}
                    </span>
                    <span className="hidden sm:block">{q.midLabel}</span>
                    <span className="flex items-center gap-1.5">
                      {q.maxLabel}
                      {q.maxIcon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Navigation & Progress */}
        <div className="mt-12 w-full pt-6">
          <Progress value={progress} className="h-2" />
          <div className="flex w-full items-center justify-between mt-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className={cn(
                "font-semibold",
                !showBack && "invisible", // Hide but maintain layout
              )}
            >
              Back
            </Button>
            <Button
              className="font-semibold"
              onClick={handleNextClick}
              size="lg"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}