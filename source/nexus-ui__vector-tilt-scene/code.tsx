"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function VectorTiltScene() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [12, -12]), {
    stiffness: 240,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-12, 12]), {
    stiffness: 240,
    damping: 22,
  });

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - bounds.left - bounds.width / 2);
        y.set(event.clientY - bounds.top - bounds.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-2xl"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Scene depth</p>
      <h3 className="mt-4 text-2xl font-semibold text-white">Vector Tilt Scene</h3>
      <p className="mt-2 text-sm text-zinc-400">
        A spring-driven glass panel for dimensional product highlights.
      </p>
    </motion.div>
  );
}

export default VectorTiltScene;
