"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SmartTVProps {
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  shadow?: boolean;
  stand?: boolean;
  children?: React.ReactNode;
}

export default function SmartTV({
  width = "900px",
  height = "520px",
  rounded = true,
  shadow = true,
  stand = true,
  children,
}: SmartTVProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      {/* TV Body */}
        <div
          className={cn(
            "relative bg-gray-900 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-700 dark:border-gray-600",
            rounded ? "rounded-3xl" : "rounded-none",
            shadow && "shadow-2xl"
          )}
          style={{ width, height }}
        >
          {/* Inner Screen */}
          <div className={cn(
            "relative w-full h-full p-4 bg-white dark:bg-gray-900 flex items-center justify-center",
            rounded ? "rounded-3xl border-4 border-gray-800 dark:border-gray-700" : "rounded-none"
          )}>
            {children}
            {/* Subtle reflection */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 via-transparent to-white/10 pointer-events-none"></div>
          </div>
        </div>
      {/* Optional Stand */}
      {stand && (
        <div className="w-48 h-3 rounded-t-lg bg-black dark:bg-gray-600 shadow-inner"></div>
      )}
    </div>
  );
}
