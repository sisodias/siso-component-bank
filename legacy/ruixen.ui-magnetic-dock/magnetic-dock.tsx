"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn";
import { Home, Search, Settings, User, Bell } from "lucide-react";
import { Card } from "./card";

const icons = [Home, Search, Bell, Settings, User];

type DockProps = {
  position?: "bottom" | "top" | "left";
};

export default function MagneticDock({ position = "bottom" }: DockProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getTranslate = (index: number) => {
    if (hoverIndex === null) return 0;
    const distance = index - hoverIndex;
    if (Math.abs(distance) > 2) return 0; // only nearby icons affected
    return -distance * 18; // smoother magnetic pull
  };

  return (
    <Card
      className={cn(
        "fixed flex gap-6 p-4 rounded-2xl shadow-xl backdrop-blur-xl",
        "bg-white/50 dark:bg-black/40 border border-white/20 dark:border-white/10",
        position === "bottom" &&
          "bottom-6 left-1/2 -translate-x-1/2 flex-row",
        position === "top" &&
          "top-6 left-1/2 -translate-x-1/2 flex-row",
        position === "left" &&
          "left-6 top-1/2 -translate-y-1/2 flex-col"
      )}
    >
      {icons.map((Icon, i) => (
        <motion.button
          key={i}
          className="relative flex items-center justify-center"
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
          animate={{
            y: position === "left" ? getTranslate(i) : 0,
            x: position !== "left" ? getTranslate(i) : 0,
            scale: hoverIndex === i ? 1.35 : 1,
          }}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
        >
          <Icon className="h-7 w-7 text-gray-700 dark:text-gray-200" />
        </motion.button>
      ))}
    </Card>
  );
}
