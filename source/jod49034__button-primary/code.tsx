import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </div>
  );
};
import React from "react";

export const HeaderSection = () => (
  <header className="mx-auto max-w-7xl px-6 py-12 grid lg:grid-cols-12 gap-8 items-center">
    {/* Left */}
    <div className="lg:col-span-7 space-y-6">
      <div className="animate-left delay-100 flex items-center gap-3">
        <div className="gradient-border">
          <div className="gradient-border-inner px-4 py-2 text-xs font-medium tracking-wider text-lime-300 uppercase flex items-center gap-2">
            Latest Insights
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2.86.46-1.92 6.02A1 1 0 0 0 13 10h7l.78 1.63-9.9 10.2-.86-.46 1.92-6.02A1 1 0 0 0 11 14z"/></svg>
          </div>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-lime-300/50 to-transparent"></div>
      </div>

      <h1 className="animate-left delay-200 text-4xl md:text-6xl xl:text-7xl font-semibold leading-tight text-white">
        Discover the future of{" "}
        <span className="bg-gradient-to-r from-lime-300 to-emerald-300 bg-clip-text text-transparent">
          technology
        </span>{" "}
        through expert insights
      </h1>
    </div>

    {/* Right */}
    <div className="lg:col-span-5 space-y-6">
      <div className="animate-right delay-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
        <p className="text-neutral-300 text-sm sm:text-base mb-4">
          Dive deep into AI breakthroughs, quantum computing, and other
          innovations reshaping our digital world.
        </p>
        <details className="text-neutral-400 text-sm">
          <summary className="cursor-pointer font-medium mb-2 hover:text-lime-300">
            Read more details
          </summary>
          <p className="mt-2">
            Explore AI, blockchain, cybersecurity, and IoT trends driving the
            next wave of tech.
          </p>
        </details>
      </div>

      <div className="animate-right delay-400 flex flex-col sm:flex-row gap-4">
        <button className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-3 bg-lime-400 text-purple-900 px-6 py-3 rounded-full font-medium text-sm hover:bg-lime-300 hover:scale-105 transition">
          Explore Articles
          <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>

        <button className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-3 border border-neutral-600 text-neutral-300 px-6 py-3 rounded-full font-medium text-sm hover:border-lime-400 hover:text-lime-400 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          Save for Later
        </button>
      </div>
    </div>
  </header>
);
