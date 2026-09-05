"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TextRevealCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  children?: React.ReactNode;
  revealContent?: React.ReactNode;
  className?: string;
  revealClassName?: string;
  intensity?: number;
  disabled?: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function TextRevealCard({
  title,
  description,
  icon,
  image,
  children,
  revealContent,
  className,
  revealClassName,
  intensity = 1,
  disabled = false,
}: TextRevealCardProps) {
  const reduceMotion = useReducedMotion() === true;
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = React.useState(false);
  const [isTouchRevealed, setIsTouchRevealed] = React.useState(false);
  const [revealProgress, setRevealProgress] = React.useState(0);
  const [pointerRatio, setPointerRatio] = React.useState(0);
  const [isCoarsePointer, setIsCoarsePointer] = React.useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const safeIntensity = clamp(intensity, 0.5, 2.2);

  const radialGlow = useMotionTemplate`radial-gradient(${280 * safeIntensity}px circle at ${x}px ${y}px, hsl(var(--primary) / 0.35), transparent 70%)`;
  const revealMask = useMotionTemplate`linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) calc(${x}px - 14px), rgba(255,255,255,0.95) calc(${x}px - 2px), rgba(255,255,255,0.28) calc(${x}px + 16px), rgba(255,255,255,0) calc(${x}px + 56px), rgba(255,255,255,0) 100%)`;
  const revealWidth = useMotionTemplate`calc(${x}px + 18px)`;
  const swarmField = useMotionTemplate`radial-gradient(1.3px 1.3px at calc(${x}px + 10px) calc(100% - 68px), rgba(255,255,255,0.9), transparent 74%),
    radial-gradient(1.1px 1.1px at calc(${x}px + 18px) calc(100% - 60px), rgba(255,255,255,0.78), transparent 74%),
    radial-gradient(1.5px 1.5px at calc(${x}px + 26px) calc(100% - 72px), rgba(191,219,254,0.88), transparent 74%),
    radial-gradient(1px 1px at calc(${x}px + 34px) calc(100% - 52px), rgba(255,255,255,0.72), transparent 74%),
    radial-gradient(1.2px 1.2px at calc(${x}px + 46px) calc(100% - 66px), rgba(191,219,254,0.84), transparent 74%),
    radial-gradient(1.4px 1.4px at calc(${x}px + 58px) calc(100% - 58px), rgba(255,255,255,0.8), transparent 74%),
    radial-gradient(1.1px 1.1px at calc(${x}px + 70px) calc(100% - 70px), rgba(191,219,254,0.78), transparent 74%),
    radial-gradient(1px 1px at calc(${x}px + 82px) calc(100% - 48px), rgba(255,255,255,0.68), transparent 74%),
    radial-gradient(1.2px 1.2px at calc(${x}px + 96px) calc(100% - 64px), rgba(191,219,254,0.72), transparent 74%)`;
  const swarmFieldSoft = useMotionTemplate`radial-gradient(2.5px 2.5px at calc(${x}px + 18px) calc(100% - 62px), rgba(255,255,255,0.32), transparent 70%),
    radial-gradient(2.2px 2.2px at calc(${x}px + 44px) calc(100% - 72px), rgba(191,219,254,0.3), transparent 72%),
    radial-gradient(2.4px 2.4px at calc(${x}px + 74px) calc(100% - 56px), rgba(255,255,255,0.28), transparent 72%)`;

  React.useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsCoarsePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function updatePointer(clientX: number, clientY: number) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const progress = clamp((localY - rect.height * 0.5) / (rect.height * 0.5), 0, 1);
    const ratio = clamp(localX / rect.width, 0, 1);
    x.set(localX);
    y.set(localY);
    setRevealProgress(progress);
    setPointerRatio(ratio);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    setIsActive(true);
    setIsTouchRevealed(false);
    updatePointer(e.clientX, e.clientY);
  }

  function onPointerLeave() {
    setIsActive(false);
    setRevealProgress(0);
    setPointerRatio(0);
  }

  function onTapToggle() {
    if (disabled || !isCoarsePointer) return;
    setIsTouchRevealed((v) => !v);
    setIsActive(false);
    setRevealProgress((v) => (v > 0 ? 0 : 1));
    setPointerRatio((v) => (v > 0 ? 0 : 1));
  }

  const showReveal = !disabled && (isTouchRevealed || isActive);
  const revealOpacity = reduceMotion
    ? showReveal
      ? 1
      : 0
    : showReveal
      ? clamp(0.68 + revealProgress * 0.32, 0, 1)
      : 0;
  const revealY = reduceMotion ? 0 : showReveal ? 0 : 18;
  const edgeFade = clamp(1 - (pointerRatio - 0.76) / 0.24, 0, 1);

  return (
    <motion.article
      ref={ref}
      tabIndex={0}
      role="button"
      aria-label={title}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onTapToggle}
      onFocus={() => {
        if (!disabled) {
          setIsTouchRevealed(true);
          setRevealProgress(1);
        }
      }}
      onBlur={() => {
        setIsTouchRevealed(false);
        setIsActive(false);
        setRevealProgress(0);
      }}
      className={cn(
        "group relative isolate overflow-hidden rounded-3xl border border-border/70 bg-card text-card-foreground shadow-[0_18px_45px_-30px_rgba(15,23,42,0.5)] outline-none transition focus-visible:ring-2 focus-visible:ring-primary/45",
        disabled ? "cursor-default opacity-80" : "cursor-pointer hover:-translate-y-0.5",
        className,
      )}
      animate={{
        y: disabled ? 0 : showReveal ? -2 : 0,
        boxShadow: showReveal
          ? "0 26px 65px -35px rgba(2,132,199,0.45)"
          : "0 18px 45px -30px rgba(15,23,42,0.5)",
      }}
      transition={{ duration: reduceMotion ? 0.1 : 0.22, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-primary/[0.08] via-transparent to-transparent" />
      {!disabled && !reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ backgroundImage: radialGlow, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      ) : null}

      <div className="relative z-10">
        {(image || children) && (
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/60">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : null}
            {children ? <div className="absolute inset-0">{children}</div> : null}
          </div>
        )}

        <div className="space-y-2 p-5">
          <div className="flex items-center gap-2.5">
            {icon ? (
              <span className="inline-flex size-8 items-center justify-center rounded-xl border border-border/70 bg-muted/50">
                {icon}
              </span>
            ) : null}
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          </div>
          {revealContent ? (
            <p className="text-sm leading-relaxed text-muted-foreground/85">{description}</p>
          ) : null}
        </div>

        <motion.div
          className={cn(
            "relative overflow-hidden border-t border-border/60 bg-gradient-to-t from-primary/[0.12] via-background/80 to-background/30 px-5 pb-5 pt-4",
            revealClassName,
          )}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: reduceMotion ? 0.1 : 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          {!reduceMotion && showReveal ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[11]"
              style={{ backgroundImage: swarmField }}
              animate={{
                opacity: clamp(revealOpacity * edgeFade * 1.1, 0, 1),
                x: [0, 14, -8, 22, 0],
                y: [0, -4, 5, -3, 0],
                scale: [1, 1.06, 0.98, 1.04, 1],
              }}
              transition={{ duration: 1.45, ease: "easeInOut", repeat: Infinity }}
            />
          ) : null}

          {!reduceMotion && showReveal ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[10] blur-[0.5px]"
              style={{ backgroundImage: swarmFieldSoft }}
              animate={{
                opacity: clamp(revealOpacity * edgeFade * 0.85, 0, 1),
                x: [0, -10, 12, -6, 0],
                y: [0, 3, -5, 4, 0],
                scale: [1.02, 0.98, 1.08, 1, 1.02],
              }}
              transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
            />
          ) : null}

          {!reduceMotion && showReveal ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute top-2 bottom-2 z-20 w-[2px] rounded-full bg-gradient-to-b from-white/25 via-white to-sky-200/30"
              style={{
                left: x,
                boxShadow:
                  "0 0 0.45rem rgba(255,255,255,0.8), 0 0 1rem rgba(147,197,253,0.65), 0 0 1.8rem rgba(56,189,248,0.4)",
              }}
              animate={{ opacity: showReveal ? revealOpacity * edgeFade : 0 }}
              transition={{ duration: 0.16 }}
            />
          ) : null}

          {!reduceMotion && showReveal ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute top-2 bottom-2 z-[19] w-5 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(125,211,252,0.35),transparent_72%)] blur-sm"
              style={{ left: x }}
              animate={{ opacity: showReveal ? clamp(revealOpacity * edgeFade * 0.9, 0, 1) : 0 }}
              transition={{ duration: 0.16 }}
            />
          ) : null}

          {typeof revealContent === "string" ? (
            <div className="relative">
              <p className="leading-[1.05] text-white/35">{revealContent}</p>
              <motion.p
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 overflow-hidden whitespace-nowrap leading-[1.05] text-white"
                style={
                  reduceMotion
                    ? undefined
                    : {
                        width: revealWidth,
                        WebkitMaskImage:
                          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(100% - 24px), rgba(0,0,0,0) 100%)",
                        maskImage:
                          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(100% - 24px), rgba(0,0,0,0) 100%)",
                      }
                }
                animate={{ opacity: showReveal ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
              >
                {revealContent}
              </motion.p>
            </div>
          ) : revealContent ? (
            <motion.div
              className="relative"
              style={
                reduceMotion
                  ? undefined
                  : {
                      WebkitMaskImage: revealMask,
                      maskImage: revealMask,
                    }
              }
              animate={{ opacity: showReveal ? revealOpacity : 0.2 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
            >
              {revealContent}
            </motion.div>
          ) : (
            <div className="relative">
              <p className="text-sm leading-relaxed text-muted-foreground/75">{description}</p>
              <motion.p
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 overflow-hidden whitespace-nowrap text-sm leading-relaxed text-foreground dark:text-white"
                style={
                  reduceMotion
                    ? undefined
                    : {
                        width: revealWidth,
                        WebkitMaskImage:
                          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(100% - 24px), rgba(0,0,0,0) 100%)",
                        maskImage:
                          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) calc(100% - 24px), rgba(0,0,0,0) 100%)",
                      }
                }
                animate={{ opacity: showReveal ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
              >
                {description}
              </motion.p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.article>
  );
}

export default TextRevealCard;
