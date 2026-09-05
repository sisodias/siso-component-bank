"use client";

import React, { useEffect, useState } from "react";

// Simple typing animation component
const TypeLine = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplay(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 50);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);
  return <div className="font-mono text-green-400">{display}</div>;
};

const DevTerminalProfile = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-200 dark:from-black dark:to-gray-900 relative p-6">
      {/* Background glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 blur-[100px] rounded-full"></div>

      <div className="relative max-w-3xl w-full bg-black/90 border border-gray-700 rounded-lg shadow-2xl p-6 font-mono text-sm leading-relaxed text-green-400">
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-xs">developer@portfolio: ~</span>
        </div>

        {/* Terminal Content */}
        <div className="space-y-2">
          <TypeLine text="> Initializing developer profile..." delay={300} />
          <TypeLine text="> Name: Ruhith G" delay={1200} />
          <TypeLine text="> Role: Software Engineer @ OpenCV University" delay={2000} />
          <TypeLine text="> Stack: Java | Spring Boot | React | Next.js | AWS | Docker" delay={2800} />
          <TypeLine text="> Interests: System Design | AI Integration | Developer Tools" delay={3700} />
          <TypeLine text="> Status: Building communities & solving problems ⚙️" delay={4600} />
        </div>

        {/* Footer buttons */}
        <div className="mt-8 flex gap-3">
          <button className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-400 text-green-300 rounded-md transition-all duration-200">
            View Projects
          </button>
          <button className="px-4 py-2 bg-transparent hover:bg-gray-800 border border-gray-600 text-gray-300 rounded-md transition-all duration-200">
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevTerminalProfile;
