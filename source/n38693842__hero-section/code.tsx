// src/components/ui/component.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Component() {
  const words = ["Web", "UI", "UX"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Background subtle star grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Animated gray blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-md bg-gray-600 opacity-20 blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-md bg-gray-500 opacity-15 blur-3xl"
        animate={{ x: [0, -80, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Mirror card */}
        <div className="relative max-w-3xl mx-auto rounded-md overflow-hidden">
          <div className="relative rounded-md p-10 shadow-2xl bg-white/10 backdrop-blur-2xl border border-white/20">
            {/* Mirror shine overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-md bg-gradient-to-tr from-white/20 via-transparent to-white/5 opacity-40" />

            <motion.h1
              className="relative text-5xl md:text-7xl font-extrabold leading-tight mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Welcome to <br />
              <span className="bg-gradient-to-r from-gray-200 via-white to-gray-300 text-transparent bg-clip-text">
                The Future of{" "}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  className="inline-block bg-gradient-to-r from-gray-200 via-white to-gray-400 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </motion.h1>

            <motion.p
            className="relative text-lg md:text-2xl max-w-2xl mx-auto mb-10 text-gray-300 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Dark, minimal, and timeless. A hero that feels elegant{" "}
            <motion.span
              animate={{ rotate: [0, 20, -10, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block origin-bottom-right"
            >
              👋
            </motion.span>
          </motion.p>


            {/* Buttons */}
            <div className="relative flex flex-wrap justify-center gap-6">
              <motion.button
                whileHover={{
                  scale: 1.1,
                  y: -4,
                  boxShadow: "0px 8px 20px rgba(255,255,255,0.3)",
                }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="px-8 py-3 text-lg font-semibold rounded-md bg-white/80 text-black hover:bg-white transition hover:cursor-pointer backdrop-blur"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  y: -4,
                  boxShadow: "0px 8px 20px rgba(255,255,255,0.15)",
                }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="px-8 py-3 text-lg font-semibold rounded-md bg-black/40 hover:bg-black/60 border border-white/20 transition hover:cursor-pointer backdrop-blur"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
