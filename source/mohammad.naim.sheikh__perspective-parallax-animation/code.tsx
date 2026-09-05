"use client";

import { useEffect, useRef } from "react";

export default function PerspectiveParallax() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    card.style.willChange = "transform, opacity";

    const update = () => {
      const rect = card.getBoundingClientRect();
      const winH = window.innerHeight;

      const start = winH;
      const end = winH * 0.4;

      const progress = Math.max(
        0,
        Math.min(1, (start - rect.top) / (start - end))
      );

      const rotateX = 70 * (1 - progress);
      const scale = 0.8 + 0.2 * progress;
      const opacity = 0.5 + 0.5 * progress;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight capitalize text-black dark:text-white">
        Perspective Parallax Animation
      </h2>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="relative overflow-hidden rounded-lg bg-white dark:bg-black">
          <div className="max-w-7xl w-full mx-auto px-2 sm:px-4">
            <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 space-y-10">

              <div className="space-y-5 flex flex-col justify-center items-center">
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center text-neutral-900 dark:text-neutral-100">
                  Where the world <br className="hidden sm:block" /> build software
                </h2>

                <p className="text-sm sm:text-base text-center text-neutral-500 dark:text-neutral-100/80 max-w-md mx-auto pb-3">
                  Github is the world's largest software development platform.
                </p>

                <div className="inline-flex flex-col sm:flex-row items-center gap-3">
                  <button className="px-6 py-3 text-sm font-medium text-white dark:text-neutral-900 border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white rounded-md">
                    Create a Github Account
                  </button>

                  <button className="px-6 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100 border border-neutral-900 dark:border-white bg-transparent rounded-md">
                    Start an Enterprise trial
                  </button>
                </div>
              </div>

              <div
                ref={ref}
                className="w-full h-full rounded-3xl overflow-hidden p-3 shadow-2xl border-2 border-neutral-500/50 bg-neutral-900"
              >
                <div className="w-full h-full overflow-hidden p-3 rounded-2xl bg-white dark:bg-neutral-700/50">
                  <img
                    src="https://img.freepik.com/free-photo/computer-engineer-typing-keyboard-writing-code-build-firewalls_482257-101117.jpg?t=st=1774432934~exp=1774436534~hmac=5e7c842edcd90a9ef70489ebac72eeba4954ebdb1781150dea66da9e7bd9da9e&w=1480"
                    alt="preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}