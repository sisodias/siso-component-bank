"use client";

/**
 * SecurityConsoleHero
 * A dark "developer / security console" hero: asymmetric split with a
 * typewriter role line, stat strip, and an animated terminal card.
 * Self-contained (no Tailwind / no external CSS required), respects
 * prefers-reduced-motion. Palette: IDE "code dark + run green".
 */

import { useEffect, useRef, useState } from "react";

export interface SecurityConsoleHeroProps {
  /** Small line shown first name (kept regular weight). */
  firstName?: string;
  /** Highlighted (accent) family name. */
  lastName?: string;
  /** Rotating role phrases typed out under the name. */
  roles?: string[];
  /** Short supporting paragraph (<= ~22 words). */
  description?: string;
  /** Primary call to action. */
  primaryCta?: { label: string; href: string };
  /** Secondary call to action. */
  secondaryCta?: { label: string; href: string };
  /** Up to three proof stats. */
  stats?: { value: string; label: string }[];
  /** Lines rendered inside the terminal card (already syntax-segmented). */
  terminalTitle?: string;
}

const DEFAULTS: Required<Omit<SecurityConsoleHeroProps, "terminalTitle">> & {
  terminalTitle: string;
} = {
  firstName: "Ibrahim",
  lastName: "ABDELAZIZ",
  roles: [
    "Administrateur systèmes & réseau",
    "Spécialisation cybersécurité",
    "Infrastructures & sécurité",
  ],
  description:
    "Étudiant en cybersécurité, réseaux et administration système. Je conçois, déploie et sécurise des infrastructures.",
  primaryCta: { label: "Voir mes projets", href: "#projets" },
  secondaryCta: { label: "Télécharger le CV", href: "#cv" },
  stats: [
    { value: "+17", label: "Badges Cisco" },
    { value: "3", label: "Modules validés" },
    { value: "6", label: "Compétences clés" },
  ],
  terminalTitle: "profile.sh",
};

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState("");
  const ref = useRef({ p: 0, c: 0, del: false });

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(phrases[0] ?? "");
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = ref.current;
      const cur = phrases[s.p] ?? "";
      s.c += s.del ? -1 : 1;
      setText(cur.slice(0, s.c));
      let delay = s.del ? 35 : 65;
      if (!s.del && s.c === cur.length) {
        delay = 1900;
        s.del = true;
      } else if (s.del && s.c === 0) {
        s.del = false;
        s.p = (s.p + 1) % phrases.length;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [phrases]);

  return text;
}

