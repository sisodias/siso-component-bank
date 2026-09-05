"use client";

import { useEffect, useState } from "react";
import { CornerRightUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

export default function RuixenAiInput_05() {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(true);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 200,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const animateCycle = () => {
      if (!isThinking) return;
      setIsThinking(true);
      timeoutId = setTimeout(() => {
        setIsThinking(false);
        timeoutId = setTimeout(() => {
          setIsThinking(true);
          animateCycle();
        }, 1000);
      }, 3000);
    };

    animateCycle();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = () => {
    setInputValue("");
    adjustHeight(true);
  };

  return (
    <div className="w-full py-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-3 items-center px-4">
        <div className="w-full relative bg-white dark:bg-neutral-900 border border-border rounded-2xl shadow-sm p-5">
          <Textarea
            ref={textareaRef}
            placeholder="What’s on your mind?"
            className={cn(
              "w-full bg-transparent border-none resize-none outline-none text-black dark:text-white",
              "placeholder:text-black/60 dark:placeholder:text-white/60",
              "min-h-[56px] max-h-[200px] text-sm sm:text-base leading-[1.5]"
            )}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustHeight();
            }}
            disabled={isThinking}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          <button
            type="button"
            disabled={isThinking}
            onClick={handleSubmit}
            className={cn(
              "absolute bottom-5 right-5 p-2 rounded-lg transition-all",
              isThinking
                ? "bg-transparent cursor-not-allowed"
                : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
            )}
          >
            {isThinking ? (
              <div
                className="w-4 h-4 rounded-full border-2 border-t-black/60 dark:border-t-white/60 border-transparent animate-spin"
                style={{ animationDuration: "1s" }}
              />
            ) : (
              <CornerRightUp
                className={cn(
                  "w-4 h-4",
                  inputValue ? "opacity-100 dark:text-white" : "opacity-30"
                )}
              />
            )}
          </button>
        </div>

        <div
          className={cn(
            "text-xs text-muted-foreground transition-opacity duration-300",
            isThinking ? "opacity-100" : "opacity-60"
          )}
        >
          {isThinking ? "AI is processing your thoughts..." : "Tap to send"}
        </div>
      </div>
    </div>
  );
}
