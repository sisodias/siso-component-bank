
import React, { useEffect, useMemo, useRef, useState } from "react";

const STYLE_ID = "bento3-animations";
const HERO_IMAGE_URL = "https://assets.awwwards.com/awards/external/2018/07/5b507de712542.jpg";

const palettes = {
  dark: {
    surface: "bg-neutral-950 text-neutral-100",
    heading: "text-white",
    muted: "text-neutral-400",
    capsule: "bg-white/5 border-white/10 text-white/80",
    card: "bg-neutral-900/55",
    toggleSurface: "bg-white/10",
    toggle: "border-white/15 text-white",
    button: "border-white/15 text-white hover:border-white/40 hover:bg-white/10",
    gridColor: "rgba(255, 255, 255, 0.06)",
    overlay:
      "linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 45%, rgba(10,10,10,0.92) 100%)",
  },
  light: {
    surface: "bg-slate-100 text-neutral-900",
    heading: "text-neutral-900",
    muted: "text-neutral-600",
    capsule: "bg-white/70 border-neutral-200 text-neutral-700",
    card: "bg-white/80",
    toggleSurface: "bg-white",
    toggle: "border-neutral-300 text-neutral-900",
    button: "border-neutral-300 text-neutral-900 hover:border-neutral-500 hover:bg-neutral-900/5",
    gridColor: "rgba(17, 17, 17, 0.08)",
    overlay:
      "linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(241,245,249,0.68) 45%, rgba(248,250,252,0.96) 100%)",
  },
};

const getRootTheme = () => {
  if (typeof document === "undefined") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }

  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.dataset?.theme === "dark" || root.getAttribute("data-theme") === "dark") return "dark";
  if (root.classList.contains("light")) return "light";
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

