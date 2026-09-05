import React from "react";
import { motion } from "framer-motion";

interface WhirlpoolLoaderProps {
  /** Number of spiral segments */
  segments?: number;
  /** Number of rotations of the spiral */
  rotations?: number;
  /** Color of the spiral dots */
  color?: string;
  /** Custom size (in pixels or Tailwind classes). Defaults to responsive fit. */
  size?: number | string;
}

const WhirlpoolLoader: React.FC<WhirlpoolLoaderProps> = ({
  segments = 50,
  rotations = 5,
  color = "#22d3ee",
  size = "100%",
}) => {
  // Compute dynamic width/height from `size`
  const computedSize =
    typeof size === "number" ? `${size}px` : size.includes("%") ? size : "100%";

  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        width={computedSize}
        height={computedSize}
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-[30vw] max-h-[30vh]"
      >
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: segments }).map((_, i) => {
            const angle = (i / segments) * Math.PI * 2 * rotations;
            const radius = 5 + (90 * i) / segments;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={2 + (i / segments) * 3}
                fill={color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: (i / segments) * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 1,
                }}
              />
            );
          })}
        </motion.g>
      </svg>
    </div>
  );
};

export const Component = () => (
  <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
    {/* Responsive wrapper ensures it scales naturally across all devices */}
    <div className="w-[60vw] max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
      <WhirlpoolLoader color="#22d3ee" segments={60} rotations={6} />
    </div>
  </div>
);


