import React, { useState, useRef, ElementRef } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { Volume1, VolumeX } from "lucide-react";

const MAX_OVERFLOW = 50;

export const Component = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 dark">
      <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
        <h1 className="text-2xl font-bold mb-4 text-center text-foreground">
          Volume Slider
        </h1>
        <Slider />
      </div>
    </div>
  );
};

const Slider: React.FC = () => {
  const [volume, setVolume] = useState(50);
  const ref = useRef<ElementRef<typeof RadixSlider.Root>>(null);
  const [region, setRegion] = useState<"left" | "middle" | "right">("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  useMotionValueEvent(clientX, "change", (latest) => {
    if (ref.current) {
      const { left, right } = ref.current.getBoundingClientRect();
      let newValue: number;

      if (latest < left) {
        setRegion("left");
        newValue = left - latest;
      } else if (latest > right) {
        setRegion("right");
        newValue = latest - right;
      } else {
        setRegion("middle");
        newValue = 0;
      }

      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  return (
    <motion.div
      onHoverStart={() => animate(scale, 1.2)}
      onHoverEnd={() => animate(scale, 1)}
      onTouchStart={() => animate(scale, 1.2)}
      onTouchEnd={() => animate(scale, 1)}
      style={{
        scale,
        opacity: useTransform(scale, [1, 1.2], [0.7, 1]),
      }}
      className="flex w-full touch-none select-none items-center justify-center gap-3"
    >
      <motion.div
        animate={{
          scale: region === "left" ? [1, 1.4, 1] : 1,
          transition: { duration: 0.25 },
        }}
        style={{
          x: useTransform(() =>
            region === "left" ? -overflow.get() / scale.get() : 0,
          ),
        }}
      >
        {region === "left" ? (
          <VolumeX className="h-6 w-6 text-primary" />
        ) : (
          <VolumeX className="h-6 w-6 text-muted-foreground" />
        )}
      </motion.div>

      <RadixSlider.Root
        ref={ref}
        value={[volume]}
        onValueChange={([v]) => setVolume(Math.floor(v))}
        step={1}
        min={0}
        max={100}
        className="relative flex w-full max-w-[200px] grow cursor-grab touch-none select-none items-center py-4 active:cursor-grabbing"
        onPointerMove={(e) => {
          if (e.buttons > 0) {
            clientX.jump(e.clientX);
          }
        }}
        onLostPointerCapture={() => {
          animate(overflow, 0, { type: "spring", bounce: 0.5 });
        }}
      >
        <motion.div
          style={{
            scaleX: useTransform(() => {
              if (ref.current) {
                const { width } = ref.current.getBoundingClientRect();
                return 1 + overflow.get() / width;
              }
              return 1;
            }),
            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
            transformOrigin: useTransform(() => {
              if (ref.current) {
                const { left, width } = ref.current.getBoundingClientRect();
                return clientX.get() < left + width / 2 ? "right" : "left";
              }
              return "left";
            }),
            height: useTransform(scale, [1, 1.2], [6, 12]),
            marginTop: useTransform(scale, [1, 1.2], [0, -3]),
            marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
          }}
          className="flex grow"
        >
          <RadixSlider.Track className="relative isolate h-full grow overflow-hidden rounded-full bg-muted">
            <RadixSlider.Range className="absolute h-full bg-primary" />
          </RadixSlider.Track>
        </motion.div>
        <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-primary shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
      </RadixSlider.Root>

      <motion.div
        animate={{
          scale: region === "right" ? [1, 1.4, 1] : 1,
          transition: { duration: 0.25 },
        }}
        style={{
          x: useTransform(() =>
            region === "right" ? overflow.get() / scale.get() : 0,
          ),
        }}
      >
        {region === "right" ? (
          <Volume1 className="h-6 w-6 text-primary" />
        ) : (
          <Volume1 className="h-6 w-6 text-muted-foreground" />
        )}
      </motion.div>
    </motion.div>
  );
};

function decay(value: number, max: number): number {
  if (max === 0) {
    return 0;
  }

  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);

  return sigmoid * max;
}