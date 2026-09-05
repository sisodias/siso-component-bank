"use client";

import { cn } from "../_utils/cn";
import { motion } from "framer-motion";

interface WeatherIconProps {
  size?: number;
  className?: string;
}

/* ─── SUN ─── */
export function SunIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <motion.svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 12, ease: "linear", repeat: Infinity }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <motion.line key={deg} x1="24" y1="6" x2="24" y2="10" stroke="#FBBF24" strokeWidth={2} strokeLinecap="round"
            style={{ transformOrigin: "24px 24px", rotate: deg }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: deg / 360 }} />
        ))}
      </motion.g>
      <motion.circle cx="24" cy="24" r="8" fill="#FBBF24" opacity={0.2}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      <circle cx="24" cy="24" r="8" stroke="#FBBF24" strokeWidth={2} />
    </motion.svg>
  );
}

/* ─── MOON ─── */
export function MoonIcon({ size = 48, className }: WeatherIconProps) {
  const stars = [
    { cx: 34, cy: 10, d: 0 }, { cx: 38, cy: 18, d: 0.5 },
    { cx: 30, cy: 6, d: 1 }, { cx: 40, cy: 12, d: 1.5 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <path d="M28 8a14 14 0 100 28 10 10 0 01 0-28z" fill="#A78BFA" opacity={0.15} />
      <path d="M28 8a14 14 0 100 28 10 10 0 01 0-28z" stroke="#A78BFA" strokeWidth={2} strokeLinecap="round" />
      {stars.map((s) => (
        <motion.circle key={s.cx + s.cy} cx={s.cx} cy={s.cy} r="1" fill="#A78BFA"
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.d }} />
      ))}
    </svg>
  );
}

