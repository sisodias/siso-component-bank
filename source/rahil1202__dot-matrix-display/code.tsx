"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DotMatrixDisplayProps {
  /** Images to cycle through — any size/aspect ratio, they will be letterboxed. */
  imageUrls?: string[];
  /** Columns of dots */
  cols?: number;
  /** Rows of dots */
  rows?: number;
  /** Interval between image frames in ms */
  interval?: number;
  /** Heading text shown above the matrix */
  heading?: string;
  /** Glow intensity 0–1 */
  glowIntensity?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_IMAGES = [
  "https://raw.githubusercontent.com/rahil1202/21st.dev-assets/refs/heads/main/assets/DotMatrixDisplay/linux.png",
  "https://raw.githubusercontent.com/rahil1202/21st.dev-assets/refs/heads/main/assets/DotMatrixDisplay/openai.png",
  "https://raw.githubusercontent.com/rahil1202/21st.dev-assets/refs/heads/main/assets/DotMatrixDisplay/figma.png",
  "https://raw.githubusercontent.com/rahil1202/21st.dev-assets/refs/heads/main/assets/DotMatrixDisplay/Telegram.png",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cols: number,
  rows: number
) {
  const scale = Math.min(cols / img.naturalWidth, rows / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (cols - dw) / 2;
  const dy = (rows - dh) / 2;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, cols, rows);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, dx, dy, dw, dh);
}

// ─── Component ────────────────────────────────────────────────────────────────

