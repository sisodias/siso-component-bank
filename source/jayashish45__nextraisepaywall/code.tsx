"use client";

/**
 * NextRaisePaywall — value-led ATS upgrade paywall (light / white theme).
 *
 * Encodes the product decisions from the CEO/COO/Lead thread:
 *  - Separation of objectives: the popup generates Pro intent; conversion can
 *    happen here (variant="full") or on a central pricing page (variant="value-only").
 *  - Intent gating: low-intent surfaces should pass variant="value-only" (no price,
 *    CTA routes to /pricing via onViewPlans); high-intent (fixes exhausted) -> "full".
 *  - Lower cognitive load: one loud recommended plan, the rest behind "Compare all plans".
 *  - No discount popups: only a quiet referral field, below the CTA. Offers live on
 *    the pricing page, not here.
 *  - Honest framing: "callback bar" not a fabricated "recruiter cutoff"; +N reconciled
 *    as "clears the bar", and one fix is unlocked free as proof.
 *
 * Only dependency: framer-motion. Styles are injected once, scoped under .nrp-*.
 */

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  animate,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/* ------------------------------------------------------------------ types */

export interface Plan {
  id: string;
  label: string;
  price: number;
  was: number;
  savePct: number;
  perMonth?: number;
  note?: string;
  popular?: boolean;
  bestValue?: boolean;
}

export interface Issue {
  name: string;
  count?: string;
  free?: boolean;
  locked?: boolean;
  demo?: { was: string; now: string };
}

export interface Testimonial {
  stars?: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export interface NextRaisePaywallProps {
  score?: number;
  cutoff?: number;
  medianLift?: number;
  issuesFound?: number;
  issues?: Issue[];
  plans?: Plan[];
  features?: string[];
  testimonial?: Testimonial;
  /** "full" shows pricing + closes the sale here. "value-only" hides pricing and
   *  routes to the central pricing page (the team's low-intent / A/B arm). */
  variant?: "full" | "value-only";
  onUnlock?: (planId: string) => void;
  onViewPlans?: () => void;
  onClose?: () => void;
  onApplyReferral?: (code: string) => void;
}

/* --------------------------------------------------------------- defaults */

const DEFAULT_ISSUES: Issue[] = [
  { name: "Weak action verbs", count: "3 fixes", free: true, demo: { was: "Responsible for a team", now: "Led a team of 6" } },
  { name: "Quantify impact", count: "4 fixes" },
  { name: "Filler words", locked: true },
  { name: "Formatting & parsing", locked: true },
];

const DEFAULT_PLANS: Plan[] = [
  { id: "1m", label: "1 month", price: 899, was: 1000, savePct: 10, note: "Try Pro short term" },
  { id: "3m", label: "3 months", price: 1999, was: 3000, savePct: 33, perMonth: 666, note: "Less than a chai a day", popular: true },
  { id: "5m", label: "5 months", price: 2499, was: 5000, savePct: 50, perMonth: 500, note: "Cheapest per day", bestValue: true },
];

const DEFAULT_FEATURES = [
  "All 11 fixes, auto-applied",
  "Unlimited ATS checks & score",
  "Unlimited tailored resumes",
  "PDF + DOCX, no watermark",
  "LinkedIn Job Agent",
  "Unlimited referral messages",
];

const DEFAULT_TESTIMONIAL: Testimonial = {
  stars: 5,
  quote:
    "40 applications, zero replies. The ATS couldn't even parse my layout. I fixed what NextRaise flagged and went from 58 to 86. Two recruiter callbacks that same week.",
  name: "Priya Sharma",
  role: "Senior Business Analyst, Gurugram",
  initials: "PS",
};

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

/* ------------------------------------------------------------------ icons */

const Check = () => (
  <svg className="nrp-ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);
const Bolt = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}><path d="M13 2L4 14h6l-1 8 9-12h-6z" /></svg>
);
const Target = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={14} height={14}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>
);
const Lock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={13} height={13}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
);

/* --------------------------------------------------------------- variants */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/* --------------------------------------------------------------- component */

