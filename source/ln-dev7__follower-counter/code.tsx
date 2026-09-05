// component.tsx
import * as React from "react";
import {
  MotionValue,
  motion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { useOnClickOutside } from "usehooks-ts";

export type PhotoType = {
  title: string;
  src: string;
};

interface FollowerMilestoneProps extends React.HTMLAttributes<HTMLDivElement> {
  targetCount: number;
  photos: PhotoType[];
  headerText: string;
  footerText: string;
}

const fontSize = 50;
const padding = 15;
const height = fontSize + padding;

function Number({ mv, number }: { mv: MotionValue; number: number }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center font-semibold"
    >
      {number}
    </motion.span>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums">
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <div
      style={{ fontSize }}
      className="flex items-center justify-center space-x-1 overflow-hidden rounded bg-white px-2 leading-none text-gray-900 dark:bg-white dark:text-gray-900"
    >
      <span className="font-semibold">+</span>
      <Digit place={1000} value={value} />
      <Digit place={100} value={value} />
      <Digit place={10} value={value} />
      <Digit place={1} value={value} />
    </div>
  );
}

const FollowerMilestone = React.forwardRef<
  HTMLDivElement,
  FollowerMilestoneProps
>(
  (
    { targetCount, photos, headerText, footerText, className, ...props },
    ref
  ) => {
    const [count, setCount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activePhoto, setActivePhoto] = useState<PhotoType | null>(null);
    const modalRef = useRef(null);

    useOnClickOutside(modalRef, () => setActivePhoto(null));

    useEffect(() => {
      const timer = setTimeout(() => {
        setCount(targetCount);
      }, 300);
      return () => clearTimeout(timer);
    }, [targetCount]);

    useEffect(() => {
      if (count === targetCount) {
        setShowConfetti(true);
      }
    }, [count, targetCount]);

    useEffect(() => {
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setActivePhoto(null);
        }
      }
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
      <div
        ref={ref}
        className={`relative flex w-full max-w-5xl flex-col items-center justify-center gap-10 md:flex-row md:justify-between md:gap-2 ${className}`}
        {...props}
      >
        <div className="flex flex-col items-center justify-center text-slate-900 dark:text-slate-900">
          <motion.h3
            className="w-full text-left text-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {headerText}
          </motion.h3>
          <Counter value={count} />
          <motion.p
            className="w-full text-right text-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {footerText}
          </motion.p>
        </div>
        <div className="grid w-full grid-cols-2 gap-4 md:w-[60%]">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.title}
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div
                className="relative h-44 w-full cursor-pointer after:absolute after:inset-0 after:z-10 after:rounded-2xl after:border-4 after:border-black/10"
                onClick={() => setActivePhoto(photo)}
                layoutId={`photo-${photo.title}`}
              >
                <img
                  className="h-full w-full rounded-2xl bg-slate-100 object-cover"
                  src={photo.src}
                  alt={photo.title}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {activePhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 h-full w-full bg-black/50 backdrop-blur-md"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activePhoto && (
            <div
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden p-4"
              ref={modalRef}
            >
              <motion.div
                className="pointer-events-auto relative left-0 h-96 w-full max-w-[600px] after:absolute after:inset-0 after:z-10 after:rounded-2xl after:border-4 after:border-black/10"
                layoutId={`photo-${activePhoto.title}`}
              >
                <img
                  className="h-full w-full rounded-2xl bg-slate-100 object-cover"
                  src={activePhoto.src}
                  alt={activePhoto.title}
                />
              </motion.div>
              <motion.button
                className="pointer-events-auto absolute right-4 top-4 z-30 rounded-full bg-zinc-900 p-3 text-white shadow-md transition-transform duration-300 active:scale-90 dark:bg-zinc-900"
                onClick={() => setActivePhoto(null)}
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: -20,
                  transition: { duration: 0.05 },
                }}
                layout
              >
                <X />
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {showConfetti && <Confetti />}
      </div>
    );
  }
);

FollowerMilestone.displayName = "FollowerMilestone";

export default FollowerMilestone;