// SuggestiveSearch.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

/**
 * Props for any effect renderer. Effects are responsible for animating the
 * provided `text` and invoking the lifecycle callbacks when phases complete.
 */
export interface EffectRendererProps {
  text: string;
  isActive: boolean;
  allowDelete?: boolean; // new: indicates if effect should delete/advance
  typeDurationMs: number;
  deleteDurationMs: number;
  pauseAfterTypeMs: number;
  prefersReducedMotion?: boolean;
  /** Called by the effect when it finishes the delete/exit phase and ready for next suggestion */
  onDeleteComplete?: () => void;
  /** Optional container ref if the effect needs to measure or align itself */
  containerRef?: RefObject<HTMLElement | null>;
}

/** Convenience union for built-in effects */
export type BuiltinEffect = "typewriter" | "slide" | "fade" | "none";

/** Props of the main SuggestiveSearch component */
export interface SuggestiveSearchProps {
  onChange?: (val: string) => void;
  suggestions?: string[];
  className?: string;
  Leading?: () => JSX.Element;
  /** show/hide leading icon */
  showLeading?: boolean;
  /** trailing icon component */
  Trailing?: () => JSX.Element;
  /** show/hide trailing icon */
  showTrailing?: boolean;
  /** convenience selection of built-in effects */
  effect?: BuiltinEffect;
  /** override with a custom Effect component */
  EffectComponent?: React.ComponentType<EffectRendererProps>;
  typeDurationMs?: number;
  deleteDurationMs?: number;
  pauseAfterTypeMs?: number;
  /** play suggestions forever or only once */
  animateMode?: "infinite" | "once";
}

/* ---------------------------
   TypewriterEffect
   - Reveal mask width 0->100% for typing (duration controlled)
   - Hold, then shrink for deleting (if allowed)
   - Shows blinking cursor while typing/paused
   ----------------------------*/
