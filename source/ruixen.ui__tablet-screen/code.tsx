"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabletScreenProps {
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  shadow?: boolean;
  connector?: boolean; // optional smart connector
  children?: React.ReactNode;
}

export default function TabletScreen({
  width = "700px",
  height = "900px",
  rounded = true,
  shadow = true,
  connector = false,
  children,
}: TabletScreenProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", shadow && "drop-shadow-2xl")}>
      {/* Tablet Frame */}
      <div
        className={cn(
          "relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center ",
          rounded ? "rounded-3xl" : "rounded-none"
        )}
        style={{ width, height }}
      >
        {/* Inner Screen */}
        <div className="w-full h-full p-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
          {children}
        </div>

        {/* Optional Smart Connector / Side Bezel */}
        {connector && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-20 bg-gray-400 dark:bg-gray-600 rounded-r-md"></div>
        )}
      </div>
    </div>
  );
}
