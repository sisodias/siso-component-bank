// component.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

export interface TimePickerProps {
  defaultValue?: string;
  onChange?: (time: string) => void;
  className?: string;
}

/* ---------------------------------------------------------------------- */
/* Time math & formatting — copied verbatim from the raw canvas source    */
/* ---------------------------------------------------------------------- */

const adjustTime = (timeStr: string, minutesToAdd: number): string => {
  if (!timeStr || timeStr.length !== 5) return timeStr;

  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;

  let totalMinutes = hours * 60 + minutes;
  totalMinutes += minutesToAdd;

  // Clamp the time between 00:00 (0 mins) and 23:59 (1439 mins) to prevent looping
  totalMinutes = Math.max(0, Math.min(1439, totalMinutes));

  const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');

  return `${newHours}:${newMinutes}`;
};

const formatInput = (val: string): string => {
  let clean = val.replace(/[^\d]/g, '');
  if (clean.length > 4) clean = clean.slice(0, 4);

  if (clean.length > 0 && parseInt(clean[0]) > 2) clean = '0' + clean;
  if (clean.length > 1 && parseInt(clean.slice(0, 2)) > 23) clean = '23';
  if (clean.length > 2 && parseInt(clean[2]) > 5) clean = clean.slice(0, 2) + '5' + clean.slice(3);

  if (clean.length >= 3) {
    return clean.slice(0, 2) + ':' + clean.slice(2);
  }
  return clean;
};

const formatOnBlur = (val: string): string => {
  let clean = val.replace(/[^\d]/g, '');
  if (clean.length === 0) return '00:00';

  if (clean.length === 1) {
    clean = `0${clean}00`;
  } else if (clean.length === 2) {
    clean = `${clean}00`;
  } else if (clean.length === 3) {
    clean = `${clean}0`;
  }

  let hours = parseInt(clean.slice(0, 2), 10);
  let minutes = parseInt(clean.slice(2, 4), 10);

  if (hours > 23) hours = 23;
  if (minutes > 59) minutes = 59;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/* ---------------------------------------------------------------------- */
/* SVG geometry — identical math/radii/centers to the raw canvas source   */
/* ---------------------------------------------------------------------- */

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians)),
  };
};

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startOuter.x, startOuter.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z",
  ].join(" ");
};

type WedgeSide = 'pos' | 'neg';

interface Wedge {
  label: string;
  val: number;
  start: number;
  end: number;
  side: WedgeSide;
}

interface OrbitNode {
  label: string;
  val: number;
  angle: number;
  side: WedgeSide;
}

// Sequential 45° wedges, 0–360, exactly as in the raw canvas source (no gaps)
const WEDGES: Wedge[] = [
  { label: '+15m', val: 15, start: 0, end: 45, side: 'pos' },
  { label: '+30m', val: 30, start: 45, end: 90, side: 'pos' },
  { label: '+1h', val: 60, start: 90, end: 135, side: 'pos' },
  { label: '+2h', val: 120, start: 135, end: 180, side: 'pos' },
  { label: '-2h', val: -120, start: 180, end: 225, side: 'neg' },
  { label: '-1h', val: -60, start: 225, end: 270, side: 'neg' },
  { label: '-30m', val: -30, start: 270, end: 315, side: 'neg' },
  { label: '-15m', val: -15, start: 315, end: 360, side: 'neg' },
];

// Exact angles from the raw canvas source (intentionally not evenly spaced)
const ORBIT_NODES: OrbitNode[] = [
  { label: '+15m', val: 15, angle: 25, side: 'pos' },
  { label: '+30m', val: 30, angle: 68, side: 'pos' },
  { label: '+1h', val: 60, angle: 112, side: 'pos' },
  { label: '+2h', val: 120, angle: 155, side: 'pos' },
  { label: '-2h', val: -120, angle: 205, side: 'neg' },
  { label: '-1h', val: -60, angle: 248, side: 'neg' },
  { label: '-30m', val: -30, angle: 292, side: 'neg' },
  { label: '-15m', val: -15, angle: 335, side: 'neg' },
];

// Increased SVG and container sizes to fit the wider input pill and prevent clipping
const SVG_SIZE = 360;
const CENTER = SVG_SIZE / 2;
const INNER_RADIUS = 90;
const OUTER_RADIUS = 160;
const ORBIT_RADIUS = 125;

/* ---------------------------------------------------------------------- */
/* Variant A: Weapon Wheel                                                */
/* ---------------------------------------------------------------------- */

