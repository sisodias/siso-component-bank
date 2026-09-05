import * as React from "react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "../_utils/cn"; // Your utility for merging Tailwind classes

/**
 * A helper component for rendering inline code snippets within the overlay message.
 */
const CodeSnippet = ({ children }: { children: React.ReactNode }) => (
  <code className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-semibold text-muted-foreground">
    {children}
  </code>
);

interface ErrorOverlayProps {
  /** The main title of the error message. */
  title: string;
  /** The body content of the overlay. Can be a string or complex JSX. */
  message: React.ReactNode;
  /** Controls whether the overlay is visible. */
  isOpen: boolean;
  /** Callback function to be invoked when the overlay should be closed. */
  onClose: () => void;
  /** Optional additional class names. */
  className?: string;
}

export const ErrorOverlay = ({
  title,
  message,
  isOpen,
  onClose,
  className,
}: ErrorOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Effect to handle the 'Escape' key press for closing the overlay
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus the overlay for screen readers and keyboard navigation
      overlayRef.current?.focus();
    }

    // Cleanup the event listener on component unmount or when isOpen changes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: { opacity: 0, scale: 0.95, y: 10 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // The backdrop that covers the screen
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.2 }}
          onClick={onClose} // Close on clicking the backdrop
        >
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="error-overlay-title"
            tabIndex={-1} // Make the div focusable
            className={cn(
              "relative w-full max-w-2xl overflow-hidden rounded-lg border bg-card p-6 font-mono text-card-foreground shadow-xl outline-none",
              className
            )}
            variants={modalVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2 id="error-overlay-title" className="text-lg font-bold text-destructive">
              {title}
            </h2>

            <hr className="my-4 border-border" />

            <div className="space-y-2 text-sm text-muted-foreground">
              {message}
            </div>
            
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export the helper component for use in the demo or other parts of the app
ErrorOverlay.CodeSnippet = CodeSnippet;