"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ImageTrailImage = {
  src: string;
  alt?: string;
};

export type ImageTrailSettings = {
  /** How long (ms) each image stays visible before fading out. */
  duration?: number;
  /** Minimum cursor travel distance (px) before spawning the next image. */
  spacing?: number;
  /** Animation smoothness multiplier from 0–1. */
  smoothness?: number;
};

export type ImageTrailAppearance = {
  /** Width and height of each trail image (px). */
  imageSize?: number;
  /** Border radius of each image (px). */
  cornerRadius?: number;
  /** CSS object-fit used by the image. */
  objectFit?: "cover" | "contain";
};

export type ImageTrailAnimation = {
  /** Fade-in duration (seconds). */
  fadeInDuration?: number;
  /** Fade-out duration (seconds). */
  fadeOutDuration?: number;
  /** Blur applied on entry (px). */
  fadeInBlur?: number;
  /** Blur applied on exit (px). */
  fadeOutBlur?: number;
};

export type ImageTrailMagneticSettings = {
  /** Strength multiplier of the magnetic force from 0–1. */
  magneticStrength?: number;
  /** Max distance (px) at which magnetic force kicks in. */
  magneticRadius?: number;
};

export type ImageTrailProps = {
  /** Images cycled through as the cursor moves. */
  images?: ImageTrailImage[];
  /** Framer-style grouped trail controls. */
  trailSettings?: ImageTrailSettings;
  /** Framer-style grouped appearance controls. */
  appearance?: ImageTrailAppearance;
  /** Framer-style grouped animation controls. */
  animation?: ImageTrailAnimation;
  /** Enable magnetic pull of trail images toward the cursor. */
  magneticEffect?: boolean;
  /** Framer-style grouped magnetic controls. */
  magneticSettings?: ImageTrailMagneticSettings;
  /** Render a deterministic static preview instead of listening to pointer movement. */
  staticPreview?: boolean;
  /** Max number of live trail images kept in state. */
  maxTrailImages?: number;
  /** className applied to the root container. */
  className?: string;
  /** Foreground content rendered above the trail layer. */
  children?: React.ReactNode;

  /** Flat prop aliases kept for copy-paste ergonomics and backward compatibility. */
  spacing?: number;
  duration?: number;
  smoothness?: number;
  imageSize?: number;
  cornerRadius?: number;
  objectFit?: "cover" | "contain";
  fadeInDuration?: number;
  fadeOutDuration?: number;
  fadeInBlur?: number;
  fadeOutBlur?: number;
  magneticRadius?: number;
  magneticStrength?: number;
};

type TrailEntry = {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  imageIndex: number;
};

