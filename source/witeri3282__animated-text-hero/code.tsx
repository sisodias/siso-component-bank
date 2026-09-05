import { useEffect, useRef } from "react";

const WORDS = ["Creative.", "Powerful.", "Elegant.", "Fluid.", "Yours."];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  dur: Math.random() * 6 + 4,
}));

export const Component = () => {
  const wordRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = wordRef.current;
    const cursor = cursorRef.current;
    if (!el || !cursor) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        timeoutRef.current = setTimeout(res, ms);
      });

    const typeWord = async (word: string) => {
      el.textContent = "";
      for (const char of word) {
        if (cancelled) return;
        el.textContent += char;
        await sleep(72);
      }
    };

    const eraseWord = async () => {
      const text = el.textContent ?? "";
      for (let i = text.length; i >= 0; i--) {
        if (cancelled) return;
        el.textContent = text.slice(0, i);
        await sleep(38);
      }
    };

    const loop = async () => {
      while (!cancelled) {
        const word = WORDS[indexRef.current % WORDS.length];
        await typeWord(word);
        await sleep(1800);
        await eraseWord();
        await sleep(300);
        indexRef.current++;
      }
    };

    loop();

    let visible = true;
    const blinkInterval = setInterval(() => {
      if (!cursor) return;
      visible = !visible;
      cursor.style.opacity = visible ? "1" : "0";
    }, 530);

    const container = containerRef.current;
    const onMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      container.style.transform = `perspective(900px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg)`;
    };
    const onLeave = () => {
      if (container)
        container.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearInterval(blinkInterval);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');

        .gsap-root {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050508;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .gsap-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
        }
        .gsap-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: orbFloat linear infinite;
        }
        .gsap-orb-1 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, #00ffe1 0%, transparent 70%);
          top: -80px; left: -60px;
          opacity: 0.12;
          animation-duration: 14s;
        }
        .gsap-orb-2 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #ff6b35 0%, transparent 70%);
          bottom: -60px; right: -40px;
          opacity: 0.10;
          animation-duration: 18s;
          animation-direction: reverse;
        }
        .gsap-orb-3 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, #a855f7 0%, transparent 70%);
          top: 40%; left: 55%;
          opacity: 0.09;
          animation-duration: 22s;
        }
        @keyframes orbFloat {
          0%   { transform: translate(0px,0px) scale(1); }
          33%  { transform: translate(30px,-20px) scale(1.05); }
          66%  { transform: translate(-20px,30px) scale(0.95); }
          100% { transform: translate(0px,0px) scale(1); }
        }
        .gsap-particles { position: absolute; inset: 0; pointer-events: none; }
        .gsap-particle {
          position: absolute;
          border-radius: 50%;
          background: #00ffe1;
          opacity: 0;
          animation: particlePulse ease-in-out infinite;
        }
        @keyframes particlePulse {
          0%   { opacity: 0; transform: scale(0.5) translateY(0px); }
          50%  { opacity: 0.6; }
          100% { opacity: 0; transform: scale(1.2) translateY(-18px); }
        }
        .gsap-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .gsap-card {
          position: relative;
          z-index: 10;
          transition: transform 0.12s ease-out;
          text-align: center;
          padding: 2rem;
        }
        .gsap-eyebrow {
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.25em;
          color: #00ffe1;
          text-transform: uppercase;
          margin-bottom: 1.2rem;
          animation: fadeSlideUp 0.8s ease both;
        }
        .gsap-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 10vw, 110px);
          line-height: 0.92;
          color: #f0ece4;
          margin: 0;
          animation: fadeSlideUp 0.8s ease 0.15s both;
        }
        .gsap-type-line {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gsap-typed {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 10vw, 110px);
          line-height: 0.92;
          background: linear-gradient(90deg, #00ffe1, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          min-width: 2ch;
        }
        .gsap-cursor {
          display: inline-block;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 10vw, 110px);
          line-height: 0.92;
          color: #00ffe1;
          margin-left: 3px;
          transition: opacity 0.1s;
          -webkit-text-fill-color: #00ffe1;
        }
        .gsap-sub {
          margin-top: 1.8rem;
          font-size: 14px;
          font-weight: 300;
          color: rgba(240,236,228,0.4);
          letter-spacing: 0.04em;
          animation: fadeSlideUp 0.8s ease 0.35s both;
          max-width: 320px;
          margin-inline: auto;
          line-height: 1.7;
        }
        .gsap-line {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, #00ffe1, transparent);
          margin: 1.6rem auto 0;
          animation: lineGrow 1s ease 0.5s both;
        }
        @keyframes lineGrow {
          from { width: 0; opacity: 0; }
          to   { width: 40px; opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="gsap-root">
        <div className="gsap-noise" />
        <div className="gsap-grid" />
        <div className="gsap-orb gsap-orb-1" />
        <div className="gsap-orb gsap-orb-2" />
        <div className="gsap-orb gsap-orb-3" />

        <div className="gsap-particles">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="gsap-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>

        <div className="gsap-card" ref={containerRef}>
          <p className="gsap-eyebrow">Motion · Design · Code</p>
          <h1 className="gsap-headline">Design that</h1>
          <div className="gsap-type-line">
            <span className="gsap-typed" ref={wordRef} />
            <span className="gsap-cursor" ref={cursorRef}>|</span>
          </div>
          <p className="gsap-sub">
            Smooth, expressive animations that feel alive — built for the modern web.
          </p>
          <div className="gsap-line" />
        </div>
      </div>
    </>
  );
};