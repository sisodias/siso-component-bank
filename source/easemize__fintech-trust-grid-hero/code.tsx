import React, { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  MessageCircle,
  Activity,
  Smile,
  Sparkles,
  Send,
  MoveRight,
} from "lucide-react";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

// --- SUB-COMPONENT: ANIMATED COUNTER ---
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const springValue = useSpring(0, {
    duration: 2000,
    bounce: 0, // No bounce for numbers, looks cleaner
  });
  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}

// --- SUB-COMPONENT: MAGNETIC BENTO CARD ---
function BentoCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Custom "Apple-like" ease
      }}
      viewport={{ once: true }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/50 bg-muted/20 backdrop-blur-sm transition-colors hover:bg-muted/30",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// --- MAIN COMPONENT ---
export default function BankingFeatureSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative z-10 overflow-hidden bg-background py-24 lg:py-32"
    >
      {/* Background Decor (Optional Gradient Blob) */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* --- LEFT COLUMN: COPY --- */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 w-fit"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 shadow-sm transition-all hover:bg-accent">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Live in 30+ countries
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Banking with <br className="hidden lg:block" />
              <span className="text-primary relative inline-block">
                momentum
                {/* Underline svg */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/30 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Automate savings, analyze spending, and move money instantly. 
              We give you the clarity and control to grow what matters most.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button className="relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <MoveRight className="h-4 w-4" />
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>
              
              <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                View Demo
              </button>
            </motion.div>

            {/* Animated Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    <Counter value={12} suffix="M+" />
                  </p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Transactions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Smile className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    <Counter value={98} suffix="%" />
                  </p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Satisfaction
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: KINETIC BENTO GRID --- */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Card 1: Team (Zoom Effect) */}
              <BentoCard delay={0.2} className="h-64 md:h-80">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop"
                    alt="Team"
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm font-semibold text-white">
                      Human-First Support
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Real humans, zero bots.
                    </p>
                  </div>
                </div>
              </BentoCard>

              {/* Card 2: Analytics (Tilt/Float) */}
              <BentoCard delay={0.3} className="h-64 md:h-80">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <motion.img
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
                    alt="Analytics"
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Floating Badge */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 backdrop-blur-md"
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium text-white">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                    Insights
                  </span>
                </motion.div>

                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm font-semibold text-white">
                      Real-time Analytics
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Track every cent.
                    </p>
                  </div>
                </div>
              </BentoCard>

              {/* Card 3: Global (Wide) */}
              <BentoCard delay={0.4} className="col-span-2 h-48 md:h-56">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
                    alt="Global Network"
                    className="h-full w-full object-cover opacity-80"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm font-semibold text-white">
                      Global Transfer
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Send to 100+ countries instantly.
                    </p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl"
                  >
                    <Send className="h-5 w-5" />
                  </motion.div>
                </div>
              </BentoCard>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}