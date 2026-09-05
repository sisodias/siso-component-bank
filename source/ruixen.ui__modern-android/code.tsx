"use client";

import * as React from "react";

interface ModernAndroidProps {
  width?: number;
  height?: number;
  src?: string;
  videoSrc?: string;
}

export default function ModernAndroid({
  width = 360,
  height = 760,
  src,
  videoSrc,
}: ModernAndroidProps) {
  return (
    <div
      className="relative flex items-center justify-center bg-transparent"
      style={{ width, height }}
    >
      {/* Outer Frame */}
      <div className="relative w-full h-full rounded-[40px] bg-gray-300 dark:bg-gray-800 shadow-2xl border border-gray-400 dark:border-gray-700 border-b-0 border-t-0 ">
        {/* Top bezel */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gray-200 dark:bg-gray-900 flex justify-center items-center rounded-t-xl">
          {/* Speaker */}
          <div className="w-16 h-2 bg-gray-500 dark:bg-gray-400 rounded-full" />
          {/* Front camera */}
          <div className="absolute right-6 w-3 h-3 bg-gray-500 dark:bg-gray-400 rounded-full" />
        </div>

        {/* Side Buttons */}
        <div className="absolute left-[-8px] top-20 w-2 h-16 bg-gray-400 dark:bg-gray-600 rounded-l-md shadow-inner" />
        <div className="absolute left-[-8px] top-48 w-2 h-10 bg-gray-400 dark:bg-gray-600 rounded-l-md shadow-inner" />

        {/* Screen */}
        <div className="absolute top-8 left-0 w-full h-[calc(100%-32px)] px-2">
          {src && (
            <img
              src={src}
              className="w-full h-full object-cover rounded-[33px]"
              alt="Android Screen"
            />
          )}
          {videoSrc && (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-[33px]"
            />
          )}
        </div>

        {/* Bottom bezel */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-200 dark:bg-gray-900 rounded-b-xl" />
      </div>
    </div>
  );
}
