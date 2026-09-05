"use client";

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

const styles = {
  surface: "if-surface",
  foil: "if-foil",
  film: "if-film",
  pearl: "if-pearl",
  content: "if-content",
  shine: "if-shine",
  glare: "if-glare",
};

const FOIL_CSS = `
.if-surface {
  --pointer-x: 50%;
  --pointer-y: 50%;
  --foil-shift: 0%;
  --foil-y-shift: 0%;
  --glare-x: 50%;
  --glare-y: 50%;
  --shine-angle: 135deg;
  --shine-opacity: 0.62;
  --shine-opacity-scale: 1;
  --film-opacity: 0.34;
  --foil-filter: saturate(1.18) contrast(1.22) brightness(1);
  --highlight-filter: brightness(1) saturate(1);
  --foil-base-gradient: linear-gradient(
    135deg,
    #eeeeee 0%,
    #dcdcdc 40%,
    #c9c9c9 72%,
    #e8e8e8 100%
  );
  --glare-opacity: 0.38;
  --pearl-opacity: 0.98;
  --surface-inset-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.38);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: #f1f0ef;
  box-shadow: var(--surface-inset-shadow);
  contain: layout paint style;
}
:root[class~="dark"] .if-surface {
  --film-opacity: 0.46;
  --foil-filter: saturate(1.22) contrast(1.12) brightness(0.96);
  --highlight-filter: brightness(0.72) saturate(0.82);
  --foil-base-gradient: linear-gradient(
    135deg,
    #f1f0ef 0%,
    #f1f0ef 44%,
    #e8e6e3 72%,
    #f1f0ef 100%
  );
  --glare-opacity: 0.26;
  --pearl-opacity: 0.56;
  --shine-opacity-scale: 0.42;
  --surface-inset-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.if-content,
.if-film,
.if-foil,
.if-glare,
.if-pearl,
.if-shine {
  position: absolute;
  inset: 0;
}
.if-film,
.if-foil,
.if-glare,
.if-pearl,
.if-shine {
  background-repeat: no-repeat;
  pointer-events: none;
}
.if-film,
.if-foil,
.if-pearl,
.if-shine {
  inset: -48%;
}
.if-foil {
  z-index: 0;
  background:
    linear-gradient(
      112deg,
      transparent 0%,
      transparent 28%,
      rgba(0, 220, 255, 0.08) 32%,
      rgba(80, 255, 190, 0.07) 36%,
      rgba(190, 255, 80, 0.05) 40%,
      transparent 46%,
      rgba(255, 230, 70, 0.04) 50%,
      rgba(255, 70, 180, 0.07) 56%,
      rgba(150, 90, 255, 0.07) 64%,
      rgba(60, 120, 255, 0.06) 70%,
      transparent 75%,
      transparent 100%
    ),
    var(--foil-base-gradient);
  background-repeat: no-repeat;
  background-position:
    var(--foil-shift) center,
    center;
  background-size:
    320% 100%,
    100% 100%;
  filter: var(--foil-filter);
  will-change: background-position;
}
.if-film {
  z-index: 1;
  background:
    radial-gradient(
      ellipse at 16% 28%,
      rgba(255, 70, 180, 0.1) 0%,
      rgba(255, 70, 180, 0.04) 18%,
      transparent 48%
    ),
    radial-gradient(
      ellipse at 66% 18%,
      rgba(0, 220, 255, 0.1) 0%,
      rgba(0, 220, 255, 0.04) 20%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 78% 70%,
      rgba(80, 255, 190, 0.1) 0%,
      rgba(80, 255, 190, 0.04) 22%,
      transparent 56%
    ),
    radial-gradient(
      ellipse at 38% 82%,
      rgba(150, 90, 255, 0.1) 0%,
      rgba(150, 90, 255, 0.04) 18%,
      transparent 52%
    );
  background-repeat: no-repeat;
  background-position:
    calc(var(--foil-shift) * -0.2) calc(var(--foil-y-shift) * 0.3),
    calc(var(--foil-shift) * 0.5) calc(var(--foil-y-shift) * -0.2),
    calc(var(--foil-shift) * -0.4) calc(var(--foil-y-shift) * 0.5),
    calc(var(--foil-shift) * 0.35) calc(var(--foil-y-shift) * 0.25);
  background-size:
    150% 150%,
    160% 160%,
    145% 145%,
    155% 155%;
  filter: blur(0.4px) saturate(1.35);
  mix-blend-mode: screen;
  opacity: var(--film-opacity);
  will-change: background-position;
}
.if-pearl {
  z-index: 2;
  background:
    radial-gradient(
      ellipse at calc(var(--glare-x) * 0.9) calc(var(--glare-y) * 0.85),
      rgba(224, 233, 240, 0.48) 0%,
      rgba(205, 217, 226, 0.18) 22%,
      transparent 54%
    ),
    linear-gradient(
      112deg,
      rgba(220, 230, 238, 0.32) 0%,
      rgba(220, 230, 238, 0) 28%,
      rgba(84, 108, 128, 0.2) 48%,
      rgba(215, 226, 235, 0.3) 72%,
      rgba(215, 226, 235, 0.04) 100%
    ),
    linear-gradient(
      28deg,
      rgba(188, 218, 255, 0.12) 0%,
      transparent 34%,
      rgba(255, 223, 244, 0.12) 58%,
      transparent 100%
    );
  background-repeat: no-repeat;
  background-position:
    center,
    var(--foil-shift) center,
    var(--foil-shift) center;
  background-size:
    100% 100%,
    180% 100%,
    160% 100%;
  filter: var(--highlight-filter);
  mix-blend-mode: soft-light;
  opacity: var(--pearl-opacity);
  will-change: background-position;
}
.if-content {
  z-index: 3;
}
.if-shine {
  z-index: 4;
  background:
    linear-gradient(
      var(--shine-angle),
      transparent 0%,
      rgba(220, 230, 238, 0.04) 12%,
      rgba(226, 235, 242, 0.48) 31%,
      rgba(37, 52, 66, 0.24) 52%,
      rgba(0, 124, 255, 0.08) 64%,
      rgba(255, 0, 147, 0.08) 74%,
      rgba(223, 232, 239, 0.28) 88%,
      transparent 100%
    ),
    linear-gradient(
      112deg,
      transparent 0%,
      transparent 30%,
      rgba(0, 220, 255, 0.04) 34%,
      rgba(80, 255, 190, 0.04) 38%,
      rgba(190, 255, 80, 0.03) 42%,
      transparent 45%,
      rgba(255, 230, 70, 0.03) 52%,
      rgba(255, 70, 180, 0.05) 59%,
      transparent 66%,
      rgba(150, 90, 255, 0.05) 73%,
      rgba(60, 120, 255, 0.04) 78%,
      transparent 84%
    );
  background-repeat: no-repeat;
  background-position: calc(50% + (var(--pointer-x) - 50%) * 0.35)
    calc(50% + (var(--pointer-y) - 50%) * 0.24);
  background-size: 220% 100%;
  filter: blur(0.25px) var(--highlight-filter);
  mix-blend-mode: screen;
  opacity: calc(var(--shine-opacity) * var(--shine-opacity-scale));
  will-change: background-position, opacity;
}
.if-glare {
  z-index: 5;
  background: radial-gradient(
    circle at var(--glare-x) var(--glare-y),
    rgba(226, 235, 242, 0.34) 0%,
    rgba(205, 218, 228, 0.14) 9%,
    rgba(226, 237, 246, 0.08) 22%,
    transparent 36%
  );
  background-repeat: no-repeat;
  filter: var(--highlight-filter);
  mix-blend-mode: screen;
  opacity: var(--glare-opacity);
  will-change: background;
}
`;

