import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Example() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Контейнер с колонкой */}
      <div className="flex flex-col items-center w-full">
        {/* Заголовок сверху */}
        <h1 className="text-3xl font-semibold">Latest Blog</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-lg text-center">
          Stay ahead of the curve with fresh content on code, design, startups, and everything in between.
        </p>

        {/* Карточки */}
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=1200&h=800&auto=format&fit=crop&q=60"
              alt=""
            />
            <h3 className="text-base text-slate-900 font-medium mt-3">
              Color Psychology in UI: How to Choose the Right Palette
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">UI/UX design</p>
          </div>

          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://images.unsplash.com/photo-1714974528646-ea024a3db7a7?w=1200&h=800&auto=format&fit=crop&q=60"
              alt=""
            />
            <h3 className="text-base text-slate-900 font-medium mt-3">
              Understanding Typography: Crafting a Visual Voice for Your Brand
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">Branding</p>
          </div>

          <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://images.unsplash.com/photo-1713947501966-34897f21162e?w=1200&h=800&auto=format&fit=crop&q=60"
              alt=""
            />
            <h3 className="text-base text-slate-900 font-medium mt-3">
              Design Thinking in Practice: How to Solve Real User Problems
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">Product Design</p>
          </div>
        </div>
      </div>
    </>
  );
}
