import React from "react";
import { motion } from "framer-motion";

const FuzzyOverlayExample = () => {
  return (
    // NOTE: An overflow of hidden will be required on a wrapping
    // element to see expected results
    <div className="relative overflow-hidden w-full">
      <ExampleContent />
      <FuzzyOverlay />
    </div>
  );
};

const FuzzyOverlay = () => {
  return (
    <motion.div
      initial={{ transform: "translateX(-10%) translateY(-10%)" }}
      animate={{
        transform: "translateX(10%) translateY(10%)",
      }}
      transition={{
        repeat: Infinity,
        duration: 0.2,
        ease: "linear",
        repeatType: "mirror",
      }}
      style={{
        backgroundImage: 'url("https://www.hover.dev/noise.png")',
        // backgroundImage: 'url("/noise.png")',
      }}
      className="pointer-events-none absolute -inset-[100%] opacity-[15%]"
    />
  );
};

const ExampleContent = () => {
  return (
    <div className="relative grid h-screen w-full place-content-center space-y-6 bg-background p-8">
      <p className="text-center text-6xl font-black text-foreground">
        Fuzzy Overlay Example
      </p>
      <p className="text-center text-neutral-400">
        This is a basic example of using a lo-fi fuzzy overlay 📺
      </p>
      <div className="flex items-center justify-center gap-3">
        <button className="text-neutral-20 w-fit px-4 py-2 font-semibold text-neutral-200 transition-colors hover:bg-neutral-800">
          Pricing
        </button>
        <button className="w-fit bg-background px-4 py-2 font-semibold text-foreground transition-colors hover:bg-neutral-500">
          Try it free
        </button>
      </div>
    </div>
  );
};

export default FuzzyOverlayExample;