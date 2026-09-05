"use client";

import { useEffect, useRef, useState } from "react";

const LOGO_VIEW_BOX = "-8 -8 329 310";

// One continuous outer contour that the animated stroke traces.
const TRACE_PATH =
  "M68.6484 121.746L112.751 21.0823C118.355 8.29253 131.211 0 145.436 0H169.659C183.884 0 196.74 8.29253 202.344 21.0823L246.447 121.746L306.119 209.304C313.198 219.69 314.044 232.99 308.338 244.155L293.469 273.244C286.624 286.636 271.786 294.241 256.634 292.123L157.548 278.277L58.0126 293.577C43.0841 295.871 28.3036 288.686 21.1586 275.661L4.31779 244.96C-2.02676 233.393 -1.17512 219.319 6.51994 208.565L68.6484 121.746Z";

// The filled logo mark (three compound triangles).
const FILL_PATHS = [
  "M58.0126 293.577L157.548 278.277L68.6484 121.746L6.51994 208.565C-1.17512 219.319 -2.02676 233.393 4.31779 244.96L21.1586 275.661C28.3036 288.686 43.0841 295.871 58.0126 293.577Z",
  "M112.751 21.0823L68.6484 121.746H246.447L202.344 21.0823C196.74 8.29253 183.884 0 169.659 0H145.436C131.211 0 118.355 8.29253 112.751 21.0823Z",
  "M246.447 121.746L157.548 278.277L256.634 292.123C271.786 294.241 286.624 286.636 293.469 273.244L308.338 244.155C314.044 232.99 313.198 219.69 306.119 209.304L246.447 121.746Z",
] as const;

type LoaderPhase = "loop" | "closingOutline" | "fadingFill" | "done";

export type LogoTraceLoaderProps = {
  loading?: boolean;
  isComplete?: boolean;
  size?: number;
  strokeWidth?: number;
  loopDurationSeconds?: number;
  fillFadeSeconds?: number;
  className?: string;
  ariaLabel?: string;
  onDone?: () => void;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function LogoTraceLoader({
  loading = true,
  isComplete = false,
  size = 40,
  strokeWidth = 6,
  loopDurationSeconds = 1.4,
  fillFadeSeconds = 0.4,
  className,
  ariaLabel = "Loading",
  onDone,
}: LogoTraceLoaderProps) {
  const shouldResolve = isComplete || !loading;
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<LoaderPhase>(
    shouldResolve ? "done" : "loop",
  );

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const doneCalled = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("done");
      if (!doneCalled.current) {
        doneCalled.current = true;
        onDoneRef.current?.();
      }
      return;
    }
    if (!shouldResolve) {
      doneCalled.current = false;
      setPhase("loop");
      return;
    }
    // Resolve: close the outline, fade in the fill, then finish. Timeouts act
    // as fallbacks so we never rely solely on SVG animation callbacks.
    setPhase("closingOutline");
    const closeMs = 480;
    const fadeMs = Math.max(0, fillFadeSeconds * 1000);
    const toFill = window.setTimeout(() => setPhase("fadingFill"), closeMs);
    const toDone = window.setTimeout(() => {
      setPhase("done");
      if (!doneCalled.current) {
        doneCalled.current = true;
        onDoneRef.current?.();
      }
    }, closeMs + fadeMs);
    return () => {
      window.clearTimeout(toFill);
      window.clearTimeout(toDone);
    };
  }, [shouldResolve, prefersReducedMotion, fillFadeSeconds]);

  const halfStroke = Math.max(1, strokeWidth / 2);
  const showFill = phase === "fadingFill" || phase === "done";

  return (
    <svg
      aria-label={ariaLabel}
      className={className}
      fill="none"
      height={size}
      role="status"
      style={{ overflow: "visible" }}
      viewBox={LOGO_VIEW_BOX}
      width={size}
    >
      {/* faint base outline — keeps the footprint stable from the first frame */}
      <g opacity="0.18">
        <path
          d={TRACE_PATH}
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth={halfStroke}
        />
      </g>

      {phase === "loop" ? (
        <path
          d={TRACE_PATH}
          fill="none"
          pathLength={1}
          stroke="currentColor"
          strokeDasharray="0.16 0.84"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          style={{
            animation: `logo-trace-loader-loop ${loopDurationSeconds}s linear infinite`,
          }}
        />
      ) : null}

      {phase === "closingOutline" ? (
        <path
          d={TRACE_PATH}
          fill="none"
          pathLength={1}
          stroke="currentColor"
          strokeDasharray="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          style={{
            strokeDashoffset: 1,
            animation: "logo-trace-loader-close 480ms ease-out forwards",
          }}
        />
      ) : null}

      {showFill ? (
        <g
          style={
            phase === "fadingFill"
              ? {
                  animation: `logo-trace-loader-fill ${fillFadeSeconds}s ease-out forwards`,
                }
              : undefined
          }
        >
          {FILL_PATHS.map((path) => (
            <path d={path} fill="currentColor" key={path} />
          ))}
        </g>
      ) : null}

      <style>{`
        @keyframes logo-trace-loader-loop {
          to { stroke-dashoffset: -1; }
        }
        @keyframes logo-trace-loader-close {
          to { stroke-dashoffset: 0; }
        }
        @keyframes logo-trace-loader-fill {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </svg>
  );
}

export default LogoTraceLoader;
