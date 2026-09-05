"use client";

import { useState, useRef } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input_01Props {
  label?: string;
  placeholder?: string;
  error?: string;
  success?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  type?: "text" | "email" | "password" | "search";
}

export default function Input_01({
  label = "Your Input",
  placeholder = "Enter something...",
  error,
  success,
  onChange,
  onClear,
  type = "text",
}: Input_01Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setValue("");
    onClear?.();
    inputRef.current?.focus();
  };

  const showFloating = focused || value.length > 0;

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Floating Label */}
      <label
        htmlFor={label}
        className={cn(
          "absolute left-4 px-1 transition-all bg-white dark:bg-zinc-900 z-10",
          "pointer-events-none",
          showFloating
            ? "top-1.5 text-xs text-indigo-500 dark:text-indigo-400"
            : "top-4 text-sm text-zinc-500 dark:text-zinc-400"
        )}
      >
        {label}
      </label>

      {/* Input Container */}
      <div
        className={cn(
          "rounded-lg border transition-all bg-white dark:bg-zinc-900",
          "focus-within:ring-2",
          error
            ? "border-red-500 focus-within:ring-red-300 dark:focus-within:ring-red-700"
            : success
            ? "border-green-500 focus-within:ring-green-300 dark:focus-within:ring-green-700"
            : "border-zinc-300 dark:border-zinc-700 focus-within:ring-indigo-300 dark:focus-within:ring-indigo-700"
        )}
      >
        <input
          id={label}
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e.target.value);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={showFloating ? placeholder : ""}
          className={cn(
            "w-full rounded-lg px-4 pt-6 pb-2 pr-10 text-sm outline-none",
            "bg-transparent text-zinc-900 dark:text-zinc-100",
            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          )}
        />
      </div>

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute top-1/2 -translate-y-1/2 right-10 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Status Icon */}
      {(error || success) && (
        <div className="absolute top-1/2 -translate-y-1/2 right-4">
          {error && <X className="w-5 h-5 text-red-500" />}
          {success && <Check className="w-5 h-5 text-green-500" />}
        </div>
      )}

      {/* Status Message */}
      {(error || success) && (
        <p
          className={cn(
            "mt-1 text-sm",
            error ? "text-red-500" : "text-green-500"
          )}
        >
          {error || success}
        </p>
      )}
    </div>
  );
}
