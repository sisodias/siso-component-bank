"use client"

import { useState } from "react"
import { X, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  question?: string
  placeholder?: string
  onSubmit?: (feedback: { helpful: boolean | null; comment: string }) => void
}

export function FeedbackModal({
  isOpen,
  onClose,
  title = "Submit Feedback",
  question = "Was this page helpful?",
  placeholder = "Tell us more about your experience...",
  onSubmit,
}: FeedbackModalProps) {
  const [helpful, setHelpful] = useState<boolean | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (onSubmit) {
      onSubmit({ helpful, comment })
    }

    setIsSuccess(true)

    // Reset and close after showing success
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(false)
      setHelpful(null)
      setComment("")
      onClose()
    }, 1500)
  }

  const handleCancel = () => {
    setHelpful(null)
    setComment("")
    setIsSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-background rounded-xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isSuccess ? (
              <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in duration-300">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Thank you for your feedback!</p>
                <p className="text-sm text-muted-foreground">Your input helps us improve</p>
              </div>
            ) : (
              <>
                {/* Question */}
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">{question}</p>

                  {/* Yes/No Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setHelpful(true)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm",
                        helpful === true
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "border-border hover:border-primary/50 hover:bg-muted",
                      )}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Yes
                    </button>
                    <button
                      onClick={() => setHelpful(false)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm",
                        helpful === false
                          ? "border-destructive bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25"
                          : "border-border hover:border-destructive/50 hover:bg-muted",
                      )}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      No
                    </button>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div className="space-y-2">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[100px] resize-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!isSuccess && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border/50">
              <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[100px]">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
