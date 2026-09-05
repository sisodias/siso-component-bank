"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EmojiProps {
  size?: number;
  className?: string;
}

/* shared blink helper — eyes shut briefly */
function Eyes({ cx1, cx2, cy, r, blinkDelay = 3 }: { cx1: number; cx2: number; cy: number; r: number; blinkDelay?: number }) {
  return (
    <>
      <motion.ellipse cx={cx1} cy={cy} rx={r} fill="currentColor"
        animate={{ ry: [r, r, 0.5, r, r] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: blinkDelay, times: [0, 0.3, 0.5, 0.7, 1] }}
      />
      <motion.ellipse cx={cx2} cy={cy} rx={r} fill="currentColor"
        animate={{ ry: [r, r, 0.5, r, r] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: blinkDelay, times: [0, 0.3, 0.5, 0.7, 1] }}
      />
    </>
  );
}

/* ─── 1. HAPPY ─── big smile, blinking eyes, subtle bounce */
export function HappyEmoji({ size = 48, className }: EmojiProps) {
  return (
    <motion.svg viewBox="0 0 48 48" fill="none" className={cn("", className)}
      style={{ width: size, height: size }}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      <Eyes cx1={17} cx2={31} cy={20} r={2.5} blinkDelay={2.5} />
      <motion.path d="M14 28c2 6 8 8 10 8s8-2 10-8" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
        animate={{ d: ["M14 28c2 6 8 8 10 8s8-2 10-8", "M14 29c2 5 8 7 10 7s8-2 10-7", "M14 28c2 6 8 8 10 8s8-2 10-8"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

/* ─── 2. SAD ─── droopy eyes, frown, single tear */
export function SadEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      <Eyes cx1={17} cx2={31} cy={21} r={2.5} blinkDelay={4} />
      {/* eyebrows — droopy */}
      <line x1="13" y1="15" x2="20" y2="16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      <line x1="35" y1="15" x2="28" y2="16" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
      {/* frown */}
      <path d="M16 34c2-4 6-6 8-6s6 2 8 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* tear */}
      <motion.circle cx="33" cy="24" r="1.5" fill="currentColor" opacity={0.3}
        animate={{ cy: [24, 36], opacity: [0.4, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeIn" }}
      />
    </svg>
  );
}

/* ─── 3. LOVE ─── heart eyes pulsing */
export function LoveEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* heart eyes */}
      {[15, 29].map((cx) => (
        <motion.g key={cx} animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${cx + 2}px 20px` }}>
          <path d={`M${cx} 20c0-2 1.5-4 3-4s3 2 3 4-3 5-3 5-3-3-3-5z`} fill="#EF4444" opacity={0.7} />
        </motion.g>
      ))}
      {/* smile */}
      <path d="M16 30c2 4 6 5 8 5s6-1 8-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/* ─── 4. SLEEPY ─── heavy eyelids, Zzz floating */
export function SleepyEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* closed eyes — just arcs */}
      <path d="M13 21c1 2 3 3 5 3s4-1 5-3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path d="M25 21c1 2 3 3 5 3s4-1 5-3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* small open mouth */}
      <ellipse cx="24" cy="32" rx="3" ry="2" stroke="currentColor" strokeWidth={2} />
      {/* floating Zzz */}
      {[0, 1, 2].map((i) => (
        <motion.text key={i} x={34 + i * 3} fill="currentColor" fontSize={6 + i * 2} fontWeight="bold"
          animate={{
            y: [24 - i * 6, 14 - i * 6],
            opacity: [0.6 - i * 0.15, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}>
          z
        </motion.text>
      ))}
    </svg>
  );
}

/* ─── 5. ANGRY ─── furrowed brows bouncing, gritted teeth */
export function AngryEmoji({ size = 48, className }: EmojiProps) {
  return (
    <motion.svg viewBox="0 0 48 48" fill="none" className={cn("", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: [0, -1, 1, -1, 0] }}
      transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      <circle cx="17" cy="21" r="2.5" fill="currentColor" />
      <circle cx="31" cy="21" r="2.5" fill="currentColor" />
      {/* angry brows — V shape */}
      <motion.line x1="12" y1="16" x2="20" y2="14" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
        animate={{ y2: [14, 15, 14] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.line x1="36" y1="16" x2="28" y2="14" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
        animate={{ y2: [14, 15, 14] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {/* gritted teeth mouth */}
      <rect x="17" y="30" width="14" height="5" rx="1" stroke="currentColor" strokeWidth={2} />
      <line x1="21" y1="30" x2="21" y2="35" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1="24" y1="30" x2="24" y2="35" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      <line x1="27" y1="30" x2="27" y2="35" stroke="currentColor" strokeWidth={1} opacity={0.4} />
    </motion.svg>
  );
}

/* ─── 6. SURPRISED ─── wide eyes, O mouth, eyebrows shooting up */
export function SurprisedEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* wide eyes */}
      <circle cx="17" cy="20" r="3.5" stroke="currentColor" strokeWidth={2} />
      <circle cx="17" cy="20" r="1.5" fill="currentColor" />
      <circle cx="31" cy="20" r="3.5" stroke="currentColor" strokeWidth={2} />
      <circle cx="31" cy="20" r="1.5" fill="currentColor" />
      {/* raised brows */}
      <motion.line x1="13" y1="13" x2="21" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
        animate={{ y1: [13, 11, 13], y2: [12, 10, 12] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.line x1="35" y1="13" x2="27" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
        animate={{ y1: [13, 11, 13], y2: [12, 10, 12] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* O mouth */}
      <motion.ellipse cx="24" cy="33" rx="4" stroke="currentColor" strokeWidth={2}
        animate={{ ry: [4, 5, 4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ─── 7. WINKING ─── one eye winks, smirk */
export function WinkEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* left eye open */}
      <motion.ellipse cx={17} cy={20} rx={2.5} fill="currentColor"
        animate={{ ry: [2.5, 2.5, 0.5, 2.5, 2.5] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3.5, times: [0, 0.3, 0.5, 0.7, 1] }}
      />
      {/* right eye — winking arc */}
      <motion.path d="M28 20c1-2 3-2 5 0" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
        animate={{ d: ["M28 20c1-2 3-2 5 0", "M28 20c1-1 3-1 5 0", "M28 20c1-2 3-2 5 0"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* smirk — asymmetric smile */}
      <path d="M16 30c2 4 6 5 8 5s6-2 8-3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* tongue peek */}
      <motion.ellipse cx="28" cy="34" rx="2.5" ry="1.5" fill="#EF4444" opacity={0.4}
        animate={{ ry: [0, 1.5, 1.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
      />
    </svg>
  );
}

/* ─── 8. THINKING ─── eyes look up, hand on chin, thought bubble */
export function ThinkingEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* eyes looking up-right */}
      <motion.g
        animate={{ x: [0, 2, 2, 0], y: [0, -1, -1, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <circle cx="17" cy="20" r="2.5" fill="currentColor" />
        <circle cx="31" cy="20" r="2.5" fill="currentColor" />
      </motion.g>
      {/* flat thinking mouth */}
      <path d="M18 32c2 0 4 1 6 0s4-1 6 0" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      {/* eyebrow raised */}
      <motion.line x1="26" y1="13" x2="35" y2="14" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
        animate={{ y1: [13, 11, 13] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* thought bubbles */}
      <motion.circle cx="40" cy="10" r="2" stroke="currentColor" strokeWidth={1.5} opacity={0.3}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="36" cy="6" r="1.2" stroke="currentColor" strokeWidth={1} opacity={0.2}
        animate={{ scale: [0.6, 1, 0.6], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      />
    </svg>
  );
}

/* ─── 9. LAUGHING ─── squinted eyes, wide open mouth, shaking */
export function LaughingEmoji({ size = 48, className }: EmojiProps) {
  return (
    <motion.svg viewBox="0 0 48 48" fill="none" className={cn("", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: [0, -2, 2, -1, 1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* squinted laughing eyes */}
      <path d="M12 20c2-2 4-2 6 0" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M30 20c2-2 4-2 6 0" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
      {/* wide open smile */}
      <path d="M13 28c2 6 8 8 11 8s9-2 11-8z" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
      <path d="M13 28c2 6 8 8 11 8s9-2 11-8z" fill="currentColor" opacity={0.06} />
      {/* tear of joy */}
      <motion.circle cx="11" cy="22" r="1.2" fill="currentColor" opacity={0.25}
        animate={{ cy: [22, 30], opacity: [0.3, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.5, ease: "easeIn" }}
      />
    </motion.svg>
  );
}

/* ─── 10. COOL ─── sunglasses glint, confident smirk */
export function CoolEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* sunglasses frame */}
      <rect x="9" y="17" width="12" height="8" rx="2" stroke="currentColor" strokeWidth={2} />
      <rect x="27" y="17" width="12" height="8" rx="2" stroke="currentColor" strokeWidth={2} />
      <line x1="21" y1="21" x2="27" y2="21" stroke="currentColor" strokeWidth={2} />
      {/* lenses dark */}
      <rect x="10" y="18" width="10" height="6" rx="1.5" fill="currentColor" opacity={0.15} />
      <rect x="28" y="18" width="10" height="6" rx="1.5" fill="currentColor" opacity={0.15} />
      {/* glint that slides across */}
      <motion.rect x="10" y="18" width="3" height="6" rx="1" fill="currentColor" opacity={0.1}
        animate={{ x: [10, 18, 28, 38, 38, 10] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.3, 0.35, 0.65, 0.9, 1] }}
      />
      {/* confident smirk */}
      <path d="M17 31c2 3 5 4 7 4s6-2 7-2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/* ─── 11. DIZZY ─── spiral eyes, wavy mouth, wobble */
export function DizzyEmoji({ size = 48, className }: EmojiProps) {
  return (
    <motion.svg viewBox="0 0 48 48" fill="none" className={cn("", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: [0, 3, -3, 2, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* spiral eyes */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "17px 20px" }}>
        <circle cx="17" cy="20" r="4" stroke="currentColor" strokeWidth={1.5} fill="none" />
        <circle cx="17" cy="20" r="2" stroke="currentColor" strokeWidth={1} fill="none" opacity={0.5} />
      </motion.g>
      <motion.g animate={{ rotate: -360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "31px 20px" }}>
        <circle cx="31" cy="20" r="4" stroke="currentColor" strokeWidth={1.5} fill="none" />
        <circle cx="31" cy="20" r="2" stroke="currentColor" strokeWidth={1} fill="none" opacity={0.5} />
      </motion.g>
      {/* wavy mouth */}
      <motion.path d="M16 33c2-2 4 2 6 0s4 2 6 0" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
        animate={{
          d: [
            "M16 33c2-2 4 2 6 0s4 2 6 0",
            "M16 33c2 2 4-2 6 0s4-2 6 0",
            "M16 33c2-2 4 2 6 0s4 2 6 0",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

/* ─── 12. STAR STRUCK ─── star eyes sparkling, open smile */
export function StarStruckEmoji({ size = 48, className }: EmojiProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={2} />
      {/* star eyes */}
      {[17, 31].map((cx) => (
        <motion.g key={cx}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${cx}px 20px` }}>
          <polygon
            points={`${cx},15 ${cx + 1.5},18.5 ${cx + 5},18.5 ${cx + 2.2},21 ${cx + 3.5},25 ${cx},22.5 ${cx - 3.5},25 ${cx - 2.2},21 ${cx - 5},18.5 ${cx - 1.5},18.5`}
            fill="#FBBF24" opacity={0.7}
          />
        </motion.g>
      ))}
      {/* sparkle particles */}
      {[
        { cx: 10, cy: 14, d: 0 }, { cx: 38, cy: 14, d: 0.4 },
        { cx: 8, cy: 24, d: 0.8 }, { cx: 40, cy: 24, d: 1.2 },
      ].map((s, i) => (
        <motion.circle key={i} cx={s.cx} cy={s.cy} r="1" fill="#FBBF24"
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: s.d }}
        />
      ))}
      {/* wide smile */}
      <path d="M14 29c2 5 7 7 10 7s8-2 10-7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/* ─── Demo Component ─── */

const ALL_EMOJIS = [
  { name: "Happy", Icon: HappyEmoji },
  { name: "Sad", Icon: SadEmoji },
  { name: "Love", Icon: LoveEmoji },
  { name: "Sleepy", Icon: SleepyEmoji },
  { name: "Angry", Icon: AngryEmoji },
  { name: "Surprised", Icon: SurprisedEmoji },
  { name: "Winking", Icon: WinkEmoji },
  { name: "Thinking", Icon: ThinkingEmoji },
  { name: "Laughing", Icon: LaughingEmoji },
  { name: "Cool", Icon: CoolEmoji },
  { name: "Dizzy", Icon: DizzyEmoji },
  { name: "Star Struck", Icon: StarStruckEmoji },
];

export function Component() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Animated Emoji Icons
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          12 expressive faces with continuous micro-expressions — eyes blink, brows raise, tears fall, stars sparkle. Each has its own personality.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center">
        {ALL_EMOJIS.map(({ name, Icon }) => (
          <div key={name} className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center size-20 rounded-2xl border border-border bg-card">
              <Icon size={48} />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground tracking-wide text-center leading-tight">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}