"use client";

import { motion, useMotionValue, useTransform } from "motion/react";

export const DraggableGradientIcon = () => {
  const dragX = useMotionValue(0);

  const xStops = [-100, 0, 100];

  const backgroundGradient = useTransform(dragX, xStops, [
    "linear-gradient(180deg, #ff008c 0%, #d309e1 100%)",
    "linear-gradient(180deg, #7700ff 0%, #4400ff 100%)",
    "linear-gradient(180deg, #e6ff00 0%, #03d100 100%)",
  ]);

  const strokeColor = useTransform(dragX, xStops, [
    "#d309e1",
    "#4400ff",
    "#03d100",
  ]);

  const tickProgress = useTransform(dragX, [10, 100], [0, 1]);
  const crossProgressA = useTransform(dragX, [-10, -55], [0, 1]);
  const crossProgressB = useTransform(dragX, [-50, -100], [0, 1]);

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        style={{ ...containerStyles, background: backgroundGradient }}
      >
        <motion.div
          className="icon-wrapper"
          style={{ ...boxStyles, x: dragX }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
        >
          <svg viewBox="0 0 50 50" className="progress-svg">
            {/* Circle */}
            <motion.path
              fill="none"
              strokeWidth={2}
              stroke={strokeColor}
              d="M 0,20 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0"
              style={{ x: 5, y: 5 }}
            />
            {/* Tick */}
            <motion.path
              fill="none"
              strokeWidth={2}
              stroke={strokeColor}
              d="M14,26 L22,33 L35,16"
              strokeDasharray="0 1"
              style={{ pathLength: tickProgress }}
            />
            {/* Cross A */}
            <motion.path
              fill="none"
              strokeWidth={2}
              stroke={strokeColor}
              d="M17,17 L33,33"
              strokeDasharray="0 1"
              style={{ pathLength: crossProgressA }}
            />
            {/* Cross B */}
            <motion.path
              fill="none"
              strokeWidth={2}
              stroke={strokeColor}
              d="M33,17 L17,33"
              strokeDasharray="0 1"
              style={{ pathLength: crossProgressB }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ================= Styles ================= */

const boxStyles: React.CSSProperties = {
  width: 140,
  height: 140,
  backgroundColor: "#f5f5f5",
  borderRadius: 20,
  padding: 20,
};

const containerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  width: 500,
  height: 300,
  maxWidth: "100%",
  borderRadius: 20,
};
