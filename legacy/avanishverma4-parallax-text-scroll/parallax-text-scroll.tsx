import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";

// Wrap function (replacement for @motionone/utils)
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden -tracking-wider leading-[0.8] m-0 whitespace-nowrap flex flex-nowrap mt-[1px]">
      <motion.div 
        style={{ x }}
        className="font-semibold uppercase text-6xl flex whitespace-nowrap flex-nowrap will-change-transform"
      >
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
        <span className="block mr-8">{children} </span>
      </motion.div>
    </div>
  );
}

export default function ParallaxTextDemo() {
  return (
    <div 
      className="w-full min-h-screen bg-white text-gray-800 font-sans antialiased overflow-auto flex flex-col justify-center mt-[10px]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px'
      }}
    >
      {/* Parallax sections */}
      <section className="py-2 relative">
        <ParallaxText baseVelocity={-5}>Framer Motion</ParallaxText>
      </section>

      <section className="py-2 relative">
        <ParallaxText baseVelocity={5}>Scroll Velocity</ParallaxText>
      </section>

      <section className="py-2 relative">
        <ParallaxText baseVelocity={-3}>Smooth Animation</ParallaxText>
      </section>

      {/* Additional space for scrolling */}
      <div className="h-screen"></div>
    </div>
  );
}
