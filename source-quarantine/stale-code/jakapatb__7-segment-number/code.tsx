"use client"

import * as React from "react";

// Segments are: A (top), B (top-right), C (bottom-right), D (bottom),
// E (bottom-left), F (top-left), G (middle)
const digitPatterns = [
  [1, 1, 1, 1, 1, 1, 0], // 0
  [0, 1, 1, 0, 0, 0, 0], // 1
  [1, 1, 0, 1, 1, 0, 1], // 2
  [1, 1, 1, 1, 0, 0, 1], // 3
  [0, 1, 1, 0, 0, 1, 1], // 4
  [1, 0, 1, 1, 0, 1, 1], // 5
  [1, 0, 1, 1, 1, 1, 1], // 6
  [1, 1, 1, 0, 0, 0, 0], // 7
  [1, 1, 1, 1, 1, 1, 1], // 8
  [1, 1, 1, 1, 0, 1, 1], // 9
];

 const segmentPaths = [
    "m 70,0 8,8 -8,8 H 18 L 10,8 18,0 Z", // A (top)
    "m 72,18 8,-8 8,8 v 52 l -8,8 -8,-8 z", // B (top-right)
    "m 72,90 8,-8 8,8 v 52 l -8,8 -8,-8 z", // C (bottom-right)
    "m 70,144 8,8 -8,8 H 18 L 10,152 18,144 Z", // D (bottom)
    "m 0,90 8,-8 8,8 v 52 l -8,8 -8,-8 z", // E (bottom-left)
    "m 0,18 8,-8 8,8 V 70 L 8,78 0,70 Z", // F (top-left)
    "m 70,72 8,8 -8,8 H 18 L 10,80 18,72 Z", // G (middle)
  ];

type SevenSegmentNumberProps = {
  /**
   * The value to display
   * @default 0
   * @min 0
   * @max 9
   */
  value: number;
  height?: number;
  width?: number;
  onColor?: string;
  offColor?: string;
  className?: string;
};

export const SevenSegmentNumber: React.FC<SevenSegmentNumberProps> = ({
  value,
  height,
  width,
  onColor = "currentColor",
  offColor = "transparent",
  className,
}) => {
  const pattern =
    value >= 0 && value <= 9 ? digitPatterns[value] : [0, 0, 0, 0, 0, 0, 0];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 88 160"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {segmentPaths.map((path, index) => (
        <path
          key={index}
          d={path}
          fill={pattern[index] === 1 ? onColor : offColor}
        />
      ))}
    </svg>
  );
};
