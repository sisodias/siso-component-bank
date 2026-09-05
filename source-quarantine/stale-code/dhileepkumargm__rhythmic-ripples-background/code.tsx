"use client";

import React, { useRef, useEffect } from "react";

// RhythmicRipplesBackground Props:
//
// backgroundColor: string      // default "#030303"
// rippleColor:     string      // default "rgba(130, 130, 180, 0.3)"
// rippleCount:     number      // default 20
// rippleSpeed:     number      // default 0.5
interface RhythmicRipplesBackgroundProps {
  children: React.ReactNode;
  backgroundColor?: string;
  rippleColor?: string;
  rippleCount?: number;
  rippleSpeed?: number;
}

const RhythmicRipplesBackground: React.FC<RhythmicRipplesBackgroundProps> = ({
  children,
  backgroundColor = "#030303",
  rippleColor = "rgba(130, 130, 180, 0.3)",
  rippleCount = 20,
  rippleSpeed = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let ripples: Ripple[] = [];
    let animationFrameId: number;
    let width: number, height: number;

    class Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;

      constructor() {
        this.reset();
      }

      reset() {
        width = window.innerWidth;
        height = window.innerHeight;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 0;
        this.maxRadius = Math.random() * 150 + 50;
        this.speed = Math.random() * rippleSpeed + 0.2;
      }

      update() {
        this.radius += this.speed;
        if (this.radius > this.maxRadius) {
          this.reset();
        }
      }

      draw() {
        const alpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rippleColor.replace(
          /[\d\.]+\)$/,
          `${alpha * 0.3})`
        );
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ripples = Array.from({ length: rippleCount }, () => new Ripple());
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ripples.forEach((r) => {
        r.update();
        r.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    setup();
    animate();
    window.addEventListener("resize", setup);

    return () => {
      window.removeEventListener("resize", setup);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rippleColor, rippleCount, rippleSpeed]);

  return (
    <div
      className="relative h-screen w-full"
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 h-full w-full"
      />
      <div className="relative z-10 flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default RhythmicRipplesBackground;
