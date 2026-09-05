"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative w-[300px] h-[250px] rounded-xl overflow-hidden p-[2px] bg-gradient-to-br from-neutral-800 via-neutral-900 to-black",
        className
      )}
    >
      {/* Moving halo */}
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-white/20 blur-xl"
        animate={{
          top: ["10%", "10%", "75%", "75%", "10%"],
          left: ["10%", "80%", "80%", "10%", "10%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner Card */}
      <div className="relative flex flex-col items-center justify-center w-full h-full rounded-lg border border-white/10 bg-gradient-to-br from-neutral-900/80 to-black/60 backdrop-blur-md">
        {/* Rotating Ray */}
        <motion.div
          className="absolute w-[220px] h-[50px] rounded-full bg-white/10 blur-2xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Value */}
        <motion.div
          className="text-5xl font-extrabold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent"
          animate={{
            textShadow: [
              "0 0 10px rgba(255,255,255,0.6)",
              "0 0 2px rgba(255,255,255,0.2)",
              "0 0 10px rgba(255,255,255,0.6)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {value}
        </motion.div>

        {/* Label */}
        <div className="mt-3 text-sm tracking-wide text-neutral-400">{label}</div>

        {/* Subtle lines */}
        <motion.div
          className="absolute top-[12%] w-[80%] h-[1px] bg-gradient-to-r from-white/30 to-transparent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[12%] w-[80%] h-[1px] bg-gradient-to-r from-transparent to-white/30"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
