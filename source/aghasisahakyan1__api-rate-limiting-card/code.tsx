"use client";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect } from "react";
import { HiOutlineShieldCheck, HiOutlineShieldExclamation } from "react-icons/hi";
import { LuServerCog } from "react-icons/lu";

// Props for the component, including a list of recent events to display
type ApiEvent = {
  id: string;
  ip: string;
  status: "Allowed" | "Throttled";
};

type ComponentProps = {
  cardTitle?: string;
  cardDescription?: string;
  events?: ApiEvent[];
};

// Main Component
export const Component = ({
  cardTitle = "API Rate Limiting",
  cardDescription = "Protect your services from abuse by monitoring incoming traffic and automatically throttling requests that exceed defined limits.",
  events = [],
}: ComponentProps) => {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        // Stagger the start of each dot's animation
        await controls.start((i) => ({
          opacity: [0, 1, 0],
          x: [-120, 0, 120],
          y: [Math.random() * 80 - 40, 0, Math.random() * 80 - 40],
          transition: {
            duration: 2,
            ease: "easeInOut",
            delay: i * 0.3,
          },
        }));
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before restarting the loop
      }
    };
    sequence();
  }, [controls]);

  const isThrottled = events.some(e => e.status === 'Throttled');

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden",
        "h-[28rem] w-full max-w-[350px] space-y-4",
        "rounded-md border border-neutral-800/50 bg-neutral-950",
      )}
    >
      {/* Animation Canvas */}
      <div className="absolute inset-x-0 top-10 flex h-48 items-center justify-center">
        <div className="relative flex h-full w-full items-center justify-center">
          {/* Central server icon */}
          <motion.div
            className="z-10 flex size-20 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 shadow-lg"
            animate={{
              borderColor: isThrottled ? "rgba(239, 68, 68, 0.5)" : "rgba(52, 211, 153, 0.5)",
              transition: { duration: 0.5, ease: "easeInOut" }
            }}
          >
            <LuServerCog className="size-8 text-neutral-400" />
          </motion.div>

          {/* Animated request dots */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              animate={controls}
              className="absolute left-1/2 top-1/2 size-2 rounded-full bg-emerald-500"
            />
          ))}

          {/* Throttling shield effect */}
          <motion.div
             className="absolute flex items-center justify-center"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{
                opacity: isThrottled ? 1 : 0,
                scale: isThrottled ? 1 : 0.8,
                transition: { duration: 0.3, ease: 'easeOut' }
             }}
          >
            <HiOutlineShieldExclamation className="size-32 text-red-500/50" />
          </motion.div>
        </div>
      </div>

      {/* Text Content */}
      <div className="absolute bottom-0 w-full px-4 pb-4">
        <div className="flex items-center gap-2">
            <motion.div
              animate={{ color: isThrottled ? "#ef4444" : "#10b981" }}
              transition={{ duration: 0.5 }}
            >
              {isThrottled ? <HiOutlineShieldExclamation /> : <HiOutlineShieldCheck />}
            </motion.div>
            <motion.p
              className="text-xs font-medium"
              animate={{ color: isThrottled ? "#ef4444" : "#10b981" }}
              transition={{ duration: 0.5 }}
            >
              {isThrottled ? "Throttling Active" : "All Systems Normal"}
            </motion.p>
        </div>
        <div className="mt-3 text-sm font-semibold text-white">{cardTitle}</div>
        <div className="mt-2 text-xs text-neutral-400">{cardDescription}</div>
      </div>
    </div>
  );
};