function Bento3Section() {
  const [theme, setTheme] = useState(() => getRootTheme());
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      @keyframes bento3-reveal {
        0% { opacity: 0; transform: translate3d(0, 36px, 0) scale(0.97); filter: blur(12px); }
        60% { filter: blur(0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      .bento3-root {
        min-height: 100svh;
        min-height: 100vh;
        padding-inline: clamp(1.25rem, 6vw, 4.5rem);
        padding-block: clamp(2.75rem, 6vw, 5rem);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bento3-shell {
        display: grid;
        gap: clamp(2rem, 6vw, 3.5rem);
        grid-template-columns: repeat(2, minmax(0, 1fr));
        width: min(100%, 68rem);
        align-items: center;
      }
      .bento3-copy {
        display: flex;
        flex-direction: column;
        gap: clamp(1.5rem, 4vw, 2.5rem);
        align-items: flex-start;
        text-align: left;
        max-width: 28rem;
      }
      .bento3-lede {
        display: flex;
        flex-direction: column;
        gap: clamp(1rem, 3vw, 1.75rem);
      }
      .bento3-cta {
        display: flex;
        gap: clamp(1rem, 4vw, 1.5rem);
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
      }
      .bento3-image {
        position: relative;
        border-radius: clamp(1.5rem, 4vw, 2.75rem);
        overflow: hidden;
        isolation: isolate;
        min-height: clamp(18rem, 40vw, 26rem);
        justify-self: end;
      }
      .bento3-image::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(160deg, rgba(0,0,0,0.55), transparent 60%);
        mix-blend-mode: multiply;
      }
      .bento3-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .bento3-footnote {
        display: flex;
        gap: clamp(1.2rem, 4vw, 2rem);
        flex-wrap: wrap;
        font-size: 0.7rem;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        align-items: center;
        justify-content: space-between;
      }
      @media (max-width: 1024px) {
        .bento3-shell {
          gap: clamp(1.75rem, 6vw, 3rem);
        }
      }
      @media (max-width: 860px) {
        .bento3-shell {
          grid-template-columns: 1fr;
          justify-items: center;
          text-align: center;
        }
        .bento3-copy {
          align-items: center;
          text-align: center;
          max-width: 32rem;
        }
        .bento3-cta {
          justify-content: center;
        }
        .bento3-stats {
          justify-items: center;
        }
        .bento3-image {
          order: -1;
          min-height: clamp(16rem, 60vw, 24rem);
          justify-self: center;
          width: min(100%, 32rem);
        }
      }
      @media (max-width: 640px) {
        .bento3-root {
          padding-inline: clamp(1rem, 8vw, 1.8rem);
          padding-block: clamp(2rem, 10vw, 4rem);
        }
        .bento3-cta {
          flex-direction: column;
          justify-content: center;
        }
        .bento3-footnote {
          letter-spacing: 0.28em;
          justify-content: center;
          text-align: center;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const syncTheme = () => {
      const next = getRootTheme();
      setTheme((prev) => (prev === next ? prev : next));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });

    const handleStorage = (event) => {
      if (event.key === "bento-theme") syncTheme();
    };

    const media =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const handleMedia = () => syncTheme();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }
    media?.addEventListener("change", handleMedia);

    return () => {
      observer.disconnect();
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
      media?.removeEventListener("change", handleMedia);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return;
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const palette = useMemo(() => palettes[theme], [theme]);

  const containerStyle = useMemo(
    () => ({
      "--bento3-grid-color": palette.gridColor,
    }),
    [palette.gridColor]
  );

  const toggleTheme = () => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      window.localStorage?.setItem("bento-theme", next);
    } catch (_err) {
      /* ignore */
    }
    setTheme(next);
  };

  return (
    <div
      className={`bento3-root relative min-h-screen w-full overflow-hidden transition-colors duration-700 ${palette.surface}`}
      style={containerStyle}
    >
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--bento3-grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--bento3-grid-color) 1px, transparent 1px)
          `,
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)
          `,
          WebkitMaskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: palette.overlay }} />

      <section
        ref={sectionRef}
        className={`relative z-10 mx-auto w-full ${visible ? "animate-[bento3-reveal_0.9s_cubic-bezier(.22,.68,0,1)_forwards]" : "opacity-0"}`}
      >
        <div className={`bento3-shell w-full max-w-6xl ${palette.card} rounded-[32px] border border-neutral-900/10 p-6 shadow-[0_24px_80px_-60px_rgba(15,15,15,0.6)] transition-colors duration-500 dark:border-white/10 sm:p-10`}>
          <div className="bento3-copy">
            <div className={`inline-flex w-fit items-center gap-3 rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.45em] ${palette.capsule}`}>
              Minimal hero
            </div>
            <div className="bento3-lede">
              <h1 className={`text-3xl font-semibold leading-tight sm:text-4xl ${palette.heading}`}>
                Monochrome launchpad for focused products.
              </h1>
              <p className={`max-w-sm text-sm ${palette.muted}`}>
                A single statement, a clear entry point, and a gallery shot that speaks for itself.
              </p>
            </div>
            <div className="bento3-cta">
              <button
                type="button"
                className={`rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] transition ${palette.button}`}
              >
                Begin project
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.35em] transition ${palette.toggleSurface} ${palette.toggle}`}
                aria-pressed={theme === "dark"}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {theme === "dark" ? "Light" : "Dark"} mode
              </button>
            </div>
            <div className={`bento3-stats grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.3em] ${palette.muted}`}>
              <span>2 week ramp</span>
              <span>Curated assets</span>
            </div>
          </div>
          <figure className="bento3-image">
            <img src={HERO_IMAGE_URL} alt="Minimal monochrome mood" loading="lazy" />
          </figure>
        </div>
        <div className={`bento3-footnote mt-10 ${palette.muted}`}>
          <span>Monochrome. Focus. Motion subtle.</span>
          <span>Designed to live in component libraries.</span>
        </div>
      </section>
    </div>
  );
}

export default Bento3Section;
export { Bento3Section };