export const TimeWheelPicker: React.FC<TimePickerProps> = ({ defaultValue = '09:00', onChange, className }) => {
  const [time, setTime] = useState(defaultValue);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    onChange?.(time);
  }, [time, onChange]);

  const handleAdjust = (mins: number) => {
    const baseTime = formatOnBlur(time);
    setTime(adjustTime(baseTime, mins));
  };

  const showMenu = isHovered && !isFocused;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-[360px] h-[360px] transition-all duration-300",
        showMenu ? "z-50" : "z-10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. SVG Background Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <AnimatePresence>
          {showMenu && (
            <motion.svg
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 15 }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
              width={SVG_SIZE}
              height={SVG_SIZE}
              className="drop-shadow-xl"
            >
              {WEDGES.map((wedge, index) => {
                const pathData = describeArc(CENTER, CENTER, INNER_RADIUS, OUTER_RADIUS, wedge.start, wedge.end);
                const centerAngle = wedge.start + (wedge.end - wedge.start) / 2;
                const textPos = polarToCartesian(CENTER, CENTER, (INNER_RADIUS + OUTER_RADIUS) / 2, centerAngle);

                // Subtler offsets for a more refined, premium feel
                const hoverOffset = polarToCartesian(0, 0, 4, centerAngle);
                const tapOffset = polarToCartesian(0, 0, 1, centerAngle);
                const isPos = wedge.side === 'pos';

                return (
                  <motion.g
                    key={index}
                    className="pointer-events-auto"
                    style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
                    whileHover={{ x: hoverOffset.x, y: hoverOffset.y }}
                    whileTap={{ x: tapOffset.x, y: tapOffset.y, transition: { duration: 0.05 } }}
                  >
                    <motion.path
                      d={pathData}
                      style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
                      whileTap={{ scale: 0.98, transition: { duration: 0.05 } }}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleAdjust(wedge.val)}
                      className={cn(
                        "fill-slate-50 stroke-white stroke-[4px] transition-colors duration-150 cursor-pointer",
                        "dark:fill-zinc-900 dark:stroke-zinc-950",
                        isPos
                          ? "hover:fill-blue-50 active:fill-blue-100 dark:hover:fill-blue-900/40 dark:active:fill-blue-900/60"
                          : "hover:fill-slate-100 active:fill-slate-200 dark:hover:fill-zinc-800 dark:active:fill-zinc-700"
                      )}
                    />
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cn(
                        "text-[15px] font-bold pointer-events-none select-none",
                        isPos ? "fill-blue-700 dark:fill-blue-400" : "fill-slate-700 dark:fill-zinc-400"
                      )}
                    >
                      {wedge.label}
                    </text>
                  </motion.g>
                );
              })}
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Main Input Field */}
      <div className="relative bg-white dark:bg-zinc-950 rounded-full px-5 py-3 z-20 shadow-md transition-all ring-1 ring-gray-200 dark:ring-zinc-800 focus-within:shadow-xl focus-within:ring-4 focus-within:ring-gray-100 dark:focus-within:ring-zinc-800">
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(formatInput(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onFocus={(e) => {
            setIsFocused(true);
            e.target.select();
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setTime(formatOnBlur(e.target.value));
          }}
          placeholder="HH:MM"
          className="w-28 text-2xl font-bold text-gray-800 dark:text-zinc-100 bg-transparent outline-none text-center tracking-wider dark:placeholder:text-zinc-700"
        />
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/* Variant B: Orbit Circles                                               */
/* ---------------------------------------------------------------------- */

export const TimeCirclePicker: React.FC<TimePickerProps> = ({ defaultValue = '14:30', onChange, className }) => {
  const [time, setTime] = useState(defaultValue);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    onChange?.(time);
  }, [time, onChange]);

  const handleAdjust = (mins: number) => {
    const baseTime = formatOnBlur(time);
    setTime(adjustTime(baseTime, mins));
  };

  const showMenu = isHovered && !isFocused;

  const nodeVariants = {
    hidden: { opacity: 0, x: 0, y: 0, scale: 0.2 },
    visible: (custom: OrbitNode) => {
      const pos = polarToCartesian(0, 0, ORBIT_RADIUS, custom.angle);
      return {
        opacity: 1,
        x: pos.x,
        y: pos.y,
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 350, damping: 22 },
      };
    },
    exit: { opacity: 0, x: 0, y: 0, scale: 0.2, transition: { duration: 0.15 } },
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-[360px] h-[360px] transition-all duration-300",
        showMenu ? "z-50" : "z-10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Floating Circles Layer */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <AnimatePresence>
          {showMenu && ORBIT_NODES.map((node, i) => {
            const isPos = node.side === 'pos';
            return (
              <motion.button
                key={i}
                custom={node}
                variants={nodeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.08, boxShadow: "0px 8px 12px -3px rgba(0,0,0,0.12)" }}
                whileTap={{ scale: 0.95, boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)", transition: { duration: 0.05 } }}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleAdjust(node.val)}
                className={cn(
                  "absolute w-14 h-14 rounded-full shadow-md border-2 font-bold text-[12px] leading-none tracking-tight whitespace-nowrap flex items-center justify-center transition-colors z-20",
                  isPos
                    ? "text-blue-700 border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 active:border-blue-400 dark:bg-zinc-900 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/40 dark:hover:border-blue-700 dark:active:bg-blue-900/60 dark:active:border-blue-600"
                    : "text-slate-700 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 active:border-slate-400 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:border-zinc-600 dark:active:bg-zinc-700 dark:active:border-zinc-500"
                )}
              >
                {node.label}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 2. Main Input Field */}
      <div className="relative bg-white dark:bg-zinc-950 rounded-full px-5 py-3 z-30 shadow-md transition-all ring-1 ring-gray-200 dark:ring-zinc-800 focus-within:shadow-xl focus-within:ring-4 focus-within:ring-gray-100 dark:focus-within:ring-zinc-800">
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(formatInput(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          onFocus={(e) => {
            setIsFocused(true);
            e.target.select();
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setTime(formatOnBlur(e.target.value));
          }}
          placeholder="HH:MM"
          className="w-28 text-2xl font-bold text-gray-800 dark:text-zinc-100 bg-transparent outline-none text-center tracking-wider dark:placeholder:text-zinc-700"
        />
      </div>
    </div>
  );
};