/* ─── CLOUD ─── */
export function CloudIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.g animate={{ x: [0, 2, 0, -2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M36 30H14a8 8 0 01-.5-16A10 10 0 0134 16a7 7 0 012 14z" fill="#94A3B8" opacity={0.12} />
        <path d="M36 30H14a8 8 0 01-.5-16A10 10 0 0134 16a7 7 0 012 14z" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

/* ─── RAIN ─── */
export function RainIcon({ size = 48, className }: WeatherIconProps) {
  const drops = [
    { x: 16, d: 0 }, { x: 22, d: 0.3 }, { x: 28, d: 0.6 }, { x: 34, d: 0.15 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" fill="#60A5FA" opacity={0.1} />
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" stroke="#60A5FA" strokeWidth={2} strokeLinecap="round" />
      {drops.map((drop) => (
        <motion.line key={drop.x} x1={drop.x} y1={26} x2={drop.x} y2={30} stroke="#60A5FA" strokeWidth={2} strokeLinecap="round"
          animate={{ y: [0, 12], opacity: [0.8, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: drop.d, ease: "easeIn" }} />
      ))}
    </svg>
  );
}

/* ─── HEAVY RAIN ─── */
export function HeavyRainIcon({ size = 48, className }: WeatherIconProps) {
  const drops = [
    { x: 14, d: 0 }, { x: 19, d: 0.15 }, { x: 24, d: 0.3 },
    { x: 29, d: 0.1 }, { x: 34, d: 0.4 }, { x: 37, d: 0.25 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" fill="#3B82F6" opacity={0.1} />
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" />
      {drops.map((drop) => (
        <motion.line key={drop.x} x1={drop.x} y1={24} x2={drop.x - 2} y2={30} stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round"
          animate={{ y: [0, 16], opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: drop.d, ease: "easeIn" }} />
      ))}
    </svg>
  );
}

/* ─── SNOW ─── */
export function SnowIcon({ size = 48, className }: WeatherIconProps) {
  const flakes = [
    { x: 16, d: 0 }, { x: 22, d: 0.5 }, { x: 28, d: 0.2 },
    { x: 34, d: 0.7 }, { x: 19, d: 1.0 }, { x: 31, d: 0.4 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" fill="#CBD5E1" opacity={0.15} />
      <path d="M36 22H14a7 7 0 01-.5-14A9 9 0 0134 10a6 6 0 012 12z" stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" />
      {flakes.map((f, i) => (
        <motion.circle key={i} cx={f.x} cy={26} r={1.5} fill="#CBD5E1"
          animate={{ y: [0, 14], x: [0, i % 2 === 0 ? 3 : -3, 0], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: f.d, ease: "easeIn" }} />
      ))}
    </svg>
  );
}

/* ─── THUNDER ─── */
export function ThunderIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" fill="#F59E0B" opacity={0.08} />
      <path d="M36 20H14a7 7 0 01-.5-14A9 9 0 0134 8a6 6 0 012 12z" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
      <motion.path d="M26 20l-3 8h6l-3 10" stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        animate={{ opacity: [0, 1, 1, 0, 0, 0, 1, 0, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity }} />
      <motion.path d="M26 20l-3 8h6l-3 10" fill="#F59E0B" opacity={0}
        animate={{ opacity: [0, 0.3, 0, 0, 0, 0, 0.2, 0, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity }} />
    </svg>
  );
}

/* ─── WIND ─── */
export function WindIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.path d="M6 18h26a4 4 0 000-8" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round"
        animate={{ pathLength: [0, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.path d="M6 24h32a3 3 0 010 6" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round"
        animate={{ pathLength: [0, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
      <motion.path d="M10 30h18a3 3 0 000-0" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" opacity={0.5}
        animate={{ pathLength: [0, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} />
    </svg>
  );
}

/* ─── FOG ─── */
export function FogIcon({ size = 48, className }: WeatherIconProps) {
  const lines = [
    { y: 16, w: 28, d: 0 }, { y: 22, w: 32, d: 0.5 },
    { y: 28, w: 24, d: 1.0 }, { y: 34, w: 30, d: 1.5 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      {lines.map((l) => (
        <motion.line key={l.y} x1={24 - l.w / 2} y1={l.y} x2={24 + l.w / 2} y2={l.y}
          stroke="#94A3B8" strokeWidth={2.5} strokeLinecap="round"
          animate={{ opacity: [0.2, 0.6, 0.2], x: [0, 3, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: l.d, ease: "easeInOut" }} />
      ))}
    </svg>
  );
}

/* ─── PARTLY CLOUDY ─── */
export function PartlyCloudyIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        style={{ transformOrigin: "16px 16px" }}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line key={deg} x1="16" y1="6" x2="16" y2="9" stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round"
            style={{ transformOrigin: "16px 16px", rotate: deg }} />
        ))}
      </motion.g>
      <circle cx="16" cy="16" r="6" stroke="#FBBF24" strokeWidth={1.5} fill="#FBBF24" fillOpacity={0.15} />
      <motion.g animate={{ x: [0, 1.5, 0, -1.5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M38 34H18a7 7 0 01-.5-14A9 9 0 0136 22a6 6 0 012 12z" fill="#94A3B8" opacity={0.12} />
        <path d="M38 34H18a7 7 0 01-.5-14A9 9 0 0136 22a6 6 0 012 12z" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/* ─── SUNRISE ─── */
export function SunriseIcon({ size = 48, className }: WeatherIconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      <line x1="6" y1="34" x2="42" y2="34" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
      <motion.g animate={{ y: [4, 0] }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}>
        <path d="M12 34a12 12 0 0124 0" fill="#FBBF24" opacity={0.15} />
        <path d="M12 34a12 12 0 0124 0" stroke="#FBBF24" strokeWidth={2} strokeLinecap="round" />
        {[0, 30, 60, 90, 120, 150, 180].map((deg) => (
          <line key={deg} x1="24" y1="14" x2="24" y2="17" stroke="#FBBF24" strokeWidth={1.5} strokeLinecap="round"
            style={{ transformOrigin: "24px 34px", rotate: deg - 90 }} />
        ))}
      </motion.g>
      <motion.path d="M24 42V36" stroke="#FBBF24" strokeWidth={2} strokeLinecap="round"
        animate={{ y: [2, -2, 2] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      <motion.path d="M20 38l4-4 4 4" stroke="#FBBF24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        animate={{ y: [2, -2, 2] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
    </svg>
  );
}

/* ─── RAINBOW ─── */
export function RainbowIcon({ size = 48, className }: WeatherIconProps) {
  const arcs = [
    { r: 16, color: "#EF4444", d: 0 },
    { r: 13, color: "#F59E0B", d: 0.1 },
    { r: 10, color: "#22C55E", d: 0.2 },
    { r: 7, color: "#3B82F6", d: 0.3 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("", className)} style={{ width: size, height: size }}>
      {arcs.map((arc) => (
        <motion.path key={arc.r}
          d={`M${24 - arc.r} 34a${arc.r} ${arc.r} 0 01${arc.r * 2} 0`}
          stroke={arc.color} strokeWidth={2} strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 1.5, delay: arc.d, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }} />
      ))}
    </svg>
  );
}

/* ─── Demo Component ─── */

const ALL_ICONS = [
  { name: "Sun", Icon: SunIcon },
  { name: "Moon", Icon: MoonIcon },
  { name: "Cloud", Icon: CloudIcon },
  { name: "Partly Cloudy", Icon: PartlyCloudyIcon },
  { name: "Rain", Icon: RainIcon },
  { name: "Heavy Rain", Icon: HeavyRainIcon },
  { name: "Snow", Icon: SnowIcon },
  { name: "Thunder", Icon: ThunderIcon },
  { name: "Wind", Icon: WindIcon },
  { name: "Fog", Icon: FogIcon },
  { name: "Sunrise", Icon: SunriseIcon },
  { name: "Rainbow", Icon: RainbowIcon },
];

export function Component() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Animated Weather Icons
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Each icon is a living micro-scene — rain falls, lightning flashes, sun rays rotate, snowflakes drift. No hover required.
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