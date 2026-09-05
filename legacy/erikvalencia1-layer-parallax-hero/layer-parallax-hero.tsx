// Layered parallax hero with depth and 3D transforms
// Multiple layers that respond to mouse movement

"use client";

import { cn } from "../_utils/cn";
import { useState, useRef } from "react";

export const LayeredParallaxHero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    
    setMousePos({ x, y });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Layer 1 - Furthest back */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translateX(${mousePos.x * -30}px) translateY(${mousePos.y * -30}px) translateZ(-100px)`,
          transition: "transform 0.3s ease-out"
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-border" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-border" />
      </div>

      {/* Layer 2 - Middle */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          transform: `translateX(${mousePos.x * -20}px) translateY(${mousePos.y * -20}px) translateZ(-50px)`,
          transition: "transform 0.2s ease-out"
        }}
      >
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-primary/20 rounded-lg rotate-12 blur-xl" />
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-primary/30 rounded-lg -rotate-12 blur-xl" />
      </div>

      {/* Layer 3 - Closest */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateX(${mousePos.x * -10}px) translateY(${mousePos.y * -10}px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        <div className="absolute top-20 left-20 w-4 h-4 rounded-full bg-primary/60" />
        <div className="absolute bottom-32 right-32 w-3 h-3 rounded-full bg-primary/40" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-primary/50" />
      </div>

      {/* Content */}
      <div 
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        style={{
          transform: `translateX(${mousePos.x * 5}px) translateY(${mousePos.y * 5}px) translateZ(50px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 rounded-full border border-border bg-card/80 backdrop-blur-sm">
              <span className="text-sm text-muted-foreground">Depth & Motion</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground leading-none">
              Multi-
              <span className="block bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                Dimensional
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Experience interfaces that respond to your every move
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-6">
            <button className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold overflow-hidden hover:shadow-2xl hover:shadow-primary/50 transition-shadow">
              <span className="relative z-10">Enter Experience</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
            <button className="px-8 py-4 border border-border bg-card/50 backdrop-blur-sm text-card-foreground rounded-lg font-semibold hover:bg-accent transition-colors">
              Learn More
            </button>
          </div>

          {/* Floating cards */}
          <div className="grid grid-cols-3 gap-4 pt-16 max-w-4xl mx-auto">
            {[
              { title: "Intuitive", desc: "Natural interactions" },
              { title: "Responsive", desc: "Instant feedback" },
              { title: "Immersive", desc: "Full engagement" }
            ].map((item, i) => (
              <div 
                key={i}
                className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors"
                style={{
                  transform: `translateZ(${20 + i * 10}px)`,
                  transformStyle: "preserve-3d"
                }}
              >
                <div className="text-lg font-semibold text-foreground">{item.title}</div>
                <div className="text-sm text-muted-foreground mt-2">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