const DEFAULT_IMAGES: ImageTrailImage[] = [
  {
    src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
    alt: "Trail image 1",
  },
  {
    src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
    alt: "Trail image 2",
  },
  {
    src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
    alt: "Trail image 3",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function ImageTrail({
  images = DEFAULT_IMAGES,
  trailSettings,
  appearance,
  animation,
  magneticEffect = false,
  magneticSettings,
  staticPreview = false,
  maxTrailImages = 36,
  className,
  children,
  spacing,
  duration,
  smoothness,
  imageSize,
  cornerRadius,
  objectFit,
  fadeInDuration,
  fadeOutDuration,
  fadeInBlur,
  fadeOutBlur,
  magneticRadius,
  magneticStrength,
}: ImageTrailProps) {
  const reduceMotion = useReducedMotion() === true;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const lastPositionRef = React.useRef({ x: 0, y: 0 });
  const imageIdRef = React.useRef(0);
  const imageIndexRef = React.useRef(0);
  const [trailImages, setTrailImages] = React.useState<TrailEntry[]>([]);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const resolvedDuration = Math.max(120, duration ?? trailSettings?.duration ?? 1000);
  const resolvedSpacing = Math.max(4, spacing ?? trailSettings?.spacing ?? 40);
  const resolvedSmoothness = clamp(smoothness ?? trailSettings?.smoothness ?? 0.7, 0, 1);
  const resolvedImageSize = Math.max(20, imageSize ?? appearance?.imageSize ?? 100);
  const resolvedCornerRadius = Math.max(0, cornerRadius ?? appearance?.cornerRadius ?? 4);
  const resolvedObjectFit = objectFit ?? appearance?.objectFit ?? "cover";
  const resolvedFadeInDuration = Math.max(0.05, fadeInDuration ?? animation?.fadeInDuration ?? 0.3);
  const resolvedFadeOutDuration = Math.max(0.05, fadeOutDuration ?? animation?.fadeOutDuration ?? 0.5);
  const resolvedFadeInBlur = Math.max(0, fadeInBlur ?? animation?.fadeInBlur ?? 0);
  const resolvedFadeOutBlur = Math.max(0, fadeOutBlur ?? animation?.fadeOutBlur ?? 5);
  const resolvedMagneticStrength = clamp(
    magneticStrength ?? magneticSettings?.magneticStrength ?? 0.3,
    0,
    1,
  );
  const resolvedMagneticRadius = Math.max(
    20,
    magneticRadius ?? magneticSettings?.magneticRadius ?? 100,
  );

  const addTrailImage = React.useCallback(
    (x: number, y: number) => {
      if (images.length === 0) return;
      const nextPosition = { x, y };
      if (distance(nextPosition, lastPositionRef.current) < resolvedSpacing) return;

      lastPositionRef.current = nextPosition;

      React.startTransition(() => {
        setTrailImages((previous) => {
          const next: TrailEntry = {
            id: imageIdRef.current,
            x,
            y,
            timestamp: Date.now(),
            imageIndex: imageIndexRef.current % images.length,
          };
          imageIdRef.current += 1;
          imageIndexRef.current += 1;
          return [next, ...previous].slice(0, Math.max(1, maxTrailImages));
        });
      });
    },
    [images.length, maxTrailImages, resolvedSpacing],
  );

  const updateFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setMousePosition({ x, y });
      addTrailImage(x, y);
    },
    [addTrailImage],
  );

  const handleMouseMove = React.useCallback(
    (event: MouseEvent) => {
      updateFromPointer(event.clientX, event.clientY);
    },
    [updateFromPointer],
  );

  const handleTouchMove = React.useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      event.preventDefault();
      updateFromPointer(touch.clientX, touch.clientY);
    },
    [updateFromPointer],
  );

  React.useEffect(() => {
    if (staticPreview) return;
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove, staticPreview]);

  React.useEffect(() => {
    if (staticPreview) return;
    const interval = window.setInterval(() => {
      const now = Date.now();
      React.startTransition(() => {
        setTrailImages((previous) =>
          previous.filter((image) => now - image.timestamp < resolvedDuration),
        );
      });
    }, 50);

    return () => window.clearInterval(interval);
  }, [resolvedDuration, staticPreview]);

  React.useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });
  }, [images]);

  const calculateMagneticOffset = React.useCallback(
    (imageX: number, imageY: number) => {
      if (!magneticEffect) return { x: 0, y: 0 };
      const dx = mousePosition.x - imageX;
      const dy = mousePosition.y - imageY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > resolvedMagneticRadius) return { x: 0, y: 0 };

      const force = (resolvedMagneticRadius - dist) / resolvedMagneticRadius;
      return {
        x: dx * force * resolvedMagneticStrength,
        y: dy * force * resolvedMagneticStrength,
      };
    },
    [magneticEffect, mousePosition, resolvedMagneticRadius, resolvedMagneticStrength],
  );

  const previewTrail = React.useMemo<TrailEntry[]>(() => {
    if (!staticPreview || images.length === 0) return [];
    return Array.from({ length: Math.min(images.length, 5) }, (_, index) => ({
      id: index,
      x: 100 + index * resolvedSpacing * 0.8,
      y: 110 + index * 20,
      timestamp: 0,
      imageIndex: index % images.length,
    }));
  }, [images.length, resolvedSpacing, staticPreview]);

  const entries = staticPreview ? previewTrail : trailImages;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        !staticPreview && "cursor-none touch-none",
        "transform-[translateZ(0)] backface-hidden",
        className,
      )}
    >
      {children ? <div className="relative z-10">{children}</div> : null}
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => {
          const image = images[entry.imageIndex];
          if (!image) return null;
          const magneticOffset = calculateMagneticOffset(entry.x, entry.y);
          const staticOpacity = Math.max(0.2, 1 - index * 0.15);

          return (
            <motion.div
              key={entry.id}
              initial={
                reduceMotion || staticPreview
                  ? { opacity: staticPreview ? staticOpacity : 0.7 }
                  : {
                      opacity: 1,
                      scale: 0.8,
                      filter: `blur(${resolvedFadeInBlur}px)`,
                    }
              }
              animate={
                reduceMotion || staticPreview
                  ? {
                      opacity: staticPreview ? staticOpacity : 0.7,
                      x: staticPreview ? 0 : magneticOffset.x,
                      y: staticPreview ? 0 : magneticOffset.y,
                      filter: `blur(${resolvedFadeInBlur}px)`,
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                      x: magneticOffset.x,
                      y: magneticOffset.y,
                    }
              }
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      scale: 0.5,
                      filter: `blur(${resolvedFadeOutBlur}px)`,
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : {
                      duration: resolvedSmoothness * resolvedFadeInDuration * 0.8,
                      ease: "easeOut",
                      opacity: { duration: resolvedFadeOutDuration * 0.7, ease: "easeIn" },
                      x: { duration: 0.1, ease: "easeOut" },
                      y: { duration: 0.1, ease: "easeOut" },
                    }
              }
              style={{
                position: "absolute",
                left: entry.x - resolvedImageSize / 2,
                top: entry.y - resolvedImageSize / 2,
                width: resolvedImageSize,
                height: resolvedImageSize,
                pointerEvents: "none",
                zIndex: entries.length - index,
                willChange: "transform, opacity, filter",
                transform: "translateZ(0)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt ?? ""}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: resolvedObjectFit,
                  borderRadius: resolvedCornerRadius,
                  display: "block",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export const MagneticImageTrail = ImageTrail;

export default ImageTrail;