function DotMatrixDisplay({
  imageUrls = DEFAULT_IMAGES,
  cols = 60,
  rows = 30,
  interval = 300,
  heading = "Pov: You Made Good Choices.",
  glowIntensity = 0.5,
}: DotMatrixDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageIndexRef = useRef(0);
  const [dotStates, setDotStates] = useState<boolean[]>(() =>
    Array(cols * rows).fill(false)
  );

  const totalDots = cols * rows;
  const hiddenDots = new Set([0, cols - 1, totalDots - cols, totalDots - 1]);

  const loadNextImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = cols;
      canvas.height = rows;
      drawContain(ctx, img, cols, rows);

      const { data } = ctx.getImageData(0, 0, cols, rows);
      const next: boolean[] = [];
      for (let i = 0; i < data.length; i += 4) {
        next.push((data[i] + data[i + 1] + data[i + 2]) / 3 < 128);
      }
      setDotStates(next);
    };
    img.src = imageUrls[imageIndexRef.current];
    imageIndexRef.current = (imageIndexRef.current + 1) % imageUrls.length;
  }, [cols, rows, imageUrls]);

  useEffect(() => {
    loadNextImage();
    const id = setInterval(loadNextImage, interval);
    return () => clearInterval(id);
  }, [loadNextImage, interval]);

  const gridW = cols * 5 + (cols - 1) * 3;
  const gridH = rows * 5 + (rows - 1) * 3;
  const glowStyle = `0px 0px ${4 + glowIntensity * 8}px var(--dmx-glow)`;

  return (
    <>
      {/*
        ── Theme tokens ────────────────────────────────────────────────────────
        We define two sets of CSS variables scoped to the component wrapper.
        They automatically switch when the OS / shadcn theme adds `.dark` to
        any ancestor element (including <html>), so zero JS is needed.

        Light mode:
          • wrapper bg   → warm off-white  (#f5f4f2)
          • heading      → near-black
          • active dot   → near-black (dark ink on light panel)
          • inactive dot → light grey
          • housing bg   → slightly darker warm grey
          • glow         → dark semi-transparent

        Dark mode:
          • wrapper bg   → shadcn --background (dark slate)
          • heading      → white
          • active dot   → white / bright
          • inactive dot → very dark
          • housing bg   → original dark gradient
          • glow         → white semi-transparent
      */}
      <style>{`
        .dmx-root {
          --dmx-wrapper-bg:   #f5f4f2;
          --dmx-heading-c:    #1a1a1a;
          --dmx-active:       #1a1a1a;
          --dmx-inactive:     #d0cfcd;
          --dmx-glow:         rgba(0,0,0,0.25);
          --dmx-housing-bg:   linear-gradient(180deg,#dddbd8 0%,#d4d2ce 87%,#c8c6c2 100%);
          --dmx-housing-sh:   0px -4px 0px 0px rgba(0,0,0,0.12) inset,
                              0px 17px 43px 0px rgba(0,0,0,0.18);
          --dmx-ring-bg:      linear-gradient(180deg,rgba(180,178,175,1) 0%,rgba(140,138,135,1) 100%);
        }

        .dark .dmx-root,
        [data-theme="dark"] .dmx-root {
          --dmx-wrapper-bg:   hsl(var(--background, 240 6% 10%));
          --dmx-heading-c:    #ffffff;
          --dmx-active:       #fffefe;
          --dmx-inactive:     #0e0e0e;
          --dmx-glow:         rgba(255,255,255,0.45);
          --dmx-housing-bg:   linear-gradient(180deg,#1c1d1f 0%,#212224 87%,#313235 100%);
          --dmx-housing-sh:   0px -4px 0px 0px rgba(0,0,0,0.7) inset,
                              0px 17px 43px 0px rgba(0,0,0,0.64);
          --dmx-ring-bg:      linear-gradient(180deg,rgba(46,45,46,1) 0%,rgba(3,2,3,1) 100%);
        }

        @media (prefers-color-scheme: dark) {
          .dmx-root:not(.dmx-force-light) {
            --dmx-wrapper-bg:   hsl(240 6% 10%);
            --dmx-heading-c:    #ffffff;
            --dmx-active:       #fffefe;
            --dmx-inactive:     #0e0e0e;
            --dmx-glow:         rgba(255,255,255,0.45);
            --dmx-housing-bg:   linear-gradient(180deg,#1c1d1f 0%,#212224 87%,#313235 100%);
            --dmx-housing-sh:   0px -4px 0px 0px rgba(0,0,0,0.7) inset,
                                0px 17px 43px 0px rgba(0,0,0,0.64);
            --dmx-ring-bg:      linear-gradient(180deg,rgba(46,45,46,1) 0%,rgba(3,2,3,1) 100%);
          }
        }
      `}</style>

      <div
        className="dmx-root inline-flex flex-col items-start gap-4 p-8 rounded-3xl select-none"
        style={{ background: "var(--dmx-wrapper-bg)" }}
      >
        {/* Hidden canvas — pixel sampling only */}
        <canvas
          ref={canvasRef}
          width={cols}
          height={rows}
          className="hidden"
          aria-hidden="true"
        />

        {/* Heading */}
        <p
          className="text-xl md:text-2xl font-serif tracking-tight transition-colors duration-300"
          style={{
            fontFamily: "'Instrument Serif', serif",
            color: "var(--dmx-heading-c)",
          }}
        >
          {heading}
        </p>

        {/* Matrix housing */}
        <div
          className="relative rounded-2xl p-4"
          style={{
            background: "var(--dmx-housing-bg)",
            boxShadow: "var(--dmx-housing-sh)",
          }}
        >
          {/* Outer border gradient ring */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
            style={{
              margin: -2,
              background: "var(--dmx-ring-bg)",
              borderRadius: "calc(1rem + 2px)",
            }}
          />

          {/* Dot grid */}
          <div
            role="img"
            aria-label="Dot matrix display"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 5px)`,
              gridTemplateRows: `repeat(${rows}, 5px)`,
              gap: "3px",
              width: gridW,
              height: gridH,
            }}
          >
            {dotStates.map((active, idx) => (
              <span
                key={idx}
                className="rounded-full transition-colors duration-100"
                style={{
                  width: 5,
                  height: 5,
                  backgroundColor: active
                    ? "var(--dmx-active)"
                    : "var(--dmx-inactive)",
                  boxShadow: active ? glowStyle : undefined,
                  opacity: hiddenDots.has(idx) ? 0 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export { DotMatrixDisplay };