"use client";

import React from "react";
import { motion } from "framer-motion";

const GlowButton: React.FC<{ label?: string; icon?: string }> = ({
  label = "Ruvy Button",
  icon = "❤︎",
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 120, // lower stiffness = smoother
        damping: 12,    // more damping = less bounce
        mass: 0.4,
      }}
      className="
        group relative cursor-pointer border-0 rounded-full outline-none
        bg-gradient-to-b from-[#ADFF42] to-[#8BD93A]
        shadow-[inset_0_0.3rem_0.9rem_rgba(255,255,255,0.4),inset_0_-0.2rem_0.3rem_rgba(0,0,0,0.2),0_0_1.5rem_rgba(173,255,66,0.5)]
        hover:shadow-[0_0_2.5rem_rgba(173,255,66,0.8),inset_0_0.4rem_1rem_rgba(255,255,255,0.6)]
        active:translate-y-[2px]
        transition-shadow duration-500
      "
    >
      <div
        className="
          relative overflow-hidden rounded-full
          text-[25px] font-medium text-[#1A1A1A]
          px-[45px] py-[32px] transition-all duration-300
        "
      >
        <p
          className="
            flex items-center gap-3 m-0 transition-all duration-300
            translate-y-[2%]
            [mask-image:linear-gradient(to_bottom,white_40%,transparent)]
            group-hover:-translate-y-[4%]
          "
        >
          <span className="group-hover:hidden">{icon}</span>
          <span className="hidden group-hover:inline-block">✨</span>
          {label}
        </p>

        {/* Overlay layers */}
        <div
          className="
            absolute left-[-15%] right-[-15%] bottom-[25%] top-[-100%]
            rounded-full bg-white/20 transition-all duration-500
            group-hover:-translate-y-[5%]
          "
        />
        <div
          className="
            absolute left-[6%] right-[6%] top-[12%] bottom-[40%]
            rounded-t-[22px]
            shadow-[inset_0_10px_8px_-10px_rgba(255,255,255,0.9)]
            bg-gradient-to-b from-white/40 via-transparent to-transparent
            transition-all duration-500 group-hover:translate-y-[5%] group-hover:opacity-60
          "
        />
      </div>
    </motion.button>
  );
};

export default GlowButton;