type ScrollProgressMode = "element" | "document";

type IridescentFoilCustomProperty =
  | "--foil-shift"
  | "--foil-y-shift"
  | "--glare-x"
  | "--glare-y"
  | "--pointer-x"
  | "--pointer-y"
  | "--shine-angle"
  | "--shine-opacity";

type IridescentFoilStyle = CSSProperties &
  Record<IridescentFoilCustomProperty, string>;

type IridescentFoilProps = ComponentPropsWithoutRef<"div"> & {
  scrollProgressMode?: ScrollProgressMode;
};

const initialStyle: IridescentFoilStyle = {
  "--foil-shift": "0%",
  "--foil-y-shift": "0%",
  "--glare-x": "50%",
  "--glare-y": "50%",
  "--pointer-x": "50%",
  "--pointer-y": "50%",
  "--shine-angle": "135deg",
  "--shine-opacity": "0.62",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toPercent(value: number) {
  return `${Number((value * 100).toFixed(3))}%`;
}

function toDegrees(value: number) {
  return `${Number(value.toFixed(3))}deg`;
}

function toUnitless(value: number) {
  return `${Number(value.toFixed(3))}`;
}

function getElementScrollProgress(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const visibleScrollRange = window.innerHeight + rect.height;
  return visibleScrollRange > 0
    ? clamp((window.innerHeight - rect.top) / visibleScrollRange, 0, 1)
    : 0;
}

function getDocumentScrollProgress() {
  const scrollingElement =
    document.scrollingElement ?? document.documentElement;
  const scrollRange = scrollingElement.scrollHeight - window.innerHeight;
  return scrollRange > 0
    ? clamp(scrollingElement.scrollTop / scrollRange, 0, 1)
    : 0;
}

function getElementPointer(event: PointerEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    x:
      rect.width > 0
        ? clamp((event.clientX - rect.left) / rect.width, 0.08, 0.92)
        : 0.5,
    y:
      rect.height > 0
        ? clamp((event.clientY - rect.top) / rect.height, 0.08, 0.92)
        : 0.5,
  };
}

