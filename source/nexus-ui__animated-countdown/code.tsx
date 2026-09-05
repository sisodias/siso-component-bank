"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CountdownUnitKey = "days" | "hours" | "minutes" | "seconds";
type CountdownVariant = "modern" | "digital" | "minimal" | "classic";
type CountdownSize = "sm" | "md" | "lg";

type TimeLeft = Record<CountdownUnitKey, number>;

export type AnimatedCountdownProps = {
  targetDate?: Date | string | number;
  variant?: CountdownVariant;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  unitOrder?: CountdownUnitKey[];
  backgroundColor?: string;
  accentColor?: string;
  className?: string;
  containerClassName?: string;
  unitClassName?: string;
  accentClassName?: string;
  labelClassName?: string;
  numberClassName?: string;
  separator?: React.ReactNode;
  showSeparators?: boolean;
  completionMessage?: string;
  onComplete?: () => void;
  staticMode?: boolean;
  initialStaticTime?: Partial<TimeLeft>;
  compact?: boolean;
  size?: CountdownSize;
  ariaLabel?: string;
};

const DEFAULT_STATIC_TIME: TimeLeft = {
  days: 7,
  hours: 12,
  minutes: 45,
  seconds: 30,
};

const UNIT_LABELS: Record<CountdownUnitKey, string> = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

const variantClasses: Record<CountdownVariant, string> = {
  modern:
    "border-border/70 bg-background/75 shadow-2xl shadow-primary/5 backdrop-blur-xl dark:bg-white/[0.035]",
  digital:
    "border-cyan-400/20 bg-zinc-950 text-white shadow-2xl shadow-cyan-500/10",
  minimal: "border-transparent bg-transparent shadow-none",
  classic: "border-border bg-card shadow-sm dark:bg-zinc-900/80",
};

const unitVariantClasses: Record<CountdownVariant, string> = {
  modern:
    "border-border/70 bg-muted/45 shadow-sm transition hover:border-primary/35 hover:bg-muted/65 hover:shadow-primary/10 dark:bg-white/[0.04]",
  digital:
    "border-cyan-400/20 bg-cyan-400/[0.055] font-mono shadow-[0_0_28px_-18px_rgba(34,211,238,0.9)] transition hover:border-cyan-300/40 hover:bg-cyan-400/[0.09]",
  minimal: "border-transparent bg-transparent transition hover:bg-muted/35",
  classic:
    "border-border bg-background shadow-sm transition hover:border-primary/30 hover:bg-muted/35 dark:bg-white/[0.035]",
};

const sizeClasses: Record<CountdownSize, { container: string; unit: string; number: string; label: string }> = {
  sm: {
    container: "gap-2 p-2",
    unit: "min-w-[4.25rem] rounded-xl px-3 py-3",
    number: "text-2xl",
    label: "text-[10px]",
  },
  md: {
    container: "gap-2.5 p-2.5 sm:gap-3 sm:p-3",
    unit: "min-w-[4.8rem] rounded-2xl px-3.5 py-4 sm:min-w-[5.6rem] sm:px-4",
    number: "text-3xl sm:text-4xl",
    label: "text-[10px] sm:text-[11px]",
  },
  lg: {
    container: "gap-3 p-3 sm:gap-4 sm:p-4",
    unit: "min-w-[5.2rem] rounded-2xl px-4 py-4 sm:min-w-[6.5rem] sm:px-5 sm:py-5",
    number: "text-4xl sm:text-5xl",
    label: "text-[11px] sm:text-xs",
  },
};

