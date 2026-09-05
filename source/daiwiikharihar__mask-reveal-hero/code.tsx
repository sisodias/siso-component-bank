"use client";

import React, { useState, useEffect, useMemo, useRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { FileText, MessageCircle } from "lucide-react";

/* ==========================================================================
   Types
   ========================================================================== */

interface MaskProps {
  children?: ReactNode;
  revealText?: ReactNode;
  size?: number;
  revealSize?: number;
  className?: string;
  hoverControl?: { isHovered: boolean; setIsHovered: (v: boolean) => void };
}

/* ==========================================================================
   MaskContainer
   - Responsible for rendering the mask layer and forwarding hover state.
   - DOES NOT change CSS variables / mask URLs.
   - Exposes hoverControl prop for external control (used by Hero).
   ========================================================================== */

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
  hoverControl,
}: MaskProps) => {
  // internal or external hover control
  const [internalHovered, setInternalHovered] = useState(false);
  const isHovered = hoverControl ? hoverControl.isHovered : internalHovered;
  const setIsHovered = hoverControl ? hoverControl.setIsHovered : setInternalHovered;

  // mouse position relative to the container (used to position the mask)
  const [mousePosition, setMousePosition] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // track mouse move on container to update mask position
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updatePosition = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    node.addEventListener("mousemove", updatePosition);
    return () => node.removeEventListener("mousemove", updatePosition);
  }, []);

  const maskSize = isHovered ? revealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative h-screen", className)}
      // the background color animation (keeps original behavior)
      animate={{
        backgroundColor: isHovered ? "var(--slate-900)" : "var(--white)",
      }}
      transition={{ backgroundColor: { duration: 0.3 } }}
    >
      {/* ------------------------------------------------------------------
          HOVER MASK LAYER
          - Uses CSS variable --mask-img for dynamic mask image
          - Positions and sizes the mask using animate props
          ------------------------------------------------------------------ */}
      <motion.div
        className="
          absolute inset-0 flex items-center justify-center 
          text-6xl 
          [mask-image:var(--mask-img)]
          [mask-repeat:no-repeat] 
          [mask-size:40px]
        "
        animate={{
          WebkitMaskPosition: `${mousePosition.x! - maskSize / 2}px ${
            mousePosition.y! - maskSize / 2
          }px`,
          maskPosition: `${mousePosition.x! - maskSize / 2}px ${mousePosition.y! - maskSize / 2}px`,
          WebkitMaskSize: `${maskSize}px`,
          maskSize: `${maskSize}px`,
        }}
        transition={{
          maskSize: { duration: 0.3, ease: "easeInOut" },
          maskPosition: { duration: 0.15, ease: "linear" },
        }}
      >
        {/* Adaptive dark/light background behind the mask.
            Note: opacity-100 kept intentionally (you set this earlier). */}
        <div className="absolute inset-0 bg-black dark:bg-white opacity-100" />

        {/* The content that sits inside the mask (children) */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold"
        >
          {children}
        </div>
      </motion.div>

      {/* DEFAULT (non-masked) CONTENT */}
      <div className="flex h-full w-full items-center justify-center">{revealText}</div>
    </motion.div>
  );
};

/* ==========================================================================
   Button base (CVA)
   - Reused exactly from your original file
   - Small wrapper to keep consistent classes
   ========================================================================== */

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/* ==========================================================================
   ResumeButton (small, focused component)
   - Encapsulates the mask-aware color logic for the Resume button.
   - Keeps hover behaviors conditional based on isHovered.
   - Easy to modify styles in one place.
   ========================================================================== */

interface ResumeButtonProps {
  isHovered: boolean;
  onClick?: () => void;
}

