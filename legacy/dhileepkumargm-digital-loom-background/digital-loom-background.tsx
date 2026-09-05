"use client";

import React, { useRef, useEffect } from "react";

interface DigitalLoomBackgroundProps {
  children: React.ReactNode;
  backgroundColor?: string;   // default "#000000"
  threadColor?: string;       // default "rgba(100, 100, 255, 0.5)"
  threadCount?: number;       // default 80
}

const DigitalLoomBackground: React.FC<DigitalLoomBackgroundProps> = ({
  children,
  backgroundColor = "#000000",
  threadColor = "rgba(100, 100, 255, 0.5)",
  threadCount = 80,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let threads: Thread[] = [];
    let animId: number;
    let width: number, height: number;

    class Thread {
      x: number;
      y: number;
      speed: number;
      amplitude: number;
      frequency: number;
      phase: number;

      constructor() {
        this.reset();
      }

      reset() {
        width = window.innerWidth;
        height = window.innerHeight;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = Math.random() * 0.5 + 0.1;
        this.amplitude = Math.random() * 20 + 10;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speed;
        if (this.x > width) {
          this.x = 0;
          this.y = Math.random() * height;
        }
      }

      draw() {
        const startX = Math.max(this.x - 200, 0);
        ctx.beginPath();
        ctx.moveTo(
          startX,
          this.y + Math.sin(startX * this.frequency + this.phase) * this.amplitude
        );
        for (let i = startX; i < this.x; i++) {
          ctx.lineTo(
            i,
            this.y + Math.sin(i * this.frequency + this.phase) * this.amplitude
          );
        }
        ctx.strokeStyle = threadColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      threads = Array.from({ length: threadCount }, () => new Thread());
      // initial fill
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      threads.forEach((thread) => {
        thread.update();
        thread.draw();
      });
      animId = requestAnimationFrame(animate);
    };

    setup();
    animate();
    window.addEventListener("resize", setup);

    return () => {
      window.removeEventListener("resize", setup);
      cancelAnimationFrame(animId);
    };
  }, [threadColor, threadCount, backgroundColor]);

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

export default DigitalLoomBackground;