function setFoilProperty(
  style: CSSStyleDeclaration,
  property: IridescentFoilCustomProperty,
  value: string,
) {
  style.setProperty(property, value);
}

export function IridescentFoil({
  children,
  className,
  scrollProgressMode = "element",
  style,
  ...props
}: IridescentFoilProps) {
  const foilRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const foil = foilRef.current;
    if (!foil) {
      return;
    }
    const applyEffect = () => {
      const { x, y } = pointerRef.current;
      const scrollProgress =
        scrollProgressMode === "document"
          ? getDocumentScrollProgress()
          : getElementScrollProgress(foil);
      const foilStyle = foil.style;
      setFoilProperty(
        foilStyle,
        "--foil-shift",
        toPercent(scrollProgress * 0.82 + (x - 0.5) * 0.18),
      );
      setFoilProperty(
        foilStyle,
        "--foil-y-shift",
        toPercent(scrollProgress * 0.28 + (y - 0.5) * 0.12),
      );
      setFoilProperty(foilStyle, "--glare-x", toPercent(x));
      setFoilProperty(foilStyle, "--glare-y", toPercent(y));
      setFoilProperty(foilStyle, "--pointer-x", toPercent(x));
      setFoilProperty(foilStyle, "--pointer-y", toPercent(y));
      setFoilProperty(
        foilStyle,
        "--shine-angle",
        toDegrees(105 + scrollProgress * 80 + (x - 0.5) * 28),
      );
      setFoilProperty(
        foilStyle,
        "--shine-opacity",
        toUnitless(0.56 + Math.abs(x - 0.5) * 0.24 + scrollProgress * 0.12),
      );
      frameRef.current = null;
    };
    const scheduleEffect = () => {
      if (frameRef.current !== null) {
        return;
      }
      frameRef.current = window.requestAnimationFrame(applyEffect);
    };
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = getElementPointer(event, foil);
      scheduleEffect();
    };
    const handleScroll = () => {
      scheduleEffect();
    };
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", scheduleEffect, { passive: true });
    scheduleEffect();
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", scheduleEffect);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [scrollProgressMode]);
  return (
    <div
      {...props}
      className={cn(styles.surface, className)}
      ref={foilRef}
      style={{ ...initialStyle, ...style }}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: FOIL_CSS }} />
      <span aria-hidden className={styles.foil} />
      <span aria-hidden className={styles.film} />
      <span aria-hidden className={styles.pearl} />
      <div className={styles.content}>{children}</div>
      <span aria-hidden className={styles.shine} />
      <span aria-hidden className={styles.glare} />
    </div>
  );
}

export default IridescentFoil;
