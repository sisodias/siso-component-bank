import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from: from,
  to: from + 360,
  ease: "linear",
  duration: duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: "speedUp" | "slowDown" | "pause" | "goBonkers" | string | null;
  className?: string;
}

const CircularText = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}: CircularTextProps) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    controls.start({
      rotate: currentRotation + 360,
      scale: 1,
      transition: getTransition(spinDuration, currentRotation),
    });
  }, [spinDuration, controls, text]);

  const handleHoverStart = () => {
    if (!onHover) return;

    let newSpinDuration = spinDuration;
    let newScale = 1;
    let shouldPause = false;

    switch (onHover) {
      case "slowDown":
        newSpinDuration = spinDuration * 2;
        break;
      case "speedUp":
        newSpinDuration = spinDuration / 4;
        break;
      case "pause":
        shouldPause = true;
        break;
      case "goBonkers":
        newSpinDuration = spinDuration / 20;
        newScale = 0.8;
        break;
      default:
        return;
    }

    if (shouldPause) {
      controls.start({
        rotate: currentRotation,
        scale: 1,
        transition: {
          rotate: { type: "spring", damping: 20, stiffness: 300, duration: 0.2 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        },
      });
    } else {
      controls.start({
        rotate: currentRotation + 360,
        scale: newScale,
        transition: getTransition(newSpinDuration, currentRotation),
      });
    }
  };

  const handleHoverEnd = () => {
    if (!onHover) return;
    controls.start({
      rotate: currentRotation + 360,
      scale: 1,
      transition: getTransition(spinDuration, currentRotation),
    });
  };

  return (
    <motion.div
      initial={{ rotate: 0 }}
      className={`mx-auto rounded-full w-[200px] h-[200px] font-black text-center cursor-pointer origin-center ${className}`}
      animate={controls}
      onUpdate={(latest) => {
        if (typeof latest.rotate === 'number') {
          setCurrentRotation(parseFloat(latest.rotate.toFixed(2)));
        }
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotation = (360 / letters.length) * i;
        const factor = Number((Math.PI / letters.length).toFixed(0));
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotation}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span
            key={i}
            className="absolute inline-block inset-0 text-2xl transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
