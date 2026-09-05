"use client";

import * as React from "react";
import {
  MinusIcon,
  PlusIcon,
  SunIcon,
  SunDimIcon,
  MoonIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";

export function BrightnessControl() {
  const [brightness, setBrightness] = React.useState(3);

  const decreaseBrightness = () => {
    if (brightness > 0) {
      setBrightness((prev) => prev - 1);
    }
  };

  const increaseBrightness = () => {
    if (brightness < 6) {
      setBrightness((prev) => prev + 1);
    }
  };

  const getBrightnessIcon = () => {
    if (brightness === 0) return MoonIcon;
    if (brightness < 3) return SunDimIcon;
    return SunIcon;
  };

  const dynamicOpacity = brightness === 0 ? 0.3 : 0.4 + (brightness / 6) * 0.6;

  const numberVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: dynamicOpacity, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 },
  };

  const buttonVariants = {
    tap: { scale: 0.9 },
    hover: { scale: 1.05 },
  };

  const Icon = getBrightnessIcon();

  return (
    <div
      className="inline-flex items-center"
      role="group"
      aria-labelledby="brightness-control"
    >
      <span id="brightness-control" className="sr-only">
        Brightness Control
      </span>

      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          className="rounded-full"
          variant="outline"
          size="icon"
          aria-label="Decrease brightness"
          onClick={decreaseBrightness}
          disabled={brightness === 0}
        >
          <MinusIcon size={16} aria-hidden="true" />
        </Button>
      </motion.div>

      <div
        className="flex items-center px-4 text-sm font-medium"
        aria-live="polite"
      >
        <div className="flex items-center">
          <motion.div
            key={`icon-${brightness}`}
            initial={{ opacity: dynamicOpacity }}
            animate={{ opacity: dynamicOpacity }}
            transition={{ duration: 0.2 }}
            className="mr-2"
          >
            <Icon size={16} aria-hidden="true" />
          </motion.div>

          <div className="relative h-6 w-4 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={brightness}
                className="absolute inset-0 flex items-center justify-center"
                variants={numberVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                aria-label={`Current brightness is ${brightness}`}
              >
                {brightness}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          className="rounded-full"
          variant="outline"
          size="icon"
          aria-label="Increase brightness"
          onClick={increaseBrightness}
          disabled={brightness === 6}
        >
          <PlusIcon size={16} aria-hidden="true" />
        </Button>
      </motion.div>
    </div>
  );
}
