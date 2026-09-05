import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Simple reusable button with basic variants
function UIButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const variants: Record<string, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
      "bg-neutral-700 text-white hover:bg-neutral-800 focus-visible:ring-neutral-500",
    ghost:
      "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400",
  };

  return (
    <button
      className={cn(base, variants[variant] ?? variants.primary, className)}
      {...props}
    >
      {children}
    </button>
  );
}

// Simple card wrapper
function UICard({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl shadow-xl border border-neutral-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 p-6",
        className
      )}
      {...props}
    />
  );
}

export const Component = () => {
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load stored value on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("advanced-counter:value");
      const ts = localStorage.getItem("advanced-counter:updatedAt");

      if (raw != null && !Number.isNaN(Number(raw))) {
        setCount(Number(raw));
      }

      if (ts) {
        const d = new Date(ts);
        if (!Number.isNaN(d.getTime())) setLastUpdated(d);
      }
    } catch {
      // fail silently – storage not available
    }
  }, []);

  // Persist value whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("advanced-counter:value", String(count));
      const now = new Date();
      localStorage.setItem("advanced-counter:updatedAt", now.toISOString());
      setLastUpdated(now);
    } catch {
      // fail silently – storage not available
    }
  }, [count]);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => prev - 1);
  const handleReset = () => setCount(0);

  const isZero = count === 0;

  return (
    <UICard className="w-full max-w-sm mx-auto">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold leading-tight">
            Advanced Counter
          </h1>
          <p className="text-xs text-neutral-500">
            Persistent, animated, and accessible.
          </p>
        </div>

        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            isZero
              ? "bg-neutral-100 text-neutral-700"
              : count > 0
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          )}
        >
          {isZero ? "Neutral" : count > 0 ? "Positive" : "Negative"}
        </span>
      </header>

      <main className="flex flex-col items-center gap-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="text-5xl font-semibold tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {count}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <UIButton
            variant="ghost"
            onClick={handleDecrement}
            aria-label="Decrease value"
          >
            −1
          </UIButton>

          <UIButton
            onClick={handleIncrement}
            aria-label="Increase value"
          >
            +1
          </UIButton>
        </div>

        <UIButton
          variant="secondary"
          className="w-full mt-1"
          onClick={handleReset}
          aria-label="Reset value to zero"
          disabled={isZero}
        >
          Reset
        </UIButton>

        <div className="mt-2 w-full text-xs text-neutral-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Stored key:</span>
            <code className="font-mono text-[11px]">
              advanced-counter:value
            </code>
          </div>
          {lastUpdated && (
            <div className="flex items-center justify-between">
              <span>Last updated:</span>
              <span>
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>
      </main>
    </UICard>
  );
};

// Also export as default in case you import it that way
export default Component;
