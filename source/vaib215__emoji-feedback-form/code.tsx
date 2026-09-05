"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface RatingOption {
  value: number
  emoji: string
  label: string
}

interface StreamFeedbackProps {
  title?: string
  subtitle?: string
  question?: string
  placeholder?: string
  onSubmit?: (rating: number, feedback: string) => void
  onBack?: () => void
  submitButtonText?: string
  backButtonText?: string
  className?: string
}

const ratingOptions: RatingOption[] = [
  { value: 1, emoji: "😢", label: "Awful" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
]

export function StreamFeedback({
  title = "Your stream has ended!",
  subtitle = "We'd love your feedback on the video experience of this stream.",
  question = "How was the quality of the live event?",
  placeholder = "Share your thoughts about the stream quality, any issues you experienced, or suggestions for improvement...",
  onSubmit,
  onBack,
  submitButtonText = "Submit feedback",
  backButtonText = "Back to community",
  className,
}: StreamFeedbackProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selectedRating !== null) {
      onSubmit?.(selectedRating, feedback)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4",
          className,
        )}
      >
        <div className="w-full max-w-2xl space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">Thank you for your feedback!</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Your input helps us improve the streaming experience for everyone.
            </p>
          </div>
          {onBack && (
            <Button variant="outline" size="lg" onClick={onBack} className="mt-8 bg-transparent">
              {backButtonText}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4",
        className,
      )}
    >
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance">{title}</h1>
          <p className="text-lg text-muted-foreground text-balance">{subtitle}</p>
        </div>

        {/* Feedback Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-lg transition-shadow hover:shadow-xl">
          <div className="space-y-8">
            {/* Question */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-balance">{question}</h2>
            </div>

            {/* Rating Options */}
            <div className="flex justify-center gap-4">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedRating(option.value)}
                  className={cn(
                    "group flex flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200",
                    "hover:bg-muted/50 hover:scale-105",
                    selectedRating === option.value
                      ? "bg-primary/10 ring-2 ring-primary scale-105"
                      : "hover:ring-1 hover:ring-border",
                  )}
                >
                  <span className="text-4xl transition-transform duration-200 group-hover:scale-110">
                    {option.emoji}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      selectedRating === option.value
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Feedback Textarea */}
            <div className="space-y-3">
              <label htmlFor="feedback" className="text-sm font-medium text-muted-foreground">
                Additional comments (optional)
              </label>
              <Textarea
                id="feedback"
                placeholder={placeholder}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-32 resize-none text-base"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={selectedRating === null}
            className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            {submitButtonText}
          </Button>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {backButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
