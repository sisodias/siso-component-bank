"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CosmicIconProps {
  size?: number;
  className?: string;
}

/* ─── PLANET ─── orbiting moon + ring tilt */
export function PlanetIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="10" fill="#6366F1" opacity={0.15} />
      <circle cx="24" cy="24" r="10" stroke="#6366F1" strokeWidth={1.5} />
      <ellipse cx="24" cy="24" rx="18" ry="5" stroke="#6366F1" strokeWidth={1} opacity={0.3} transform="rotate(-20 24 24)" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "24px 24px" }}
      >
        <motion.circle cx="42" cy="24" r="2.5" fill="#A5B4FC"
          animate={{ scale: [1, 0.7, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      </motion.g>
      <circle cx="20" cy="21" r="2" fill="#818CF8" opacity={0.2} />
      <circle cx="27" cy="28" r="1.5" fill="#818CF8" opacity={0.15} />
    </svg>
  );
}

/* ─── BLACK HOLE ─── spiraling accretion disk + warped light */
export function BlackHoleIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "24px 24px" }}
      >
        <ellipse cx="24" cy="24" rx="20" ry="7" stroke="url(#bhGrad)" strokeWidth={2.5} opacity={0.6} />
        <ellipse cx="24" cy="24" rx="15" ry="5" stroke="url(#bhGrad)" strokeWidth={1.5} opacity={0.4} />
      </motion.g>
      <motion.circle cx="24" cy="24" r="5" fill="#0F0F0F"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx="24" cy="24" r="7" stroke="#F97316" strokeWidth={0.5} opacity={0.5}
        animate={{ r: [7, 8, 7], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }} />
      <defs>
        <linearGradient id="bhGrad" x1="4" y1="24" x2="44" y2="24">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── COMET ─── streaking across with particle trail */
export function CometIcon({ size = 48, className }: CosmicIconProps) {
  const particles = [
    { delay: 0, x: -4, y: 2, r: 1.5 },
    { delay: 0.1, x: -8, y: 4, r: 1.2 },
    { delay: 0.2, x: -13, y: 6, r: 1 },
    { delay: 0.3, x: -18, y: 8, r: 0.7 },
    { delay: 0.4, x: -22, y: 10, r: 0.5 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.g
        animate={{ x: [0, 6, 0], y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {particles.map((p, i) => (
          <motion.circle key={i} cx={28 + p.x} cy={18 + p.y} r={p.r} fill="#38BDF8"
            animate={{ opacity: [0.6, 0.15, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: p.delay }} />
        ))}
        <motion.line x1="28" y1="18" x2="8" y2="28" stroke="#38BDF8" strokeWidth={1} opacity={0.15} strokeLinecap="round" />
        <circle cx="28" cy="18" r="4" fill="#38BDF8" opacity={0.15} />
        <circle cx="28" cy="18" r="3" stroke="#38BDF8" strokeWidth={1.5} />
        <motion.circle cx="28" cy="18" r="5.5" stroke="#38BDF8" strokeWidth={0.5} opacity={0}
          animate={{ r: [4, 8], opacity: [0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
    </svg>
  );
}

/* ─── SUPERNOVA ─── pulsing core + expanding shockwave rings */
export function SupernovaIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.circle cx="24" cy="24" r="3" fill="#FBBF24"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx="24" cy="24" r="8" stroke="#FBBF24" strokeWidth={1}
        animate={{ r: [6, 14], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
      <motion.circle cx="24" cy="24" r="8" stroke="#F59E0B" strokeWidth={0.5}
        animate={{ r: [4, 18], opacity: [0.4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }} />
      <motion.circle cx="24" cy="24" r="8" stroke="#F97316" strokeWidth={0.5}
        animate={{ r: [3, 22], opacity: [0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }} />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <motion.line key={deg} x1="24" y1="24" x2="24" y2="16" stroke="#FBBF24" strokeWidth={1} strokeLinecap="round"
          style={{ transformOrigin: "24px 24px", rotate: deg }}
          animate={{ opacity: [0.8, 0.2, 0.8], scaleY: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: deg / 720 }} />
      ))}
    </svg>
  );
}

/* ─── GALAXY ─── spiral arms rotating */
export function GalaxyIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "24px 24px" }}
      >
        <motion.path d="M24 24c2-6 8-10 16-8" stroke="#C084FC" strokeWidth={1.5} strokeLinecap="round" opacity={0.5}
          animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.path d="M24 24c-2 6-8 10-16 8" stroke="#C084FC" strokeWidth={1.5} strokeLinecap="round" opacity={0.5}
          animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} />
        <motion.path d="M24 24c6 2 10 8 8 16" stroke="#A78BFA" strokeWidth={1} strokeLinecap="round" opacity={0.3}
          animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity }} />
        <motion.path d="M24 24c-6-2-10-8-8-16" stroke="#A78BFA" strokeWidth={1} strokeLinecap="round" opacity={0.3}
          animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity, delay: 2.5 }} />
      </motion.g>
      <motion.circle cx="24" cy="24" r="3" fill="#C084FC" opacity={0.3}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} />
      <circle cx="24" cy="24" r="2" fill="#E9D5FF" opacity={0.8} />
      {[
        { cx: 30, cy: 16, r: 0.8, d: 0 }, { cx: 14, cy: 28, r: 0.6, d: 1 },
        { cx: 34, cy: 32, r: 0.7, d: 0.5 }, { cx: 18, cy: 14, r: 0.5, d: 1.5 },
      ].map((s, i) => (
        <motion.circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#E9D5FF"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.d }} />
      ))}
    </svg>
  );
}

