import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export const Component = ({
  text = "3D Text",
  color = "#ffffff",
  depth = 20,
}: {
  text?: string;
  color?: string;
  depth?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    }
  };

  const layers = Array.from({ length: depth }, (_, i) => (
    <span
      key={i}
      className="absolute left-0 top-0"
      style={{
        color,
        transform: `translateZ(${i}px)`,
        textShadow: `1px 1px 1px rgba(0,0,0,0.5)`,
      }}
    >
      {text}
    </span>
  ));

  return (
    <div
      ref={ref}
      className="w-full h-full flex items-center justify-center bg-black-900"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        className="text-6xl font-bold [transform-style:preserve-3d]"
        style={{
          rotateX,
          rotateY,
          textShadow: "0 0 10px rgba(0,0,0,0.5)",
        }}
      >
        {layers}
      </motion.div>
    </div>
  );
};