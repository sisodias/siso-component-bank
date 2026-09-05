// app/components/sections/Specs.tsx
'use client';

import React from 'react';
import {
  Speaker,
  Bluetooth,
  Battery,
  Radio,
  Activity,
  Zap,
  Music,
  Scale,
  LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Types ---
interface SpecItem {
  icon: LucideIcon;
  title: string;
  val: string;
  desc: string;
}

// --- Data ---
const specs: SpecItem[] = [
  {
    icon: Speaker,
    title: 'Driver Unit',
    val: '40mm Beryllium',
    desc: 'Precision‑tuned diaphragms for fast transients and deep, controlled low end.',
  },
  {
    icon: Bluetooth,
    title: 'Connectivity',
    val: 'Bluetooth 5.4',
    desc: 'Multi‑point pairing keeps your laptop and phone in sync without re‑pairing.',
  },
  {
    icon: Battery,
    title: 'Battery Life',
    val: '40 Hours ANC On',
    desc: 'Long sessions with ANC on, plus quick top‑ups from the case when you dock.',
  },
  {
    icon: Radio,
    title: 'Range',
    val: '100m Line of Sight',
    desc: 'Optimized antenna design for fewer dropouts in crowded, noisy RF spaces.',
  },
  {
    icon: Activity,
    title: 'Frequency',
    val: '4Hz – 40,000Hz',
    desc: 'Extended response captures both sub‑bass weight and subtle air up top.',
  },
  {
    icon: Zap,
    title: 'Charging',
    val: 'USB‑C Fast Charge',
    desc: '15 minutes on the cable is enough for a few extra hours of listening.',
  },
  {
    icon: Music,
    title: 'Codecs',
    val: 'LDAC, aptX HD, AAC',
    desc: 'High‑resolution wireless support when your device and service allow it.',
  },
  {
    icon: Scale,
    title: 'Weight',
    val: '240g',
    desc: 'Balanced clamp force and weight distribution for all‑day comfort.',
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  },
};

export const Specs = () => {
  return (
    <section
      id="specs"
      className="relative overflow-hidden bg-slate-50 py-24 text-slate-900 dark:bg-black dark:text-zinc-100 sm:py-32"
    >
      {/* Background Ambience (Dark Mode) */}
      <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-1/2 right-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-zinc-500"
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Sound architecture
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl"
          >
            Technical specifications
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-slate-600 dark:text-zinc-400"
          >
            Everything under the hood that makes SOUND PRO X feel effortless:
            from driver materials and codecs to the way it sips power over long
            sessions.
          </motion.p>
        </div>

        {/* Unified Specs Block */}
        <div className="mt-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            // The magic happens here: gap-[1px] combined with a background color creates the "borders"
            className="grid grid-cols-1 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-200 dark:border-zinc-800 dark:bg-zinc-800 gap-[1px] sm:grid-cols-2 lg:grid-cols-4"
          >
            {specs.map((spec, i) => (
              <motion.div
                key={spec.title}
                variants={itemVariants}
                className="group relative bg-white p-8 dark:bg-zinc-950/50 hover:z-10"
              >
                {/* Hover Glow Effect */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-emerald-500/5" />
                </div>

                <div className="relative flex flex-col gap-6">
                  {/* Icon Header */}
                  <div className="flex items-center justify-between">
                    <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-sky-600 transition-transform duration-300 group-hover:scale-110 dark:bg-zinc-900 dark:text-sky-400">
                      <spec.icon size={22} className="relative z-10" />
                      <div className="absolute inset-0 rounded-2xl bg-sky-400/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 dark:text-zinc-700">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                      {spec.title}
                    </h4>
                    <p className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                      {spec.val}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
                    {spec.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};