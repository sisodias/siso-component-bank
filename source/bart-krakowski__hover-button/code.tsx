import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ComponentPropsWithRef } from "react";
import { useRef, useState } from "react";

interface InteractiveHoverButtonProps
  extends ComponentPropsWithRef<"button"> {
  idleText: string;
  hoverText: string;
}

function InteractiveHoverButton({
  className,
  ref,
  idleText,
  hoverText,
}: InteractiveHoverButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const idleTextRef = useRef<HTMLSpanElement>(null);
  const hoverTextRef = useRef<HTMLSpanElement>(null);

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden bg-background border border-border text-foreground font-semibold rounded-full cursor-pointer grid grid-cols-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      ref={ref}
    >
      <motion.div
        className="bg-foreground rounded-full flex items-center justify-center col-start-1 row-start-1 z-2 py-1.5 px-2"
        animate={{
          clipPath: isHovered
            ? `inset(9px calc(100% - 30px) 9px 12px round var(--radius) var(--radius) var(--radius) var(--radius))`
            : "inset(0 0 0 0 round var(--radius) var(--radius) var(--radius) var(--radius))",
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 30,
        }}
      >
        <motion.span
          ref={idleTextRef}
          className={cn(
            "text-background font-semibold transition-all duration-250",
            {
              "pl-5": isHovered,
            }
          )}
        >
          {idleText}
        </motion.span>
      </motion.div>

      <motion.div
        className="relative flex items-center justify-center h-full overflow-hidden col-start-1 row-start-1"
        animate={{
          width: isHovered
            ? "auto"
            : idleTextRef.current?.offsetWidth ?? 0,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 30,
        }}
      >
        <motion.span
          ref={hoverTextRef}
          className="whitespace-nowrap text-sm pl-9 pr-2"
        >
          {hoverText}
        </motion.span>
      </motion.div>
    </motion.button>
  );
}

export { InteractiveHoverButton };
