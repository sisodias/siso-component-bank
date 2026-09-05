"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";

/* ─── Types ─── */

interface Stat {
  value: string;
  label: string;
}

interface CTA {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
}

interface SaaSHeroProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctas?: CTA[];
  stats?: Stat[];
  mockupSrc?: string;
  className?: string;
}

/* ─── Animated Dot Grid Background ─── */

function DotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial fade from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_80%)]" />

      {/* Animated glow orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 size-96 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 size-80 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 70%)",
        }}
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 30, -50, 0],
          scale: [1.1, 0.9, 1.15, 1.1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ─── Stagger wrapper ─── */

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.4, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Browser Mockup Frame ─── */

function BrowserFrame({
  src,
  delay,
}: {
  src: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className="relative mx-auto w-full max-w-4xl">
      {/* Glow behind */}
      <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />

      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-foreground/10" />
            <div className="size-3 rounded-full bg-foreground/10" />
            <div className="size-3 rounded-full bg-foreground/10" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1">
            <div className="size-3 rounded-full bg-foreground/10" />
            <span className="text-[11px] text-muted-foreground">
              yourapp.com
            </span>
          </div>
          <div className="w-[52px]" />
        </div>

        {/* Content area */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted/20">
          <img
            src={src}
            alt="Product screenshot"
            className="size-full object-cover object-top"
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Stats Row ─── */

function StatsRow({ stats, delay }: { stats: Stat[]; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {stat.value}
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

/* ─── Main Block ─── */

export function Component({
  badge = "Introducing v2.0",
  title = "Ship your product",
  titleHighlight = "10× faster",
  subtitle = "The modern platform for building, deploying, and scaling your applications. Stop configuring infrastructure and start shipping features.",
  ctas = [
    { label: "Get Started Free", variant: "primary", icon: <ArrowRight className="size-4" /> },
    { label: "See Demo", variant: "secondary", icon: <ChevronRight className="size-4" /> },
  ],
  stats = [
    { value: "10,000+", label: "Developers" },
    { value: "99.99%", label: "Uptime" },
    { value: "<50ms", label: "Latency" },
    { value: "150+", label: "Countries" },
  ],
  mockupSrc = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  className,
}: SaaSHeroProps) {
  return (
    <section className={cn("relative w-full overflow-hidden bg-background", className)}>
      <DotGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Badge */}
        {badge && (
          <FadeIn delay={0} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="size-3.5 text-primary" />
              {badge}
            </span>
          </FadeIn>
        )}

        {/* Headline */}
        <FadeIn delay={0.1} className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.08] max-w-4xl mx-auto">
            {title}{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {titleHighlight}
            </span>
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.2} className="text-center mt-6">
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </FadeIn>

        {/* CTAs */}
        {ctas.length > 0 && (
          <FadeIn delay={0.3} className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {ctas.map((cta, i) => (
              <a
                key={i}
                href={cta.href ?? "#"}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200",
                  cta.variant === "primary"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
                    : "border border-border bg-card/80 backdrop-blur-sm text-foreground hover:bg-muted/80"
                )}
              >
                {cta.label}
                {cta.icon && (
                  <span className="transition-transform group-hover:translate-x-0.5">
                    {cta.icon}
                  </span>
                )}
              </a>
            ))}
          </FadeIn>
        )}

        {/* Browser Mockup */}
        {mockupSrc && (
          <div className="mt-16 md:mt-20">
            <BrowserFrame src={mockupSrc} delay={0.5} />
          </div>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div className="mt-16 md:mt-20">
            <StatsRow stats={stats} delay={0.7} />
          </div>
        )}
      </div>
    </section>
  );
}