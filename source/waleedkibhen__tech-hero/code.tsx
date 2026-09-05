"use client";

import React, { memo, useEffect, useRef, useState } from "react";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-glass/80 backdrop-blur-md border-b border-glass">
      {/* full-bleed wrapper */}
      <div className="w-[100vw] max-w-[100vw] mx-[calc(50%-50vw)]">
        {/* constrained content */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand: solid white (no gradient) */}
            <div className="text-xl font-bold text-white">VisionLab</div>

            {/* Desktop Navigation: hover to white (not black) */}
            <nav
              className="hidden md:flex items-center gap-8"
              role="navigation"
              aria-label="Main"
            >
              {[
                ["#features", "Features"],
                ["#solutions", "Solutions"],
                ["#pricing", "Pricing"],
                ["#about", "About"],
              ].map(([href, label]) => (
                <a
                  key={label}
                  href={href}
                  className="text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded px-1 py-0.5"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="#login"
                className="text-white/70 hover:text-white transition-colors px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Login
              </a>
              <a
                href="#signup"
                className="bg-white text-black px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:translate-y-[1px] active:scale-[0.98]"
              >
                Sign Up
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded p-1.5"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
              type="button"
            >
              {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div id="mobile-nav" className="md:hidden py-4 border-t border-glass animate-fade-in">
              <nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobile">
                {[
                  ["#features", "Features"],
                  ["#solutions", "Solutions"],
                  ["#pricing", "Pricing"],
                  ["#about", "About"],
                ].map(([href, label]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-white/70 hover:text-white transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </a>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-glass">
                  <a
                    href="#login"
                    className="text-white/70 hover:text-white transition-colors px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="#signup"
                    className="bg-white text-black px-4 py-2 rounded-lg font-medium text-center transition-all hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:translate-y-[1px] active:scale-[0.98]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── UnicornBackground ── */
declare global {
  interface Window {
    UnicornStudio?: any;
    requestIdleCallback?: (cb: () => void) => void;
  }
}

function getDeviceCapability() {
  if (typeof navigator === "undefined") return "high";
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType;
  const isLowEnd =
    hardwareConcurrency <= 2 ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    /Android.*(4\.[0-4]|[0-3]\.)/.test(navigator.userAgent);
  return isLowEnd ? "low" : "high";
}

function UnicornBackground() {
  const [shouldRender, setShouldRender] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const deviceCapability = getDeviceCapability();

    if (prefersReducedMotion || deviceCapability === "low") return;
    if (!("IntersectionObserver" in window)) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !shouldRender) setShouldRender(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observerRef.current.observe(containerRef.current);
    return () => observerRef.current?.disconnect();
  }, [shouldRender]);

  useEffect(() => {
    if (typeof window === "undefined" || !shouldRender) return;

    const w = window as any;

    function init() {
      try {
        if (!w.UnicornStudio?.isInitialized) {
          w.UnicornStudio.init();
          w.UnicornStudio.isInitialized = true;
        }
      } catch {
        /* silent; fallback stays */
      }
    }

    const loadScript = () => {
      const id = "unicornstudio-umd";
      if (w.UnicornStudio) {
        init();
      } else if (!document.getElementById(id)) {
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js";
        s.async = true;
        s.onload = init;
        document.head.appendChild(s);
      } else {
        document.getElementById(id)!.addEventListener("load", init, { once: true });
      }
    };

    if ("requestIdleCallback" in window && typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(loadScript);
    } else {
      setTimeout(loadScript, 100);
    }
  }, [shouldRender]);

  const fallbackBackground = (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background/95 to-primary/10" />
  );

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden="true">
      {fallbackBackground}
      {shouldRender && (
        <div
          data-us-project="DkpIF97RkpPcNVWjTfy4"
          data-us-production="true"
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

/* ── Hero (full-bleed section, LEFT-anchored responsive content) ── */
const Hero = memo(function Hero() {
  return (
    <section
      className="
        relative min-h-screen flex flex-col overflow-hidden
        w-[100vw] max-w-[100vw] mx-[calc(50%-50vw)] overflow-x-hidden
      "
    >
      {/* Header */}
      <Header />

      {/* Animated background */}
      <UnicornBackground />

      <div className="flex-1 flex items-center pt-16">
        {/* LEFT-anchored container: responsive left padding, small right padding, not centered */}
        <div
          className="
            relative z-10 w-full
            pl-5 pr-5
            sm:pl-10 sm:pr-8
            md:pl-14
            lg:pl-24
            xl:pl-32
            2xl:pl-40
          "
        >
          {/* limit text width for readability */}
          <div className="max-w-4xl">
            {/* Main Heading (tighten line length and spacing on small screens) */}
            <h1
              className="
                text-3xl sm:text-5xl md:text-6xl lg:text-7xl
                font-semibold tracking-tight leading-[1.05]
                mb-4 sm:mb-6 lg:mb-8
                text-white
              "
            >
              Transform Your
              <br />
              Digital Vision
            </h1>

            {/* Subtitle */}
            <p
              className="
                max-w-[60ch]
                text-sm sm:text-base md:text-lg
                text-white/80
                mb-6 sm:mb-8 lg:mb-10
              "
            >
              Experience cutting-edge design with stunning animations and modern interfaces.
              Build exceptional digital experiences that captivate and convert.
            </p>

            {/* CTA Button: premium press/hover */}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <a
                href="#get-started"
                className="
                  group w-full sm:w-auto inline-flex items-center justify-center
                  rounded-lg text-white px-5 py-3 text-base font-semibold
                  transition-all duration-200
                  hover:opacity-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                  active:translate-y-[1px] active:scale-[0.99]
                  shadow-lg hover:shadow-xl
                "
                style={{ backgroundColor: "#3036e3" }}
              >
                Start Your Journey
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

/* ── Exports ── */
const Component = Hero; // keep alias so demo can `import { Component }`
export { Hero, Component };
export default Hero;
