"use client";
import { motion } from "motion/react";
import { cn } from "../_utils/cn";
import React, { useMemo, useState } from "react";

type AnomalyHeatmapProps = {
  rows?: number;
  cols?: number;
  cardTitle?: string;
  cardDescription?: string;
};

export const AnomalyHeatmap = ({
  rows = 6,
  cols = 10,
  cardTitle = "Anomaly heatmap",
  cardDescription = "Intensity of suspicious signals across time windows.",
}: AnomalyHeatmapProps) => {
  const [hovered, setHovered] = useState(false);
  const cells = useMemo(() => rows * cols, [rows, cols]);
  const data = useMemo(
    () => Array.from({ length: cells }, (_, i) => (Math.sin(i * 1.3) + 1) / 2),
    [cells],
  );

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

      <div
        className="mt-3 grid flex-1 place-items-center"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {data.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: hovered ? 1.05 : 1,
              backgroundColor: `rgba(34, 211, 238, ${0.15 + v * 0.7})`,
              boxShadow: hovered ? "inset 0 0 12px rgba(34,211,238,0.3)" : "none",
            }}
            transition={{ duration: 0.4, delay: (i % cols) * 0.03 }}
            className="m-[2px] h-5 w-6 rounded-[3px]"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AnomalyHeatmap;