/* ─── SATELLITE ─── orbiting with blinking signal */
export function SatelliteIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <circle cx="24" cy="24" r="4" fill="#34D399" opacity={0.1} />
      <circle cx="24" cy="24" r="4" stroke="#34D399" strokeWidth={1} opacity={0.3} strokeDasharray="2 3" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "24px 24px" }}
      >
        <ellipse cx="24" cy="24" rx="16" ry="16" stroke="#34D399" strokeWidth={0.5} opacity={0.15} strokeDasharray="3 6" />
        <g transform="translate(40, 24)">
          <rect x="-3" y="-1.5" width="6" height="3" rx="0.5" fill="#34D399" opacity={0.3} />
          <rect x="-1.5" y="-4" width="3" height="8" rx="0.5" stroke="#34D399" strokeWidth={1} />
          <motion.circle cx="0" cy="0" r="0" fill="#34D399"
            animate={{ r: [0, 4, 0], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </g>
      </motion.g>
    </svg>
  );
}

/* ─── METEOR SHOWER ─── multiple streaking meteors at different speeds */
export function MeteorShowerIcon({ size = 48, className }: CosmicIconProps) {
  const meteors = [
    { x1: 12, y1: 4, x2: 4, y2: 16, dur: 1.2, d: 0, w: 1.5 },
    { x1: 28, y1: 2, x2: 18, y2: 18, dur: 1.5, d: 0.4, w: 2 },
    { x1: 40, y1: 6, x2: 32, y2: 20, dur: 1.0, d: 0.8, w: 1 },
    { x1: 22, y1: 14, x2: 14, y2: 28, dur: 1.8, d: 1.2, w: 1 },
    { x1: 38, y1: 16, x2: 30, y2: 30, dur: 1.3, d: 0.6, w: 1.5 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      {meteors.map((m, i) => (
        <motion.line key={i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
          stroke="url(#meteorGrad)" strokeWidth={m.w} strokeLinecap="round"
          animate={{ opacity: [0, 0.9, 0], x: [0, 4], y: [0, 4] }}
          transition={{ duration: m.dur, repeat: Infinity, delay: m.d, ease: "easeIn" }} />
      ))}
      {[
        { cx: 8, cy: 32, d: 0 }, { cx: 36, cy: 38, d: 0.7 },
        { cx: 20, cy: 40, d: 1.3 }, { cx: 42, cy: 28, d: 0.3 },
      ].map((s, i) => (
        <motion.circle key={`s${i}`} cx={s.cx} cy={s.cy} r="0.8" fill="#FCD34D"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: s.d }} />
      ))}
      <defs>
        <linearGradient id="meteorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── CONSTELLATION ─── dots connecting with animated lines */
export function ConstellationIcon({ size = 48, className }: CosmicIconProps) {
  const stars = [
    { cx: 8, cy: 12 }, { cx: 18, cy: 6 }, { cx: 30, cy: 10 },
    { cx: 38, cy: 20 }, { cx: 28, cy: 30 }, { cx: 14, cy: 36 },
    { cx: 22, cy: 22 },
  ];
  const lines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 6], [4, 6],
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      {lines.map(([a, b], i) => (
        <motion.line key={i}
          x1={stars[a].cx} y1={stars[a].cy}
          x2={stars[b].cx} y2={stars[b].cy}
          stroke="#67E8F9" strokeWidth={0.8} strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0.3] }}
          transition={{ duration: 2, delay: i * 0.25, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }} />
      ))}
      {stars.map((s, i) => (
        <motion.circle key={i} cx={s.cx} cy={s.cy} r="1.8" fill="#67E8F9"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
    </svg>
  );
}

/* ─── ECLIPSE ─── moon crossing sun with corona flare */
export function EclipseIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.circle cx="24" cy="24" r="14" stroke="#FBBF24" strokeWidth={0.5}
        animate={{ r: [14, 16, 14], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      <motion.circle cx="24" cy="24" r="17" stroke="#FBBF24" strokeWidth={0.3}
        animate={{ r: [17, 20, 17], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <circle cx="24" cy="24" r="11" fill="#FBBF24" opacity={0.1} />
      <circle cx="24" cy="24" r="11" stroke="#FBBF24" strokeWidth={1.5} />
      <motion.circle cx="24" cy="24" r="10" fill="#18181B"
        animate={{ cx: [18, 24, 30, 24, 18] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <motion.line key={deg} x1="24" y1="4" x2="24" y2="7" stroke="#FBBF24" strokeWidth={1} strokeLinecap="round"
          style={{ transformOrigin: "24px 24px", rotate: deg }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: deg / 400 }} />
      ))}
    </svg>
  );
}

/* ─── NEBULA ─── swirling gas clouds */
export function NebulaIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.ellipse cx="20" cy="22" rx="12" ry="8" fill="#EC4899" opacity={0.1}
        animate={{ rx: [12, 14, 12], ry: [8, 10, 8], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "20px 22px" }} />
      <motion.ellipse cx="28" cy="26" rx="10" ry="7" fill="#8B5CF6" opacity={0.12}
        animate={{ rx: [10, 12, 10], ry: [7, 9, 7], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "28px 26px" }} />
      <motion.ellipse cx="24" cy="20" rx="8" ry="5" fill="#3B82F6" opacity={0.08}
        animate={{ rx: [8, 10, 8], rotate: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "24px 20px" }} />
      {[
        { cx: 16, cy: 18, d: 0 }, { cx: 30, cy: 22, d: 0.5 },
        { cx: 22, cy: 28, d: 1.0 }, { cx: 28, cy: 16, d: 1.5 },
        { cx: 18, cy: 26, d: 0.8 }, { cx: 32, cy: 28, d: 0.3 },
      ].map((s, i) => (
        <motion.circle key={i} cx={s.cx} cy={s.cy} r="0.8" fill="#F9A8D4"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: s.d }} />
      ))}
    </svg>
  );
}

