"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Layout,
  Shield,
  Zap,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

// Lenis smooth scroll initialization (simulated for single file)
const useLenis = (): void => {
  useEffect(() => {
    // In a real Next.js app, you'd install 'lenis'
    // This effect ensures the scroll behavior is smooth and modern
    document.documentElement.style.scrollBehavior = "auto";
    return () => {
      document.documentElement.style.scrollBehavior = "smooth";
    };
  }, []);
};

interface CardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  index: number;
}

const Card: React.FC<CardProps> = ({ title, description, Icon, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = (): void => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.23, 1, 0.32, 1],
      }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative bg-white p-8 md:p-10 rounded-4xl md:rounded-[2.5rem] flex flex-col h-100 md:h-112.5 w-[calc(100vw-48px)] md:w-95 transition-all duration-500 cursor-none group"
    >
      {/* Inner Content with Z-index for 3D effect */}
      <div
        style={{ transform: "translateZ(50px)" }}
        className="flex flex-col h-full"
      >
        <div className="mb-6 md:mb-8 w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-500 ease-out shadow-sm group-hover:shadow-xl">
          <Icon size={28} strokeWidth={1.2} className="md:w-8 md:h-8" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-5 tracking-tight">
          {title}
        </h3>

        <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-light line-clamp-3 md:line-clamp-none">
          {description}
        </p>

        <div className="mt-auto flex items-center text-xs md:text-sm font-bold text-black uppercase tracking-widest overflow-hidden">
          <span className="relative">
            Discover More
            <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </span>
          <motion.div
            className="ml-3"
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight size={18} />
          </motion.div>
        </div>
      </div>

      {/* Thick Shadow handling */}
      <div className="absolute inset-0 rounded-4xl md:rounded-[2.5rem] bg-black/5 -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-8 scale-95" />
    </motion.div>
  );
};

interface CardData {
  title: string;
  description: string;
  Icon: LucideIcon;
}

interface MousePosition {
  x: number;
  y: number;
}

export function Component(): React.ReactElement {
  useLenis();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent): void => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  const cards: CardData[] = [
    {
      title: "Visionary UI",
      description:
        "Breaking the mold with interfaces that don't just function, but inspire. We prioritize emotional connection through design.",
      Icon: Layout,
    },
    {
      title: "Fortified Core",
      description:
        "Architecture built for the future. We deploy military-grade encryption wrapped in a user-friendly shell.",
      Icon: Shield,
    },
    {
      title: "Neural Speed",
      description:
        "Engineered for instantaneous response times. Our stack is fine-tuned for high-concurrency and ultra-low latency.",
      Icon: Zap,
    },
  ];

  const scrollLeft = (): void =>
    carouselRef.current?.scrollBy({
      left: -window.innerWidth * 0.8,
      behavior: "smooth",
    });

  const scrollRight = (): void =>
    carouselRef.current?.scrollBy({
      left: window.innerWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black flex flex-col items-center justify-center overflow-hidden relative">
      {/* Dynamic Background Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 80%)`,
        }}
      />

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center w-full px-4 md:px-6 py-12 relative z-10">
        <header className="text-center mb-16 md:mb-24 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6 md:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
                Next Gen Experiences
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 bg-clip-text text-transparent bg-linear-to-b from-white to-gray-500">
              The Standard.
            </h1>
            <p className="text-base md:text-xl text-gray-400 font-light leading-relaxed px-4">
              We do not follow trends; we set the benchmark for digital
              craftsmanship and fluidity.
            </p>
          </motion.div>
        </header>

        {/* Carousel Container */}
        <div className="relative w-full max-w-350 mx-auto">
          {/* Custom Navigation Buttons */}
          <div className="flex justify-end gap-3 md:gap-4 mb-6 md:mb-8 pr-4 md:pr-12">
            <button
              onClick={scrollLeft}
              className="group p-4 md:p-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-full border border-white/10 transition-all duration-500"
            >
              <ChevronLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={scrollRight}
              className="group p-4 md:p-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-full border border-white/10 transition-all duration-500"
            >
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Cards Wrapper */}
          <div
            ref={carouselRef}
            className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-16 md:pb-20 pt-4 md:pt-10 px-6 md:px-10 scroll-smooth"
            style={{ perspective: "2000px" }}
          >
            {cards.map((card, idx) => (
              <div key={idx} className="snap-center shrink-0">
                <Card {...card} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        body {
          background-color: #0a0a0a;
          overflow-x: hidden;
        }
      `,
        }}
      />
    </div>
  );
}

