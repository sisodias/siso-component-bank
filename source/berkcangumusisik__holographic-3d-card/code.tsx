"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const HolographicCard = ({
  children,
  className,
  ...props
}: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse'un kart içindeki konumu (0 ile 1 arası)
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;

    // Dönüş açıları (Hassasiyeti artırmak için çarpanları değiştirin)
    const rotateY = (mouseX - 0.5) * 25; // X eksenindeki hareket Y dönüşünü etkiler
    const rotateX = (mouseY - 0.5) * -25; // Y eksenindeki hareket X dönüşünü etkiler (ters)

    setRotation({ x: rotateX, y: rotateY });
    setGlarePos({ x: mouseX * 100, y: mouseY * 100 });
  };

  const handleMouseLeave = () => {
    // Mouse çıkınca merkeze yavaşça dön
    setRotation({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`,
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 transition-all ease-out duration-200 shadow-2xl",
        className
      )}
      {...props}
    >
      {/* Holographic Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-60 mix-blend-overlay transition-all duration-200 ease-out"
        style={{
          backgroundImage: `
            radial-gradient(
              farthest-corner at ${glarePos.x}% ${glarePos.y}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(162, 155, 255, 0.5) 20%,
              rgba(255, 106, 213, 0.5) 40%,
              rgba(108, 239, 255, 0.5) 60%,
              transparent 85%
            )
          `,
        }}
      />
      
      {/* Noise Texture for realism (Optional, looks nice) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Content */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};