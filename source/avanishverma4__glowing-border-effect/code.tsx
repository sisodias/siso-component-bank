import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  Box,
  Lock,
  Search,
  Settings,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";

/* -----------------------------------------------------------------------------
 * Utils
 * ---------------------------------------------------------------------------*/

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/* -----------------------------------------------------------------------------
 * Glowing Effect
 * ---------------------------------------------------------------------------*/

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    const handleMove = useCallback(
      (event?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
          const el = containerRef.current;
          if (!el) return;

          const { left, top, width, height } = el.getBoundingClientRect();

          const mouseX =
            event && "x" in event
              ? (event as any).x
              : lastPosition.current.x;
          const mouseY =
            event && "y" in event
              ? (event as any).y
              : lastPosition.current.y;

          if (event) lastPosition.current = { x: mouseX, y: mouseY };

          const centerX = left + width * 0.5;
          const centerY = top + height * 0.5;

          const distance = Math.hypot(mouseX - centerX, mouseY - centerY);
          const inactiveRadius =
            0.5 * Math.min(width, height) * inactiveZone;

          if (distance < inactiveRadius) {
            el.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          el.style.setProperty("--active", isActive ? "1" : "0");
          if (!isActive) return;

          const currentAngle =
            parseFloat(el.style.getPropertyValue("--start")) || 0;

          const targetAngle =
            (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI +
            90;

          const angleDiff =
            ((targetAngle - currentAngle + 180) % 360) - 180;

          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) =>
              el.style.setProperty("--start", String(value)),
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const onScroll = () => handleMove();
      const onPointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", onScroll, { passive: true });
      document.body.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        window.removeEventListener("scroll", onScroll);
        document.body.removeEventListener("pointermove", onPointerMove);
      };
    }, [handleMove, disabled]);

    const styleVars: React.CSSProperties = {
      "--blur": `${blur}px`,
      "--spread": spread,
      "--start": "0",
      "--active": "0",
      "--glowingeffect-border-width": `${borderWidth}px`,
      "--repeating-conic-gradient-times": "5",
      "--gradient":
        variant === "white"
          ? `repeating-conic-gradient(
              from 236.84deg at 50% 50%,
              rgba(255,255,255,0.1),
              rgba(255,255,255,0.1) calc(25% / var(--repeating-conic-gradient-times))
            )`
          : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
             radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
             radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), 
             radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
             repeating-conic-gradient(
               from 236.84deg at 50% 50%,
               #dd7bbb 0%,
               #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
               #5a922c calc(50% / var(--repeating-conic-gradient-times)), 
               #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
               #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
             )`,
    } as React.CSSProperties;

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white/20",
            disabled && "!block"
          )}
        />

        <div
          ref={containerRef}
          style={styleVars}
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)]",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow rounded-[inherit]",
              'after:content-[""] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))] after:rounded-[inherit]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

/* -----------------------------------------------------------------------------
 * Grid Item
 * ---------------------------------------------------------------------------*/

interface GridItemProps {
  area: string;
  icon: ReactNode;
  title: string;
  description: ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <li
      className={cn("group list-none min-h-[14rem] perspective-[1000px]", area)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full rounded-[1.25rem] border-[0.75px] border-border/40 p-2 transition-transform duration-200 ease-out md:rounded-[1.5rem] md:p-3"
      >
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />

        <div
          style={{ transform: "translateZ(20px)" }}
          className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-border/40 bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]"
        >
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <motion.div
              whileHover={{
                scale: 1.15,
                rotate: 12,
                transition: { type: "spring", stiffness: 300, damping: 10 },
              }}
              className="w-fit rounded-lg border-[0.75px] border-border/40 bg-muted p-2 shadow-sm transition-colors group-hover:bg-muted/80"
            >
              {icon}
            </motion.div>

            <div className="space-y-3">
              <h3 className="pt-0.5 font-sans text-xl font-semibold leading-[1.375rem] tracking-[-0.04em] text-foreground text-balance md:text-2xl md:leading-[1.875rem]">
                {title}
              </h3>

              <p className="font-sans text-sm leading-[1.125rem] text-muted-foreground [&_b]:md:font-semibold [&_strong]:md:font-semibold md:text-base md:leading-[1.375rem]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </li>
  );
};

/* -----------------------------------------------------------------------------
 * Demo Grid
 * ---------------------------------------------------------------------------*/

export const GlowingEffectDemo = () => {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Box className="h-4 w-4 text-primary" />}
        title="Robust Architecture"
        description="Crafted with high-performance animations and type-safe components for modern web applications."
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Settings className="h-4 w-4 text-primary" />}
        title="Customizable Motion"
        description="Fine-tune movement duration, proximity detection, and blur intensity to match your brand."
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4 text-primary" />}
        title="Visual Security"
        description="Implement stunning visual feedback that guides user attention where it matters most."
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4 text-primary" />}
        title="Dynamic Gradients"
        description="Utilizing repeating conic gradients for smooth, high-fidelity light tracking effects."
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Search className="h-4 w-4 text-primary" />}
        title="Interactive Discovery"
        description="A playful yet professional interface element that responds to your every move."
      />
    </ul>
  );
};

/* -----------------------------------------------------------------------------
 * App
 * ---------------------------------------------------------------------------*/

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden transition-colors duration-300">
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 dark:opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground) / 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground) / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at center, black, transparent 90%)",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark((prev) => !prev)}
            className="relative flex items-center justify-center overflow-hidden rounded-full p-2.5 transition-colors hover:bg-muted"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ y: 20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                >
                  <Sun className="h-5 w-5 text-yellow-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ y: 20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                >
                  <Moon className="h-5 w-5 text-indigo-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Content */}
      <main className="relative px-4 pb-20 pt-24">
        <div className="mx-auto max-w-7xl">
          <div className="group relative mt-8">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/5 to-transparent opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100" />
            <GlowingEffectDemo />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;