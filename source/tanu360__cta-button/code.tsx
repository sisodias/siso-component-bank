"use client"

import { ArrowRight } from "lucide-react"
import { useRef, useMemo, useCallback } from "react"

export interface GlowCTAProps {
  children?: React.ReactNode
  className?: string
  onClick?: () => void

  glowColorLeft: string
  glowColorRight: string
  darkGlowColorLeft: string
  darkGlowColorRight: string

  highlightColor: string
  highlightSubtle: string
  glassColor: string
  darkHighlightColor: string
  darkHighlightSubtle: string
  darkGlassColor: string

  borderRadius?: number
  borderWidth?: number
  paddingX?: number
  paddingY?: number
  fontSize?: number
  fontWeight?: number
  gap?: number
  animationDuration?: number
  showArrow?: boolean
}

export function GlowCTA({
  children = "Get Started",
  className,
  onClick,
  glowColorLeft,
  glowColorRight,
  darkGlowColorLeft,
  darkGlowColorRight,
  highlightColor,
  highlightSubtle,
  glassColor,
  darkHighlightColor,
  darkHighlightSubtle,
  darkGlassColor,
  borderRadius = 353,
  borderWidth = 1,
  paddingX = 32,
  paddingY = 24,
  fontSize = 24,
  fontWeight = 700,
  gap = 20,
  animationDuration = 3,
  showArrow = true,
}: GlowCTAProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  const id = useMemo(
    () =>
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10),
    []
  )

  const handleMouseEnter = useCallback(() => {
    const btn = btnRef.current
    if (!btn) return
    btn.style.transition = "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    btn.style.transform =
      "translate3d(0,0,0) scale3d(1.1,1.1,1) rotateX(0deg) rotateY(0deg)"
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const btn = btnRef.current
    const circle = circleRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -8
    const rotateY = ((x - cx) / cx) * 8

    btn.style.willChange = "transform"
    btn.style.transform = `translate3d(0,0,0) scale3d(1.1,1.1,1) rotateX(${rotateX.toFixed(4)}deg) rotateY(${rotateY.toFixed(4)}deg)`
    btn.style.transformStyle = "preserve-3d"

    if (circle) {
      circle.style.display = "block"
      circle.style.left = `${x - 25}px`
      circle.style.top = `${y - 25}px`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    const btn = btnRef.current
    const circle = circleRef.current
    if (!btn) return
    btn.style.transition = "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    btn.style.transform = "translate3d(0,0,0) scale3d(1,1,1) rotateX(0deg) rotateY(0deg)"
    if (circle) circle.style.display = "none"
  }, [])

  const cssVars = {
    "--gcta-hl": highlightColor,
    "--gcta-hl-s": highlightSubtle,
    "--gcta-glass": glassColor,
    "--gcta-d-hl": darkHighlightColor,
    "--gcta-d-hl-s": darkHighlightSubtle,
    "--gcta-d-glass": darkGlassColor,
    "--gcta-r": `${borderRadius}px`,
    "--gcta-bw": `${borderWidth}px`,
    "--gcta-px": `${paddingX}px`,
    "--gcta-py": `${paddingY}px`,
    "--gcta-fs": `${fontSize}px`,
    "--gcta-fw": String(fontWeight),
    "--gcta-dur": `${animationDuration}s`,
    "--gcta-gap": `${gap}px`,
    "--gcta-gl": glowColorLeft,
    "--gcta-gr": glowColorRight,
    "--gcta-d-gl": darkGlowColorLeft,
    "--gcta-d-gr": darkGlowColorRight,
  } as React.CSSProperties

  return (
    <>
      <style>{`
        @property --gcta-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gcta-pct {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }
        @property --gcta-off {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @property --gcta-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }

        .gcta-wrap {
          perspective: 800px;
          display: inline-block;
          cursor: pointer;
        }

        .gcta {
          --_hl: var(--gcta-hl);
          --_hl-s: var(--gcta-hl-s);
          --_glass: var(--gcta-glass);
          --_bg: #ffffff;
          --_fg: #0a0a0a;
          --_gl: var(--gcta-gl);
          --_gr: var(--gcta-gr);
          /* Shimmer color: in light mode use highlight, same for dark */
          --_shimmer: var(--gcta-hl);

          --shadow-size: 2px;
          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline-offset: 4px;
          padding: var(--gcta-py) var(--gcta-px);
          font-family: inherit;
          font-size: var(--gcta-fs);
          font-weight: var(--gcta-fw);
          line-height: 1.2;
          border: var(--gcta-bw) solid transparent;
          border-radius: var(--gcta-r);
          color: var(--_fg);
          background:
            linear-gradient(var(--_bg), var(--_bg)) padding-box,
            conic-gradient(
              from calc(var(--gcta-angle) - var(--gcta-off)),
              var(--_glass),
              var(--_hl) var(--gcta-pct),
              var(--gcta-shine) calc(var(--gcta-pct) * 2),
              var(--_hl) calc(var(--gcta-pct) * 3),
              var(--_glass) calc(var(--gcta-pct) * 4)
            ) border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--gcta-gap);
          transform: scale3d(1,1,1);
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --_tr: 800ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        :is(.dark, [data-theme="dark"]) .gcta {
          --_hl: var(--gcta-d-hl);
          --_hl-s: var(--gcta-d-hl-s);
          --_glass: var(--gcta-d-glass);
          --_bg: #101010;
          --_fg: #ffffff;
          --_gl: var(--gcta-d-gl);
          --_gr: var(--gcta-d-gr);
          /* Dark shimmer: blend highlight with some white for softer glow */
          --_shimmer: var(--gcta-d-hl);
        }

        .gcta:active { translate: 0 1px; }

        /* ── Dot pattern — z-index 2, uses currentColor (= text color) ── */
        .gcta::before {
          content: "";
          pointer-events: none;
          position: absolute;
          left: 50%; top: 50%;
          translate: -50% -50%;
          z-index: 2;
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(
            circle at var(--position) var(--position),
            currentColor calc(var(--position) / 4),
            transparent 0
          ) padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(
            from calc(var(--gcta-angle) + 45deg),
            black, transparent 10% 90%, black
          );
          border-radius: inherit;
          opacity: 0.4;
        }

        /* ── Shimmer — uses highlight color, not raw white ── */
        .gcta::after {
          content: "";
          pointer-events: none;
          position: absolute;
          left: 50%; top: 50%;
          translate: -50% -50%;
          z-index: 2;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(
            -50deg,
            transparent,
            var(--_shimmer),
            transparent
          );
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.6;
        }

        /* Reduce shimmer intensity in dark mode */
        :is(.dark, [data-theme="dark"]) .gcta::after {
          opacity: 0.25;
        }

        /* Animations — paused, play on hover */
        .gcta {
          animation: gcta-spin var(--gcta-dur) linear infinite,
            gcta-spin calc(var(--gcta-dur) / 0.4) linear infinite reverse paused;
          animation-composition: add;
          transition: var(--_tr);
          transition-property: --gcta-off, --gcta-pct, --gcta-shine;
        }
        .gcta::before {
          animation: gcta-spin var(--gcta-dur) linear infinite,
            gcta-spin calc(var(--gcta-dur) / 0.4) linear infinite reverse paused;
          animation-composition: add;
        }
        .gcta::after {
          animation: gcta-shimmer var(--gcta-dur) linear infinite,
            gcta-shimmer calc(var(--gcta-dur) / 0.4) linear infinite reverse paused;
          animation-composition: add;
        }

        .gcta:is(:hover, :focus-visible) {
          --gcta-pct: 20%;
          --gcta-off: 95deg;
          --gcta-shine: var(--_hl-s);
          animation-play-state: running;
        }
        .gcta:hover::before,
        .gcta:hover::after,
        .gcta:focus-visible::before,
        .gcta:focus-visible::after {
          animation-play-state: running;
        }

        /* Moving circle */
        .gcta-circle {
          z-index: 1;
          pointer-events: none;
          position: absolute;
          width: 50px; height: 50px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.42);
          border: 0 transparent;
          display: none;
          overflow: visible;
          box-shadow: 0 0 70px 46px rgba(255,255,255,0.5);
        }

        /* SVG container — clip to button's border-radius */
        .gcta-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          overflow: hidden;
        }

        .gcta .gcta-sl { fill: var(--_gl); }
        .gcta .gcta-sr { fill: var(--_gr); }

        @keyframes gcta-spin { to { --gcta-angle: 360deg; } }
        @keyframes gcta-shimmer { to { rotate: 360deg; } }

        @media (max-width: 479px) {
          .gcta { padding: 18px 24px; font-size: 16px; gap: 12px; }
        }
      `}</style>

      <div
        ref={wrapRef}
        className="gcta-wrap"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <button
          ref={btnRef}
          className={["gcta", className].filter(Boolean).join(" ")}
          onClick={onClick}
          style={cssVars}
        >
          <div ref={circleRef} className="gcta-circle" />

          {/* SVG wrapped in clipping div — inherits border-radius */}
          <div className="gcta-svg">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <g filter={`url(#gcta-f0-${id})`}>
                <path
                  d="M-10 100H-15V0H70C70 0 30 15 10 40C-10 65 -10 100 -10 100Z"
                  className="gcta-sl"
                />
              </g>
              <g filter={`url(#gcta-f1-${id})`}>
                <path
                  d="M110 0H115V100H30C30 0 70 85 90 60C110 35 110 0 110 0Z"
                  className="gcta-sr"
                />
              </g>
              <defs>
                <filter id={`gcta-f0-${id}`} x="-35" y="-20" width="125" height="140" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="10" result="effect1" />
                </filter>
                <filter id={`gcta-f1-${id}`} x="10" y="-20" width="125" height="140" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feGaussianBlur stdDeviation="10" result="effect1" />
                </filter>
              </defs>
            </svg>
          </div>

          <span className="relative z-10 flex items-center justify-center" style={{ gap: `${gap}px` }}>
            <span>{children}</span>
            {showArrow && <ArrowRight style={{ width: fontSize, height: fontSize }} />}
          </span>
        </button>
      </div>
    </>
  )
}