"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";

const CSS = `
@keyframes dc-blur-in {
  from { opacity: 0; filter: blur(8px); transform: translateY(10px); }
  to   { opacity: 1; filter: blur(0);   transform: translateY(0);    }
}
@keyframes dc-bar-grow {
  from { opacity: 0; transform: scaleX(0); }
  to   { opacity: 1; transform: scaleX(1); }
}
.dc-word {
  display: inline-block;
  animation: dc-blur-in 0.35s cubic-bezier(0.22, 0.61, 0.36, 1) both;
  animation-play-state: paused;
  will-change: filter, transform, opacity;
}
.dc-bar {
  transform-origin: left center;
  animation: dc-bar-grow 0.55s cubic-bezier(0.33, 1, 0.68, 1) 0.05s both;
  animation-play-state: paused;
}
.dc-deck.is-revealed .dc-word,
.dc-deck.is-revealed .dc-bar {
  animation-play-state: running;
}
`;

export type DeckItem = { title: string; text: string };

export interface DeckCarouselProps {
  items: DeckItem[];
  /** Primary accent color (buttons, number badges). Default: #2563EB */
  accentColor?: string;
  /** Color of the decorative bar per card — cycles automatically. */
  barColors?: string[];
}

const DEFAULT_BARS = ["#EF4444", "#EAB308", "#22C55E", "#3B82F6"];

const DECK_EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const SETTLE = `transform 0.7s ${DECK_EASE}, opacity 0.7s ${DECK_EASE}`;
const FALL = "transform 0.4s cubic-bezier(0.4, 0, 0.7, 1), opacity 0.34s ease-out";
const FALL_MS = 340;

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "prev" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

function BlurText({
  text,
  base,
  step,
}: {
  text: string;
  base: number;
  step: number;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span
            className="dc-word"
            style={{ animationDelay: `${base + i * step}ms` }}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

export function DeckCarousel({
  items,
  accentColor = "#2563EB",
  barColors = DEFAULT_BARS,
}: DeckCarouselProps) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById("dc-styles")) {
      const el = document.createElement("style");
      el.id = "dc-styles";
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const next = () => {
    if (leaving !== null) return;
    setLeaving(active);
    window.setTimeout(() => {
      setActive((a) => (a + 1) % n);
      setLeaving(null);
    }, FALL_MS);
  };
  const prev = () => {
    if (leaving !== null) return;
    setActive((a) => (a - 1 + n) % n);
  };
  const goTo = (i: number) => {
    if (leaving !== null) return;
    setActive(i);
  };

  const downX = useRef<number | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    downX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (downX.current === null) return;
    const dx = e.clientX - downX.current;
    downX.current = null;
    if (dx < -50) next();
    else if (dx > 50) prev();
  };

  const cardStyle = (i: number): CSSProperties => {
    if (i === leaving) {
      return {
        transform: "translateY(120%) rotate(6deg) scale(0.96)",
        opacity: 0,
        zIndex: n + 1,
        pointerEvents: "none",
        transformOrigin: "top center",
        transition: FALL,
        cursor: "default",
      };
    }
    const offset = (i - active + n) % n;
    const visible = offset < 3;
    const isFront = offset === 0 && leaving === null;
    return {
      transform: `translateY(${offset * 16}px) scale(${1 - offset * 0.05})`,
      opacity: visible ? (offset === 0 ? 1 : 0.5) : 0,
      zIndex: n - offset,
      pointerEvents: isFront ? "auto" : "none",
      transformOrigin: "top center",
      transition: SETTLE,
      cursor: isFront ? "grab" : "default",
    };
  };

  return (
    <div style={{ width: "100%", maxWidth: "28rem", margin: "0 auto" }}>
      <div
        ref={deckRef}
        className={`dc-deck${revealed ? " is-revealed" : ""}`}
        style={{
          position: "relative",
          height: "300px",
          width: "100%",
          userSelect: "none",
          perspective: "1200px",
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {items.map((item, i) => {
          const showText = i === active;
          return (
            <article
              key={item.title}
              aria-hidden={!showText}
              style={{
                position: "absolute",
                inset: 0,
                boxSizing: "border-box",
                overflow: "hidden",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                padding: "1.75rem",
                boxShadow: "0 18px 40px -20px rgba(0,0,0,0.18)",
                ...cardStyle(i),
              }}
            >
              <div
                key={`c-${active}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  opacity: showText ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "0.375rem",
                      flexShrink: 0,
                      background: accentColor,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color: "#fff",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="dc-bar"
                    aria-hidden="true"
                    style={{
                      height: "0.375rem",
                      width: "2rem",
                      borderRadius: "9999px",
                      background: barColors[i % barColors.length],
                    }}
                  />
                </div>
                <h3
                  style={{
                    margin: "1.25rem 0 0",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: "#0f172a",
                  }}
                >
                  <BlurText text={item.title} base={100} step={30} />
                </h3>
                <p
                  style={{
                    margin: "0.625rem 0 0",
                    lineHeight: 1.6,
                    color: "#64748b",
                    fontSize: "0.9375rem",
                  }}
                >
                  <BlurText text={item.text} base={230} step={18} />
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "0.625rem" }}>
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={dir === "prev" ? prev : next}
              aria-label={dir === "prev" ? "Previous card" : "Next card"}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.background = accentColor;
                btn.style.borderColor = accentColor;
                btn.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.background = "#fff";
                btn.style.borderColor = "#e2e8f0";
                btn.style.color = accentColor;
              }}
              style={{
                display: "grid",
                placeItems: "center",
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "9999px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: accentColor,
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
              }}
            >
              <Arrow dir={dir} />
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {items.map((item, i) => {
            const dotIndex = leaving !== null ? (active + 1) % n : active;
            const isActive = i === dotIndex;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to card ${i + 1}`}
                aria-current={isActive ? "true" : undefined}
                style={{
                  width: "0.625rem",
                  height: "0.625rem",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition:
                    "transform 0.5s cubic-bezier(0.22,0.61,0.36,1), background-color 0.5s cubic-bezier(0.22,0.61,0.36,1)",
                  transform: isActive ? "scale(1.25)" : "scale(1)",
                  backgroundColor: isActive ? accentColor : "#e2e8f0",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
