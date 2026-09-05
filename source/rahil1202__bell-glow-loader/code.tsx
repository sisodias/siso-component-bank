'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

export type BellLoaderProps = {
  autoStart?: boolean;
  durationMs?: number;
  isLoading?: boolean;
  progress?: number;
  onProgress?: (p: number) => void;
  onComplete?: () => void;

  keepBellOnWhenDone?: boolean;
  size?: number;
  baseColor?: string;
  rotationAmplitude?: number;

  /** Label while loading (shown inside the glow) */
  loadingLabel?: string;
  /** Label after completion (shown inside the glow) */
  doneLabel?: string;
  className?: string;
};

function BellLoader({
  autoStart = false,
  durationMs = 3000,
  isLoading,
  progress,
  onProgress,
  onComplete,
  keepBellOnWhenDone = false,
  size = 520,
  baseColor = '#b7b5b4',
  rotationAmplitude = 0.8,
  loadingLabel = 'Loading State',
  doneLabel = 'Loading completed',
  className = '',
}: BellLoaderProps) {
  // Uncontrolled state (only used if corresponding controlled prop is undefined)
  const [internalLoading, setInternalLoading] = useState<boolean>(!!autoStart);
  const [internalProgress, setInternalProgress] = useState<number>(0);

  // Effective states (controlled has priority)
  const loading = isLoading ?? internalLoading;
  const pct = Math.max(0, Math.min(100, progress ?? internalProgress));

  // Auto-run timer for uncontrolled mode
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number | null>(null);
  const completedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isLoading !== undefined) return;
    if (!autoStart) return;
    setInternalLoading(true);
  }, [autoStart, isLoading]);

  useEffect(() => {
    if (progress !== undefined) return; // controlled progress
    if (!loading) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startTsRef.current = null;
      return;
    }

    completedRef.current = false;
    startTsRef.current = performance.now();

    const step = () => {
      const now = performance.now();
      const start = startTsRef.current ?? now;
      const elapsed = now - start;
      const p = Math.min(100, (elapsed / durationMs) * 100);

      setInternalProgress(p);
      onProgress?.(p);

      if (p >= 100) {
        if (!completedRef.current) {
          completedRef.current = true;
          setInternalLoading(false);
          onComplete?.();
        }
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [loading, durationMs, onProgress, onComplete, progress]);

  // Controlled progress completion edge
  useEffect(() => {
    if (progress === undefined) return;
    if (isLoading === undefined) return;
    if (isLoading && progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    } else if (progress < 100) {
      completedRef.current = false;
    }
  }, [progress, isLoading, onComplete]);

  // Bell on/off rules
  const bellOn = loading || (pct >= 100 && keepBellOnWhenDone);

  const rootStyle = useMemo<React.CSSProperties>(() => {
    return {
      fontSize: `calc(${size}px * 0.01)`,
      ['--_size' as any]: `${size}px`,
      ['--base-clr' as any]: baseColor,
      ['--degofrot' as any]: rotationAmplitude,
    };
  }, [size, baseColor, rotationAmplitude]);

  return (
    <div className={`bell-root ${className}`} style={rootStyle}>
      {/* Bell */}
      <div
        className={`bell-container ${bellOn ? '' : 'off'} ${loading ? 'blink' : 'steady'}`}
        aria-label={loading ? 'Loading' : pct >= 100 ? 'Completed' : 'Idle'}
        aria-live="polite"
      >
        <div className="rope" />
        <div className="bell-top" />

        <div className="bell-base" />
        <div className="bell-base" />
        <div className="shadow-l1" />
        <div className="shadow-l2" />
        <div className="left-glow" />
        <div className="left-glow2" />
        <div className="r-glow" />
        <div className="r-glow2" />
        <div className="mid-ring" />
        <div className="mid-ring small" />

        <div className="glow" />
        <div className="glow2" />

        <div className="bell-buff-t" />
        <div className="bell-buff" />

        <div className="bell-btm" />
        <div className="bell-btm2" />

        <div className="bell-ring-container">
          <div className="bell-ring" />
          <div className="bell-rays" />
        </div>

        <div className="volumetric">
          <div className="vl" />
          <div className="vr" />
        </div>

        {/* Text sits inside the glow area */}
        <div className="status-label" aria-hidden={!bellOn}>
          {pct < 100 ? loadingLabel : doneLabel}
        </div>
      </div>

      <div className="grain" />

      <style jsx global>{`
        .bell-root {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          background: #000;
        }

        .bell-root * {
          transition: filter 0.4s ease-in-out, box-shadow 0.4s ease-in-out,
            opacity 0.4s ease-in-out, color 0.4s ease-in-out,
            background 0.4s ease-in-out, text-shadow 0.4s ease-in-out;
        }

        .bell-container,
        .bell-container * {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }

        .bell-container {
          width: 80em;
          height: 80em;
          transform-origin: 50% -50vh;
          animation: bell 5s ease-in-out infinite;
        }

        /* Slow blinking while loading */
        .bell-container.blink .bell-btm2,
        .bell-container.blink .bell-ring,
        .bell-container.blink .glow,
        .bell-container.blink .r-glow,
        .bell-container.blink .left-glow {
          animation: bellBlink 2s ease-in-out infinite;
        }

        /* Steady full-on when done */
        .bell-container.steady .bell-btm2,
        .bell-container.steady .bell-ring,
        .bell-container.steady .glow,
        .bell-container.steady .r-glow,
        .bell-container.steady .left-glow {
          animation: none;
          filter: brightness(1);
          opacity: 1;
        }

        @keyframes bellBlink {
          0%   { filter: brightness(0.65); opacity: 0.75; }
          50%  { filter: brightness(1.0);  opacity: 1; }
          100% { filter: brightness(0.65); opacity: 0.75; }
        }

        @keyframes bell {
          0% { rotate: calc(1deg * var(--degofrot)); }
          50% { rotate: calc(-1deg * var(--degofrot)); }
          100% { rotate: calc(1deg * var(--degofrot)); }
        }

        /* ---- original bell visuals (unchanged) ---- */
        .rope {
          height: 50vh; width: 2em; translate: 0 -52%;
          background: linear-gradient(90deg,#2d54744d 0%,#000b 30%,transparent 100%),
            repeating-linear-gradient(-70deg, #252525, #888 2%, #3a3a3a 3%);
        }
        .bell-top {
          width: 14%; height: 14%; border-radius: 50%; translate: 0 -28em;
          background: var(--base-clr);
          box-shadow: inset -1em -0.5em 2em 0.5em #fff, inset 1em -1em 2em 3em #000,
            0 -0.1em 0.4em 0.3em #c6eaffa8;
        }
        .bell-base { width: 50%; height: 50%; border-radius: 50%; translate: 0 -24%; background: var(--base-clr); box-shadow: 0 -0.1em 0.4em 0.2em #c6eaffa8; }
        .bell-base:before {
          content: ''; background-image: radial-gradient(circle at -80% -12%,transparent 50em,var(--base-clr) 50em);
          position: absolute; translate: -18em 20em; width: 100%; height: 80%;
        }
        .bell-base:after {
          content: ''; background-image: radial-gradient(circle at -80% -12%,transparent 50.1em,#cacaca 50.3em,var(--base-clr) 50.5em);
          position: absolute; translate: 18em 20em; width: 100%; height: 80%; transform: rotateY(180deg);
        }
        .bell-base:nth-of-type(3) { filter: brightness(3) blur(1em); scale: 0.74 0.84; translate: 0 -11em; }

        .shadow-l1 { width: 30em; height: 42em; border-radius: 50%; rotate: 12deg; translate: -3em -6em; filter: blur(2em); background: #797a80; }
        .shadow-l2 { width: 130%; height: 90%; filter: blur(5em); translate: -6em 9em; }
        .shadow-l2::before { content: ''; width: 68%; height: 64%; border-radius: 50%; rotate: -54deg; translate: -8em 2em; background: #000; display: block; }

        .glow { width: 100%; height: 100%; filter: brightness(2) blur(2em); }
        .glow::before {
          content: ''; display: block; width: 100%; height: 80%; translate: 0 6em; scale: .94 .94; background: #fff3;
          clip-path: polygon(9% 83%,12% 79%,15% 74%,18% 68%,20% 62%,22% 56%,23% 50%,24% 43%,25% 38%,25% 34%,26% 29%,26% 26%,27% 22%,29% 19%,30% 15%,32% 13%,34% 10%,37% 7%,41% 5%,44% 4%,47% 3%,51% 3%,55% 3%,58% 5%,62% 6%,73% 29%,72% 25%,70% 20%,67% 16%,63% 12%,60% 9%,58% 8%,55% 7%,52% 6%,48% 6%,44% 8%,41% 9%,37% 12%,36% 14%,33% 16%,31% 20%,30% 23%,29% 26%,28% 31%,27% 36%,27% 39%,26% 44%,26% 48%,26% 52%,25% 56%,23% 61%,22% 65%,21% 69%,19% 72%,17% 75%,15% 78%,13% 81%);
        }
        .glow2 { width: 100%; height: 100%; filter: brightness(1) blur(.3em); opacity: .1; }
        .glow2::before {
          content: ''; display: block; width: 100%; height: 84%; translate: -1em 8.4em; background: #fff3;
          clip-path: polygon(9.21% 83%,12.28% 79%,15.35% 74%,18.41% 68%,20.46% 62%,22.51% 56%,23.53% 50%,24.55% 43%,25.58% 34%,26.6% 29%,27.62% 22%,29.16% 18.5%,30.95% 15.75%,32.74% 13%,34.78% 10%,37.85% 7%,41.94% 5%,45.01% 4%,48.08% 3%,52.17% 3%,56.27% 3%,64.01% 6.36%,55.75% 4.5%,47.83% 4.75%,42.84% 5.88%,39.51% 7.88%,36.45% 10.38%,33.38% 14.88%,30.69% 19%,29.67% 22.5%,28.8% 26.72%,28.21% 31.36%,26.92% 38.44%,26.57% 43.67%,25.51% 48.34%,25% 54.34%,23.4% 60.69%,21.23% 65.38%,18.41% 71.5%,16.88% 74.75%,12.28% 80.5%);
        }

        .left-glow { --lgc:#5d819666; width:50%; height:50%; border-radius:50%; translate:0 -24%; box-shadow:inset 1em 0 1em .2em var(--lgc); clip-path:polygon(0 0,100% 0,100% 50%,0 50%); }
        .left-glow2 { --lgc2:#5d819666; width:49%; height:50%; translate:-19em 10.35em; background-image:radial-gradient(circle at -80% -12%,transparent 50em,var(--lgc2) 50.3em,transparent 52em); clip-path:polygon(0 0,100% 0,100% 78%,0 78%); }
        .r-glow { --lgc:#fffaf680; width:50%; height:50%; border-radius:50%; translate:0 -24%; box-shadow:inset 1em 0 1em .2em var(--lgc); clip-path:polygon(0 0,100% 0,100% 50%,0 50%); transform:rotateY(180deg); }
        .r-glow2 { --lgc2:#fffaf680; width:49%; height:50%; translate:18.2em 10.35em; background-image:radial-gradient(circle at -80% -12%,transparent 50em,var(--lgc2) 50.3em,transparent 52em); clip-path:polygon(0 0,100% 0,100% 78%,0 78%); transform:rotateY(180deg) rotateZ(-2deg); }

        .mid-ring.small { translate:.04em -8em; scale:.8 .5; }
        .mid-ring { width:64%; height:10%; border-radius:50%; translate:-.1em 10em; box-shadow: inset -.3em 1.3em .4em -1em #fff5, -.2em -1.2em .4em -.4em #505050, -.1em -1.8em .4em -.4em #fff5, 0 -2.5em .4em -1em #000; mix-blend-mode:hard-light; filter:brightness(.8); }
        .mid-ring::before, .mid-ring::after { content:''; position:absolute; top:10%; width:2em; height:2em; border-radius:50%; background:#000; }
        .mid-ring::before { left:-2%; } .mid-ring::after { right:-2%; }

        .bell-buff-t { background:#fff2; width:72%; height:12%; border-radius:50%; translate:0 16em; filter:blur(1em); }
        .bell-buff { background:linear-gradient(90deg, #000 40%, var(--base-clr) 90%); width:88%; height:20%; border-radius:50% 50% 50% 50% / 50% 50% 30% 30%; translate:0 20em; box-shadow: inset 1em 0 2em -1em #5d819666, inset -1em 0 2em -1em #fff; }
        .bell-btm { width:88%; height:18%; border-radius:50%; translate:0 23em; background:linear-gradient(90deg, #000 40%, var(--base-clr) 90%); }
        .bell-btm2 { width:74%; height:12%; border-radius:50%; translate:0 24em; background:#fffff6; box-shadow: 0 0 1em .6em #ffe9d4, -.8em .2em 2em 1em #cca37f, -5.4em -.6em 3em -1em #ce6e1abb, 6em -.6em 3em -1em #ce6e1abb, inset 0 30.3em .3em -30em #c7962d, inset 0 -2em 2em -2em #ffe9d4, inset 0 -1em 2em 1em #ce6e1a66; filter:brightness(1); }
        .off .bell-btm2 { filter:brightness(.02); }

        .bell-ring-container { width:74%; height:24%; border-radius:50% 50% 50% 50% / 25% 25% 0% 0%; translate:0 29.2em; overflow:hidden; }
        .bell-ring { width:12em; height:12em; background:#fff; border-radius:50%; translate:0 -6em; box-shadow: 0 .8em 1em -.3em #f8e1d0, inset 0 -6em 4em -4em #e3b695, inset 0 1em 3em 1em #fff4, inset 0 2em 3em 1em #fff, inset 0 100em 0 100em #2c2c2c; }
        .off .bell-ring { background:#000; box-shadow: 0 .8em 1em -.3em #0000, inset 0 -6em 4em -4em #e3b69500, inset 0 1em 3em 1em #fff0, inset 0 -2em 3em 1em #fff2, inset 0 100em 0 100em #000; }

        .bell-rays { mix-blend-mode:soft-light; box-shadow: inset 0 -21em 4em -20em #000; width:100%; height:140%; translate:0 -4em; border-radius:50%; }
        .bell-rays::before {
          content:''; position:absolute; left:-21em; top:-77em; width:100em; height:100em; border-radius:100%;
          filter:blur(.6em);
          background: repeating-conic-gradient(at 50% 50%, #fff2 0%, transparent .6%, #fff2 .8%);
          animation: radiate 1s linear infinite;
        }
        .off .bell-rays { opacity:0; }
        @keyframes radiate { from { rotate:0deg; } to { rotate:6deg; } }

        .volumetric { width:98%; height:224%; translate:0 124em; opacity:.2; }
        .volumetric .vl { width:100%; height:100%; transform-origin:50% 20em; rotate:22deg; box-shadow: inset 40em 0 20em -20em #fff1; }
        .volumetric .vr { width:100%; height:100%; transform-origin:50% 20em; rotate:-22deg; box-shadow: inset -40em 0 20em -20em #fff1; }
        .off .volumetric { opacity:0; }

        .grain {
          z-index: 10; position:absolute; pointer-events:none; inset:0;
          background: radial-gradient(circle at 50% 50%, #000, #0000),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          filter: contrast(100%) brightness(200%) grayscale(1) opacity(0.168);
          mix-blend-mode: screen;
        }

        /* Status text inside the bell glow */
        .status-label {
          position: absolute;
          top: 16em; /* sits in front of bell-btm2 glow */
          left: 50%;
          transform: translateX(-50%);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
          font-size: 5em;
          color: #fff;
          text-shadow: 0 0 8px #fff6, 0 0 24px #ffd9a6aa, 0 0 48px #ffd9a666;
          pointer-events: none;
          opacity: 0.95;
          mix-blend-mode: screen;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

export { BellLoader };
