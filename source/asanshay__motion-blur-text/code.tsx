"use client";
import React from "react";

interface MotionBlurTextProps {
  children: React.ReactNode;
  blurAmount?: number;
  className?: string;
  angle?: number;
  opacity?: number;
  bidirectional?: boolean;
  color?: string;
}

export default function MotionBlurText({
  children,
  blurAmount = 100,
  color = "white",
  angle = 135,
  opacity = 0.05,
  bidirectional = true,
  className,
}: MotionBlurTextProps) {
  // Calculate shadow offsets based on angle
  const getShadows = () => {
    const shadows = [];
    const radianAngle = (angle * Math.PI) / 180;
    const xStep = Math.cos(radianAngle);
    const yStep = Math.sin(radianAngle);

    // Create multiple text shadows with decreasing opacity and increasing blur
    for (let i = 1; i <= blurAmount; i++) {
      if (i % 5 !== 0) continue;
      const baseOpacity = opacity;
      const opacityStep = baseOpacity / (blurAmount + 2);
      const layerOpacity = baseOpacity - i * opacityStep;
      const x = xStep * i;
      const y = yStep * i;
      const blur = (i + 5) / 5; // Increase blur with each layer
      shadows.push(
        `${x.toFixed(3)}px ${y.toFixed(3)}px ${blur}px rgba(${
          color === "white" ? "255,255,255" : "0,0,0"
        }, ${layerOpacity.toFixed(3)})`
      );

      // Add bidirectional shadows if enabled
      if (bidirectional) {
        shadows.push(
          `${(-x).toFixed(3)}px ${(-y).toFixed(3)}px ${blur}px rgba(${
            color === "white" ? "255,255,255" : "0,0,0"
          }, ${layerOpacity.toFixed(3)})`
        );
      }
    }

    return shadows.join(", ");
  };

  return (
    <div
      className={className}
      style={{
        textShadow: getShadows(),
        lineHeight: 1.2,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}
