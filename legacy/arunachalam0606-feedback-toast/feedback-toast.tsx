'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, X, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Button } from "./button";
import { Textarea } from "./textarea";

type FeedbackType = 'up' | 'down';

type Props = {
  visible: boolean;
  onClose: () => void;
  onFeedback?: (type: FeedbackType, reason?: string) => void;
};

const FEEDBACK_CLOSE_DELAY = 1500; // ms

export default function FeedbackToast({ visible, onClose, onFeedback }: Props) {
  const [selected, setSelected] = useState<FeedbackType | null>(null);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const closeAfterDelay = () => {
    setTimeout(onClose, FEEDBACK_CLOSE_DELAY);
  };

  const handleThumb = (type: FeedbackType) => {
    setSelected(type);

    if (type === 'up') {
      onFeedback?.('up');
      setSubmitted(true);
      closeAfterDelay();
    } else {
      setShowReasonInput(true);
    }
  };

  const handleSubmit = () => {
    onFeedback?.('down', reason);
    setSubmitted(true);
    closeAfterDelay();
  };

  const handleSkip = () => {
    onFeedback?.('down');
    setSubmitted(true);
    closeAfterDelay();
  };

  const handleBack = () => {
    setSelected(null);
    setShowReasonInput(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed right-4 bottom-4 z-50 w-full max-w-sm"
        >
          <motion.div
            layout
            className="bg-background border-border overflow-hidden rounded-xl border p-4 shadow-xl"
          >
            {!submitted ? (
              <>
                {selected === null && (
                  <motion.div layout className="flex items-center justify-between">
                    <p className="text-foreground text-sm font-medium">Was this helpful?</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Thumbs up"
                        onClick={() => handleThumb('up')}
                        className="cursor-pointer"
                      >
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Thumbs down"
                        onClick={() => handleThumb('down')}
                        className="cursor-pointer"
                      >
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {selected === 'down' && showReasonInput && (
                  <motion.div layout className="mt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-foreground text-sm font-medium">What could be better?</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Close"
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Textarea
                      placeholder="Share your reason (optional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full resize-none"
                      rows={3}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Back"
                          onClick={handleBack}
                          className="cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="link"
                          onClick={handleSkip}
                          className="text-muted-foreground cursor-pointer px-0"
                        >
                          Skip
                        </Button>
                      </div>
                      <Button onClick={handleSubmit} className="cursor-pointer">
                        Submit
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.p layout className="text-foreground text-sm">
                Thanks — we appreciate your feedback!
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
