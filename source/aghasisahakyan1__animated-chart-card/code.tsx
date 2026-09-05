"use client";

import * as React from 'react';
import { BarChart2, ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const weeklyData = [
  { day: 'M', visitors: 120 },
  { day: 'T', visitors: 180 },
  { day: 'W', visitors: 150 },
  { day: 'T', visitors: 220 },
  { day: 'F', visitors: 300 },
  { day: 'S', visitors: 250 },
  { day: 'S', visitors: 280 },
];

const chartWidth = 240;
const chartHeight = 100;

export const Component = () => {
  const [activeDay, setActiveDay] = React.useState(weeklyData[6]);

  // Convert data to SVG path string
  const maxVisitors = Math.max(...weeklyData.map(d => d.visitors));
  const pathData = weeklyData.map((d, i) => {
    const x = (i / (weeklyData.length - 1)) * chartWidth;
    const y = chartHeight - (d.visitors / maxVisitors) * chartHeight;
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');

  return (
    <motion.div
      className="bg-neutral-200 dark:bg-neutral-900 p-3 rounded-3xl w-xs space-y-3 shadow-md"
      initial="collapsed"
      whileHover="expanded"
    >
      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl px-4 pt-4 pb-2 shadow-sm flex flex-col">
        <div className='h-16'>
          <AnimatePresence mode="wait">
              <motion.div
                key={activeDay.day + activeDay.visitors}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex items-baseline gap-2"
              >
                  <p className="text-3xl font-bold">{activeDay.visitors}</p>
                  <p className="text-sm font-medium text-neutral-500">Visitors</p>
              </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative -ml-1">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`} className="w-full h-auto">
            <motion.path
              d={pathData}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
             {/* Interaction layer */}
            {weeklyData.map((d, i) => (
                <rect key={i} onMouseEnter={() => setActiveDay(d)}
                  x={(i / (weeklyData.length - 1)) * chartWidth - (chartWidth / (weeklyData.length - 1))/2}
                  y="0"
                  width={chartWidth / (weeklyData.length - 1)}
                  height={chartHeight + 10}
                  fill="transparent"
                />
            ))}
          </svg>
        </div>
        <div className="flex justify-between mt-1">
          {weeklyData.map((d) => <span key={d.day} className="text-xs font-medium text-neutral-500">{d.day}</span>)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="size-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
          <BarChart2 className="size-3" />
        </div>
        <span className="grid">
          <motion.span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 row-start-1 col-start-1" variants={{collapsed: {opacity: 1}, expanded: {opacity: 0}}}>Weekly Visitors</motion.span>
          <motion.a href="#" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1 cursor-pointer select-none row-start-1 col-start-1" variants={{collapsed: {opacity: 0}, expanded: {opacity: 1}}}>View Full Analytics <ArrowUpRight className="size-4" /></motion.a>
        </span>
      </div>
    </motion.div>
  );
}