export const TypewriterEffect: React.FC<EffectRendererProps> = ({
  text,
  isActive,
  allowDelete = true,
  typeDurationMs,
  deleteDurationMs,
  pauseAfterTypeMs,
  prefersReducedMotion,
  onDeleteComplete,
  containerRef,
}) => {
  const [phase, setPhase] = useState<"typing" | "paused" | "deleting">(
    "typing"
  );
  const timers = useRef<ReturnType<typeof window.setTimeout>[]>([]);

  useEffect(() => {
    setPhase("typing");
    timers.current.forEach(clearTimeout);
    timers.current = [];
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [text, isActive, allowDelete]);

  useEffect(() => {
    if (!isActive) {
      setPhase("typing");
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    if (prefersReducedMotion) {
      if (!allowDelete) return;
      const t = window.setTimeout(
        () => onDeleteComplete?.(),
        Math.max(200, pauseAfterTypeMs)
      );
      timers.current.push(t);
      return () => timers.current.forEach(clearTimeout);
    }
  }, [
    isActive,
    prefersReducedMotion,
    allowDelete,
    pauseAfterTypeMs,
    onDeleteComplete,
  ]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement> | undefined}
      style={{
        display: "inline-block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        alignItems: "center",
      }}
    >
      {prefersReducedMotion ? (
        <span className="text-sm text-muted-foreground select-none">
          {text}
        </span>
      ) : (
        <motion.div
          key={text}
          initial={{ width: "0%" }}
          animate={
            phase === "typing"
              ? { width: "100%" }
              : phase === "deleting"
              ? { width: "0%" }
              : { width: "100%" }
          }
          transition={
            phase === "typing"
              ? { duration: typeDurationMs / 1000, ease: "linear" }
              : phase === "deleting"
              ? { duration: deleteDurationMs / 1000, ease: "linear" }
              : {}
          }
          onAnimationComplete={() => {
            if (phase === "typing") {
              setPhase("paused");
              if (allowDelete) {
                const t = window.setTimeout(
                  () => setPhase("deleting"),
                  pauseAfterTypeMs
                );
                timers.current.push(t);
              }
            } else if (phase === "deleting") {
              onDeleteComplete?.();
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <span className="text-sm text-muted-foreground select-none">
            {text}
          </span>

          {/* blinking cursor */}
          <motion.span
            aria-hidden
            style={{
              display: "inline-block",
              width: 1,
              marginLeft: 4,
              height: "1.1em",
              verticalAlign: "middle",
            }}
            className="bg-muted-foreground"
            animate={
              phase === "typing" || phase === "paused"
                ? { opacity: [0, 1, 0] }
                : { opacity: 0 }
            }
            transition={
              phase === "typing" || phase === "paused"
                ? { repeat: Infinity, duration: 0.9, ease: "linear" }
                : { duration: 0.1 }
            }
          />
        </motion.div>
      )}
    </div>
  );
};

/* ---------------------------
   SlideEffect
   - Slide text from top -> center -> bottom
   - Uses transforms; good for a 'carousel' style
   ----------------------------*/
export const SlideEffect: React.FC<EffectRendererProps> = ({
  text,
  isActive,
  allowDelete = true,
  typeDurationMs,
  deleteDurationMs,
  pauseAfterTypeMs,
  prefersReducedMotion,
  onDeleteComplete,
  containerRef,
}) => {
  const [phase, setPhase] = useState<"enter" | "pause" | "exit">("enter");
  const timers = useRef<ReturnType<typeof window.setTimeout>[]>([]);

  useEffect(() => {
    setPhase("enter");
    timers.current.forEach(clearTimeout);
    timers.current = [];
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [text, isActive, allowDelete]);

  useEffect(() => {
    if (!isActive) {
      setPhase("enter");
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }
  }, [isActive]);

  if (!isActive) return null;

  if (prefersReducedMotion) {
    useEffect(() => {
      if (!allowDelete) return;
      const t = window.setTimeout(
        () => onDeleteComplete?.(),
        Math.max(200, pauseAfterTypeMs)
      );
      timers.current.push(t);
      return () => timers.current.forEach(clearTimeout);
    }, [onDeleteComplete, pauseAfterTypeMs, allowDelete]);
    return (
      <span className="text-sm text-muted-foreground select-none">{text}</span>
    );
  }

  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement> | undefined}
      style={{
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "nowrap",
        alignItems: "center",
      }}
    >
      <motion.div
        key={text}
        initial={{ y: "-100%" }}
        animate={
          phase === "enter"
            ? { y: "0%" }
            : phase === "exit"
            ? { y: "100%" }
            : { y: "0%" }
        }
        transition={
          phase === "enter"
            ? { duration: typeDurationMs / 1000, ease: "easeOut" }
            : { duration: deleteDurationMs / 1000, ease: "easeIn" }
        }
        onAnimationComplete={() => {
          if (phase === "enter") {
            setPhase("pause");
            if (allowDelete) {
              const t = window.setTimeout(
                () => setPhase("exit"),
                pauseAfterTypeMs
              );
              timers.current.push(t);
            }
          } else if (phase === "exit") {
            onDeleteComplete?.();
          }
        }}
        style={{ display: "inline-block" }}
      >
        <span className="text-sm text-muted-foreground select-none">
          {text}
        </span>
      </motion.div>
    </div>
  );
};

/* ---------------------------
   FadeEffect
   - Crossfade opacity in/out (new)
   ----------------------------*/
export const FadeEffect: React.FC<EffectRendererProps> = ({
  text,
  isActive,
  allowDelete = true,
  typeDurationMs,
  deleteDurationMs,
  pauseAfterTypeMs,
  prefersReducedMotion,
  onDeleteComplete,
  containerRef,
}) => {
  const [phase, setPhase] = useState<"fadeIn" | "hold" | "fadeOut">("fadeIn");
  const timers = useRef<ReturnType<typeof window.setTimeout>[]>([]);

  useEffect(() => {
    setPhase("fadeIn");
    timers.current.forEach(clearTimeout);
    timers.current = [];
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [text, isActive, allowDelete]);

  useEffect(() => {
    if (!isActive) {
      setPhase("fadeIn");
      timers.current.forEach(clearTimeout);
      timers.current = [];
    }
  }, [isActive]);

  if (!isActive) return null;

  if (prefersReducedMotion) {
    useEffect(() => {
      if (!allowDelete) return;
      const t = window.setTimeout(
        () => onDeleteComplete?.(),
        Math.max(200, pauseAfterTypeMs)
      );
      timers.current.push(t);
      return () => timers.current.forEach(clearTimeout);
    }, [onDeleteComplete, pauseAfterTypeMs, allowDelete]);
    return (
      <span className="text-sm text-muted-foreground select-none">{text}</span>
    );
  }

  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement> | undefined}
      style={{
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      <motion.div
        key={text}
        initial={{ opacity: 0 }}
        animate={
          phase === "fadeIn"
            ? { opacity: 1 }
            : phase === "fadeOut"
            ? { opacity: 0 }
            : { opacity: 1 }
        }
        transition={
          phase === "fadeIn"
            ? { duration: typeDurationMs / 1000 }
            : { duration: deleteDurationMs / 1000 }
        }
        onAnimationComplete={() => {
          if (phase === "fadeIn") {
            setPhase("hold");
            if (allowDelete) {
              const t = window.setTimeout(
                () => setPhase("fadeOut"),
                pauseAfterTypeMs
              );
              timers.current.push(t);
            }
          } else if (phase === "fadeOut") {
            onDeleteComplete?.();
          }
        }}
        style={{ display: "inline-block" }}
      >
        <span className="text-sm text-muted-foreground select-none">
          {text}
        </span>
      </motion.div>
    </div>
  );
};

/* ---------------------------
   SuggestiveSearch Orchestrator
   - handles input state, sizing/measurement of overlay bounds,
     effect selection & cycling suggestions.
   ----------------------------*/
export const SuggestiveSearch: React.FC<SuggestiveSearchProps> = ({
  onChange,
  suggestions = ["Search your favourite movie", "Search user from connection"],
  className,
  Leading = () => <Search className="size-4 text-muted-foreground" />,
  showLeading = true,
  Trailing = () => <Search className="size-4 text-muted-foreground" />,
  showTrailing = false,
  effect = "typewriter",
  EffectComponent,
  typeDurationMs = 500,
  deleteDurationMs = 300,
  pauseAfterTypeMs = 1500,
  animateMode = "infinite",
}) => {
  const [search, setSearch] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const [index, setIndex] = useState<number>(0);
  const current = useMemo(() => suggestions[index] ?? "", [suggestions, index]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const leadingRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const trailingRef = useRef<HTMLDivElement | null>(null);

  const [leftOffsetPx, setLeftOffsetPx] = useState<number | null>(null);
  const [rightOffsetPx, setRightOffsetPx] = useState<number | null>(null);

  // pixel width of the longest suggestion text (measured via canvas)
  const [measuredLongestTextPx, setMeasuredLongestTextPx] = useState<
    number | null
  >(null);
  // available width for text inside wrapper (wrapper width minus left/right offsets)
  const [availableTextAreaPx, setAvailableTextAreaPx] = useState<number | null>(
    null
  );

  // compute longest suggestion string
  const longestSuggestion = useMemo(
    () => suggestions.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [suggestions]
  );

  // measure paddings & leading/trailing width to compute overlay left/right & available area
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const lead = leadingRef.current;
    const trail = trailingRef.current;
    if (!wrapper) return;

    const update = () => {
      const cs = getComputedStyle(wrapper);
      const padLeft = parseFloat(cs.paddingLeft || "0");
      const padRight = parseFloat(cs.paddingRight || "0");
      const leadW = showLeading ? lead?.getBoundingClientRect().width ?? 0 : 0;
      const trailW = showTrailing
        ? trail?.getBoundingClientRect().width ?? 0
        : 0;
      const left = padLeft + leadW + 8; // small gap
      setLeftOffsetPx(left);
      const right = padRight + trailW;
      setRightOffsetPx(right);

      const wrapperW = wrapper.getBoundingClientRect().width;
      const avail = Math.max(0, wrapperW - left - right);
      setAvailableTextAreaPx(avail);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapper);
    if (lead) ro.observe(lead);
    if (trail) ro.observe(trail);
    return () => ro.disconnect();
  }, [showLeading, showTrailing]);

  // measure pixel width of longestSuggestion using canvas with input's font
  useEffect(() => {
    const input = inputRef.current;
    if (!longestSuggestion) {
      setMeasuredLongestTextPx(null);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setMeasuredLongestTextPx(null);
      return;
    }

    const elForFont = input ?? wrapperRef.current;
    if (!elForFont) {
      ctx.font =
        "14px system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
    } else {
      const cs = getComputedStyle(elForFont);
      const font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
      ctx.font = font;
    }

    const metrics = ctx.measureText(longestSuggestion);
    const measured = Math.ceil(metrics.width) + 8;
    setMeasuredLongestTextPx(measured);
  }, [longestSuggestion, inputRef.current]);

  // choose effect component (same as before, includes new 'fade')
  const builtinMap: Record<BuiltinEffect, React.ComponentType<any>> = {
    typewriter: TypewriterEffect,
    slide: SlideEffect,
    fade: FadeEffect,
    none: () => null,
  };
  const ChosenEffect = EffectComponent ?? builtinMap[effect];

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function handleEffectDeleteComplete() {
    setIndex((i) => (i + 1) % suggestions.length);
  }

  const handleInputChange = (val: string) => {
    setSearch(val);
    onChange?.(val);
  };

  // compute minWidthPx: try to use measuredLongestTextPx if available and parent has space,
  // otherwise use availableTextAreaPx. If measurement not ready, no minWidth applied.
  const minWidthPx =
    measuredLongestTextPx != null && availableTextAreaPx != null
      ? Math.min(measuredLongestTextPx, availableTextAreaPx)
      : measuredLongestTextPx != null
      ? measuredLongestTextPx
      : undefined;

  // overlay is active only when input empty AND not focused
  const overlayActive = !search && !isFocused;

  // compute allowDelete: in "once" mode, prevent deleting when on last suggestion
  const isLast = index === suggestions.length - 1;
  const allowDelete = animateMode === "infinite" ? true : !isLast;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative flex items-center gap-x-2 py-2 px-4 border border-border rounded-full",
        className
      )}
      style={{ maxWidth: "100%" }}
    >
      {/* Leading icon (optional) */}
      <div ref={leadingRef} className="flex-shrink-0">
        {showLeading && <Leading />}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={search}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => handleInputChange(e.target.value)}
        className="bg-transparent outline-none text-sm text-foreground placeholder:text-transparent w-full"
        placeholder=""
        aria-label="search"
        // set minWidth based on pixel measurement (if available)
        style={
          minWidthPx != null
            ? { minWidth: `${minWidthPx}px` }
            : { minWidth: undefined }
        }
      />

      {/* Trailing icon (optional) */}
      <div ref={trailingRef} className="flex-shrink-0">
        {showTrailing && Trailing && <Trailing />}
      </div>

      {/* overlay area: only render when input empty and not focused */}
      {overlayActive && (
        <div
          ref={overlayRef}
          aria-hidden
          style={{
            position: "absolute",
            left:
              leftOffsetPx != null
                ? `${leftOffsetPx}px`
                : "calc(0.5rem + 1.5rem + 8px)",
            right: rightOffsetPx != null ? `${rightOffsetPx}px` : "0.5rem",
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <ChosenEffect
            text={current}
            isActive={overlayActive}
            allowDelete={allowDelete}
            typeDurationMs={typeDurationMs ?? 500}
            deleteDurationMs={deleteDurationMs ?? 300}
            pauseAfterTypeMs={pauseAfterTypeMs ?? 1500}
            prefersReducedMotion={prefersReduced}
            onDeleteComplete={handleEffectDeleteComplete}
            containerRef={overlayRef}
          />
        </div>
      )}
    </div>
  );
};

export default SuggestiveSearch;
