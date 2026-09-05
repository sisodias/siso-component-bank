import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, WandSparkles, Paperclip, ArrowUp, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "../_utils/cn"; // Your path to the 'cn' utility

// --- Component Variants for the gradient border ---
const promptInputVariants = cva(
  "relative w-full overflow-hidden rounded-2xl p-px",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-green-300/80 via-cyan-300/80 to-indigo-400/80",
        magic: "bg-gradient-to-r from-rose-400/80 via-fuchsia-500/80 to-indigo-500/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// --- Prop Interface for type-safety and documentation ---
export interface PromptInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof promptInputVariants> {
  /** The number of credits remaining for the user. */
  credits: number;
  /** Function to handle the 'Upgrade' button click. */
  onUpgrade: () => void;
  /** Function to handle the submission of the prompt. */
  onSubmit: () => void;
  /** A boolean to indicate if the component is in a loading state. */
  isLoading?: boolean;
}

/**
 * A comprehensive, theme-adaptive chat input component with a dismissible
 * credit banner, a customizable action toolbar, and engaging animations.
 */
const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ className, variant, credits, onUpgrade, onSubmit, isLoading, ...props }, ref) => {
    const [showBanner, setShowBanner] = React.useState(true);

    // Memoize action buttons for performance
    const actionButtons = React.useMemo(() => [
      { icon: Mic, label: "Use Microphone" },
      { icon: WandSparkles, label: "Magic Tools" },
      { icon: Paperclip, label: "Attach File" },
    ], []);

    return (
      <div className={cn(promptInputVariants({ variant }), className)}>
        <div className="relative flex h-full w-scree flex-col rounded-[15px] bg-background">
          {/* Credits Banner with enter/exit animation */}
          <AnimatePresence>
            {showBanner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between p-2 px-4 text-sm bg-gradient-to-r from-orange-200/20 via-green-200/10 to-transparent dark:from-orange-800/20 dark:via-green-900/10">
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{credits}</span> Credits Remaining
                  </span>
                  <div className="flex items-center gap-120">
                    <button onClick={onUpgrade} className="font-medium text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                      Upgrade
                    </button>
                    <button
                      onClick={() => setShowBanner(false)}
                      aria-label="Dismiss banner"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Input Area */}
          <div className="flex flex-col p-2 sm:p-4">
            <TextareaAutosize
              ref={ref}
              className="w-full resize-none bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
              minRows={1}
              maxRows={80}
              {...props}
            />

            {/* Toolbar and Submit Button */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-muted-foreground">
                {actionButtons.map((Button, index) => (
                  <button
                    key={index}
                    aria-label={Button.label}
                    className="hover:text-primary transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <Button.icon size={20} />
                  </button>
                ))}
              </div>
              <button
                onClick={onSubmit}
                aria-label="Submit prompt"
                disabled={isLoading || !props.value}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white transition-all duration-300 ease-in-out",
                  "hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
                  "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {/* Loading spinner */}
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <ArrowUp size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
PromptInput.displayName = "PromptInput";

export { PromptInput };