"use client";
import { cn } from "../_utils/cn";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FiCloud, FiServer } from "react-icons/fi";
import { LuArrowDown, LuNetwork } from "react-icons/lu";

type ComponentProps = {
  cardTitle?: string;
  cardDescription?: string;
};

const servers = [
  { id: 1, x: -90, y: 100 },
  { id: 2, x: 0, y: 100 },
  { id: 3, x: 90, y: 100 },
];

export const Component = ({
  cardTitle = "Elastic Load Balancing",
  cardDescription = "Automatically distribute incoming application traffic across multiple servers to ensure high availability and fault tolerance.",
}: ComponentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const parentVariants = {
    hover: { transition: { staggerChildren: 0.1 } },
    initial: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
  };

  const particleVariants = {
    initial: { opacity: 0, y: -20 },
    hover: (i: number) => ({
      opacity: [0, 1, 1, 0],
      y: servers[i % servers.length].y,
      x: servers[i % servers.length].x,
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.4,
        ease: "easeOut",
      },
    }),
  };

  const serverLightVariants = {
      initial: { backgroundColor: "#404040" },
      hover: (i: number) => ({
        backgroundColor: ["#404040", "#22c55e", "#404040"],
        transition: {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4 + 1.2, // Time to match particle arrival
        }
      })
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex flex-col justify-between",
        "h-[28rem] w-full max-w-[350px] space-y-4",
        "overflow-hidden rounded-md border border-neutral-800/50 bg-neutral-950",
      )}
    >
      {/* Animation Canvas */}
      <div className="absolute inset-x-0 top-12 flex h-64 items-center justify-center">
        <div className="relative flex h-full w-full flex-col items-center">
          {/* Icons */}
          <FiCloud className="size-12 text-neutral-500" />
          <LuArrowDown className="size-8 text-neutral-700" />
          <LuNetwork className="size-10 text-neutral-500" />

          {/* Server Icons */}
          <div className="absolute bottom-0 flex w-full justify-around">
            {servers.map((server, i) => (
              <div key={server.id} className="flex flex-col items-center gap-2">
                <FiServer className="size-8 text-neutral-500" />
                <motion.div 
                    className="h-2 w-2 rounded-full"
                    variants={serverLightVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                    custom={i}
                />
              </div>
            ))}
          </div>
          
          {/* Animated Particles */}
          <motion.div variants={parentVariants} initial="initial" animate={isHovered ? "hover" : "initial"}>
              {[...Array(5)].map((_, i) => (
                  <motion.div
                  key={i}
                  custom={i}
                  variants={particleVariants}
                  className="absolute top-0 size-1.5 rounded-full bg-emerald-400"
                  />
              ))}
          </motion.div>
        </div>
      </div>

      {/* Text Content */}
      <div className="absolute bottom-0 z-10 w-full px-4 pb-4">
        <div className="mt-3 text-sm font-semibold text-white">{cardTitle}</div>
        <div className="mt-2 text-xs text-neutral-400">{cardDescription}</div>
      </div>
      <div className="absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-neutral-950 to-transparent" />
    </div>
  );
};