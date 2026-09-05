// components/ui/feedback-widget.tsx
import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, X, Loader2 } from "lucide-react";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

// Props interface for component reusability
export interface FeedbackWidgetProps {
  /** The title displayed at the top of the widget. */
  title?: string;
  /** Placeholder text for the comment textarea. */
  placeholder?: string;
  /** Function to handle the submission of feedback data. */
  onSubmit: (feedback: { rating: 'helpful' | 'not-helpful'; comment: string }) => Promise<void>;
  /** Function to handle closing the widget. */
  onClose: () => void;
  /** Text for the submit button. */
  submitText?: string;
  /** Text for the cancel button. */
  cancelText?: string;
}

export const FeedbackWidget = ({
  title = "Help us improve",
  placeholder = "Your feedback...",
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  onClose,
}: FeedbackWidgetProps) => {
  const [rating, setRating] = useState<'helpful' | 'not-helpful' | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle rating selection
  const handleRatingClick = (selectedRating: 'helpful' | 'not-helpful') => {
    setRating(currentRating => currentRating === selectedRating ? null : selectedRating);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);
    await onSubmit({ rating, comment });
    setIsSubmitting(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.6, bounce: 0.4 } },
    exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
  };

  const textAreaVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: "auto", marginTop: "1rem", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm"
      aria-live="polite"
    >
      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close feedback widget">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={rating === 'helpful' ? 'default' : 'outline'}
              onClick={() => handleRatingClick('helpful')}
              aria-pressed={rating === 'helpful'}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              Helpful
            </Button>
            <Button
              variant={rating === 'not-helpful' ? 'default' : 'outline'}
              onClick={() => handleRatingClick('not-helpful')}
              aria-pressed={rating === 'not-helpful'}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Not helpful
            </Button>
          </div>

          <AnimatePresence>
            {rating && (
              <motion.div
                key="textarea"
                variants={textAreaVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <Textarea
                  placeholder={placeholder}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-4"
                  rows={3}
                  aria-label="Feedback comment"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              {cancelText}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!rating || isSubmitting}
              className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500/90 dark:bg-yellow-500 dark:text-yellow-950 dark:hover:bg-yellow-500/90"
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {submitText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};