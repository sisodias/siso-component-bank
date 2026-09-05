"use client";

import { Mic, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

export default function RuixenAiInput01() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 220,
  });

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    console.log("Submitted:", inputValue);
    setInputValue("");
    adjustHeight(true);
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="relative max-w-2xl mx-auto bg-muted/30 dark:bg-muted/20 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
        <Textarea
          id="ai-textarea"
          ref={textareaRef}
          placeholder="Ask anything..."
          className={cn(
            "w-full resize-none border-none bg-transparent",
            "text-base text-muted-foreground dark:text-white",
            "placeholder:text-muted-foreground/60 dark:placeholder:text-white/40",
            "px-5 py-4 pr-16 rounded-2xl leading-[1.4]",
            "transition-all focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* Icon Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full bg-muted hover:bg-muted/70 text-muted-foreground transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              "p-2 rounded-full transition-colors",
              inputValue.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <SendHorizonal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
