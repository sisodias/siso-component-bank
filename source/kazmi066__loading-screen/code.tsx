"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
  "bg-gradient-to-r from-blue-500 to-blue-600",
  "bg-gradient-to-r from-purple-500 to-purple-600",
  "bg-gradient-to-r from-pink-500 to-pink-600",
  "bg-gradient-to-r from-green-500 to-green-600",
  "bg-gradient-to-r from-yellow-500 to-yellow-600",
  "bg-gradient-to-r from-red-500 to-red-600",
  "bg-gradient-to-r from-indigo-500 to-indigo-600",
  "bg-gradient-to-r from-cyan-500 to-cyan-600",
];

const widths = [
  "w-12",
  "w-16",
  "w-20",
  "w-24",
  "w-32",
  "w-40",
  "w-48",
  "w-56",
  "w-64",
  "w-72",
  "w-80",
  "w-96",
];

function generateRow(startId: number) {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `block-${startId + i}`,
    width: widths[Math.floor(Math.random() * widths.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

export function Component() {
  const [rows, setRows] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: `row-${i}`,
      blocks: generateRow(i * 6),
    }))
  );
  const [counter, setCounter] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((prev) => {
        const newRows = [...prev.slice(1)];
        newRows.push({
          id: `row-${counter}`,
          blocks: generateRow(counter * 6),
        });
        setCounter((c) => c + 1);
        return newRows;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-6">
      <div className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
        <div className="bg-slate-900/80 border-b border-slate-700/50 p-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-32 h-2 bg-slate-700/50 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="p-6 h-80 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-transparent z-10 pointer-events-none" />

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {rows.map((row) => (
                <motion.div
                  key={row.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    layout: { duration: 0.5, ease: "easeInOut" },
                    opacity: { duration: 0.4 },
                    y: { duration: 0.5, ease: "easeInOut" },
                  }}
                  className="flex flex-wrap gap-3"
                >
                  {row.blocks.map((block, index) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.4,
                      }}
                      className={`${block.width} h-4 ${block.color} rounded-md`}
                    />
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-lg px-4 py-3 z-20 max-w-xs">
          <div className="text-slate-200 text-sm font-semibold mb-1.5">
            Bringing your site to life
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div
                className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
            <span className="text-slate-400 text-xs">
              This step usually takes 3–4 minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
