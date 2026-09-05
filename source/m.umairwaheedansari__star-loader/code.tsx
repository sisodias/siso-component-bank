"use client";
import { motion } from "framer-motion";

export default function StarPathLoader() {
  const arms = 5;        // star points (try 5 or 6)
  const step = 2;        // how you "skip" points to form the star (2 works for 5)
  const size = 96;       // svg viewport
  const r = 34;          // radius of the star path
  const color = "#6366f1"; // single accent (indigo-500)

  // Build a star polygon path visiting vertices in star order with rounded joins
  const toPath = () => {
    const pts = [];
    for (let i = 0; i < arms; i++) {
      const idx = (i * step) % arms;
      const a = (idx * (2 * Math.PI)) / arms - Math.PI / 2; // start at top
      const x = size / 2 + r * Math.cos(a);
      const y = size / 2 + r * Math.sin(a);
      pts.push([x, y]);
    }
    const [x0, y0] = pts[0];
    return `M ${x0} ${y0} ` + pts.slice(1).map(([x, y]) => `L ${x} ${y}`).join(" ") + " Z";
  };

  const d = toPath();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0b1120] to-[#111827]">
      <div className="relative">
        {/* soft center glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-24 h-24 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"
          style={{ background: `radial-gradient(circle, ${color}55 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* star path */}
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block"
        >
          <motion.g
            animate={{ rotate: [0, 360], scale: [1, 1.06, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <motion.path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinejoin="round"
              strokeLinecap="round"
              // optional trace effect (kept subtle)
              strokeDasharray="8 14"
              animate={{ strokeDashoffset: [0, -44] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              filter="url(#glow)"
            />
          </motion.g>

          {/* glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.6" />
            </filter>
          </defs>
        </motion.svg>
      </div>

      <motion.p
        className="absolute bottom-20 text-slate-300 text-sm uppercase tracking-[0.35em] font-light"
        animate={{
          opacity: [1, 0.3, 1],
          letterSpacing: ["0.35em", "0.5em", "0.35em"],
        }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Loading<span className="text-cyan-400">...</span>
      </motion.p>
    </div>
  );
}
