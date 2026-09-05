"use client";

import { motion } from "framer-motion";

export function NebulaCta() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 px-10 py-16">
      <motion.div className="absolute size-40 rounded-full bg-cyan-400/25 blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.35] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.button whileHover={{ scale: 1.03 }} className="relative rounded-full bg-white px-6 py-2 text-sm font-semibold text-zinc-950">Start building</motion.button>
    </div>
  );
}

export default NebulaCta;
