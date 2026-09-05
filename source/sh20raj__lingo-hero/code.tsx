"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Star,
  Flame,
  Trophy,
  Play,
  Users,
  Target,
  BookOpen,
  Rocket,
  Crown,
} from "lucide-react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS — Lingokit UA / Duolingo DDS
   ───────────────────────────────────────────── */
const TOKENS = {
  feather: "#58CC02",
  featherShadow: "#46A302",
  mask: "#89E219",
  macaw: "#1CB0F6",
  macawShadow: "#1899D6",
  cardinal: "#FF4B4B",
  bee: "#FFC800",
  beeShadow: "#E6B400",
  fox: "#FF9600",
  foxShadow: "#E68600",
  beetle: "#CE82FF",
  beetleShadow: "#B86CE6",
  eel: "#4B4B4B",
  wolf: "#777777",
  hare: "#AFAFAF",
  swan: "#E5E5E5",
  polar: "#F7F7F7",
  snow: "#FFFFFF",
  humpback: "#2B70C9",
};

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const float = {
  y: [0, -14, 0],
  transition: {
    duration: 4.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const floatSlow = {
  y: [0, -10, 0],
  transition: {
    duration: 5.5,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 0.8,
  },
};

const floatSlower = {
  y: [0, -12, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1.6,
  },
};

const floatSlowest = {
  y: [0, -8, 0],
  transition: {
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 0.4,
  },
};

/* ─────────────────────────────────────────────
   MOSAIC MASCOT — Pure CSS / Div Construction
   ───────────────────────────────────────────── */
function MosaicMascot() {
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex-shrink-0">
      {/* Decorative ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-[3px] border-dashed opacity-20"
        style={{ borderColor: TOKENS.feather }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Outer glow */}
      <div
        className="absolute inset-4 rounded-full opacity-30 blur-2xl"
        style={{ background: `radial-gradient(circle, ${TOKENS.mask} 0%, transparent 70%)` }}
      />

      {/* Body base */}
      <div className="absolute inset-10 rounded-full bg-white border-[3px] border-black/10 shadow-[0_8px_0_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.1)]">
        {/* Face mask area */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 rounded-full bg-[#F5F0E8] border-[3px] border-black/10" />

        {/* Eyes */}
        <div className="absolute top-[34%] left-[24%] w-14 h-16 bg-white rounded-full border-[3px] border-black/10 shadow-[0_2px_0_rgba(0,0,0,0.06)] flex items-center justify-center">
          <div className="w-7 h-7 bg-[#2B2B2B] rounded-full relative">
            <div className="absolute top-[3px] left-[3px] w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
        <div className="absolute top-[34%] right-[24%] w-14 h-16 bg-white rounded-full border-[3px] border-black/10 shadow-[0_2px_0_rgba(0,0,0,0.06)] flex items-center justify-center">
          <div className="w-7 h-7 bg-[#2B2B2B] rounded-full relative">
            <div className="absolute top-[3px] left-[3px] w-3 h-3 bg-white rounded-full" />
          </div>
        </div>

        {/* Eyebrows */}
        <div className="absolute top-[28%] left-[20%] w-16 h-3 bg-[#2B2B2B] rounded-full opacity-80 rotate-[-6deg] origin-right" />
        <div className="absolute top-[28%] right-[20%] w-16 h-3 bg-[#2B2B2B] rounded-full opacity-80 rotate-[6deg] origin-left" />

        {/* Beak */}
        <div className="absolute top-[46%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-16 h-9 bg-[#FFC200] rounded-t-full border-[3px] border-black/10 relative">
            <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-black/10 rounded-full" />
          </div>
          <div className="w-10 h-4 bg-[#FF9900] rounded-b-lg border-x-[3px] border-b-[3px] border-black/10" />
        </div>

        {/* Feet / talons */}
        <div className="absolute bottom-7 left-[22%] flex gap-1">
          <div className="w-3 h-4 bg-[#FF9900] rounded-b-lg border-[2px] border-black/10" />
          <div className="w-3 h-4 bg-[#FF9900] rounded-b-lg border-[2px] border-black/10" />
          <div className="w-3 h-4 bg-[#FF9900] rounded-b-lg border-[2px] border-black/10" />
        </div>
        <div className="absolute bottom-7 right-[22%] flex gap-1">
          <div className="w-3 h-4 bg-[#FF9900] rounded-b-lg border-[2px] border-black/10" />
          <div className="w-3 h-4 bg-[#FF9900] rounded-b-lg border-[2px] border-black/10" />
          <div className="w-3 h-4 bg-[#FF9900] rounded-b-lg border-[2px] border-black/10" />
        </div>

        {/* Wing left */}
        <div className="absolute top-[40%] -left-3 w-12 h-20 bg-[#58CC02] rounded-[50%] border-[3px] border-black/10 rotate-[-20deg] shadow-[0_4px_0_rgba(0,0,0,0.08)]" />

        {/* Wing right */}
        <div className="absolute top-[40%] -right-3 w-12 h-20 bg-[#58CC02] rounded-[50%] border-[3px] border-black/10 rotate-[20deg] shadow-[0_4px_0_rgba(0,0,0,0.08)]" />

        {/* Belly patch */}
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-20 h-16 bg-[#F9F3E8] rounded-full border-[2px] border-black/5" />

        {/* Head tuft */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-10 bg-[#58CC02] rounded-full border-b-[3px] border-black/10" />

        {/* Small feather detail on head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#89E219] rounded-full border-[2px] border-black/10" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLOATING CARD COMPONENT
   ───────────────────────────────────────────── */
interface FloatingCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  shadowColor: string;
  x: string;
  y: string;
  delay: number;
  rotate?: string;
  badge?: string;
}

function FloatingCard({
  icon,
  label,
  value,
  color,
  shadowColor,
  x,
  y,
  delay,
  rotate = "0deg",
  badge,
}: FloatingCardProps) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -12, 0],
        rotate: [rotate, rotate],
      }}
      transition={{
        y: {
          duration: 4.5 + delay * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
        rotate: { duration: 1 },
      }}
      whileHover={{ scale: 1.05, rotate: "0deg" }}
    >
      <div
        className="relative bg-white rounded-2xl border-[2.5px] border-black/10 shadow-[0_4px_0_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.08)] p-3 min-w-[120px] sm:min-w-[140px]"
        style={{
          transform: `rotate(${rotate})`,
          transformOrigin: "center center",
        }}
      >
        {/* Accent stripe */}
        <div
          className="absolute top-0 left-3 right-3 h-[3px] rounded-b-full"
          style={{ backgroundColor: color }}
        />

        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}22` }}
          >
            <span className="text-lg" style={{ color }}>
              {icon}
            </span>
          </div>
          {badge && (
            <span
              className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="text-xs font-extrabold uppercase tracking-wider text-[#777] mb-0.5">
          {label}
        </div>
        <div className="text-sm font-black text-[#4B4B4B] leading-none">{value}</div>

        {/* Shadow element */}
        <div
          className="absolute -bottom-1 left-4 right-4 h-2 rounded-full opacity-20 blur-sm"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   AVATAR STACK
   ───────────────────────────────────────────── */
function AvatarStack() {
  const avatars = [
    "bg-[#58CC02]",
    "bg-[#1CB0F6]",
    "bg-[#FFC800]",
    "bg-[#FF9600]",
    "bg-[#CE82FF]",
  ];

  return (
    <div className="flex -space-x-3">
      {avatars.map((bg, i) => (
        <div
          key={i}
          className={`w-9 h-9 rounded-full ${bg} border-[2.5px] border-white shadow-[0_2px_4px_rgba(0,0,0,0.12)] flex items-center justify-center text-white font-black text-xs`}
        >
          {["A", "M", "J", "K", "S"][i]}
        </div>
      ))}
      <div className="w-9 h-9 rounded-full bg-[#4B4B4B] border-[2.5px] border-white shadow-[0_2px_4px_rgba(0,0,0,0.12)] flex items-center justify-center text-white font-black text-[10px]">
        +12M
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT PILL
   ───────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-[2px] border-black/[0.06] rounded-2xl px-3.5 py-2.5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
      <Icon className="w-4 h-4 text-[#58CC02]" strokeWidth={3} />
      <div>
        <div className="text-sm font-black text-[#4B4B4B] leading-none">{value}</div>
        <div className="text-[11px] font-bold text-[#777] uppercase tracking-wider mt-0.5">{label}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CTA BUTTON — 3D Duolingo Style
   ───────────────────────────────────────────── */
function CTAButton({
  children,
  variant = "primary",
  icon: Icon,
  href = "#",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: React.ElementType;
  href?: string;
}) {
  const [isPressed, setIsPressed] = useState(false);

  const styles = {
    primary: {
      bg: TOKENS.feather,
      shadow: TOKENS.featherShadow,
      text: "#FFFFFF",
      border: "none",
      hoverBg: "#68e003",
    },
    secondary: {
      bg: TOKENS.snow,
      shadow: TOKENS.swan,
      text: TOKENS.eel,
      border: `2px solid ${TOKENS.swan}`,
      hoverBg: TOKENS.polar,
    },
    ghost: {
      bg: "transparent",
      shadow: "none",
      text: TOKENS.macaw,
      border: `2px solid ${TOKENS.macaw}`,
      hoverBg: "#EEF9FF",
    },
  };

  const s = styles[variant];

  return (
    <motion.a
      href={href}
      className="relative inline-flex items-center justify-center gap-2 select-none focus-visible:outline-4 focus-visible:outline-[#1CB0F6] focus-visible:outline-offset-3 focus-visible:rounded-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ y: 4, scale: 0.98 }}
      onHoverStart={() => setIsPressed(false)}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        backgroundColor: s.bg,
        color: s.text,
        border: s.border,
        boxShadow: variant !== "ghost" ? `0 5px 0 ${s.shadow}` : "none",
        borderRadius: "16px",
        padding: "14px 28px",
        fontFamily:
          "'Nunito Sans', 'Varela Round', 'DIN Next Rounded', sans-serif",
        fontWeight: 800,
        fontSize: "14px",
        letterSpacing: "0.7px",
        textTransform: "uppercase",
        cursor: "pointer",
        transform: isPressed ? "translateY(5px)" : "none",
        boxSizing: "border-box",
        display: "inline-flex",
        width: "auto",
        textDecoration: "none",
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onFocus={() => setIsPressed(false)}
    >
      {Icon && <Icon className="w-5 h-5" strokeWidth={2.5} />}
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

/* ─────────────────────────────────────────────
   MARQUEE LOGOS
   ───────────────────────────────────────────── */
const LOGOS = [
  "Stripe",
  "Notion",
  "Figma",
  "Linear",
  "Vercel",
  "Supabase",
  "Raycast",
  "Arc",
];

function LogoMarquee() {
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-8 items-center"
        animate={{ x: [0, -LOGOS.length * 160] }}
        transition={{
          x: { repeat: Infinity, duration: 30, ease: "linear" },
        }}
      >
        {[...LOGOS, ...LOGOS].map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 text-lg font-extrabold text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors duration-300 select-none"
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   XP BAR — animated progress
   ───────────────────────────────────────────── */
function XPBar({ percent = 72 }: { percent?: number }) {
  return (
    <motion.div
      className="w-full bg-[#E5E5E5] rounded-full h-3 overflow-hidden border-[1.5px] border-black/5"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(to right, ${TOKENS.feather}, ${TOKENS.mask})`,
          boxShadow: `0 0 8px ${TOKENS.mask}66`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: percent / 100 }}
        transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HERO COMPONENT
   ───────────────────────────────────────────── */
export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4] via-[#FAFFFE] to-[#F7F7F7] min-h-screen"
      aria-labelledby="hero-heading"
      role="region"
    >
      {/* ── Decorative Blobs ───────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Large soft blob — feather green */}
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: `radial-gradient(circle, ${TOKENS.mask} 0%, transparent 70%)`,
            filter: "blur(60px)",
            x: mousePos.x * 30,
            y: mousePos.y * 30,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Macaw blob — top-right */}
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${TOKENS.macaw} 0%, transparent 70%)`,
            filter: "blur(60px)",
            x: mousePos.x * -25,
            y: mousePos.y * -25,
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Beetle blob — bottom-left */}
        <motion.div
          className="absolute bottom-0 -left-20 w-80 h-80 rounded-full opacity-15"
          style={{
            background: `radial-gradient(circle, ${TOKENS.beetle} 0%, transparent 70%)`,
            filter: "blur(60px)",
            x: mousePos.x * 20,
            y: mousePos.y * 20,
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Bee blob — bottom center */}
        <motion.div
          className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full opacity-15"
          style={{
            background: `radial-gradient(circle, ${TOKENS.bee} 0%, transparent 70%)`,
            filter: "blur(60px)",
            x: mousePos.x * -20,
            y: mousePos.y * -20,
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle, #4B4B4B12 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Main Container ───────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-8 xl:gap-16">

          {/* ── LEFT COLUMN ───────────────── */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none">
            {/* Announcement Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white border-[2px] border-black/[0.06] rounded-full px-4 py-2 shadow-[0_2px_0_rgba(0,0,0,0.04)] mb-6"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58CC02] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#58CC02]" />
              </span>
              <span className="text-xs font-extrabold text-[#4B4B4B] uppercase tracking-wider">
                Now with AI-powered learning paths ✨
              </span>
            </motion.div>

            {/* Big Headline */}
            <h1
              id="hero-heading"
              className="text-[clamp(2.6rem,5.5vw,4rem)] font-black text-[#2B2B2B] leading-[1.05] tracking-tight mb-5"
              style={{ fontFamily: "'Nunito', 'Varela Round', sans-serif" }}
            >
              <motion.span
                className="block"
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                Learn Anything.
              </motion.span>
              <motion.span
                className="block relative"
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <span className="relative inline-block">
                  Stay
                  <span
                    className="relative inline-block px-2 sm:px-3 mx-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${TOKENS.feather} 0%, ${TOKENS.mask} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Consistent.
                  </span>
                  {/* underline decoration */}
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8 C50 2, 100 2, 198 8"
                      stroke={TOKENS.feather}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.span>
            </h1>

            {/* Sub-heading paragraph */}
            <motion.p
              className="text-base sm:text-lg text-[#777] leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: "'Nunito Sans', 'Varela Round', sans-serif" }}
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              Master any skill through gamified learning, AI tutoring, and
              science-backed exercises. Join the world&apos;s most delightful
              learning platform — built for curious minds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-3 sm:gap-4 mb-8"
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <CTAButton variant="primary" icon={Rocket}>
                Start Learning Free
              </CTAButton>
              <CTAButton variant="secondary" icon={Play}>
                Watch Demo
              </CTAButton>
            </motion.div>

            {/* Social Proof Row */}
            <motion.div
              className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <AvatarStack />
              <div className="text-sm font-bold text-[#4B4B4B] leading-tight">
                <span className="flex items-center gap-1">
                  <Star
                    className="w-4 h-4 text-[#FFC800]"
                    fill="#FFC800"
                    strokeWidth={0}
                  />
                  4.9/5 from{" "}
                  <span className="font-black text-[#58CC02]">12M+</span>{" "}
                  ratings
                </span>
              </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="flex flex-wrap gap-3"
              custom={6}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <StatPill icon={Users} label="Learners" value="10M+" />
              <StatPill icon={BookOpen} label="Lessons" value="500M+" />
              <StatPill icon={GlobeIcon} label=" Languages" value="40+" />
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — VISUAL ─────── */}
          <div className="relative flex-shrink-0 w-full max-w-lg sm:max-w-xl lg:max-w-2xl flex items-center justify-center">
            {/* Parallax backdrop */}
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] opacity-40"
              style={{
                background: `radial-gradient(ellipse at center, ${TOKENS.mask}33 0%, transparent 70%)`,
                transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
                transition: "transform 0.3s ease-out",
              }}
            />

            {/* Hero Mosaic Mascot */}
            <motion.div
              className="relative z-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)` }}
            >
              <MosaicMascot />
            </motion.div>

            {/* Floating Card — XP Reward */}
            <motion.div
              className="absolute z-30 hidden sm:block"
              style={{ top: "4%", right: "-4%" }}
              animate={float}
              whileHover={{ scale: 1.08 }}
            >
              <div className="bg-white rounded-2xl border-[2.5px] border-black/10 p-3.5 shadow-[0_6px_0_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.12)] min-w-[140px]">
                {/* Top accent */}
                <div
                  className="absolute top-0 left-4 right-4 h-[3px] rounded-b-full"
                  style={{ backgroundColor: TOKENS.bee }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${TOKENS.bee}22` }}
                  >
                    <Star className="w-5 h-5" style={{ color: TOKENS.bee }} fill={TOKENS.bee} strokeWidth={0} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md text-[#FF9600] bg-[#FFF3E0]">
                    +2,450 XP
                  </span>
                </div>
                <p className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-1.5">
                  Lesson Complete!
                </p>
                <XPBar percent={85} />
              </div>
            </motion.div>

            {/* Floating Card — Streak */}
            <motion.div
              className="absolute z-30 hidden sm:block"
              style={{ bottom: "8%", left: "-8%" }}
              animate={floatSlow}
              whileHover={{ scale: 1.08 }}
            >
              <div className="bg-white rounded-2xl border-[2.5px] border-black/10 p-3.5 shadow-[0_6px_0_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.12)] min-w-[130px]">
                <div
                  className="absolute top-0 left-4 right-4 h-[3px] rounded-b-full"
                  style={{ backgroundColor: TOKENS.fox }}
                />
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-6 h-6" style={{ color: TOKENS.fox }} strokeWidth={2.5} />
                  <span className="text-xl font-black text-[#4B4B4B] leading-none">
                    247
                  </span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#777]">
                  Day Streak 🔥
                </p>
              </div>
            </motion.div>

            {/* Floating Card — Leaderboard */}
            <motion.div
              className="absolute z-30 hidden sm:block"
              style={{ top: "10%", left: "-6%" }}
              animate={floatSlower}
              whileHover={{ scale: 1.08 }}
            >
              <div className="bg-white rounded-2xl border-[2.5px] border-black/10 p-3.5 shadow-[0_6px_0_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.12)] min-w-[130px]">
                <div
                  className="absolute top-0 left-4 right-4 h-[3px] rounded-b-full"
                  style={{ backgroundColor: TOKENS.beetle }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5" style={{ color: TOKENS.beetle }} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#F3E8FF] text-[#CE82FF]">
                    #3
                  </span>
                </div>
                <p className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider mb-1">
                  Weekly Rank
                </p>
                <div className="flex items-center gap-1.5">
                  {["#58CC02", "#FFC800", "#1CB0F6"].map((c, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-white"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Card — Progress Goal */}
            <motion.div
              className="absolute z-30 hidden sm:block"
              style={{ top: "60%", right: "-8%" }}
              animate={floatSlowest}
              whileHover={{ scale: 1.08 }}
            >
              <div className="bg-white rounded-2xl border-[2.5px] border-black/10 p-3.5 shadow-[0_6px_0_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.12)] min-w-[140px]">
                <div
                  className="absolute top-0 left-4 right-4 h-[3px] rounded-b-full"
                  style={{ backgroundColor: TOKENS.macaw }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" style={{ color: TOKENS.macaw }} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#E3F2FD] text-[#1CB0F6]">
                    Daily Goal
                  </span>
                </div>
                <p className="text-lg font-black text-[#4B4B4B] leading-none mb-1.5">
                  8<span className="text-[#AFAFAF] font-bold">/10</span>
                </p>
                <XPBar percent={80} />
              </div>
            </motion.div>

            {/* Tiny Floating Gems */}
            {["💎", "⭐", "🏆", "🔥"].map((emoji, i) => (
              <motion.div
                key={i}
                className="absolute z-40 text-xl select-none pointer-events-none"
                style={{
                  top: `${20 + i * 18}%`,
                  right: `${5 + i * 5}%`,
                }}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.7,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── TRUSTED BY MARQUEE ─────────── */}
        <motion.div
          className="mt-16 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-[#AFAFAF] mb-6">
            Trusted by learners at
          </p>
          <LogoMarquee />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   INLINE ICON COMPONENT (avoids missing Lucide import)
   ───────────────────────────────────────────────────── */
function GlobeIcon({ className, ...props }: { className?: string; [key: string]: unknown }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
