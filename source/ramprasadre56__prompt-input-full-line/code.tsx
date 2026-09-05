"use client"

import * as React from "react"
import { Paperclip, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PromptInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSubmitPrompt?: (value: string) => void
  isLoading?: boolean
}

const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ className, onSubmitPrompt, isLoading, onKeyDown,...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useImperativeHandle(ref, () => textareaRef.current!)

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const target = e.target
      target.style.height = "auto"
      target.style.height = `${target.scrollHeight}px`
      props.onInput?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" &&!e.shiftKey) {
        e.preventDefault()
        if (textareaRef.current?.value.trim()) {
          onSubmitPrompt?.(textareaRef.current.value)
          textareaRef.current.value = ""
          textareaRef.current.style.height = "auto"
        }
      }
      onKeyDown?.(e)
    }

    return (
      <div className={cn("relative flex w-full items-end gap-2 rounded-xl bg-muted/50 p-3 ring-1 ring-transparent focus-within:ring-ring transition-all", className)}>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          ref={textareaRef}
          className="flex-1 max-h-[200px] min-h-[40px] resize-none bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter a prompt here"
          rows={1}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          {...props}
        />

        <button
          type="button"
          onClick={() => {
            if (textareaRef.current?.value.trim()) {
              onSubmitPrompt?.(textareaRef.current.value)
              textareaRef.current.value = ""
              textareaRef.current.style.height = "auto"
            }
          }}
          disabled={isLoading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
          aria-label="Send prompt"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    )
  }
)
PromptInput.displayName = "PromptInput"

export { PromptInput }