function toDateTime(value: AnimatedCountdownProps["targetDate"]) {
  if (!value) return null;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

function getTimeLeft(targetDate?: AnimatedCountdownProps["targetDate"]): TimeLeft {
  const target = toDateTime(targetDate);
  if (!target) return DEFAULT_STATIC_TIME;

  const total = Math.max(0, target - Date.now());
  const secondsTotal = Math.floor(total / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  return { days, hours, minutes, seconds };
}

function isFinished(time: TimeLeft) {
  return time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
}

function format(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function useVisibleUnits({
  showDays,
  showHours,
  showMinutes,
  showSeconds,
  unitOrder,
}: Required<Pick<AnimatedCountdownProps, "showDays" | "showHours" | "showMinutes" | "showSeconds" | "unitOrder">>) {
  return React.useMemo(() => {
    const enabled = {
      days: showDays,
      hours: showHours,
      minutes: showMinutes,
      seconds: showSeconds,
    };
    return unitOrder.filter((unit) => enabled[unit]);
  }, [showDays, showHours, showMinutes, showSeconds, unitOrder]);
}

function CountdownNumber({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <span className={cn("relative inline-grid min-w-[2ch] place-items-center tabular-nums", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduceMotion ? false : { y: 12, opacity: 0, filter: "blur(4px)" }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { y: -12, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: reduceMotion ? 0.05 : 0.25, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CountdownUnit({
  unit,
  value,
  variant,
  size,
  unitClassName,
  numberClassName,
  labelClassName,
  accentClassName,
  index,
}: {
  unit: CountdownUnitKey;
  value: number;
  variant: CountdownVariant;
  size: CountdownSize;
  unitClassName?: string;
  numberClassName?: string;
  labelClassName?: string;
  accentClassName?: string;
  index: number;
}) {
  const reduceMotion = useReducedMotion() === true;
  const sizePreset = sizeClasses[size];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.055, duration: 0.35, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden border text-center",
        unitVariantClasses[variant],
        sizePreset.unit,
        unitClassName,
      )}
    >
      {variant === "modern" && (
        <span
          className={cn(
            "pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/55 to-transparent",
            accentClassName,
          )}
        />
      )}
      <CountdownNumber
        value={format(value)}
        className={cn(
          "font-bold leading-none tracking-tight text-foreground",
          variant === "digital" && "font-mono text-cyan-100 drop-shadow-[0_0_18px_rgba(34,211,238,0.45)]",
          variant === "minimal" && "font-semibold",
          sizePreset.number,
          numberClassName,
        )}
      />
      <span
        className={cn(
          "mt-2 font-semibold uppercase tracking-[0.18em] text-muted-foreground",
          variant === "digital" && "text-cyan-200/55",
          sizePreset.label,
          labelClassName,
        )}
      >
        {UNIT_LABELS[unit]}
      </span>
    </motion.div>
  );
}

export function AnimatedCountdown({
  targetDate,
  variant = "modern",
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  unitOrder = ["days", "hours", "minutes", "seconds"],
  backgroundColor,
  accentColor,
  className,
  containerClassName,
  unitClassName,
  accentClassName,
  labelClassName,
  numberClassName,
  separator = ":",
  showSeparators = variant === "digital",
  completionMessage = "We're live!",
  onComplete,
  staticMode,
  initialStaticTime,
  compact = false,
  size = compact ? "sm" : "md",
  ariaLabel = "Countdown timer",
}: AnimatedCountdownProps) {
  const reduceMotion = useReducedMotion() === true;
  const isStatic = staticMode ?? !targetDate;
  const completedRef = React.useRef(false);
  const staticTime = React.useMemo<TimeLeft>(
    () => ({ ...DEFAULT_STATIC_TIME, ...initialStaticTime }),
    [initialStaticTime],
  );
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(DEFAULT_STATIC_TIME);
  const [mounted, setMounted] = React.useState(false);
  const visibleUnits = useVisibleUnits({ showDays, showHours, showMinutes, showSeconds, unitOrder });
  const sizePreset = sizeClasses[size];
  const displayTimeLeft = isStatic ? staticTime : timeLeft;
  const completed = mounted && !isStatic && isFinished(displayTimeLeft);

  React.useEffect(() => {
    setMounted(true);
    if (isStatic) return;

    setTimeLeft(getTimeLeft(targetDate));
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isStatic, targetDate]);

  React.useEffect(() => {
    if (!completed || completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [completed, onComplete]);

  const style = {
    ...(backgroundColor ? { backgroundColor } : null),
    ...(accentColor ? { "--countdown-accent": accentColor } as React.CSSProperties : null),
  } as React.CSSProperties;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex max-w-full flex-col items-center rounded-[1.75rem] border",
        variantClasses[variant],
        sizePreset.container,
        compact && "rounded-2xl",
        containerClassName,
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "grid max-w-full grid-cols-2 items-stretch gap-2 sm:flex sm:flex-wrap sm:justify-center",
          showSeparators && "sm:gap-0",
        )}
      >
        {visibleUnits.map((unit, index) => (
          <React.Fragment key={unit}>
            <CountdownUnit
              unit={unit}
              value={displayTimeLeft[unit]}
              variant={variant}
              size={size}
              unitClassName={unitClassName}
              numberClassName={numberClassName}
              labelClassName={labelClassName}
              accentClassName={accentClassName}
              index={index}
            />
            {showSeparators && index < visibleUnits.length - 1 && (
              <span
                className={cn(
                  "hidden items-center px-2 text-2xl font-semibold text-muted-foreground/50 sm:flex",
                  variant === "digital" && "font-mono text-cyan-200/45",
                )}
                aria-hidden
              >
                {separator}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence>
        {completed && completionMessage && (
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="mt-3 text-sm font-medium text-primary"
          >
            {completionMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AnimatedCountdown;
