import { useRef, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Design tokens — flip THEME to "ivory" for the light variant.       */
/* ------------------------------------------------------------------ */
const THEME = "obsidian"; // "obsidian" | "ivory"

const PALETTE = {
  obsidian: {
    bg: "#0A0A0B",
    text: "#F5F3EE",
    muted: "#9C988F",
    line: "rgba(212,175,55,0.22)",
    auraA: "rgba(212,175,55,0.18)",
    auraB: "rgba(120,90,180,0.10)",
  },
  ivory: {
    bg: "#FDFBF7",
    text: "#1A1714",
    muted: "#6B655C",
    line: "rgba(212,175,55,0.35)",
    auraA: "rgba(212,175,55,0.24)",
    auraB: "rgba(212,175,55,0.10)",
  },
};

const GOLD = "#D4AF37";
const c = PALETTE[THEME];

// Use a transparent-PNG bottle render for the cleanest float.
const BOTTLE_IMG =
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1400&auto=format&fit=crop";

const FONT_SERIF = "'Cormorant Garamond', 'Times New Roman', serif";
const FONT_SANS = "'Jost', 'Helvetica Neue', sans-serif";

/* Stable particle field (computed once) */
const PARTICLES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: 1.5 + Math.random() * 3,
  delay: Math.random() * 6,
  dur: 7 + Math.random() * 9,
  drift: 30 + Math.random() * 55,
}));

/* Headline reveal — staggered clip-rise */
const lineWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } },
};
const lineUp = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
const Navbar = () => (
  <header className="absolute top-0 left-0 z-30 flex w-full items-center justify-between px-6 py-6 md:px-12 md:py-8">
    <button
      aria-label="Open menu"
      className="transition-opacity duration-300 hover:opacity-60"
      style={{ color: c.text }}
    >
      <Menu strokeWidth={1.25} className="h-5 w-5 md:h-6 md:w-6" />
    </button>

    <span
      className="select-none text-base md:text-lg"
      style={{
        fontFamily: FONT_SANS,
        color: c.text,
        letterSpacing: "0.42em",
        paddingLeft: "0.42em",
      }}
    >
      AURÉLIE
    </span>

    <div className="flex items-center gap-5" style={{ color: c.text }}>
      <button aria-label="Search" className="transition-opacity duration-300 hover:opacity-60">
        <Search strokeWidth={1.25} className="h-5 w-5 md:h-[22px] md:w-[22px]" />
      </button>
      <button aria-label="Cart" className="transition-opacity duration-300 hover:opacity-60">
        <ShoppingBag strokeWidth={1.25} className="h-5 w-5 md:h-[22px] md:w-[22px]" />
      </button>
    </div>
  </header>
);

