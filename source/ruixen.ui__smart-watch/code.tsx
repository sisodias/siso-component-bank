"use client";

import * as React from "react";

interface SmartWatchProps {
  hours?: string;
  minutes?: string;
}

export default function SmartWatch({ hours = "09", minutes = "55" }: SmartWatchProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      {/* Top Strap */}
      <div className="relative w-28 h-36 bg-gray-900 rounded-t-2xl flex flex-col items-center justify-center shadow-lg -mb-2">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <span key={idx} className="w-3 h-3 bg-gray-600 rounded-full shadow-inner"></span>
          ))}
        </div>
      </div>

      {/* Watch Body */}
      <div className="relative w-72 h-[360px] rounded-[3.5rem] bg-gray-950 shadow-2xl flex items-center justify-center my-2 border border-gray-800">
        {/* Inner Glow */}
        <div className="absolute inset-0 rounded-[3.5rem] border border-gray-800 shadow-[inset_0_0_20px_2px_#111111] pointer-events-none"></div>

        {/* Time Text */}
        <div className="text-[8rem] font-mono font-bold leading-[0.8] text-green-400 drop-shadow-[0_0_20px_#39ff14] text-center">
          <div>{hours}</div>
          <div>{minutes}</div>
        </div>

        {/* Side Button */}
        <div className="absolute top-[100px] -right-3 w-3 h-16 rounded-r-md bg-gray-700 shadow-inner"></div>

        {/* Power Button (aligned with body curvature) */}
        <div className="absolute top-[200px] -right-3 w-3 h-16 rounded-r-full bg-gray-800 shadow-inner"></div>
      </div>


      {/* Bottom Strap */}
      <div className="relative w-28 h-36 bg-gray-900 rounded-b-2xl flex flex-col items-center justify-center shadow-lg -mt-2">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <span key={idx} className="w-3 h-3 bg-gray-600 rounded-full shadow-inner"></span>
          ))}
        </div>
      </div>
    </div>
  );
}
