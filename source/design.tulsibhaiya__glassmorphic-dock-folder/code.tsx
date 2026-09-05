import React, { useState, useEffect, useRef } from "react";
import { Folder, FileText, Cpu, Globe, X } from "lucide-react";

export function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key or outside click for Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      {/* THE LAYOVER (The Glass Window) */}
      <div
        className={`absolute bottom-20 w-64 p-4 rounded-2xl transition-all duration-300 ease-out origin-bottom ${
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">AI Assets</span>
          <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white">
            <X size={14} />
          </button>
        </div>

        {/* Dynamic Grid for AI Agents/Prompts */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Cpu size={20} />, label: "Core" },
            { icon: <Globe size={20} />, label: "Web" },
            { icon: <FileText size={20} />, label: "Docs" },
          ].map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center justify-center aspect-square rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group"
            >
              <div className="text-white/70 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="text-[10px] mt-1 text-white/40">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* THE TRIGGER (Dock Icon) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`group relative p-4 rounded-2xl bg-neutral-900 border border-neutral-800 transition-all active:scale-90 ${
          isOpen ? "ring-2 ring-white/20" : "hover:bg-neutral-800"
        }`}
      >
        <Folder 
          size={24} 
          className={`transition-colors ${isOpen ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"}`} 
        />
        {/* Dock Indicator Dot */}
        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} />
      </button>
    </div>
  );
}