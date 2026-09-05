"use client";
import { motion } from "motion/react";
import { cn } from "../_utils/cn";
import React, { useState } from "react";

type LoginActivityProps = {
  cardTitle?: string;
  cardDescription?: string;
  data?: number[]; // last 10 bars
};

export const LoginActivity = ({
  cardTitle = "Login activity",
  cardDescription = "Recent successful sign-ins across regions.",
  data = [6, 4, 7, 5, 8, 9, 5, 7, 6, 10],
}: LoginActivityProps) => {
  const max = Math.max(1, ...data);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        "relative",
        "flex flex-col justify-between",
        "h-[20rem] w-[350px] max-w-[350px]",
        "rounded-md border bg-neutral-50 p-4 dark:bg-neutral-900",
      )}
    >
      <div>
        <h3 className="text-sm font-semibold text-primary">{cardTitle}</h3>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          {cardDescription}
        </p>
      </div>

      <div className="mt-4 flex h-40 items-end justify-between gap-2">
        {data.map((value, i) => {
          const height = (value / max) * 100;
          return (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0.6 }}
              animate={{
                height: `${height}%`,
                opacity: 1,
                scale: hovered ? 1.05 : 1,
                boxShadow: hovered
                  ? "0 8px 24px rgba(34, 211, 238, 0.25)"
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              className="w-6 rounded-sm bg-gradient-to-b from-primary/80 to-primary/60"
            />
          );
        })}
      </div>

      <motion.div
        className="mt-3 text-[10px] text-neutral-500"
        animate={{ opacity: hovered ? 1 : 0.8 }}
      >
        last 24h
      </motion.div>
    </motion.div>
  );
};

export default LoginActivity;


