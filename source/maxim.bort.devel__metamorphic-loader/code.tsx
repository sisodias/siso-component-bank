"use client";
import React from "react";

export interface MetamorphicLoaderProps {
  size: number;             // Size of the largest circle
  color?: string;           // Base color for the circles (optional)
  lighteningStep?: number;  // Step for lightening the color (optional)
}

// Helper function to lighten a color (same as your original)
function lightenColor(color: string, amount: number) {
  if (!color) return "#000000"; // Default to black if color is undefined

  const rgb = color.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!rgb) return color;

  const r = parseInt(rgb[1], 16);
  const g = parseInt(rgb[2], 16);
  const b = parseInt(rgb[3], 16);

  const newR = Math.min(255, Math.max(0, r + amount));
  const newG = Math.min(255, Math.max(0, g + amount));
  const newB = Math.min(255, Math.max(0, b + amount));

  // Convert the new RGB values back to hexadecimal
  return (
    "#" +
    newR.toString(16).padStart(2, "0") +
    newG.toString(16).padStart(2, "0") +
    newB.toString(16).padStart(2, "0")
  );
}

export const MetamorphicLoader: React.FC<MetamorphicLoaderProps> = ({
  size,
  color = "#8f10f6",
  lighteningStep = 24,
}) => {
  const circleSizes = Array.from({ length: 9 }, (_, i) => size - i * lighteningStep);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "none",
        position: "relative",
        overflow: "visible",
      }}
    >
      {circleSizes.map((circleSize, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            borderRadius: "50%",
            backgroundColor: lightenColor(color, index * lighteningStep),
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            animation: "metamorphic-spin 2s alternate infinite",
            animationDelay: `${(index + 1) * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes metamorphic-spin {
          0% {
            border-radius: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
          }
          20% {
            border-radius: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
          }
          90% {
            border-radius: 5%;
            transform: translate(-50%, -50%) rotate(90deg);
          }
          100% {
            border-radius: 5%;
            transform: translate(-50%, -50%) rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
};
