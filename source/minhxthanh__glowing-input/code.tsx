import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
 
export function GlowingInput({
  placeholder = "Make a country song about ....",
  onSubmit,
}: {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<number | null>(null);

  const canSubmit = value.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.(value.trim());
    // Remove console.log if you wire up onSubmit
    if (!onSubmit) console.log("Submitted:", value.trim());
  };

  // cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-black text-white">
      <div className="relative">
        {/* LEFT light trail */}
        <motion.div
          aria-hidden
          className="absolute -left-80 top-1/2 -translate-y-1/2 w-80 h-16 blur-2xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(251,146,60,0.70), rgba(251,146,60,0.18), rgba(0,0,0,0))",
          }}
          animate={{ opacity: isFocused ? 0.85 : 0.45 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />

        {/* RIGHT light trail */}
        <motion.div
          aria-hidden
          className="absolute -right-80 top-1/2 -translate-y-1/2 w-80 h-16 blur-2xl"
          style={{
            background:
              "linear-gradient(270deg, rgba(251,146,60,0.70), rgba(251,146,60,0.18), rgba(0,0,0,0))",
          }}
          animate={{ opacity: isFocused ? 0.85 : 0.45 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.05 }}
        />

        {/* PILL / PROMPT BAR */}
        <motion.div
          className="group relative flex items-center w-[760px] max-w-[92vw] px-5 py-3 md:px-6 md:py-4 rounded-full bg-gradient-to-r from-slate-950 to-slate-900 ring-1 ring-white/10 shadow-[0_0_100px_-25px_rgba(251,146,60,0.65)] transition-shadow"
          initial={{ boxShadow: "0 0 80px -30px rgba(251,146,60,0.55)" }}
          animate={{
            boxShadow: isFocused
              ? "0 0 140px -25px rgba(251,146,60,0.85)"
              : "0 0 90px -30px rgba(251,146,60,0.6)",
          }}
          whileHover={{ scale: 1.01 }}
        >
          {/* inner edge + top highlight */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/5" />
          <div aria-hidden className="pointer-events-none absolute left-4 right-4 top-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent opacity-80" />

          {/* left icon chip */}
          <motion.div
            className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10"
            animate={{
              scale: isFocused ? 1.05 : 1,
              filter: isFocused ? "drop-shadow(0 0 10px rgba(251,146,60,0.7))" : "none",
            }}
          >
            <Sparkles className="h-5 w-5 text-amber-300" />
          </motion.div>

          {/* Accessible label for screen readers */}
          <label htmlFor="ai-prompt" className="sr-only">
            Prompt
          </label>

          {/* INPUT (you can type here) */}
          <input
            id="ai-prompt"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsTyping(true);
              if (typingTimer.current) window.clearTimeout(typingTimer.current);
              typingTimer.current = window.setTimeout(() => setIsTyping(false), 700);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent placeholder-slate-300/70 text-slate-100 outline-none text-lg md:text-xl caret-amber-300/90"
            autoComplete="off"
            spellCheck={false}
          />

          {/* action button */}
          <motion.button
            type="button"
            aria-label="Generate"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="relative cursor-pointer grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-black shadow-lg ring-4 ring-amber-400/20 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: canSubmit ? 1.06 : 1 }}
            whileTap={{ scale: canSubmit ? 0.96 : 1 }}
            animate={{
              boxShadow: canSubmit
                ? "0 0 40px rgba(251,146,60,0.45)"
                : "0 0 12px rgba(251,146,60,0.15)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
          >
            {/* The ArrowRight "runs" to the right while typing */}
            <motion.span
              className="grid"
              animate={
                isTyping
                  ? { x: [0, 6, 12] }
                  : { x: 0 }
              }
              transition={
                isTyping
                  ? { duration: 0.8, repeat: Infinity, ease: "easeIn" }
                  : { duration: 0.2 }
              }
            >
              <ArrowRight className="h-6 w-6" />
            </motion.span>
            {/* bright rim */}
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
          </motion.button>

          {/* end hot-spots (bright cores) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-amber-400/90 blur-xl"
            animate={{ opacity: isFocused ? 1 : 0.7 }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-amber-400/90 blur-xl"
            animate={{ opacity: isFocused ? 1 : 0.7 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
