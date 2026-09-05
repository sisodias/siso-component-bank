// cta-landing-page.tsx
import React from "react";
import clsx from "clsx";

type LinkItem = { label: string; href: string };
type Cta = { label: string; href?: string; onClick?: () => void };

type Props = {
  title?: string | React.ReactNode;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  navLinks?: LinkItem[];
  signInHref?: string;
  className?: string;
};

export default function CtaLandingPage({
  title = (
    <>
      <span>Let AI handle</span>
      <br />
      <span>your testing</span>
    </>
  ),
  subtitle = "From writing test cases to finding issues — effortless and reliable.",
  primaryCta = { label: "Get started", href: "#" },
  secondaryCta = { label: "Watch video", href: "#" },
  navLinks = [
    { label: "Solutions", href: "#" },
    { label: "Docs", href: "#" },
    { label: "About", href: "#" },
  ],
  signInHref = "#",
  className,
}: Props) {
  return (
    <div className={clsx("relative min-h-screen w-full", className)}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .pixel {
          font-family: 'Silkscreen', sans-serif;
          font-weight: 700;
          letter-spacing: 0.02em;
          line-height: 0.9;
          image-rendering: pixelated;
          filter: drop-shadow(0.08em 0.08em 0 rgba(0, 0, 0, 0.3));
        }
        .pill {
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03), 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        .frost {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 25% 25%, #ffea61, transparent 60%), radial-gradient(circle at 75% 25%, #ff5d73, transparent 60%), radial-gradient(circle at 50% 70%, #66a3ff, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(255, 255, 255, 0.2), rgba(255,255,255,0))",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 md:px-8">
        <nav className="mt-8 flex items-center justify-center">
          <div className="pill flex items-center gap-6 rounded-full bg-white px-4 py-2 text-sm font-medium">
            <a href="#" aria-label="Home" className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
              <span className="text-lg">✺</span>
            </a>
            <ul className="hidden items-center gap-6 text-black md:flex">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a className="hover:underline" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="ml-2">
              <a href={signInHref} className="rounded-full bg-black px-4 py-2 text-white hover:opacity-90">
                Sign in
              </a>
            </div>
          </div>
        </nav>

        <header className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-col items-center text-center md:mt-28">
          <h1 className="pixel text-[12vw] font-bold leading-none text-black md:text-[7rem]">{title}</h1>

          <div className="frost mx-auto mt-8 w-full max-w-3xl rounded-[2rem] p-6 shadow-xl sm:p-8">
            <p className="mx-auto max-w-xl text-sm text-black md:text-base">{subtitle}</p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <CtaButton {...primaryCta} variant="dark" />
              <CtaButton {...secondaryCta} variant="light" />
            </div>

            <hr className="mx-auto my-6 w-3/4 border-black/10" />

            <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-2">
              <Tile
                title="Backend testing"
                blurb="Cut manual testing, setup, and maintenance"
                icon={<span className="text-lg">{"</>"}</span>}
              />
              <Tile
                title="Frontend testing"
                blurb="Skip manual testing, recording, and upkeep"
                icon={<span className="text-lg">☰</span>}
              />
            </div>
          </div>
        </header>

        <footer className="pointer-events-none mt-auto h-24 w-full" />
      </div>
    </div>
  );
}

function CtaButton({ label, href, onClick, variant = "dark" as "dark" | "light" }) {
  const base =
    "rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-black/20";
  const styles =
    variant === "dark"
      ? "bg-black text-white hover:opacity-90"
      : "bg-white text-black ring-1 ring-black/10 hover:bg-neutral-100";
  const content = <span>{label}</span>;

  if (href) {
    return (
      <a className={clsx(base, styles)} href={href}>
        {content}
      </a>
    );
  }
  return (
    <button className={clsx(base, styles)} onClick={onClick}>
      {content}
    </button>
  );
}

function Tile({ title, blurb, icon }: { title: string; blurb: string; icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="group flex items-start justify-between gap-4 rounded-2xl border border-transparent bg-white p-4 transition hover:border-black/10"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-black">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-black">{title}</div>
          <div className="mt-1 text-xs text-neutral-600">{blurb}</div>
        </div>
      </div>
      <svg
        className="mt-1 h-4 w-4 shrink-0 text-neutral-500 transition group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </a>
  );
}