export default function NextRaisePaywall({
  score = 84,
  cutoff = 85,
  medianLift = 22,
  issuesFound = 11,
  issues = DEFAULT_ISSUES,
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  testimonial = DEFAULT_TESTIMONIAL,
  variant = "full",
  onUnlock,
  onViewPlans,
  onClose,
  onApplyReferral,
}: NextRaisePaywallProps) {
  const reduce = useReducedMotion();
  const gap = Math.max(0, cutoff - score);
  const showPricing = variant === "full";

  const popular = plans.find((p) => p.popular) ?? plans[0];
  const [selectedId, setSelectedId] = useState(popular?.id);
  const selected = plans.find((p) => p.id === selectedId) ?? popular;
  const others = plans.filter((p) => p.id !== selectedId);

  const [compareOpen, setCompareOpen] = useState(false);
  const [display, setDisplay] = useState(reduce ? score : 0);
  const [referOpen, setReferOpen] = useState(false);
  const [code, setCode] = useState("");

  // inject scoped styles once
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);

  // animated score count-up
  useEffect(() => {
    if (reduce) { setDisplay(score); return; }
    const controls = animate(0, score, {
      duration: 1.1,
      delay: 0.3,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score, reduce]);

  const C = 2 * Math.PI * 52;
  const offset = C * (1 - score / 100);
  const tickDeg = 306; // 85/100 around the ring, measured from top

  const ribbon = selected?.popular ? "Most popular" : selected?.bestValue ? "Best value" : null;

  return (
    <div className="nrp-overlay" onClick={onClose} role="presentation">
      <motion.div
        className="nrp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nrp-title"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ============================ diagnosis ============================ */}
        <motion.section className="nrp-diag" variants={container} initial={reduce ? "show" : "hidden"} animate="show">
          <motion.p className="nrp-eyebrow" variants={item}>Your ATS report</motion.p>

          <motion.div className="nrp-score" variants={item}>
            <div className="nrp-ring" role="img" aria-label={`ATS score ${score} out of 100, ${gap} point under the callback bar`}>
              <svg viewBox="0 0 120 120">
                <circle className="nrp-track" cx="60" cy="60" r="52" />
                <motion.circle
                  className="nrp-prog" cx="60" cy="60" r="52"
                  strokeDasharray={C}
                  initial={reduce ? { strokeDashoffset: offset } : { strokeDashoffset: C }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.15, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
                <line className="nrp-tick" x1="60" y1="5" x2="60" y2="17" transform={`rotate(${tickDeg} 60 60)`} />
              </svg>
              <div className="nrp-cap"><div><b className="nrp-num">{display}</b><span>/100</span></div></div>
            </div>
            <div className="nrp-meta">
              <b>Callback bar: {cutoff}</b>
              <p>Resumes that get replies clear {cutoff}+.</p>
              <span className="nrp-gap">▲ {gap} point{gap === 1 ? "" : "s"} away</span>
            </div>
          </motion.div>

          <motion.h2 className="nrp-serif" id="nrp-title" variants={item}>One point from a yes.</motion.h2>
          <motion.p className="nrp-sub" variants={item}>
            Pro fixes all {issuesFound} issues in your resume. The median user clears the bar by{" "}
            <span className="nrp-up">+{medianLift} points</span> on the very next upload.
          </motion.p>

          <motion.div className="nrp-issues" variants={item}>
            <h4>{issuesFound} fixes found · 1 unlocked free</h4>
            {issues.map((it, i) => (
              <div key={i} className={`nrp-irow${it.free ? " free" : ""}${it.locked ? " lock" : ""}${i === issues.length - 1 ? " last" : ""}`}>
                <span className="nrp-ic">{it.locked ? <Lock /> : it.free ? <Bolt /> : <Target />}</span>
                <span className="nrp-nm">{it.name}{it.free && <span className="nrp-free">FREE</span>}</span>
                <span className="nrp-ct">{it.locked ? <span className="nrp-locked"><Lock /> locked</span> : it.count}</span>
                {it.demo && (
                  <span className="nrp-demo">
                    <span className="was">{it.demo.was}</span>
                    <span className="arr">→</span>
                    <span className="now">{it.demo.now}</span>
                  </span>
                )}
              </div>
            ))}
          </motion.div>

          <motion.figure className="nrp-quote" variants={item}>
            <div className="nrp-stars" aria-hidden>{"★".repeat(testimonial.stars ?? 5)}</div>
            <p>{testimonial.quote}</p>
            <figcaption className="nrp-who">
              <div className="nrp-avatar">{testimonial.initials}</div>
              <div><b>{testimonial.name}</b><span>{testimonial.role}</span></div>
            </figcaption>
          </motion.figure>
        </motion.section>

        {/* ============================ decision ============================ */}
        <section className="nrp-decide">
          <motion.div className="nrp-head" variants={item} initial={reduce ? "show" : "hidden"} animate="show">
            <div className="nrp-brand">
              <svg className="nrp-mark" viewBox="0 0 32 32" fill="none" aria-hidden>
                <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#nrpg)" />
                <path d="M10 22V10l12 12V10" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 7l3-3 3 3-3 3z" fill="#FAD64A" />
                <defs><linearGradient id="nrpg" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#0065F4" /><stop offset="1" stopColor="#6366F1" /></linearGradient></defs>
              </svg>
              <span className="nrp-name">NextRaise <span className="pro">Pro</span></span>
            </div>
            <button className="nrp-close" aria-label="Close" onClick={onClose}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </motion.div>

          <motion.div className="nrp-dbody" variants={container} initial={reduce ? "show" : "hidden"} animate="show">
            {showPricing && selected && (
              <>
                <motion.div className="nrp-plan" variants={item}>
                  {ribbon && <span className="nrp-ribbon">{ribbon}</span>}
                  <div className="nrp-ptop">
                    <span className="nrp-dur">{selected.label} of Pro</span>
                    <span className="nrp-save">Save {selected.savePct}%</span>
                  </div>
                  <div className="nrp-price"><b className="nrp-num">{inr(selected.price)}</b><s className="nrp-num">{inr(selected.was)}</s></div>
                  {selected.perMonth && <p className="nrp-perday"><b>{inr(selected.perMonth)} / month.</b> {selected.note}</p>}
                  {!selected.perMonth && selected.note && <p className="nrp-perday">{selected.note}</p>}
                </motion.div>

                {others.length > 0 && (
                  <motion.button className="nrp-cmp" variants={item} aria-expanded={compareOpen} onClick={() => setCompareOpen((v) => !v)}>
                    Compare all plans
                    <svg className="nrp-chev" data-open={compareOpen} width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                  </motion.button>
                )}

                <AnimatePresence initial={false}>
                  {compareOpen && (
                    <motion.div
                      className="nrp-alts"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="nrp-alts-inner">
                        {others.map((p) => (
                          <button key={p.id} className="nrp-alt" onClick={() => { setSelectedId(p.id); setCompareOpen(false); }}>
                            <span className="l"><b>{p.label}</b><span>{p.note}</span></span>
                            <span className="r"><b className="nrp-num">{inr(p.price)}</b><s className="nrp-num">{inr(p.was)}</s><span>Save {p.savePct}%</span></span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <motion.div className="nrp-unlocks" variants={item}>
              <h5>Everything unlocks instantly</h5>
              <div className="nrp-feats">
                {features.map((f, i) => (
                  <div className="nrp-feat" key={i}><Check />{f}</div>
                ))}
              </div>
            </motion.div>

            <motion.button
              className="nrp-cta"
              variants={item}
              whileHover={reduce ? undefined : { y: -1 }}
              whileTap={reduce ? undefined : { y: 0 }}
              onClick={() => (showPricing ? onUnlock?.(selected!.id) : onViewPlans?.())}
            >
              {!reduce && <span className="nrp-sheen" aria-hidden />}
              {showPricing ? (
                <>
                  <b>Unlock my report & fix all {issuesFound}</b>
                  <span>Pro · {selected?.label} · {inr(selected!.price)} today</span>
                </>
              ) : (
                <>
                  <b>See my plan & unlock Pro</b>
                  <span>View plans · takes 20 seconds</span>
                </>
              )}
            </motion.button>

            <motion.div className="nrp-trust" variants={item}>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></svg>7-day money back</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>Secure checkout</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M3 12a9 9 0 109-9" /><path d="M3 4v5h5" /></svg>Cancel anytime</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></svg>No redirect</span>
            </motion.div>

            <motion.div className="nrp-refer" variants={item}>
              {!referOpen ? (
                <button className="nrp-refer-link" onClick={() => setReferOpen(true)}>Have a referral code?</button>
              ) : (
                <div className="nrp-refer-field">
                  <input autoFocus value={code} onChange={(e) => setCode(e.target.value)} placeholder="Referral code" aria-label="Referral code" />
                  <button onClick={() => onApplyReferral?.(code)}>Apply</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const STYLE_ID = "nrp-styles";

const CSS = `
.nrp-overlay{ position:fixed; inset:0; z-index:50; display:grid; place-items:center;
  padding:clamp(12px,3vw,40px);
  background:radial-gradient(120% 120% at 50% 30%, oklch(0.62 0.10 264 / 0.18), oklch(0.55 0.08 264 / 0.34));
  backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px);
  font-family:"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif; }
.nrp-overlay *{ box-sizing:border-box; }
.nrp-num{ font-family:"Inter", ui-sans-serif, sans-serif; font-feature-settings:"tnum" 1; }

.nrp-modal{ position:relative; width:min(1060px,100%);
  display:grid; grid-template-columns:0.86fr 1.14fr;
  background:oklch(0.995 0.002 264);
  border:1px solid oklch(0.45 0.05 264 / 0.10);
  border-radius:26px; overflow:hidden;
  box-shadow:0 36px 100px -34px oklch(0.42 0.06 264 / 0.40), 0 10px 30px -16px oklch(0.42 0.06 264 / 0.22); }

/* ---------- diagnosis (light brand wash) ---------- */
.nrp-diag{ position:relative; padding:34px 32px 30px; color:oklch(0.30 0.04 266);
  background:
    radial-gradient(130% 90% at 6% 0%, oklch(0.95 0.05 277 / 0.9), transparent 56%),
    linear-gradient(162deg, oklch(0.975 0.022 274), oklch(0.945 0.034 264) 60%, oklch(0.93 0.04 262));
  border-right:1px solid oklch(0.45 0.05 264 / 0.08); }
.nrp-eyebrow{ margin:0; font-size:11px; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
  color:oklch(0.52 0.10 270); display:flex; align-items:center; gap:9px; }
.nrp-eyebrow::before{ content:""; width:18px; height:2px; border-radius:2px; background:oklch(0.66 0.15 70); }

.nrp-score{ display:flex; align-items:center; gap:18px; margin:22px 0 4px; }
.nrp-ring{ position:relative; width:104px; height:104px; flex:none; }
.nrp-ring svg{ width:100%; height:100%; transform:rotate(-90deg); overflow:visible; }
.nrp-track{ fill:none; stroke:oklch(0.55 0.05 264 / 0.16); stroke-width:9; }
.nrp-prog{ fill:none; stroke:oklch(0.58 0.19 262); stroke-width:9; stroke-linecap:round; }
.nrp-tick{ stroke:oklch(0.66 0.15 70); stroke-width:3.5; stroke-linecap:round; }
.nrp-cap{ position:absolute; inset:0; display:grid; place-content:center; text-align:center; }
.nrp-cap b{ font-size:31px; font-weight:700; line-height:1; letter-spacing:-0.02em; color:oklch(0.30 0.05 266); }
.nrp-cap span{ font-size:11px; font-weight:600; color:oklch(0.55 0.04 266); }
.nrp-meta b{ display:block; font-size:14px; font-weight:700; color:oklch(0.30 0.05 266); }
.nrp-meta p{ margin:3px 0 9px; font-size:12.5px; line-height:1.45; color:oklch(0.48 0.04 266); max-width:20ch; }
.nrp-gap{ display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:999px;
  background:oklch(0.92 0.07 78); color:oklch(0.46 0.12 62); border:1px solid oklch(0.74 0.12 72 / 0.55);
  font-size:11.5px; font-weight:700; }

.nrp-serif{ margin:20px 0 0; font-family:"Cormorant Garamond", Georgia, serif; font-style:italic; font-weight:600;
  font-size:clamp(30px,4.2vw,39px); line-height:1.02; letter-spacing:0.01em; color:oklch(0.40 0.16 278); }
.nrp-sub{ margin:11px 0 0; font-size:13.5px; line-height:1.5; color:oklch(0.44 0.04 266); max-width:34ch; }
.nrp-up{ color:oklch(0.52 0.15 162); font-weight:700; }

.nrp-issues{ margin-top:22px; }
.nrp-issues h4{ margin:0 0 2px; font-size:11px; letter-spacing:.10em; text-transform:uppercase; font-weight:700; color:oklch(0.54 0.05 266); }
.nrp-irow{ display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid oklch(0.45 0.05 264 / 0.12); flex-wrap:wrap; }
.nrp-irow.last{ border-bottom:0; }
.nrp-ic{ width:26px; height:26px; flex:none; display:grid; place-items:center; border-radius:8px;
  background:oklch(0.58 0.12 264 / 0.12); color:oklch(0.48 0.14 264); }
.nrp-irow.free .nrp-ic{ background:oklch(0.66 0.15 70 / 0.16); color:oklch(0.55 0.14 64); }
.nrp-nm{ flex:1; font-size:13.5px; font-weight:600; color:oklch(0.32 0.04 266); display:flex; align-items:center; gap:8px; }
.nrp-free{ font-size:10px; font-weight:800; letter-spacing:.05em; padding:2px 7px; border-radius:6px;
  background:oklch(0.60 0.15 162 / 0.16); color:oklch(0.46 0.13 162); border:1px solid oklch(0.60 0.15 162 / 0.35); }
.nrp-ct{ font-family:"Inter"; font-size:12.5px; font-weight:600; color:oklch(0.50 0.04 266); }
.nrp-locked{ display:inline-flex; align-items:center; gap:4px; color:oklch(0.58 0.03 266); font-weight:600; }
.nrp-irow.lock .nrp-nm{ color:oklch(0.56 0.03 266); }
.nrp-irow.lock .nrp-ic{ background:oklch(0.55 0.03 266 / 0.12); color:oklch(0.56 0.03 266); }
.nrp-demo{ flex-basis:100%; margin:7px 0 0 37px; font-size:12px; display:flex; align-items:center; gap:8px; }
.nrp-demo .was{ text-decoration:line-through; color:oklch(0.62 0.03 266); }
.nrp-demo .arr{ color:oklch(0.55 0.14 64); }
.nrp-demo .now{ font-weight:700; color:oklch(0.34 0.05 266); }

.nrp-quote{ margin:20px 0 0; padding-top:18px; border-top:1px solid oklch(0.45 0.05 264 / 0.14); }
.nrp-stars{ color:oklch(0.70 0.13 76); font-size:13px; letter-spacing:2px; }
.nrp-quote p{ margin:8px 0 12px; font-size:13px; line-height:1.55; color:oklch(0.38 0.04 266); }
.nrp-who{ display:flex; align-items:center; gap:10px; }
.nrp-avatar{ width:34px; height:34px; border-radius:50%; flex:none; display:grid; place-items:center;
  font-family:"Inter"; font-weight:700; font-size:13px; color:#fff;
  background:linear-gradient(135deg, oklch(0.62 0.17 277), oklch(0.58 0.19 262)); }
.nrp-who b{ font-size:12.5px; color:oklch(0.32 0.04 266); }
.nrp-who span{ display:block; font-size:11px; color:oklch(0.54 0.03 266); }

/* ---------- decision (white) ---------- */
.nrp-decide{ position:relative; display:flex; flex-direction:column; padding:30px 32px; background:oklch(0.995 0.002 264); }
.nrp-dbody{ flex:1; display:flex; flex-direction:column; justify-content:center; }
.nrp-head{ display:flex; align-items:center; justify-content:space-between; }
.nrp-brand{ display:flex; align-items:center; gap:10px; }
.nrp-mark{ width:30px; height:30px; }
.nrp-name{ font-weight:700; font-size:16px; letter-spacing:-0.01em; color:oklch(0.30 0.04 266); }
.nrp-name .pro{ color:oklch(0.52 0.18 277); font-weight:800; }
.nrp-close{ width:34px; height:34px; border-radius:50%; cursor:pointer; display:grid; place-items:center;
  border:1px solid oklch(0.45 0.05 264 / 0.14); background:oklch(0.97 0.004 264); color:oklch(0.50 0.04 266); transition:.2s; }
.nrp-close:hover{ background:oklch(0.94 0.006 264); color:oklch(0.32 0.04 266); }

.nrp-plan{ position:relative; margin-top:18px; padding:18px 20px; border-radius:18px;
  background:linear-gradient(180deg, oklch(0.65 0.17 277 / 0.08), oklch(0.65 0.17 277 / 0.02));
  border:1px solid oklch(0.60 0.16 273 / 0.32); }
.nrp-ribbon{ position:absolute; top:-11px; left:20px; font-size:10.5px; font-weight:800; letter-spacing:.07em;
  text-transform:uppercase; padding:4px 10px; border-radius:999px; color:#fff;
  background:linear-gradient(90deg, oklch(0.56 0.18 277), oklch(0.58 0.19 262)); box-shadow:0 6px 16px -6px oklch(0.55 0.18 270 / 0.5); }
.nrp-ptop{ display:flex; align-items:baseline; justify-content:space-between; gap:12px; }
.nrp-dur{ font-size:13.5px; font-weight:700; color:oklch(0.40 0.04 266); }
.nrp-save{ font-family:"Inter"; font-size:11.5px; font-weight:700; color:oklch(0.46 0.13 162);
  background:oklch(0.60 0.15 162 / 0.13); border:1px solid oklch(0.60 0.15 162 / 0.30); padding:3px 9px; border-radius:999px; }
.nrp-price{ display:flex; align-items:baseline; gap:10px; margin-top:8px; }
.nrp-price b{ font-size:38px; font-weight:700; letter-spacing:-0.02em; line-height:1; color:oklch(0.28 0.04 266); }
.nrp-price s{ font-size:16px; color:oklch(0.62 0.03 266); }
.nrp-perday{ margin:7px 0 0; font-size:12.5px; color:oklch(0.50 0.04 266); }
.nrp-perday b{ color:oklch(0.36 0.04 266); font-weight:600; }

.nrp-cmp{ margin-top:13px; width:100%; background:none; border:0; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px;
  font-family:inherit; font-size:12.5px; font-weight:600; color:oklch(0.50 0.04 266); padding:6px; transition:.2s; }
.nrp-cmp:hover{ color:oklch(0.34 0.04 266); }
.nrp-chev{ transition:transform .3s cubic-bezier(0.16,1,0.3,1); }
.nrp-chev[data-open="true"]{ transform:rotate(180deg); }
.nrp-alts{ overflow:hidden; }
.nrp-alts-inner{ display:grid; gap:8px; padding-top:4px; }
.nrp-alt{ display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%; text-align:left; cursor:pointer;
  padding:11px 14px; border:1px solid oklch(0.45 0.05 264 / 0.14); border-radius:13px; background:oklch(0.985 0.003 264); transition:.18s; font-family:inherit; }
.nrp-alt:hover{ border-color:oklch(0.58 0.16 270 / 0.5); background:oklch(0.97 0.012 274); }
.nrp-alt .l b{ font-size:13px; color:oklch(0.32 0.04 266); } .nrp-alt .l span{ display:block; font-size:11px; color:oklch(0.52 0.03 266); margin-top:1px; }
.nrp-alt .r{ text-align:right; white-space:nowrap; } .nrp-alt .r b{ font-size:15px; font-weight:700; color:oklch(0.30 0.04 266); }
.nrp-alt .r s{ font-size:11px; color:oklch(0.62 0.03 266); margin-left:5px; }
.nrp-alt .r span{ display:block; font-size:10.5px; color:oklch(0.46 0.13 162); font-weight:600; }

.nrp-unlocks{ margin-top:20px; }
.nrp-unlocks h5{ margin:0 0 12px; font-size:11px; letter-spacing:.10em; text-transform:uppercase; font-weight:700; color:oklch(0.54 0.04 266); }
.nrp-feats{ display:grid; grid-template-columns:1fr 1fr; gap:11px 18px; }
.nrp-feat{ display:flex; align-items:flex-start; gap:9px; font-size:12.8px; line-height:1.35; color:oklch(0.38 0.04 266); }
.nrp-ck{ width:17px; height:17px; flex:none; margin-top:1px; color:oklch(0.56 0.14 162); }

.nrp-cta{ margin-top:22px; width:100%; border:0; cursor:pointer; border-radius:15px; padding:15px 18px; position:relative; overflow:hidden;
  font-family:inherit; color:#fff; text-align:center;
  background:linear-gradient(180deg, oklch(0.64 0.15 162), oklch(0.55 0.15 160));
  box-shadow:0 14px 30px -12px oklch(0.55 0.15 160 / 0.55), inset 0 1px 0 oklch(1 0 0 / 0.25); transition:box-shadow .25s; }
.nrp-cta:hover{ box-shadow:0 20px 40px -14px oklch(0.55 0.15 160 / 0.62), inset 0 1px 0 oklch(1 0 0 / 0.3); }
.nrp-cta:focus-visible{ outline:3px solid oklch(0.64 0.15 162 / 0.5); outline-offset:3px; }
.nrp-cta b{ display:block; font-size:16px; font-weight:700; letter-spacing:0.01em; }
.nrp-cta span{ display:block; font-size:12px; font-weight:500; opacity:.92; margin-top:3px; }
.nrp-sheen{ position:absolute; top:0; bottom:0; width:40%; left:-60%; transform:skewX(-18deg);
  background:linear-gradient(90deg, transparent, oklch(1 0 0 / 0.28), transparent); animation:nrp-sheen 2.6s 1s cubic-bezier(0.16,1,0.3,1); }
@keyframes nrp-sheen{ to{ left:130%; } }

.nrp-trust{ margin-top:14px; display:flex; flex-wrap:wrap; gap:6px 16px; justify-content:center; }
.nrp-trust span{ display:inline-flex; align-items:center; gap:6px; font-size:11.5px; color:oklch(0.50 0.04 266); }
.nrp-trust svg{ width:14px; height:14px; color:oklch(0.60 0.04 266); }
.nrp-refer{ margin-top:14px; text-align:center; min-height:30px; }
.nrp-refer-link{ background:none; border:0; cursor:pointer; font-family:inherit; font-size:12px; color:oklch(0.56 0.04 266);
  text-decoration:underline; text-underline-offset:3px; }
.nrp-refer-link:hover{ color:oklch(0.42 0.04 266); }
.nrp-refer-field{ display:flex; gap:8px; justify-content:center; }
.nrp-refer-field input{ font-family:inherit; font-size:12.5px; padding:9px 12px; width:160px; outline:none; color:oklch(0.30 0.04 266);
  border:1px solid oklch(0.45 0.05 264 / 0.22); border-radius:10px; background:oklch(0.985 0.003 264); }
.nrp-refer-field input:focus{ border-color:oklch(0.58 0.16 270 / 0.6); }
.nrp-refer-field button{ font-family:inherit; font-size:12.5px; font-weight:600; padding:9px 14px; border-radius:10px; cursor:pointer;
  border:0; background:oklch(0.40 0.16 278); color:#fff; }

@media (max-width:880px){
  .nrp-modal{ grid-template-columns:1fr; max-height:94svh; overflow-y:auto; border-radius:20px; }
  .nrp-diag{ padding:26px 22px 24px; border-right:0; border-bottom:1px solid oklch(0.45 0.05 264 / 0.1); }
  .nrp-decide{ padding:24px 22px 26px; }
  .nrp-feats{ grid-template-columns:1fr; gap:10px; }
  .nrp-quote{ display:none; }
}
@media (prefers-reduced-motion:reduce){ .nrp-sheen{ display:none; } }
`;
