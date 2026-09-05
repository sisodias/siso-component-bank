import { cn } from "@/lib/utils";
import React from "react";
import { ArrowRight, Github, Sparkles } from "lucide-react";

// Define props to make the text content customizable
interface AuroraHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText?: string;
  title?: React.ReactNode;
  description?: string;
}

export const AuroraHero = ({
  className,
  badgeText = "Introducing v2.0 — Ship faster",
  title = <>Build software <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">at light speed</span></>,
  description = "Accelerate your development workflow with our next-generation platform. Focus on innovation, let us handle the infrastructure.",
  ...props
}: AuroraHeroProps) => {
  return (
    <section
      className={cn(
        // Base styles: dark background, centered content, overflow hidden to contain blurred elements
        "relative flex flex-col items-center justify-center overflow-hidden bg-neutral-950 px-4 py-32 text-center md:px-8 md:py-48",
        className
      )}
      {...props}
    >
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* Layer 1: Subtle Grid Pattern Overlay */}
      {/* Uses CSS gradients to create a technical grid look */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15]"
        style={{
            backgroundImage: "linear-gradient(#ffffff33 1px, transparent 1px), linear-gradient(90deg, #ffffff33 1px, transparent 1px)",
            backgroundSize: "40px 40px"
        }}
      />
      
      {/* Layer 2: Gradient Fade (Vignette effect) */}
      {/* Makes the content blend seamlessly into the background at the edges */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,theme(colors.neutral.950)_80%)]" />

      {/* Layer 3: Animated Aurora Blobs */}
      {/* Large, heavily blurred colored shapes animated with custom keyframes */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/40 blur-[120px] animate-aurora-slow mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/40 blur-[120px] animate-aurora-slower mix-blend-screen" />


      {/* --- FOREGROUND CONTENT --- */}
      {/* relative and z-20 ensures content is above background effects */}
      <div className="relative z-20 flex max-w-4xl flex-col items-center gap-8">
        
        {/* Announcement Badge */}
        <div className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1.5 text-sm font-medium text-neutral-300 backdrop-blur-md transition-colors hover:bg-neutral-800 hover:text-white cursor-pointer">
          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
          <span>{badgeText}</span>
        </div>

        {/* Main Headline */}
        {/* Uses tracking-tight for a modern, compact look */}
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:leading-[1.1]">
          {title}
        </h1>

        {/* Description Paragraph */}
        <p className="max-w-2xl text-lg text-neutral-400 sm:text-xl leading-relaxed">
          {description}
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {/* Primary Button with hover arrow animation */}
          <button className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-white px-8 text-base font-semibold text-black transition-all hover:bg-neutral-200">
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          {/* Secondary Outline Button */}
          <button className="inline-flex h-12 items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-8 text-base font-semibold text-white transition-colors hover:bg-neutral-900 hover:text-white">
            <Github className="h-5 w-5" />
            Star on GitHub
          </button>
        </div>
      </div>

      {/* --- CSS ANIMATIONS --- */}
      {/* Embedded styles to avoid external config dependencies */}
      <style jsx>{`
        @keyframes aurora-move-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(50px, -50px) scale(1.1); opacity: 0.6; }
        }
        @keyframes aurora-move-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-70px, 30px) scale(0.9); opacity: 0.5; }
        }
        .animate-aurora-slow {
          animation: aurora-move-1 15s ease-in-out infinite alternate;
        }
        .animate-aurora-slower {
          animation: aurora-move-2 20s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
};