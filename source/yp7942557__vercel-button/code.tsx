import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedDeployButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const AnimatedDeployButton = React.forwardRef<HTMLButtonElement, AnimatedDeployButtonProps>(
  ({ className, text = "Start Deploying", ...props }, ref) => {
    // Split text into an array of characters
    const letters = text.split("");

    return (
      <motion.button
        ref={ref}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={cn(
          "group relative flex h-[72px] items-center justify-between rounded-full bg-[#0a0a0a] pl-8 pr-2.5 transition-colors duration-300",
          "border border-white/10 hover:bg-[#141414] hover:border-white/20",
          className
        )}
        {...props}
      >
        <div className="flex items-center overflow-hidden pr-6 pb-1">
          {letters.map((letter, i) => (
            <span 
              key={i} 
              className="relative inline-block overflow-visible [perspective:800px]"
              // Preserve exact spacing for space characters
              style={{ width: letter === " " ? "0.3em" : "auto" }}
            >
              {/* Outgoing Letter (Animates up and out) */}
              <motion.span
                className="inline-block origin-bottom whitespace-pre text-[26px] font-semibold tracking-tight text-white"
                variants={{
                  initial: { y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)" },
                  hover: { y: "-100%", rotateX: 90, opacity: 0, filter: "blur(4px)" },
                }}
                transition={{ duration: 0.5, delay: i * 0.025, ease: [0.32, 0.72, 0, 1] }}
              >
                {letter}
              </motion.span>

              {/* Incoming Letter (Animates up and in from below) */}
              <motion.span
                className="absolute left-0 top-0 inline-block origin-top whitespace-pre text-[26px] font-semibold tracking-tight text-white"
                variants={{
                  initial: { y: "100%", rotateX: -90, opacity: 0, filter: "blur(4px)" },
                  hover: { y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.5, delay: i * 0.025, ease: [0.32, 0.72, 0, 1] }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </div>

        {/* Right Circular Arrow Button */}
        <motion.div
          className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-black"
          variants={{
            initial: { scale: 1 },
            hover: { scale: 1.05 },
            tap: { scale: 0.95 }
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Outgoing Arrow */}
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            variants={{
              initial: { x: 0 },
              hover: { x: 40 }
            }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          
          {/* Incoming Arrow */}
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute"
            variants={{
              initial: { x: -40 },
              hover: { x: 0 }
            }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </motion.button>
    );
  }
);

AnimatedDeployButton.displayName = "AnimatedDeployButton";