export default function SecurityConsoleHero(props: SecurityConsoleHeroProps) {
  const cfg = { ...DEFAULTS, ...props };
  const role = useTypewriter(cfg.roles);

  return (
    <section className="sch">
      <style>{CSS}</style>

      <div className="sch-content">
        <span className="sch-tag">
          <span className="sch-pulse" />
          BTS SIO SISR · Disponible
        </span>

        <h1 className="sch-title">
          <span>{cfg.firstName}</span>
          <br />
          <span className="sch-accent">{cfg.lastName}</span>
        </h1>

        <p className="sch-role">
          {role}
          <span className="sch-caret">_</span>
        </p>

        <p className="sch-desc">{cfg.description}</p>

        <div className="sch-buttons">
          <a className="sch-btn sch-btn-primary" href={cfg.primaryCta.href}>
            {cfg.primaryCta.label}
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a className="sch-btn sch-btn-secondary" href={cfg.secondaryCta.href}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="m7 10 5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            {cfg.secondaryCta.label}
          </a>
        </div>

        <div className="sch-stats">
          {cfg.stats.slice(0, 3).map((s) => (
            <div className="sch-stat" key={s.label}>
              <div className="sch-stat-num">{s.value}</div>
              <div className="sch-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sch-visual">
        <div className="sch-term">
          <div className="sch-term-bar">
            <span className="sch-dot" />
            <span className="sch-dot" />
            <span className="sch-dot sch-dot-live" />
            <span className="sch-term-title">{cfg.terminalTitle}</span>
          </div>
          <pre className="sch-term-body">
<span className="sch-com"># whoami</span>{"\n"}
<span className="sch-key">name</span>=<span className="sch-str">"{cfg.firstName} {cfg.lastName}"</span>{"\n"}
<span className="sch-key">role</span>=<span className="sch-str">"BTS SIO SISR"</span>{"\n"}
<span className="sch-key">focus</span>=(<span className="sch-str">"cybersécurité"</span> <span className="sch-str">"réseaux"</span> <span className="sch-str">"systèmes"</span>){"\n"}
<span className="sch-com"># status</span>{"\n"}
<span className="sch-fn">echo</span> <span className="sch-str">"open to work"</span>
          </pre>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.sch {
  --bg: #0f172a; --card: #1b2336; --inset: #0b1120;
  --line: rgba(148,163,184,.14); --line-2: rgba(148,163,184,.26);
  --text: #f8fafc; --dim: #94a3b8; --faint: #64748b;
  --accent: #22c55e; --accent-2: #4ade80; --accent-deep: #16a34a;
  --soft: rgba(34,197,94,.12); --aline: rgba(34,197,94,.32); --glow: rgba(34,197,94,.22);
  position: relative; box-sizing: border-box;
  display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(2rem,5vw,4.5rem);
  align-items: center; min-height: 100dvh; padding: 6rem clamp(1.2rem,4vw,2.5rem) 3rem;
  max-width: 1180px; margin: 0 auto;
  background: var(--bg); color: var(--text);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
}
.sch *, .sch *::before, .sch *::after { box-sizing: border-box; }
.sch-tag {
  display: inline-flex; align-items: center; gap: .6rem; width: fit-content;
  font-family: "JetBrains Mono", ui-monospace, monospace; font-size: .78rem; color: var(--dim);
  background: var(--soft); border: 1px solid var(--aline); padding: .42rem .9rem;
  border-radius: 999px; margin-bottom: 1.75rem;
}
.sch-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: sch-pulse 2.4s infinite; }
@keyframes sch-pulse { 0% { box-shadow: 0 0 0 0 var(--glow); } 70% { box-shadow: 0 0 0 8px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
.sch-title {
  font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 700; margin: 0;
  font-size: clamp(2.7rem,7.5vw,5.2rem); line-height: .98; letter-spacing: -.03em;
}
.sch-accent {
  background: linear-gradient(100deg, var(--accent-2), var(--accent) 55%, var(--accent-deep));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.sch-role {
  font-family: "JetBrains Mono", ui-monospace, monospace; color: var(--dim);
  font-size: clamp(1rem,2.2vw,1.25rem); margin: 1.1rem 0 0; min-height: 1.6em;
}
.sch-caret { color: var(--accent); animation: sch-blink 1.1s step-end infinite; }
@keyframes sch-blink { 50% { opacity: 0; } }
.sch-desc { color: var(--dim); max-width: 46ch; font-size: 1.03rem; margin: 1.4rem 0 0; line-height: 1.65; }
.sch-buttons { display: flex; flex-wrap: wrap; gap: .9rem; margin-top: 2rem; }
.sch-btn {
  display: inline-flex; align-items: center; gap: .55rem; text-decoration: none;
  font-weight: 600; font-size: .92rem; padding: .78rem 1.4rem; border-radius: 999px;
  border: 1px solid transparent; cursor: pointer; transition: transform .15s ease, background .2s ease, border-color .2s ease;
}
.sch-btn:active { transform: translateY(1px) scale(.99); }
.sch-btn-primary { background: var(--accent); color: #0f172a; font-weight: 700; box-shadow: 0 8px 28px -10px var(--glow); }
.sch-btn-primary:hover { background: var(--accent-2); transform: translateY(-2px); }
.sch-btn-secondary { color: var(--text); border-color: var(--line-2); }
.sch-btn-secondary:hover { border-color: var(--aline); color: var(--accent-2); transform: translateY(-2px); }
.sch-stats { display: flex; align-items: center; gap: clamp(1.25rem,4vw,2.75rem); margin-top: 2.75rem; padding-top: 1.75rem; border-top: 1px solid var(--line); }
.sch-stat-num { font-family: "Space Grotesk", system-ui, sans-serif; font-weight: 700; font-size: 1.75rem; line-height: 1; color: var(--accent); }
.sch-stat-label { font-size: .78rem; color: var(--faint); margin-top: .3rem; }
.sch-visual { display: flex; justify-content: center; }
.sch-term { width: 100%; max-width: 440px; background: var(--card); border: 1px solid var(--line-2); border-radius: 14px; overflow: hidden; box-shadow: 0 24px 60px -28px rgba(0,0,0,.75); }
.sch-term-bar { display: flex; align-items: center; gap: .5rem; padding: .85rem 1rem; background: var(--inset); border-bottom: 1px solid var(--line); }
.sch-dot { width: 11px; height: 11px; border-radius: 50%; background: #2b3340; }
.sch-dot-live { background: var(--accent); box-shadow: 0 0 8px var(--glow); }
.sch-term-title { margin-left: auto; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: .76rem; color: var(--faint); }
.sch-term-body { margin: 0; padding: 1.4rem 1.3rem; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: .82rem; line-height: 1.9; white-space: pre-wrap; color: var(--text); }
.sch-com { color: var(--faint); } .sch-key { color: var(--accent-2); } .sch-str { color: #d7e0ea; } .sch-fn { color: var(--accent); }
@media (max-width: 980px) {
  .sch { grid-template-columns: 1fr; min-height: auto; padding-top: 7rem; gap: 2.75rem; }
  .sch-visual { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .sch *, .sch *::before, .sch *::after { animation: none !important; transition: none !important; }
}
`;
