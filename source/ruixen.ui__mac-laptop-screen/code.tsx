"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MacLaptopScreenProps {
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  shadow?: boolean;
  children?: React.ReactNode;
}

export default function MacLaptopScreen({
  width = "700px",
  height = "450px",
  rounded = true,
  shadow = true,
  children,
}: MacLaptopScreenProps) {
  return (
    <div
      className={cn(
        "relative bg-gray-50 dark:bg-gray-800",
        rounded ? "rounded-lg" : "rounded-none",
        shadow ? "shadow-xl" : "",
        "flex flex-col overflow-hidden border border-gray-300 dark:border-gray-700"
      )}
      style={{ width, height }}
    >
      {/* Top Bezel */}
      <div className="relative h-6 bg-gray-200 dark:bg-gray-900 flex items-center px-3">
        {/* Mac Window Control Dots */}
        <div className="flex gap-2 items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600" />
          <span className="w-3 h-3 rounded-full bg-yellow-400 cursor-pointer hover:bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:bg-green-600" />
        </div>

        {/* Camera Dot */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-200" />
      </div>

      {/* Screen Content */}
      <div className="flex-1 bg-white dark:bg-gray-900">{children}</div>

      {/* Bottom Bezel */}
      <div className="h-4 bg-gray-200 dark:bg-gray-900 rounded-b-lg"></div>
    </div>
  );
}
