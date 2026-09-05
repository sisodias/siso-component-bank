import { useState } from "react";
import { cn } from "../_utils/cn";
import { ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";

export const Component = () => {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);

  return (
    <div className="flex flex-col items-start gap-2 text-gray-800 dark:text-gray-200">
      {/* Question */}
      <span className="text-sm">Was this page helpful?</span>

      {/* Buttons / result */}
      {feedback ? (
        <div
          className={cn(
            "flex items-center gap-2 text-sm text-green-600 dark:text-green-400",
            "animate-fade-in"
          )}
        >
          <CheckCircle className="h-4 w-4" />
          Thanks for your feedback!
        </div>
      ) : (
        <div className="flex gap-2 animate-fade-in">
          {/* Yes button */}
          <button
            onClick={() => setFeedback("yes")}
            className={cn(
              "flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm",
              "transition-all duration-200 ease-out",
              "hover:scale-105 active:scale-95",
              "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            Yes
          </button>

          {/* No button */}
          <button
            onClick={() => setFeedback("no")}
            className={cn(
              "flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm",
              "transition-all duration-200 ease-out",
              "hover:scale-105 active:scale-95",
              "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600",
              "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <ThumbsDown className="h-4 w-4" />
            No
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Tailwind animations (add to globals.css if not using Tailwind's animate plugin):
 *
 * @layer utilities {
 *   @keyframes fade-in {
 *     from { opacity: 0; transform: translateY(4px); }
 *     to   { opacity: 1; transform: translateY(0); }
 *   }
 *   .animate-fade-in {
 *     animation: fade-in 0.25s ease-out forwards;
 *   }
 * }
 */