/* ------------------------------------------------------------------ */
/*  Drifting gold dust                                                 */
/* ------------------------------------------------------------------ */
const Particles = ({ x, y, reduce }) => (
  <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ x, y }}>
    {PARTICLES.map((p) => (
      <motion.span
        key={p.id}
        className="absolute rounded-full"
        style={{
          left: `${p.left}%`,
          top: `${p.top}%`,
          width: p.size,
          height: p.size,
          background: GOLD,
          boxShadow: `0 0 ${p.size * 3}px ${GOLD}`,
        }}
        animate={reduce ? {} : { y: [0, -p.drift, 0], opacity: [0, 0.9, 0] }}
        transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Scent aura — breathing blob + slow rotating conic ring             */
/* ------------------------------------------------------------------ */
const ScentAura = ({ x, y, reduce }) => (
  <motion.div
    aria-hidden
    className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
    style={{ x, y }}
  >
    <motion.div
      className="absolute h-[70vh] w-[70vh] rounded-full blur-3xl md:h-[85vh] md:w-[85vh]"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${c.auraA} 0%, ${c.auraB} 45%, transparent 70%)`,
      }}
      animate={reduce ? {} : { scale: [1, 1.2, 1], opacity: [0.55, 0.9, 0.55] }}
      transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute h-[55vh] w-[55vh] rounded-full blur-2xl md:h-[65vh] md:w-[65vh]"
      style={{
        background: `conic-gradient(from 0deg, transparent 0%, ${c.auraA} 25%, transparent 50%, ${c.auraA} 75%, transparent 100%)`,
        opacity: 0.4,
      }}
      animate={reduce ? {} : { rotate: 360 }}
      transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export const Component = () => {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();

  // Pointer position, normalised -0.5 → 0.5
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 80, damping: 20, mass: 0.6 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);

  // Layered depth — each layer moves a different amount.
  const auraX = useTransform(sx, [-0.5, 0.5], [-55, 55]);
  const auraY = useTransform(sy, [-0.5, 0.5], [-40, 40]);
  const dustX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const dustY = useTransform(sy, [-0.5, 0.5], [-22, 22]);
  const textX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const textY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const bottleX = useTransform(sx, [-0.5, 0.5], [50, -50]);
  const bottleY = useTransform(sy, [-0.5, 0.5], [38, -38]);
  // 3D tilt on the bottle
  const rotY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotX = useTransform(sy, [-0.5, 0.5], [12, -12]);

  const handleMouse = (e) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetMouse = () => {
    mx.set(0);
    my.set(0);
  };

  const enter = useMemo(
    () => ({
      initial: { opacity: 0, scale: 1.06, filter: "blur(12px)" },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
      transition: { duration: 1.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] },
    }),
    []
  );

  return (
    <section
      ref={rootRef}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      className="relative w-full overflow-hidden"
      style={{
        height: "100vh",
        minHeight: "100dvh",
        backgroundColor: c.bg,
        color: c.text,
        perspective: 1200,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Jost:wght@300;400;500&display=swap');`}</style>

      <ScentAura x={auraX} y={auraY} reduce={reduce} />
      <Particles x={dustX} y={dustY} reduce={reduce} />
      <Navbar />

      {/* Asymmetric content */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-10 px-6 pt-24 pb-16 md:px-12 lg:flex-row lg:justify-between lg:gap-8 lg:pt-0 lg:pb-0">
        {/* Left — poetic copy (slight counter-parallax) */}
        <motion.div
          className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left"
          style={{ x: textX, y: textY }}
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 text-xs md:text-[13px]"
            style={{ fontFamily: FONT_SANS, color: GOLD, letterSpacing: "0.45em", paddingLeft: "0.45em" }}
          >
            EAU DE PARFUM · N°XXI
          </motion.span>

          <motion.h1
            variants={lineWrap}
            initial="hidden"
            animate="show"
            className="font-light leading-[0.94]"
            style={{ fontFamily: FONT_SERIF, fontSize: "clamp(2.9rem, 8vw, 6.2rem)" }}
          >
            <span className="block overflow-hidden">
              <motion.span variants={lineUp} className="block">
                A Whisper
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineUp} className="block">
                Worn as{" "}
                {/* shimmer sweep across the gold word */}
                <motion.span
                  style={{
                    fontStyle: "italic",
                    backgroundImage: `linear-gradient(110deg, ${GOLD} 0%, #FFF4CC 25%, ${GOLD} 50%, #B8902B 75%, ${GOLD} 100%)`,
                    backgroundSize: "250% 100%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                  animate={reduce ? {} : { backgroundPosition: ["0% 0%", "250% 0%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }}
                >
                  Light
                </motion.span>
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-md text-base leading-relaxed md:text-lg"
            style={{ fontFamily: FONT_SERIF, color: c.muted }}
          >
            Midnight orris, smoked amber and the quiet of dawn — a fragrance
            that lingers in the room long after you have left it.
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover="hover"
            className={cn("group relative mt-11 overflow-hidden px-10 py-4 text-xs md:text-[13px]")}
            style={{ fontFamily: FONT_SANS, border: `1px solid ${GOLD}`, color: c.text }}
          >
            <motion.span
              className="absolute inset-0 z-0"
              style={{ backgroundColor: GOLD }}
              variants={{ hover: { y: "0%" } }}
              initial={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="relative z-10 block"
              style={{ letterSpacing: "0.32em", paddingLeft: "0.32em" }}
              variants={{ hover: { letterSpacing: "0.42em", color: c.bg } }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              DISCOVER THE ELIXIR
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Right — floating + tilting bottle */}
        <motion.div
          className="relative flex shrink-0 items-center justify-center"
          style={{ x: bottleX, y: bottleY, rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          {...enter}
        >
          {/* ambient glow behind the bottle */}
          <motion.div
            aria-hidden
            className="absolute h-[72%] w-[72%] rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${c.auraA} 0%, transparent 70%)` }}
            animate={reduce ? {} : { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={BOTTLE_IMG}
            alt="AURÉLIE signature fragrance bottle"
            draggable={false}
            className="relative h-[44vh] w-auto select-none object-contain md:h-[62vh] lg:h-[72vh]"
            style={{ filter: "drop-shadow(0 35px 60px rgba(0,0,0,0.55))" }}
            animate={reduce ? {} : { y: [0, -16, 0], rotateZ: [-1.2, 1.2, -1.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* hairline base divider */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 z-20 h-px w-[82%] -translate-x-1/2"
        style={{ backgroundColor: c.line }}
      />
    </section>
  );
};

export default Component;