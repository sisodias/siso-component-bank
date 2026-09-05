"use client";

import { motion, Variants } from "motion/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const VARIANTS: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: (i: number = 0) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Reveal({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.div
      variants={VARIANTS}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
