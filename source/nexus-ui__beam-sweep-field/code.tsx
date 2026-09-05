"use client";

import { motion } from "framer-motion";

export function BeamField() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950">
      <div className="lf-grid absolute inset-0 opacity-30" />
      <motion.div className="absolute inset-y-10 w-[2px] bg-gradient-to-b from-transparent via-cyan-300 to-transparent" animate={{ left: ["8%", "86%", "30%", "8%"] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}

export default BeamField;