/* ─── ASTRONAUT ─── floating with gentle tumble */
export function AstronautIcon({ size = 48, className }: CosmicIconProps) {
  return (
    <motion.svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}
      animate={{ y: [0, -3, 0, 3, 0], rotate: [0, 3, 0, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
      {/* helmet */}
      <circle cx="24" cy="16" r="8" fill="#E2E8F0" opacity={0.1} />
      <circle cx="24" cy="16" r="8" stroke="#94A3B8" strokeWidth={1.5} />
      <rect x="19" y="12" width="10" height="7" rx="3" fill="#38BDF8" opacity={0.2} />
      <rect x="19" y="12" width="10" height="7" rx="3" stroke="#38BDF8" strokeWidth={1} opacity={0.6} />
      {/* body */}
      <rect x="18" y="24" width="12" height="10" rx="3" fill="#E2E8F0" opacity={0.08} />
      <rect x="18" y="24" width="12" height="10" rx="3" stroke="#94A3B8" strokeWidth={1.5} />
      {/* arms */}
      <motion.path d="M18 28c-4-1-6 2-8 4" stroke="#94A3B8" strokeWidth={1.5} strokeLinecap="round"
        animate={{ d: ["M18 28c-4-1-6 2-8 4", "M18 28c-4 1-7 0-9 2", "M18 28c-4-1-6 2-8 4"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <motion.path d="M30 28c4-1 6 2 8 4" stroke="#94A3B8" strokeWidth={1.5} strokeLinecap="round"
        animate={{ d: ["M30 28c4-1 6 2 8 4", "M30 28c4 1 7 0 9 2", "M30 28c4-1 6 2 8 4"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
      {/* tether */}
      <motion.line x1="24" y1="34" x2="24" y2="44" stroke="#94A3B8" strokeWidth={0.8} strokeLinecap="round" strokeDasharray="2 2"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }} />
    </motion.svg>
  );
}

/* ─── WORMHOLE ─── concentric rings pulsing inward */
export function WormholeIcon({ size = 48, className }: CosmicIconProps) {
  const rings = [
    { r: 18, dur: 3, d: 0, c: "#818CF8" },
    { r: 14, dur: 2.5, d: 0.3, c: "#A78BFA" },
    { r: 10, dur: 2, d: 0.6, c: "#C084FC" },
    { r: 6, dur: 1.5, d: 0.9, c: "#D8B4FE" },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "24px 24px" }}
      >
        {rings.map((ring, i) => (
          <motion.ellipse key={i} cx="24" cy="24" rx={ring.r} ry={ring.r * 0.4}
            stroke={ring.c} strokeWidth={1.2} fill="none"
            animate={{
              ry: [ring.r * 0.4, ring.r * 0.6, ring.r * 0.4],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: ring.dur, repeat: Infinity, delay: ring.d, ease: "easeInOut" }} />
        ))}
      </motion.g>
      <motion.circle cx="24" cy="24" r="2" fill="#E9D5FF"
        animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  );
}

/* ─── Demo Component ─── */

const ALL_ICONS = [
  { name: "Planet", Icon: PlanetIcon },
  { name: "Black Hole", Icon: BlackHoleIcon },
  { name: "Comet", Icon: CometIcon },
  { name: "Supernova", Icon: SupernovaIcon },
  { name: "Galaxy", Icon: GalaxyIcon },
  { name: "Satellite", Icon: SatelliteIcon },
  { name: "Meteors", Icon: MeteorShowerIcon },
  { name: "Constellation", Icon: ConstellationIcon },
  { name: "Eclipse", Icon: EclipseIcon },
  { name: "Nebula", Icon: NebulaIcon },
  { name: "Astronaut", Icon: AstronautIcon },
  { name: "Wormhole", Icon: WormholeIcon },
];

export function Component() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Animated Cosmic Icons
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          12 living micro-universes — each icon is a scene with orbits, pulses, particles, and physics. No interaction needed.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 justify-items-center">
        {ALL_ICONS.map(({ name, Icon }) => (
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