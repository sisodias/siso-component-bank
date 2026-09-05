"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
  type ChangeEvent,
} from "react";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface OTPInputProps {
  className?: string;
  /** Number of digits */
  length?: number;
  /** Called with the full OTP string when all digits are filled */
  onComplete?: (otp: string) => void;
  /** Called on every change */
  onChange?: (otp: string) => void;
  /** Show a separator dash after this index (e.g., 2 for "123-456") */
  separatorAfter?: number;
  /** Trigger error shake animation */
  error?: boolean;
  /** Trigger success animation */
  success?: boolean;
  /** Mask input like a password */
  masked?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Auto focus first input on mount */
  autoFocus?: boolean;
  /** Input mode for mobile keyboards */
  inputMode?: "numeric" | "text";
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/* ═══════════════════════════════════════════════════════════
   SIZE CONFIG
   ═══════════════════════════════════════════════════════════ */

const sizes = {
  sm: {
    box: "w-10 h-11 text-lg",
    gap: "gap-2",
    separator: "text-lg px-0.5",
  },
  md: {
    box: "w-12 h-14 text-2xl",
    gap: "gap-2.5",
    separator: "text-xl px-1",
  },
  lg: {
    box: "w-14 h-16 text-3xl",
    gap: "gap-3",
    separator: "text-2xl px-1.5",
  },
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function Component({
  className,
  length = 6,
  onComplete,
  onChange,
  separatorAfter,
  error = false,
  success = false,
  masked = false,
  disabled = false,
  autoFocus = true,
  inputMode = "numeric",
  size = "md",
}: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [filledIndices, setFilledIndices] = useState<Set<number>>(new Set());
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sizeConfig = sizes[size];

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Notify on change
  const notifyChange = useCallback(
    (newValues: string[]) => {
      const otp = newValues.join("");
      onChange?.(otp);
      if (otp.length === length && newValues.every((v) => v !== "")) {
        onComplete?.(otp);
      }
    },
    [length, onChange, onComplete]
  );

  // Handle input
  const handleChange = useCallback(
    (index: number, e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      // Take only last character (handles autocomplete edge cases)
      const char = val.slice(-1);

      // Filter based on input mode
      if (inputMode === "numeric" && !/^\d$/.test(char)) return;

      const newValues = [...values];
      newValues[index] = char;
      setValues(newValues);

      // Track filled animation
      setFilledIndices((prev) => new Set(prev).add(index));

      notifyChange(newValues);

      // Auto-advance
      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [values, length, inputMode, notifyChange]
  );

  // Handle keydown
  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newValues = [...values];

        if (values[index]) {
          // Clear current
          newValues[index] = "";
          setValues(newValues);
          setFilledIndices((prev) => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
          notifyChange(newValues);
        } else if (index > 0) {
          // Move back and clear previous
          newValues[index - 1] = "";
          setValues(newValues);
          setFilledIndices((prev) => {
            const next = new Set(prev);
            next.delete(index - 1);
            return next;
          });
          inputRefs.current[index - 1]?.focus();
          notifyChange(newValues);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    },
    [values, length, notifyChange]
  );

  // Handle paste
  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").trim();

      // Filter to allowed chars
      let chars: string[];
      if (inputMode === "numeric") {
        chars = pasted.replace(/\D/g, "").split("").slice(0, length);
      } else {
        chars = pasted.split("").slice(0, length);
      }

      if (chars.length === 0) return;

      const newValues = [...values];
      const newFilled = new Set(filledIndices);

      for (let i = 0; i < chars.length; i++) {
        newValues[i] = chars[i];
        newFilled.add(i);
      }

      setValues(newValues);
      setFilledIndices(newFilled);
      notifyChange(newValues);

      // Focus last filled or next empty
      const nextFocus = Math.min(chars.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    },
    [values, length, inputMode, filledIndices, notifyChange]
  );

  // Reset filled state when error changes (for re-trigger)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        // Allow re-trigger
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <motion.div
      className={cn("flex items-center", sizeConfig.gap, className)}
      animate={
        error
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
          : {}
      }
      transition={error ? { duration: 0.4, ease: "easeInOut" } : {}}
    >
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            className="relative"
            animate={
              success && values[index]
                ? {
                    scale: [1, 1.15, 1],
                  }
                : {}
            }
            transition={
              success
                ? { delay: index * 0.05, duration: 0.3, ease: "easeOut" }
                : {}
            }
          >
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type={masked ? "password" : "text"}
              inputMode={inputMode}
              maxLength={2}
              value={values[index]}
              disabled={disabled}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => {
                setFocusedIndex(index);
                inputRefs.current[index]?.select();
              }}
              onBlur={() => setFocusedIndex(null)}
              className={cn(
                "rounded-xl border bg-neutral-950 text-center font-mono font-semibold text-white caret-transparent outline-none transition-all duration-200",
                sizeConfig.box,
                // States
                disabled && "opacity-40 cursor-not-allowed",
                error
                  ? "border-red-500/60 bg-red-500/5"
                  : success && values[index]
                    ? "border-emerald-500/60 bg-emerald-500/5"
                    : focusedIndex === index
                      ? "border-white/40 bg-white/[0.03]"
                      : values[index]
                        ? "border-white/20 bg-white/[0.02]"
                        : "border-white/10 bg-white/[0.01]"
              )}
              aria-label={`Digit ${index + 1}`}
            />

            {/* Focus ring glow */}
            <AnimatePresence>
              {focusedIndex === index && !error && !success && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    boxShadow: "0 0 0 3px rgba(255,255,255,0.06), 0 0 20px rgba(100,150,255,0.08)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>

            {/* Pop animation on fill */}
            <AnimatePresence>
              {filledIndices.has(index) && values[index] && !success && !error && (
                <motion.div
                  className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
                  initial={{ scale: 1.2, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {/* Cursor blink when focused and empty */}
            {focusedIndex === index && !values[index] && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-[55%] bg-white/50 rounded-full pointer-events-none"
                animate={{ opacity: [1, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5,
                }}
              />
            )}
          </motion.div>

          {/* Separator */}
          {separatorAfter !== undefined && index === separatorAfter && (
            <span
              className={cn(
                "text-neutral-600 font-light select-none",
                sizeConfig.separator
              )}
            >
              -
            </span>
          )}
        </div>
      ))}
    </motion.div>
  );
}