const ResumeButton: React.FC<ResumeButtonProps> = ({ isHovered, onClick }) => {
  /**
   * Desired behavior:
   * - When mask NOT active (isHovered === false): black button (light mode),
   *   white button (dark mode) with hover inverting to the opposite.
   * - When mask IS active (isHovered === true): button is white (or black in dark mode),
   *   and hover should not invert — instead show subtle gray.
   */

  const resumeClasses = cn(
    "gap-3 transition-all duration-300 border border-black/20 dark:border-white/20",
    // Normal state (when mask is not active)
    !isHovered && "bg-black text-white dark:bg-white dark:text-black",

    // Mask active → display inverted color (white in light mode, black in dark).
    isHovered && "bg-white text-black dark:bg-black dark:text-white",

    // Hover logic:
    // - When mask NOT active, hover SHOULD invert (to white / black depending on theme).
    !isHovered &&
      "hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white",

    // - When mask IS active, hovering should not invert — show subtle neutral gray instead.
    isHovered && "hover:bg-neutral-100 dark:hover:bg-neutral-800"
  );

  return (
    <Button
      size="lg"
      className={resumeClasses}
      onClick={onClick}
      // keep variant omitted so the CVA 'outline' style doesn't add extra border
    >
      Resume <FileText className="h-4 w-4" />
    </Button>
  );
};

/* ==========================================================================
   Hero component
   - Uses MaskContainer and ResumeButton
   - Title rotation logic preserved
   ========================================================================== */

export function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const titles = useMemo(
    () => ["Full Stack Dev", "Computer Vision", "Deep Learning", "Design"],
    []
  );
  const [isMobile, setIsMobile] = useState(false);

  // responsive check for small screens
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // rotate the small title list every 2s (kept original behavior)
  useEffect(() => {
    const timeoutId = setTimeout(
      () =>
        setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1)),
      2000
    );
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // mobile touch handling to mimic hover in the center area
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const radius = 150;

      const dist = Math.sqrt((t.clientX - centerX) ** 2 + (t.clientY - centerY) ** 2);
      setIsHovered(dist < radius);
    };

    const stopHover = () => setIsHovered(false);

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", stopHover);
    window.addEventListener("touchcancel", stopHover);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopHover);
      window.removeEventListener("touchcancel", stopHover);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
      <MaskContainer
        hoverControl={{ isHovered, setIsHovered }}
        revealText={
          <div
            className="mx-auto max-w-5xl text-center space-y-6 px-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white">
              Hey I&apos;m Daiwiik Harihar
            </h2>

            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-200">
              Computer Science student & Research Intern passionate about solving
              real-world problems with AI and design. Blending curiosity,
              creativity, and technical depth to craft meaningful digital solutions.
            </p>

            {/* Buttons row */}
            <div className="flex flex-row gap-4 mt-8 justify-center relative z-50">
              {/* Resume button — mask-aware */}
              <ResumeButton
                isHovered={isHovered}
                onClick={() =>
                  window.open(
                    "https://drive.google.com/file/d/1jJhbRTttyYJiZkbluRfGqWhCtSIZuSon/view?usp=sharing",
                    "_blank"
                  )
                }
              />

              {/* Contact button — unchanged, kept as you had it */}
              <Button
                size="lg"
                className="gap-3 bg-white text-black border border-black/10 dark:border-zinc-300"
                variant="outline"
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Contact Me <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
        className="h-full w-full text-white dark:text-black"
      >
        {/* HOVER CONTENT (content shown inside the mask) */}
        <div className="flex flex-col items-center justify-center text-center px-4 -translate-y-10">
          <h1 className="text-5xl md:text-7xl tracking-tighter font-regular w-full max-w-5xl leading-tight">
            <span className="text-white dark:text-black block">Core Skills</span>

            <span className="relative flex justify-center overflow-visible min-h-[1.8em] pt-2">
              {titles.map((t, index) => (
                <motion.span
                  key={index}
                  className="absolute font-semibold whitespace-nowrap"
                  initial={{ opacity: 0, y: -100 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  {t}
                </motion.span>
              ))}
            </span>
          </h1>
        </div>
      </MaskContainer>

      {/* Instruction (bottom-right) */}
      <span className="absolute bottom-6 right-6 text-gray-400 text-md z-50">
        {isMobile ? "Drag your finger in the center ✨" : "Hover in the center to see magic ✨"}
      </span>
    </div>
  );
}

/* ==========================================================================
   Default export
   ========================================================================== */

export default function Home() {
  return <Hero />;
}
