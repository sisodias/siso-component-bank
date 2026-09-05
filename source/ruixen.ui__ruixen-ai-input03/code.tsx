"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useFileInput } from "@/hooks/use-file-input";
import { Paperclip, Send, Trash2 } from "lucide-react";

export default function RuixenAiInput02() {
  const [input, setInput] = useState("");
  const { fileInputRef, handleFileSelect, fileName, clearFile } = useFileInput({
    accept: "image/*,application/pdf",
    maxSize: 10,
  });

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 220,
  });

  const handleSend = () => {
    if (!input.trim() && !fileName) return;
    console.log("Submitted:", input, fileName);
    setInput("");
    adjustHeight(true);
    clearFile();
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="relative max-w-2xl mx-auto rounded-2xl border border-border bg-muted/30 backdrop-blur-md shadow-md p-4 space-y-3">
        
        {/* File Preview */}
        {fileName && (
          <div className="flex items-center justify-between bg-background/40 px-4 py-2 rounded-lg border border-dashed text-sm text-muted-foreground">
            <div className="truncate">{fileName}</div>
            <button
              type="button"
              onClick={clearFile}
              className="text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Section */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            placeholder="Ask something or upload a file..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className={cn(
              "w-full resize-none bg-white/10 dark:bg-black/10",
              "rounded-xl px-4 py-3 text-sm sm:text-base",
              "placeholder:text-muted-foreground text-foreground",
              "focus:outline-none focus-visible:ring-1 focus-visible:ring-primary transition",
              "max-h-[220px] min-h-[60px] overflow-y-auto"
            )}
          />

          {/* Floating Icons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full bg-muted hover:bg-muted/70 text-muted-foreground"
            >
              <Paperclip className="w-4 h-4 rotate-45" />
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() && !fileName}
              className={cn(
                "p-2 rounded-full",
                input.trim() || fileName
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
