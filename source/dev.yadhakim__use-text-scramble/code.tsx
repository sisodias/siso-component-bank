"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

interface UseTextScrambleOptions {
  speed?: number;
  tick?: number;
  step?: number;
  scrambleOnMount?: boolean;
  characters?: string;
}

interface UseTextScrambleReturn {
  text: string;
  scramble: (newText?: string) => void;
  isScrambling: boolean;
}

export function useTextScramble(
  initialText: string = "",
  options: UseTextScrambleOptions = {}
): UseTextScrambleReturn {
  const {
    speed = 50,
    tick = 1,
    step = 1,
    scrambleOnMount = true,
    characters = CHARS,
  } = options;

  const [displayText, setDisplayText] = useState(
    scrambleOnMount ? "" : initialText
  );
  const [isScrambling, setIsScrambling] = useState(false);
  const targetRef = useRef(initialText);
  const frameRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(
    (newText?: string) => {
      if (newText !== undefined) {
        targetRef.current = newText;
      }
      const target = targetRef.current;
      frameRef.current = 0;
      setIsScrambling(true);

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        frameRef.current += tick;
        const resolved = Math.min(
          Math.floor(frameRef.current * step),
          target.length
        );

        let output = "";
        for (let i = 0; i < target.length; i++) {
          if (i < resolved) {
            output += target[i];
          } else if (target[i] === " ") {
            output += " ";
          } else {
            output +=
              characters[Math.floor(Math.random() * characters.length)];
          }
        }

        setDisplayText(output);

        if (resolved >= target.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayText(target);
          setIsScrambling(false);
        }
      }, speed);
    },
    [speed, tick, step, characters]
  );

  useEffect(() => {
    if (scrambleOnMount) {
      const timeout = setTimeout(() => scramble(), 200);
      return () => {
        clearTimeout(timeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scramble, scrambleOnMount]);

  return { text: displayText, scramble, isScrambling };
}

/* ─── Demo Component for platform preview ─── */

const DEMO_LINES = [
  "Build something extraordinary.",
  "Ship with confidence.",
  "Scale without limits.",
  "Design for tomorrow.",
];

export function Component() {
  const { text, scramble, isScrambling } = useTextScramble(DEMO_LINES[0], {
    speed: 40,
    step: 0.8,
  });

  const [lineIndex, setLineIndex] = useState(0);

  const handleCycle = useCallback(() => {
    const next = (lineIndex + 1) % DEMO_LINES.length;
    setLineIndex(next);
    scramble(DEMO_LINES[next]);
  }, [lineIndex, scramble]);

  useEffect(() => {
    const interval = setInterval(handleCycle, 3000);
    return () => clearInterval(interval);
  }, [handleCycle]);

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <p className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-mono min-h-[1.2em]">
          {text}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Auto-cycling every 3 seconds
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCycle}
          disabled={isScrambling}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-all",
            isScrambling
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-foreground text-background hover:opacity-90"
          )}
        >
          {isScrambling ? "Scrambling..." : "Next phrase"}
        </button>

        <button
          onClick={() => scramble(DEMO_LINES[lineIndex])}
          disabled={isScrambling}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold border transition-all",
            isScrambling
              ? "border-border text-muted-foreground cursor-not-allowed"
              : "border-border text-foreground hover:bg-muted"
          )}
        >
          Replay
        </button>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4 max-w-md w-full">
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          <span className="text-foreground/60">const</span>{" "}
          <span className="text-foreground">{"{ text, scramble }"}</span>{" "}
          <span className="text-foreground/60">=</span>{" "}
          <span className="text-foreground">useTextScramble</span>
          <span className="text-muted-foreground">(</span>
          <span className="text-emerald-600 dark:text-emerald-400">
            &quot;Hello&quot;
          </span>
          <span className="text-muted-foreground">)</span>
        </p>
      </div>
    </div>
  );
}