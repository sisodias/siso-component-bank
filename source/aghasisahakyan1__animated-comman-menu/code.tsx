"use client";

import React, { useState, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search, File, Zap, ArrowRight } from 'lucide-react';

const searchResults = [
  { type: 'File', name: '- marketing-brief.pdf', Icon: File },
  { type: 'File', name: '- q3-financials.xlsx', Icon: File },
  { type: 'Action', name: 'Deploy to Production', Icon: Zap },
  { type: 'Action', name: 'Run Lint Checks', Icon: Zap },
];

export const Component = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(itemsRef.current, { y: 30, opacity: 0 });
      const tl = gsap.timeline({ paused: true });
      tl.to(containerRef.current, { height: 280, duration: 0.4, ease: 'power3.out' })
        .to(itemsRef.current, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.06 }, '-=0.2');
      tlRef.current = tl;
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (!tlRef.current) return;
    if (isOpen) {
      tlRef.current.reverse();
    } else {
      tlRef.current.play();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[90%] max-w-[480px] h-[60px] bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-2">
          <Search className="text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search files or run a command..."
            className="bg-transparent text-sm placeholder:text-neutral-400 focus:outline-none"
            onFocus={() => !isOpen && toggleMenu()}
          />
        </div>
        <button
          onClick={toggleMenu}
          className="text-xs font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded-md"
        >
          {isOpen ? 'Close' : 'Open'}
        </button>
      </div>

      <div className="absolute inset-x-0 top-[60px] p-2 space-y-1">
        {searchResults.map((item, i) => (
          <div
            key={i}
            ref={el => itemsRef.current[i] = el!}
            className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <item.Icon className="text-neutral-400" size={16} />
              <span className="text-sm font-medium">{item.type}</span>
              <span className="text-sm text-neutral-500">{item.name}</span>
            </div>
            <ArrowRight className="text-neutral-400" size={16} />
          </div>
        ))}
      </div>
    </div>
  );
};