"use client";

import React from "react";

type LoaderProps = {
  text?: string;
  size?: number | string;
  speedMs?: number;
  colors?: [string, string, string];
  fontFamily?: string;
  className?: string;
  backgroundColor?: string;
};

export function Component({
  text = "Generating",
  size = 240,
  speedMs = 2000,
  colors = ["#fff", "#ad5fff", "#471eec"],
  fontFamily =
    '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  className,
  backgroundColor = "#030812",
}: LoaderProps) {
  const letters = Array.from(text);
  const sizeCss = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`tf-gen-loader ${className ?? ""}`}
      role="status"
      aria-label={`${text}…`}
      style={
        {
          ["--tf-size" as any]: sizeCss,
          ["--tf-c1" as any]: colors[0],
          ["--tf-c2" as any]: colors[1],
          ["--tf-c3" as any]: colors[2],
          ["--tf-speed" as any]: `${speedMs}ms`,
          ["--tf-font" as any]: fontFamily,
          ["--tf-bg" as any]: backgroundColor,
          ["--tf-pad" as any]: `calc(${sizeCss} / 10)`,
        } as React.CSSProperties
      }
    >
      <div className="tf-core" aria-hidden="true" />

      {/* Two-layer text: solid base + shimmer overlay */}
      <div className="tf-text-wrap">
        <div className="tf-text-base" aria-hidden="true">
          {letters.map((ch, i) => (
            <span key={`base-${ch}-${i}`} className="tf-letter">
              {ch}
            </span>
          ))}
          <span className="tf-spacer" />
        </div>
        <div className="tf-text">
          {letters.map((ch, i) => (
            <span key={`shimmer-${ch}-${i}`} className="tf-letter">
              {ch}
            </span>
          ))}
          <span className="tf-spacer" aria-hidden="true" />
        </div>
      </div>

      <style>{`
        .tf-gen-loader {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--tf-size);
          height: var(--tf-size);
          border-radius: 50%;
          user-select: none;
          font-family: var(--tf-font);
          color: currentColor;
          background-color: var(--tf-bg);
          contain: content;
          isolation: isolate;
        }

        .tf-core {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          animation: tf-rotate var(--tf-speed) linear infinite;
        }

        /* Stack base + shimmer perfectly centered */
        .tf-text-wrap {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          height: 100%;
          padding-inline: var(--tf-pad);
          box-sizing: border-box;
        }
        .tf-text-base,
        .tf-text {
          grid-area: 1 / 1;
          display: inline-flex;
          align-items: baseline;
          gap: 0.02em;
          font-size: calc(var(--tf-size) / 9);
          font-weight: 300;
          line-height: 1;
          white-space: nowrap;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Solid base fill (shows at edges) */
        .tf-text-base {
          color: rgba(255, 255, 255, 0.85);
        }

        /* Shimmer overlay (on top) */
        .tf-text {
          color: transparent;
          background: linear-gradient(
            110deg,
            rgba(255,255,255,0.20) 0%,
            rgba(255,255,255,0.95) 50%,
            rgba(255,255,255,0.20) 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: tf-shimmer var(--tf-speed) ease-in-out infinite;
        }

        .tf-letter { display: inline-block; }

        /* tiny trailing buffer so last glyph never touches the edge */
        .tf-spacer { display: inline-block; width: 0.25em; }

        @keyframes tf-shimmer {
          0%   { background-position: 300% 0%; }
          100% { background-position: -200% 0%; }
        }

        @keyframes tf-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 10px 20px 0 var(--tf-c1) inset,
              0 20px 30px 0 var(--tf-c2) inset,
              0 60px 60px 0 var(--tf-c3) inset;
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 10px 20px 0 var(--tf-c1) inset,
              0 20px 10px 0 #d60a47 inset,
              0 40px 60px 0 #311e80 inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 10px 20px 0 var(--tf-c1) inset,
              0 20px 30px 0 var(--tf-c2) inset,
              0 60px 60px 0 var(--tf-c3) inset;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tf-core, .tf-text { animation: none !important; }
          .tf-text {
            background: none;
            -webkit-background-clip: initial;
            background-clip: initial;
            color: rgba(255,255,255,0.85);
          }
        }
      `}</style>
    </div>
  );
}
